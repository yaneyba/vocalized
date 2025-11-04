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
