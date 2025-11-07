-- ============================================
-- PHONE NUMBERS
-- ============================================

CREATE TABLE phone_numbers (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL, -- E.164 format: +14155551234
    provider TEXT NOT NULL, -- twilio, telnyx
    provider_sid TEXT, -- Provider's identifier
    friendly_name TEXT, -- Optional label like "Main Line"
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'porting')),
    created_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_phone_workspace ON phone_numbers(workspace_id);
CREATE INDEX idx_phone_number ON phone_numbers(phone_number);

-- ============================================
-- AGENT TEMPLATES
-- Pre-built templates created by platform admins
-- ============================================

CREATE TABLE agent_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL, -- dental, auto_repair, restaurant
    description TEXT,
    default_config TEXT NOT NULL, -- JSON: call flows, scripts
    is_public INTEGER DEFAULT 1, -- 1=available to all clients, 0=admin only
    created_by_admin_id TEXT, -- Which admin created this template
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (created_by_admin_id) REFERENCES platform_admins(id) ON DELETE SET NULL
);

CREATE INDEX idx_template_industry ON agent_templates(industry);
CREATE INDEX idx_template_public ON agent_templates(is_public);

-- ============================================
-- VOICE AGENTS
-- The actual AI agents created by clients
-- ============================================

CREATE TABLE voice_agents (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    phone_number_id TEXT,
    name TEXT NOT NULL,
    template_id TEXT, -- NULL if built from scratch
    config TEXT NOT NULL, -- JSON: call flows, scripts, voice settings
    voice_provider TEXT NOT NULL, -- elevenlabs, vapi, retell
    voice_config TEXT NOT NULL, -- JSON: voice_id, model, settings
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'testing', 'live', 'paused')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    activated_at INTEGER,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id) ON DELETE SET NULL,
    FOREIGN KEY (template_id) REFERENCES agent_templates(id) ON DELETE SET NULL
);

CREATE INDEX idx_agent_workspace ON voice_agents(workspace_id);
CREATE INDEX idx_agent_phone ON voice_agents(phone_number_id);
CREATE INDEX idx_agent_status ON voice_agents(status);
