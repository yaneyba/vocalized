# Phase I
## Using clouflare wrangler. create a database called vocalized-db
### Then implement the following SQL

---
tags:
  - vocalized
  - d1-database
  - database-schema
  - pipeline
tag:
---
## 1.1 Platform Admins (YOU)

```sql
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
```

---

## 1.2 Client Users (YOUR CUSTOMERS)

```sql
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
```

---

## 1.3 Workspaces (CLIENT TENANTS)

```sql
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
```

---

## 1.4 Phone Numbers

```sql
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
```

---

## 1.5 Agent Templates

```sql
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
```

---

## 1.6 Voice Agents

```sql
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
```

---

## 1.7 Voice AI Gateway Configuration

```sql
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
```

---

## 1.8 Integrations

```sql
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
```

---

## 1.9 Calls

```sql
-- ============================================
-- CALLS
-- All phone calls handled by the platform
-- ============================================

CREATE TABLE calls (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    phone_number_id TEXT NOT NULL,
    caller_number TEXT NOT NULL, -- E.164 format
    caller_name TEXT, -- If available from caller ID
    direction TEXT NOT NULL CHECK(direction IN ('inbound', 'outbound')),
    status TEXT NOT NULL CHECK(status IN ('queued', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer')),
    provider_call_sid TEXT, -- Twilio/Telnyx call ID
    voice_provider_used TEXT NOT NULL, -- Which AI provider handled this call
    duration_seconds INTEGER,
    recording_url TEXT, -- R2 URL
    transcription TEXT,
    summary TEXT, -- AI-generated call summary
    sentiment TEXT, -- positive, neutral, negative
    metadata TEXT, -- JSON: intent, extracted entities, custom fields
    cost_total REAL, -- Total cost for this call
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES voice_agents(id) ON DELETE CASCADE,
    FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id) ON DELETE CASCADE
);

CREATE INDEX idx_call_workspace ON calls(workspace_id);
CREATE INDEX idx_call_agent ON calls(agent_id);
CREATE INDEX idx_call_started ON calls(started_at);
CREATE INDEX idx_call_status ON calls(status);
CREATE INDEX idx_call_direction ON calls(direction);

-- Call Events (for real-time tracking)
CREATE TABLE call_events (
    id TEXT PRIMARY KEY,
    call_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- initiated, answered, transferred, ended, error
    event_data TEXT, -- JSON
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (call_id) REFERENCES calls(id) ON DELETE CASCADE
);

CREATE INDEX idx_event_call ON call_events(call_id);
CREATE INDEX idx_event_timestamp ON call_events(timestamp);
```

---

## 1.10 Usage & Billing

```sql
-- ============================================
-- USAGE RECORDS
-- Track every billable action
-- ============================================

CREATE TABLE usage_records (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    call_id TEXT,
    resource_type TEXT NOT NULL, -- call_minutes, transcription, storage, ai_tokens
    provider TEXT NOT NULL, -- Which provider was used
    quantity REAL NOT NULL, -- minutes, characters, bytes
    unit_cost REAL NOT NULL, -- Cost per unit from provider
    total_cost REAL NOT NULL, -- quantity * unit_cost
    markup_percentage REAL DEFAULT 20, -- Your platform markup (%)
    final_cost REAL NOT NULL, -- total_cost + markup
    billing_period_id TEXT, -- Link to billing period
    created_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (call_id) REFERENCES calls(id) ON DELETE SET NULL
);

CREATE INDEX idx_usage_workspace ON usage_records(workspace_id);
CREATE INDEX idx_usage_created ON usage_records(created_at);
CREATE INDEX idx_usage_billing_period ON usage_records(billing_period_id);

-- ============================================
-- BILLING PERIODS
-- Monthly billing cycles per workspace
-- ============================================

CREATE TABLE billing_periods (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    period_start INTEGER NOT NULL,
    period_end INTEGER NOT NULL,
    subtotal REAL DEFAULT 0.0, -- Total usage costs
    subscription_fee REAL DEFAULT 0.0, -- Monthly subscription if applicable
    total_amount REAL DEFAULT 0.0, -- subtotal + subscription_fee
    status TEXT DEFAULT 'current' CHECK(status IN ('current', 'finalized', 'paid', 'overdue')),
    stripe_invoice_id TEXT,
    paid_at INTEGER,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_billing_workspace ON billing_periods(workspace_id);
CREATE INDEX idx_billing_status ON billing_periods(status);
CREATE INDEX idx_billing_period ON billing_periods(period_start, period_end);

-- ============================================
-- WORKSPACE BILLING SETTINGS
-- ============================================

CREATE TABLE workspace_billing_settings (
    workspace_id TEXT PRIMARY KEY,
    usage_limit_monthly REAL, -- Dollar limit per month
    alert_threshold_percentage REAL DEFAULT 80, -- Alert at 80% of limit
    auto_pause_on_limit INTEGER DEFAULT 0, -- Auto-pause agents when limit reached
    payment_method_id TEXT, -- Stripe payment method ID
    billing_email TEXT,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);
```

