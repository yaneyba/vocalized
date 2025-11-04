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
