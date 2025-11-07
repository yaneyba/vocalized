-- ============================================
-- PLATFORM PROVIDER CONFIGS (Admin Managed)
-- These are YOUR master API keys for each provider
-- ============================================

CREATE TABLE platform_provider_configs (
    provider TEXT PRIMARY KEY, -- elevenlabs, vapi, retell, deepgram, bolna
    api_key_encrypted TEXT NOT NULL, -- Platform's master API key (encrypted)
    config TEXT, -- JSON: global settings
    priority INTEGER DEFAULT 0, -- Failover order
    is_enabled INTEGER DEFAULT 1,
    cost_per_unit REAL, -- For billing calculation
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- ============================================
-- WORKSPACE PROVIDER CONFIGS (Client Optional)
-- Clients can optionally bring their own API keys
-- ============================================

CREATE TABLE workspace_provider_configs (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    provider TEXT NOT NULL, -- elevenlabs, vapi, retell, deepgram
    uses_platform_key INTEGER DEFAULT 1, -- 1=use YOUR key, 0=client brings own key
    api_key_encrypted TEXT, -- Only if client brings own key (encrypted)
    config TEXT, -- JSON: provider-specific settings
    is_enabled INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    UNIQUE(workspace_id, provider)
);

CREATE INDEX idx_workspace_provider ON workspace_provider_configs(workspace_id);

-- ============================================
-- PROVIDER SELECTION STRATEGY (Per Workspace)
-- ============================================

CREATE TABLE workspace_provider_strategies (
    workspace_id TEXT PRIMARY KEY,
    strategy TEXT NOT NULL CHECK(strategy IN ('auto', 'cost_optimized', 'quality_first', 'specific', 'custom')),
    config TEXT, -- JSON: rules for custom strategy
    fallback_enabled INTEGER DEFAULT 1,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- ============================================
-- PROVIDER HEALTH STATUS (Platform-Wide)
-- Managed by Durable Objects, monitored by admin
-- ============================================

CREATE TABLE provider_health_status (
    provider TEXT NOT NULL,
    region TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('healthy', 'degraded', 'down')),
    last_check INTEGER NOT NULL,
    error_rate REAL DEFAULT 0.0,
    avg_latency INTEGER, -- milliseconds
    details TEXT, -- JSON: error messages, etc.
    PRIMARY KEY (provider, region)
);