---

## 1.11 Platform Settings (ADMIN MANAGED)

```sql
-- ============================================
-- PLATFORM SETTINGS
-- Global settings managed by YOU (admin)
-- ============================================

CREATE TABLE platform_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL, -- JSON for complex values
    description TEXT,
    updated_by_admin_id TEXT,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (updated_by_admin_id) REFERENCES platform_admins(id) ON DELETE SET NULL
);

-- Example settings stored:
-- - default_subscription_tier: "starter"
-- - trial_duration_days: 14
-- - available_integrations: ["salesforce", "hubspot", "google_calendar"]
-- - feature_flags: {"advanced_analytics": true, "custom_domains": false}
-- - pricing_markup_percentage: 20

-- ============================================
-- SUBSCRIPTION TIERS
-- Pricing plans managed by admin
-- ============================================

CREATE TABLE subscription_tiers (
    tier_name TEXT PRIMARY KEY, -- starter, professional, enterprise
    display_name TEXT NOT NULL,
    monthly_fee REAL NOT NULL,
    included_minutes INTEGER, -- Free minutes per month
    price_per_minute REAL NOT NULL, -- After free minutes
    max_agents INTEGER, -- Max number of agents allowed
    max_phone_numbers INTEGER,
    features TEXT NOT NULL, -- JSON array of feature flags
    is_active INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Seed data example:
INSERT INTO subscription_tiers VALUES
('starter', 'Starter', 29.99, 100, 0.05, 1, 1, '["basic_analytics"]', 1, 1234567890, 1234567890),
('professional', 'Professional', 99.99, 500, 0.04, 5, 3, '["basic_analytics", "advanced_analytics", "priority_support"]', 1, 1234567890, 1234567890),
('enterprise', 'Enterprise', 299.99, 2000, 0.03, 999, 10, '["basic_analytics", "advanced_analytics", "priority_support", "custom_integrations", "dedicated_account_manager"]', 1, 1234567890, 1234567890);
```

### Once complete, wait for Phase II


# Phase II

---
tags:
  - vocalized
  - api-endpoint
  - pipeline
---

## 2.1 Admin Portal API (`admin.vocalized.app` → API)

### Admin Authentication

```
POST   /admin/auth/login
       Body: { email, password }
       Returns: { token, admin: { id, email, name, role } }

POST   /admin/auth/logout
       Headers: Authorization: Bearer {token}
       
GET    /admin/auth/me
       Headers: Authorization: Bearer {token}
       Returns: { admin: { id, email, name, role } }

POST   /admin/auth/refresh
       Body: { refresh_token }
       Returns: { token }
```

### Platform Dashboard

```
GET    /admin/dashboard/overview
       Returns: {
         total_workspaces,
         active_workspaces,
         total_calls_today,
         total_calls_month,
         total_revenue_month,
         mrr,
         active_agents,
         provider_health_summary
       }

GET    /admin/dashboard/revenue
       Query: ?period=month|quarter|year
       Returns: {
         total_revenue,
         revenue_by_tier,
         mrr,
         arr,
         churn_rate
       }

GET    /admin/dashboard/usage
       Query: ?period=day|week|month
       Returns: {
         total_calls,
         total_minutes,
         calls_by_provider,
         avg_call_duration,
         peak_hours
       }
```

