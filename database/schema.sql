-- ============================================
-- VOCALIZED PLATFORM - DATABASE SCHEMA
-- Consolidated schema from all migrations
-- ============================================

-- Run migrations in order:
-- 1. 0001_platform_admins.sql
-- 2. 0002_client_users_workspaces.sql
-- 3. 0003_phone_numbers_agents.sql
-- 4. 0004_voice_ai_gateway.sql
-- 5. 0005_integrations.sql
-- 6. 0006_calls.sql
-- 7. 0007_usage_billing.sql
-- 8. 0008_platform_settings.sql
-- 9. 0009_seed_data.sql

-- For initial setup, run:
-- wrangler d1 execute vocalized-production --file=./migrations/0001_platform_admins.sql
-- wrangler d1 execute vocalized-production --file=./migrations/0002_client_users_workspaces.sql
-- ... and so on

-- OR use the setup script:
-- bash setup.sh
