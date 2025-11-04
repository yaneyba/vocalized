-- ============================================
-- CLIENT USERS
-- These are the businesses (nail salon, dental office) who use your platform
-- ============================================

CREATE TABLE client_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    email_verified INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    last_login INTEGER
);

CREATE INDEX idx_client_user_email ON client_users(email);

-- ============================================
-- WORKSPACES
-- Each client user creates a workspace (their isolated environment)
-- ============================================

CREATE TABLE workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT, -- dental, auto_repair, restaurant, real_estate
    owner_id TEXT NOT NULL, -- The client_user who created this workspace
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'trial', 'suspended', 'cancelled')),
    subscription_tier TEXT DEFAULT 'starter' CHECK(subscription_tier IN ('starter', 'professional', 'enterprise')),
    trial_ends_at INTEGER,
    timezone TEXT DEFAULT 'UTC',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES client_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_workspace_owner ON workspaces(owner_id);
CREATE INDEX idx_workspace_status ON workspaces(status);

-- Workspace Members (Team Collaboration)
-- A workspace can have multiple client_users as members
CREATE TABLE workspace_members (
    workspace_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('owner', 'admin', 'member', 'viewer')),
    -- owner: Full control (the person who created workspace)
    -- admin: Can manage agents, integrations, billing
    -- member: Can view calls, analytics, but not change settings
    -- viewer: Read-only access
    invited_by TEXT, -- user_id who sent the invite
    joined_at INTEGER NOT NULL,
    PRIMARY KEY (workspace_id, user_id),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES client_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_member_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_member_user ON workspace_members(user_id);
