// File: backend/api/routes/revenue-dashboard.js
// MindReply Revenue Dashboard API - Real-time metrics

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/dashboard/metrics - All current metrics
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM sites) as total_sites,
        (SELECT COUNT(*) FROM sites WHERE status='online') as sites_online,
        (SELECT COUNT(*) FROM orders WHERE status='paid' AND created_at >= NOW() - INTERVAL '24 hours') as orders_24h,
        (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status='paid' AND created_at >= NOW() - INTERVAL '24 hours') as revenue_24h,
        (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status='paid' AND created_at >= NOW() - INTERVAL '7 days') as revenue_7d,
        (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status='paid') as revenue_total,
        NOW() as timestamp
    `);
    
    res.json(metrics.rows[0]);
  } catch (err) {
    console.error('Metrics error:', err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// GET /api/dashboard/revenue/daily - Daily revenue breakdown
router.get('/revenue/daily', async (req, res) => {
  try {
    const daily = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(amount) as revenue,
        COUNT(DISTINCT customer_email) as unique_customers
      FROM orders 
      WHERE status='paid'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);
    
    res.json(daily.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily revenue' });
  }
});

// GET /api/dashboard/sites - All sites status
router.get('/sites', async (req, res) => {
  try {
    const sites = await db.query(`
      SELECT 
        id,
        site_name,
        label,
        domain,
        status,
        stripe_product_id,
        created_at,
        revenue
      FROM sites
      ORDER BY created_at DESC
    `);
    
    res.json(sites.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

// POST /api/dashboard/metrics/revenue - Record revenue event
router.post('/metrics/revenue', async (req, res) => {
  try {
    const { amount, currency, product, customer_email } = req.body;
    
    await db.query(
      'INSERT INTO orders (customer_email, amount, product, status, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [customer_email, amount, product, 'paid']
    );
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record revenue' });
  }
});

// GET /api/dashboard/report/daily - Generate daily report
router.get('/report/daily', async (req, res) => {
  try {
    const report = await db.query(`
      SELECT 
        DATE(NOW()) as report_date,
        (SELECT COUNT(*) FROM sites) as total_sites,
        (SELECT COUNT(*) FROM sites WHERE created_at::date = CURRENT_DATE) as sites_created_today,
        (SELECT COUNT(*) FROM orders WHERE status='paid' AND created_at::date = CURRENT_DATE) as orders_today,
        (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status='paid' AND created_at::date = CURRENT_DATE) as revenue_today,
        (SELECT COALESCE(AVG(amount), 0) FROM orders WHERE status='paid' AND created_at::date = CURRENT_DATE) as avg_order_value,
        (SELECT COUNT(DISTINCT customer_email) FROM orders WHERE created_at::date = CURRENT_DATE) as unique_customers
    `);
    
    res.json(report.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// GET /api/dashboard/health - System health status
router.get('/health', async (req, res) => {
  try {
    const health = await db.query(`
      SELECT 
        'database' as component,
        'healthy' as status,
        NOW() as checked_at
      UNION ALL
      SELECT 
        'sites',
        CASE WHEN COUNT(*) > 0 THEN 'healthy' ELSE 'warning' END,
        NOW()
      FROM sites
      WHERE status = 'online'
    `);
    
    res.json(health.rows);
  } catch (err) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// POST /api/sites - Create new site
router.post('/sites', async (req, res) => {
  try {
    const { site_name, label, domain, stripe_product_id } = req.body;
    
    const result = await db.query(
      'INSERT INTO sites (site_name, label, domain, stripe_product_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [site_name, label, domain, stripe_product_id, 'creating']
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create site' });
  }
});

module.exports = router;