### Workspace Management (Admin)

```
GET    /admin/workspaces
       Query: ?status=active|trial|suspended&search=name&page=1&limit=50
       Returns: {
         workspaces: [{
           id, name, industry, owner_email, status, 
           subscription_tier, created_at, 
           total_calls, total_revenue
         }],
         total, page, limit
       }

GET    /admin/workspaces/{workspaceId}
       Returns: {
         workspace: { ...details },
         owner: { id, email, name },
         members: [...],
         agents: [...],
         stats: { total_calls, total_revenue, active_agents }
       }

PUT    /admin/workspaces/{workspaceId}
       Body: { name, status, subscription_tier }
       
DELETE /admin/workspaces/{workspaceId}

POST   /admin/workspaces/{workspaceId}/suspend
       Body: { reason }
       
POST   /admin/workspaces/{workspaceId}/activate

POST   /admin/workspaces/{workspaceId}/change-tier
       Body: { tier_name }
```

### User Management (Admin)

```
GET    /admin/users
       Query: ?search=email|name&page=1&limit=50
       Returns: {
         users: [{ id, email, name, workspaces_count, created_at }],
         total, page, limit
       }

GET    /admin/users/{userId}
       Returns: {
         user: { id, email, name, created_at, last_login },
         workspaces: [{
           workspace_id, workspace_name, role, joined_at
         }]
       }

PUT    /admin/users/{userId}
       Body: { name, is_active }
       
DELETE /admin/users/{userId}
       Note: Cascade deletes workspace_members entries
```

### Voice AI Gateway Management (Admin)

```
GET    /admin/providers
       Returns: {
         providers: [{
           provider, is_enabled, priority, cost_per_unit, 
           health_status, last_check
         }]
       }

POST   /admin/providers
       Body: {
         provider, api_key, config, priority, cost_per_unit
       }
       
PUT    /admin/providers/{provider}
       Body: { api_key, config, priority, is_enabled, cost_per_unit }
       
DELETE /admin/providers/{provider}

GET    /admin/providers/health
       Returns: {
         providers: [{
           provider, status, latency, error_rate, last_check
         }]
       }

GET    /admin/providers/costs
       Query: ?period=month
       Returns: {
         total_cost,
         by_provider: [{
           provider, total_cost, total_usage, avg_cost_per_unit
         }]
       }

PUT    /admin/providers/routing
       Body: {
         default_strategy, fallback_chain: [provider1, provider2]
       }
```

### Agent Templates Management (Admin)

```
GET    /admin/templates
       Returns: {
         templates: [{ id, name, industry, is_public, usage_count }]
       }

POST   /admin/templates
       Body: {
         name, industry, description, default_config, is_public
       }
       
GET    /admin/templates/{templateId}
       
PUT    /admin/templates/{templateId}
       
DELETE /admin/templates/{templateId}
```

### Integration Management (Admin)

```
GET    /admin/integrations/available
       Returns: {
         integrations: [{ type, name, description, auth_type, is_enabled }]
       }

POST   /admin/integrations/available
       Body: {
         type, name, description, auth_type, config
       }
       Note: Makes new integration type available to clients
       
GET    /admin/integrations/usage
       Returns: {
         by_type: [{
           integration_type, workspaces_using, total_syncs
         }]
       }
```

### Call Management (Admin)

```
GET    /admin/calls
       Query: ?workspace_id=xxx&status=completed&from=timestamp&to=timestamp&page=1&limit=50
       Returns: {
         calls: [{
           id, workspace_name, agent_name, caller_number, 
           direction, status, duration_seconds, cost_total, started_at
         }],
         total, page, limit
       }

GET    /admin/calls/live
       Returns: {
         active_calls: [{
           id, workspace_name, agent_name, caller_number, 
           duration_so_far, started_at
         }]
       }

GET    /admin/calls/{callId}
       Returns: {
         call: { ...full details },
         workspace: { id, name },
         agent: { id, name }
       }
```

