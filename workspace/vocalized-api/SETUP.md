# Vocalized API - Setup Guide

Complete setup instructions for the Vocalized Voice AI Platform API.

## Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Cloudflare account** (free tier works)
- **Wrangler CLI** (will be installed as dev dependency)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd workspace/vocalized-api
npm install
```

This will install:
- Hono (web framework)
- Wrangler (Cloudflare Workers CLI)
- TypeScript and types

### 2. Login to Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3. Create the D1 Database

```bash
npx wrangler d1 create vocalized-db
```

**Important**: Copy the database ID from the output. It will look like:

```
✅ Successfully created DB 'vocalized-db'!

[[d1_databases]]
binding = "DB"
database_name = "vocalized-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 4. Update wrangler.toml

Open `wrangler.toml` and add the database_id:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vocalized-db"
database_id = "YOUR-DATABASE-ID-HERE"  # <-- Paste the ID here
```

### 5. Run Database Migrations

For **local development** (recommended for testing):

```bash
npx wrangler d1 migrations apply vocalized-db --local
```

For **remote database** (production):

```bash
npx wrangler d1 migrations apply vocalized-db
```

You should see output like:

```
✅ Migrated 0001_platform_admins.sql
✅ Migrated 0002_client_users_workspaces.sql
✅ Migrated 0003_phone_numbers_agents.sql
✅ Migrated 0004_voice_ai_gateway.sql
✅ Migrated 0005_integrations.sql
✅ Migrated 0006_calls.sql
✅ Migrated 0007_usage_billing.sql
✅ Migrated 0008_platform_settings.sql
✅ Migrated 0009_seed_data.sql
```

### 6. Verify Database Setup

Check that tables were created:

```bash
npx wrangler d1 execute vocalized-db --local --command "SELECT name FROM sqlite_master WHERE type='table'"
```

You should see all 22 tables listed.

### 7. Create Initial Admin User

Create a platform admin account:

```bash
npx wrangler d1 execute vocalized-db --local --command "
INSERT INTO platform_admins (id, email, name, password_hash, role, is_active, created_at, updated_at)
VALUES (
  'admin_' || hex(randomblob(16)),
  'admin@vocalized.app',
  'Platform Admin',
  'CHANGE_THIS_PASSWORD_HASH',
  'super_admin',
  1,
  strftime('%s', 'now'),
  strftime('%s', 'now')
)
"
```

**Important**: Replace `'CHANGE_THIS_PASSWORD_HASH'` with a proper hashed password using the crypto utils.

### 8. Start Development Server

```bash
npm run dev
```

The API will be available at: `http://localhost:8787`

Test it:

```bash
curl http://localhost:8787/health
```

Expected response:

```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": 1234567890
}
```

## Environment-Specific Setup

### Staging Environment

1. Create staging database:

```bash
npx wrangler d1 create vocalized-db-staging
```

2. Update `wrangler.toml` with the staging database ID in the `[env.staging]` section

3. Run migrations:

```bash
npx wrangler d1 migrations apply vocalized-db-staging
```

4. Deploy:

```bash
npm run deploy:staging
```

### Production Environment

1. Create production database:

```bash
npx wrangler d1 create vocalized-db-production
```

2. Update `wrangler.toml` with the production database ID in the `[env.production]` section

3. **Important**: Update the JWT_SECRET in the production environment:

```toml
[env.production]
vars = {
  ENVIRONMENT = "production",
  JWT_SECRET = "YOUR-STRONG-SECRET-KEY-HERE"
}
```

4. Run migrations:

```bash
npx wrangler d1 migrations apply vocalized-db-production
```

5. Deploy:

```bash
npm run deploy:production
```

## Testing the API

### Health Check

```bash
curl http://localhost:8787/health
```

### Admin API Endpoints

```bash
# Check admin routes
curl http://localhost:8787/admin/
```

### Client API Endpoints

```bash
# Check client routes
curl http://localhost:8787/
```

## Database Management

### Execute SQL Queries

Local database:

```bash
npx wrangler d1 execute vocalized-db --local --command "SELECT * FROM subscription_tiers"
```

Remote database:

```bash
npx wrangler d1 execute vocalized-db --command "SELECT * FROM subscription_tiers"
```

### View All Tables

```bash
npx wrangler d1 execute vocalized-db --local --command "
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
"
```

### Backup Database (Remote)

```bash
npx wrangler d1 export vocalized-db --output backup.sql
```

### Import Database

```bash
npx wrangler d1 import vocalized-db --file backup.sql
```

## Troubleshooting

### Issue: Migration fails with "table already exists"

**Solution**: Reset the database:

```bash
# Local database
npx wrangler d1 execute vocalized-db --local --command "DROP TABLE IF EXISTS _cf_KV"
# Then run migrations again
npx wrangler d1 migrations apply vocalized-db --local
```

### Issue: Cannot connect to Cloudflare

**Solution**: Re-authenticate:

```bash
npx wrangler logout
npx wrangler login
```

### Issue: TypeScript errors

**Solution**: Regenerate types:

```bash
npm run cf-typegen
```

### Issue: CORS errors from frontend

**Solution**: Check that your frontend URL is listed in the CORS origins in `src/index.ts`

## Next Steps

After setup is complete:

1. ✅ **Phase 0 & Phase I Complete**: Infrastructure and database are ready
2. 🔨 **Phase II**: Implement API endpoints (see main README.md)
3. 🔒 **Phase III**: Add authentication and middleware
4. 🔌 **Phase IV**: Connect frontend applications

## Useful Commands Reference

```bash
# Development
npm run dev                      # Start local dev server

# Database
npm run db:create                # Create new database
npm run db:migrate               # Run migrations (remote)
npm run db:migrate:local         # Run migrations (local)
npm run db:console               # Open database console
npm run db:console:local         # Open local database console

# Deployment
npm run deploy                   # Deploy to production
npm run deploy:staging           # Deploy to staging

# Types
npm run cf-typegen               # Generate Cloudflare types
```

## Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong, unique value
- [ ] Update default admin password
- [ ] Enable HTTPS only
- [ ] Review CORS origins
- [ ] Set up monitoring and alerts
- [ ] Configure rate limiting
- [ ] Review and update all default credentials

## Support

For issues or questions:

- Check [README.md](./README.md) for API documentation
- Review [PLANS.md](../vocalized/docs/PLANS.md) for architecture details
- Check Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
