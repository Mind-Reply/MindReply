-- Admin Dashboard Database Schema
-- PostgreSQL

CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE admin_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR(255) NOT NULL,
  message_id VARCHAR(255),
  role VARCHAR(10),
  content TEXT,
  sources JSONB,
  context JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

CREATE TABLE admin_data_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  action VARCHAR(50),
  data_accessed JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET
);

CREATE TABLE admin_api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint VARCHAR(255),
  method VARCHAR(10),
  status_code INTEGER,
  response_time_ms INTEGER,
  admin_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_chat_history_admin ON admin_chat_history(admin_id);
CREATE INDEX idx_chat_history_created ON admin_chat_history(created_at);
CREATE INDEX idx_data_access_admin ON admin_data_access(admin_id);
CREATE INDEX idx_data_access_timestamp ON admin_data_access(timestamp);

-- Grant permissions (adjust as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO mindreply_user;