### Analytics (Admin)

```
GET    /admin/analytics/platform
       Query: ?period=day|week|month|year
       Returns: {
         total_calls, total_minutes, total_revenue,
         calls_by_status, calls_by_provider,
         revenue_by_tier, top_workspaces
       }

GET    /admin/analytics/workspaces
       Query: ?sort_by=calls|revenue|minutes&limit=10
       Returns: {
         workspaces: [{
           workspace_id, name, total_calls, total_revenue, 
           total_minutes, avg_call_duration
         }]
       }

GET    /admin/analytics/providers
       Query: ?period=month
       Returns: {
         by_provider: [{
           provider, total_calls, success_rate, avg_latency,
           total_cost, revenue_generated
         }]
       }

GET    /admin/analytics/costs
       Query: ?period=month
       Returns: {
         total_cost, total_revenue, profit_margin,
         by_provider: [{ provider, cost, revenue, margin }],
         by_workspace: [{ workspace_id, cost, revenue }]
       }
```

### Billing (Admin)

```
GET    /admin/billing/overview
       Query: ?period=month
       Returns: {
         total_revenue, total_cost, profit,
         by_tier: [{ tier, workspaces_count, revenue }],
         payment_status: { paid, pending, overdue }
       }

GET    /admin/billing/workspaces
       Query: ?status=paid|pending|overdue
       Returns: {
         workspaces: [{
           workspace_id, name, current_balance, 
           payment_status, last_payment_date
         }]
       }

GET    /admin/billing/invoices
       Query: ?workspace_id=xxx&status=paid|pending
       Returns: {
         invoices: [{
           id, workspace_name, amount, status, 
           period_start, period_end, paid_at
         }]
       }

POST   /admin/billing/invoices/{invoiceId}/void
       Body: { reason }
```

### System Configuration (Admin)

```
GET    /admin/config/settings
       Returns: {
         settings: [{ key, value, description, updated_at }]
       }

PUT    /admin/config/settings
       Body: {
         settings: [{ key, value }]
       }

GET    /admin/config/tiers
       Returns: {
         tiers: [{ tier_name, display_name, monthly_fee, ... }]
       }

POST   /admin/config/tiers
       Body: {
         tier_name, display_name, monthly_fee, included_minutes,
         price_per_minute, max_agents, features
       }

PUT    /admin/config/tiers/{tierName}
```

### Audit Logs (Admin)

```
GET    /admin/logs/activity
       Query: ?admin_id=xxx&action=xxx&from=timestamp&to=timestamp&page=1
       Returns: {
         logs: [{
           id, admin_email, action, resource_type, 
           resource_id, details, timestamp
         }],
         total, page
       }
```

---

## 2.2 Client Portal API (`app.vocalized.app` → API)

### Client Authentication

```
POST   /auth/signup
       Body: { email, password, name }
       Returns: { token, user: { id, email, name } }

POST   /auth/login
       Body: { email, password }
       Returns: { token, user: { id, email, name }, workspaces: [...] }

POST   /auth/logout

GET    /auth/me
       Returns: { user: { id, email, name }, workspaces: [...] }

POST   /auth/verify-email
       Body: { token }

POST   /auth/forgot-password
       Body: { email }

POST   /auth/reset-password
       Body: { token, new_password }
```

### Workspace Management (Client)

```
POST   /workspaces
       Body: { name, industry, timezone }
       Returns: { workspace: { id, name, ... } }

GET    /workspaces
       Returns: {
         workspaces: [{
           id, name, industry, role, status, subscription_tier
         }]
       }

GET    /workspaces/{workspaceId}
       Returns: {
         workspace: { ...details },
         members: [...],
         subscription: { tier, usage, limits }
       }

PUT    /workspaces/{workspaceId}
       Body: { name, timezone }
       Note: Can only update workspaces where user has owner/admin role

DELETE /workspaces/{workspaceId}
       Note: Only workspace owner can delete

GET    /workspaces/{workspaceId}/members
       
POST   /workspaces/{workspaceId}/members
       Body: { email, role }
       Note: Sends invitation email
       
PUT    /workspaces/{workspaceId}/members/{userId}
       Body: { role }
       
DELETE /workspaces/{workspaceId}/members/{userId}
```

