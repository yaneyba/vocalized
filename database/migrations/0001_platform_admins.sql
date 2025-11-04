-- ============================================
-- PLATFORM ADMINS
-- These are YOU and your team who manage the platform
-- ============================================

CREATE TABLE platform_admins (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK(role IN ('super_admin', 'admin', 'support')),
    -- super_admin: Full access (you)
    -- admin: Can manage workspaces, view analytics
    -- support: Read-only access for customer support
    is_active INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    last_login INTEGER
);

CREATE INDEX idx_platform_admin_email ON platform_admins(email);

-- Admin Activity Logs (Audit Trail)
CREATE TABLE admin_activity_logs (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'viewed_workspace', 'suspended_workspace', 'updated_provider_config'
    resource_type TEXT, -- 'workspace', 'user', 'provider', 'integration'
    resource_id TEXT,
    details TEXT, -- JSON with additional context
    ip_address TEXT,
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES platform_admins(id) ON DELETE CASCADE
);

CREATE INDEX idx_admin_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_timestamp ON admin_activity_logs(timestamp);
CREATE INDEX idx_admin_logs_resource ON admin_activity_logs(resource_type, resource_id);
