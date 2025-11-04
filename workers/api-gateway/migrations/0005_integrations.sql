-- ============================================
-- WORKSPACE INTEGRATIONS
-- CRM, Calendar, Booking systems connected by clients
-- ============================================

CREATE TABLE workspace_integrations (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    integration_type TEXT NOT NULL, -- salesforce, hubspot, google_calendar, square, fresha
    name TEXT NOT NULL, -- User-friendly name
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'connected', 'error', 'disconnected')),
    auth_type TEXT NOT NULL, -- oauth, api_key
    credentials_encrypted TEXT, -- Encrypted tokens/keys (or reference to KV)
    config TEXT, -- JSON: sync rules, field mappings
    last_sync_at INTEGER,
    last_sync_status TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_integration_workspace ON workspace_integrations(workspace_id);
CREATE INDEX idx_integration_type ON workspace_integrations(integration_type);
CREATE INDEX idx_integration_status ON workspace_integrations(status);

-- Integration Sync Logs
CREATE TABLE integration_sync_logs (
    id TEXT PRIMARY KEY,
    integration_id TEXT NOT NULL,
    sync_type TEXT NOT NULL, -- full, incremental
    status TEXT NOT NULL CHECK(status IN ('started', 'completed', 'failed')),
    records_synced INTEGER DEFAULT 0,
    error_message TEXT,
    started_at INTEGER NOT NULL,
    completed_at INTEGER,
    FOREIGN KEY (integration_id) REFERENCES workspace_integrations(id) ON DELETE CASCADE
);

CREATE INDEX idx_sync_integration ON integration_sync_logs(integration_id);
CREATE INDEX idx_sync_started ON integration_sync_logs(started_at);
