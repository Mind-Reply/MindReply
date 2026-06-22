-- MindReply Database Schema
-- Tables for orders, sites, metrics

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL COMMENT 'Amount in pence (GBP)',
  currency VARCHAR(3) DEFAULT 'GBP',
  product VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, paid, delivered, failed',
  stripe_charge_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_check CHECK (customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_stripe_id ON orders(stripe_charge_id);

CREATE TABLE IF NOT EXISTS sites (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(100) NOT NULL UNIQUE,
  label VARCHAR(50) NOT NULL UNIQUE COMMENT 'MRcore, MRhub, etc',
  domain VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'creating' COMMENT 'creating, online, offline, suspended',
  stripe_product_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  revenue INTEGER DEFAULT 0 COMMENT 'Total revenue for this site in pence',
  active_customers INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_label ON sites(label);
CREATE INDEX idx_sites_created ON sites(created_at);

CREATE TABLE IF NOT EXISTS daily_metrics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_orders INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0 COMMENT 'In pence',
  avg_order_value INTEGER DEFAULT 0,
  unique_customers INTEGER DEFAULT 0,
  sites_deployed INTEGER DEFAULT 0,
  sites_online INTEGER DEFAULT 0,
  uptime_percent DECIMAL(5, 2) DEFAULT 100.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);

CREATE TABLE IF NOT EXISTS site_revenue (
  id SERIAL PRIMARY KEY,
  site_id INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL COMMENT 'Revenue for this site from this order in pence',
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_revenue_site ON site_revenue(site_id);
CREATE INDEX idx_site_revenue_order ON site_revenue(order_id);

CREATE TABLE IF NOT EXISTS health_checks (
  id SERIAL PRIMARY KEY,
  component VARCHAR(100) NOT NULL COMMENT 'database, n8n, sites, stripe, etc',
  status VARCHAR(50) DEFAULT 'healthy' COMMENT 'healthy, warning, critical',
  response_time_ms INTEGER,
  message TEXT,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_checks_component ON health_checks(component);
CREATE INDEX idx_health_checks_time ON health_checks(checked_at);

CREATE TABLE IF NOT EXISTS director_alerts (
  id SERIAL PRIMARY KEY,
  severity VARCHAR(50) DEFAULT 'info' COMMENT 'info, warning, critical',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  component VARCHAR(100),
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_severity ON director_alerts(severity);
CREATE INDEX idx_alerts_acknowledged ON director_alerts(acknowledged);
CREATE INDEX idx_alerts_created ON director_alerts(created_at);

-- View for easy revenue reporting
CREATE OR REPLACE VIEW v_daily_revenue AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as orders,
  SUM(amount) as revenue_pence,
  ROUND(SUM(amount)::numeric / 100, 2) as revenue_gbp,
  COUNT(DISTINCT customer_email) as unique_customers,
  ROUND(AVG(amount)::numeric / 100, 2) as avg_order_gbp
FROM orders
WHERE status = 'paid'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View for sites status
CREATE OR REPLACE VIEW v_sites_status AS
SELECT 
  s.id,
  s.site_name,
  s.label,
  s.domain,
  s.status,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.amount), 0) as revenue_pence,
  ROUND(COALESCE(SUM(o.amount)::numeric / 100, 0), 2) as revenue_gbp,
  COUNT(DISTINCT o.customer_email) as unique_customers,
  s.created_at
FROM sites s
LEFT JOIN orders o ON o.id IN (
  SELECT order_id FROM site_revenue WHERE site_id = s.id
)
GROUP BY s.id, s.site_name, s.label, s.domain, s.status, s.created_at
ORDER BY revenue_pence DESC;

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_site_revenue_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Update order count on sites
  UPDATE sites SET 
    revenue = revenue + NEW.amount,
    updated_at = NOW()
  WHERE id IN (
    SELECT site_id FROM site_revenue WHERE order_id = NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_revenue
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (NEW.status = 'paid' AND OLD.status != 'paid')
EXECUTE FUNCTION update_site_revenue_on_order();

-- Function to generate daily summary
CREATE OR REPLACE FUNCTION generate_daily_summary()
RETURNS void AS $$
BEGIN
  INSERT INTO daily_metrics (date, total_orders, total_revenue, avg_order_value, unique_customers, sites_online)
  SELECT 
    CURRENT_DATE,
    COUNT(*),
    SUM(amount),
    CASE WHEN COUNT(*) > 0 THEN AVG(amount) ELSE 0 END,
    COUNT(DISTINCT customer_email),
    (SELECT COUNT(*) FROM sites WHERE status = 'online')
  FROM orders
  WHERE DATE(created_at) = CURRENT_DATE AND status = 'paid'
  ON CONFLICT (date) DO UPDATE SET
    total_orders = EXCLUDED.total_orders,
    total_revenue = EXCLUDED.total_revenue,
    avg_order_value = EXCLUDED.avg_order_value,
    unique_customers = EXCLUDED.unique_customers,
    sites_online = EXCLUDED.sites_online;
END;
$$ LANGUAGE plpgsql;

-- Initial data
INSERT INTO orders (customer_email, amount, product, status) VALUES
  ('test@mind-reply.com', 60000, 'website-completion-package', 'paid'),
  ('demo@example.com', 49 * 100, 'growth-subscription', 'paid')
ON CONFLICT DO NOTHING;

INSERT INTO sites (site_name, label, domain, status) VALUES
  ('site_1', 'MRcore', 'mrcore.mind-reply.com', 'online'),
  ('site_2', 'MRhub', 'mrhub.mind-reply.com', 'online'),
  ('site_3', 'MRscope', 'mrscope.mind-reply.com', 'online'),
  ('site_4', 'MRserve', 'mrserve.mind-reply.com', 'online'),
  ('site_5', 'MRvision', 'mrvision.mind-reply.com', 'online')
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO mindreply;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mindreply;
