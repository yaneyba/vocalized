-- ============================================
-- SEED DATA
-- Initial platform settings and subscription tiers
-- ============================================

-- Subscription Tiers
INSERT INTO subscription_tiers VALUES
('starter', 'Starter', 29.99, 100, 0.05, 1, 1, '["basic_analytics"]', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('professional', 'Professional', 99.99, 500, 0.04, 5, 3, '["basic_analytics", "advanced_analytics", "priority_support"]', 1, strftime('%s', 'now'), strftime('%s', 'now')),
('enterprise', 'Enterprise', 299.99, 2000, 0.03, 999, 10, '["basic_analytics", "advanced_analytics", "priority_support", "custom_integrations", "dedicated_account_manager"]', 1, strftime('%s', 'now'), strftime('%s', 'now'));

-- Platform Settings
INSERT INTO platform_settings (key, value, description, updated_at) VALUES
('default_subscription_tier', '"starter"', 'Default subscription tier for new workspaces', strftime('%s', 'now')),
('trial_duration_days', '14', 'Free trial duration in days', strftime('%s', 'now')),
('pricing_markup_percentage', '20', 'Default markup percentage for provider costs', strftime('%s', 'now')),
('available_integrations', '["salesforce", "hubspot", "google_calendar", "square", "fresha"]', 'List of available third-party integrations', strftime('%s', 'now')),
('feature_flags', '{"advanced_analytics": true, "custom_domains": false, "api_access": false}', 'Platform-wide feature flags', strftime('%s', 'now')),
('maintenance_mode', 'false', 'Enable/disable maintenance mode', strftime('%s', 'now')),
('max_workspaces_per_user', '5', 'Maximum number of workspaces a user can create', strftime('%s', 'now'));