### Phone Numbers (Client)

```
GET    /workspaces/{workspaceId}/phone-numbers
       Returns: {
         phone_numbers: [{
           id, phone_number, friendly_name, status, agent_name
         }]
       }

GET    /workspaces/{workspaceId}/phone-numbers/available
       Query: ?area_code=415&country=US
       Returns: {
         available: [{ phone_number, locality, region, price }]
       }

POST   /workspaces/{workspaceId}/phone-numbers
       Body: { phone_number, friendly_name }
       Returns: { phone_number: { id, phone_number, ... } }

PUT    /workspaces/{workspaceId}/phone-numbers/{numberId}
       Body: { friendly_name }

DELETE /workspaces/{workspaceId}/phone-numbers/{numberId}
```

### Agent Templates (Client)

```
GET    /templates
       Query: ?industry=dental
       Returns: {
         templates: [{ id, name, industry, description }]
       }

GET    /templates/{templateId}
       Returns: {
         template: { id, name, industry, description, preview_config }
       }
```

### Voice Agents (Client)

```
GET    /workspaces/{workspaceId}/agents
       Returns: {
         agents: [{
           id, name, status, phone_number, template_name, created_at
         }]
       }

POST   /workspaces/{workspaceId}/agents
       Body: {
         name, template_id, phone_number_id, 
         config, voice_provider, voice_config
       }
       Returns: { agent: { id, ... } }

GET    /workspaces/{workspaceId}/agents/{agentId}
       Returns: {
         agent: { ...full config },
         phone_number: { ... },
         stats: { total_calls, avg_duration }
       }

PUT    /workspaces/{workspaceId}/agents/{agentId}
       Body: { name, config, voice_config }

DELETE /workspaces/{workspaceId}/agents/{agentId}

POST   /workspaces/{workspaceId}/agents/{agentId}/activate
       Returns: { agent: { id, status: 'live' } }

POST   /workspaces/{workspaceId}/agents/{agentId}/pause
       Returns: { agent: { id, status: 'paused' } }

POST   /workspaces/{workspaceId}/agents/{agentId}/test
       Body: { phone_number_to_call }
       Returns: { test_call_id }
```

### Voice Provider Configuration (Client)

```
GET    /workspaces/{workspaceId}/voice/providers
       Returns: {
         providers: [{
           provider, is_enabled, uses_platform_key, is_configured
         }]
       }

PUT    /workspaces/{workspaceId}/voice/providers/{provider}
       Body: {
         uses_platform_key, api_key (if BYO), config
       }

GET    /workspaces/{workspaceId}/voice/strategy
       Returns: {
         strategy: 'cost_optimized', config: {...}, fallback_enabled: true
       }

PUT    /workspaces/{workspaceId}/voice/strategy
       Body: { strategy, config, fallback_enabled }
```

### Integrations (Client)

```
GET    /workspaces/{workspaceId}/integrations
       Returns: {
         integrations: [{
           id, integration_type, name, status, last_sync_at
         }]
       }

POST   /workspaces/{workspaceId}/integrations
       Body: { integration_type, name }
       Returns: { oauth_url } or { integration: {...} } if api_key auth

GET    /workspaces/{workspaceId}/integrations/{integrationId}
       Returns: {
         integration: { ...details },
         sync_logs: [...]
       }

PUT    /workspaces/{workspaceId}/integrations/{integrationId}
       Body: { config }

DELETE /workspaces/{workspaceId}/integrations/{integrationId}

POST   /workspaces/{workspaceId}/integrations/{integrationId}/sync
       Returns: { sync_log_id }

GET    /workspaces/{workspaceId}/integrations/{integrationId}/sync-logs
       Returns: {
         logs: [{ id, sync_type, status, records_synced, started_at }]
       }

# OAuth Callback (handled by platform)
GET    /integrations/oauth/callback/{type}
       Query: ?code=xxx&state=workspaceId
       Redirects to app.vocalized.app after storing tokens
```

### Calls (Client)

```
GET    /workspaces/{workspaceId}/calls
       Query: ?agent_id=xxx&status=completed&direction=inbound&from=timestamp&to=timestamp&page=1
       Returns: {
         calls: [{
           id, agent_name, caller_number, direction, status,
           duration_seconds, cost_total, started_at
         }],
         total, page
       }

GET    /workspaces/{workspaceId}/calls/{callId}
       Returns: {
         call: { ...full details },
         agent: { id, name },
         recording_url, transcription, summary
       }

GET    /workspaces/{workspaceId}/calls/{callId}/recording
       Returns: Audio file or redirect to R2 URL

GET    /workspaces/{workspaceId}/calls/{callId}/transcription
       Returns: { transcription, words: [...] }

GET    /workspaces/{workspaceId}/calls/{callId}/events
       Returns: {
         events: [{ event_type, event_data, timestamp }]
       }

GET    /workspaces/{workspaceId}/calls/live
       Returns: {
         active_calls: [{
           id, agent_name, caller_number, duration_so_far, started_at
         }]
       }

POST   /workspaces/{workspaceId}/calls/outbound
       Body: { agent_id, phone_number_to_call }
       Returns: { call_id }
```

### Analytics (Client)

```
GET    /workspaces/{workspaceId}/analytics/overview
       Query: ?period=day|week|month
       Returns: {
         total_calls, total_minutes, avg_call_duration,
         calls_by_status, calls_by_direction, calls_by_agent,
         peak_hours, sentiment_distribution
       }

GET    /workspaces/{workspaceId}/analytics/agents
       Returns: {
         agents: [{
           agent_id, name, total_calls, success_rate, 
           avg_duration, sentiment_score
         }]
       }

GET    /workspaces/{workspaceId}/analytics/costs
       Query: ?period=month
       Returns: {
         current_period_cost, by_resource: [{
           resource_type, quantity, cost
         }],
         trend: [{ date, cost }]
       }

GET    /workspaces/{workspaceId}/analytics/export
       Query: ?format=csv|json&period=month
       Returns: File download
```

### Billing (Client)

```
GET    /workspaces/{workspaceId}/billing/current
       Returns: {
         current_period: { start, end, subtotal, subscription_fee, total },
         usage_breakdown: [{ resource_type, quantity, cost }],
         percentage_of_limit
       }

GET    /workspaces/{workspaceId}/billing/history
       Returns: {
         periods: [{
           id, period_start, period_end, total_amount, 
           status, paid_at, stripe_invoice_id
         }]
       }

GET    /workspaces/{workspaceId}/billing/invoices
       Returns: {
         invoices: [{
           id, amount, status, period_start, period_end, 
           invoice_pdf_url, paid_at
         }]
       }

GET    /workspaces/{workspaceId}/billing/invoices/{invoiceId}
       Returns: PDF or JSON with invoice details

POST   /workspaces/{workspaceId}/billing/payment-method
       Body: { stripe_payment_method_id }

GET    /workspaces/{workspaceId}/billing/settings
       Returns: {
         usage_limit_monthly, alert_threshold_percentage,
         auto_pause_on_limit, payment_method_last4, billing_email
       }

PUT    /workspaces/{workspaceId}/billing/settings
       Body: {
         usage_limit_monthly, alert_threshold_percentage,
         auto_pause_on_limit, billing_email
       }
```

### Webhooks (Platform Receives)

```
# From Twilio/Telnyx
POST   /webhooks/calls/inbound
       Body: Twilio/Telnyx webhook payload
       Note: Routes to appropriate agent

POST   /webhooks/calls/status
       Body: Call status updates
       Note: Updates call records in D1

POST   /webhooks/calls/recording
       Body: Recording ready notification
       Note: Downloads and stores in R2

# From Stripe
POST   /webhooks/stripe
       Body: Stripe webhook payload
       Note: Handles payment events, updates billing
```

---

**This completes the Database Schema and API Endpoints sections. Ready to continue with the next section?**
#vocalized