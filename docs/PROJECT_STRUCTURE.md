# Vocalized Platform - Project Structure

**Last Updated**: 2025-11-04

This document describes the reorganized project structure that follows the deployment pattern specified in [plans/8. DEPLOYMENT & CONFIGURATION.md](plans/8.%20DEPLOYMENT%20%26%20CONFIGURATION.md).

---

## 📂 Directory Structure

```
vocalized/
│
├── workers/                           # Cloudflare Workers (Microservices)
│   │
│   ├── api-gateway/                   # ✅ IMPLEMENTED
│   │   ├── src/
│   │   │   ├── index.ts              # Main Hono app
│   │   │   ├── routes/
│   │   │   │   ├── admin/            # Admin API routes
│   │   │   │   │   ├── auth.ts       # ✅ Admin authentication
│   │   │   │   │   └── index.ts      # Admin router
│   │   │   │   └── client/           # Client API routes
│   │   │   │       ├── auth.ts       # ✅ Client authentication
│   │   │   │       ├── workspaces.ts # ✅ Workspace management
│   │   │   │       └── index.ts      # Client router
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts           # ✅ JWT auth middleware
│   │   │   │   └── errors.ts         # Error handling
│   │   │   ├── utils/
│   │   │   │   └── crypto.ts         # ✅ Password & JWT utilities
│   │   │   └── types/
│   │   │       ├── env.ts            # Environment types
│   │   │       └── database.ts       # Database types
│   │   ├── wrangler.toml             # Cloudflare config
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── billing-analytics/             # ✅ IMPLEMENTED
│   │   ├── src/
│   │   │   └── index.ts              # ✅ Billing & analytics endpoints + cron
│   │   ├── wrangler.toml             # With cron triggers
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── voice-gateway/                 # ⏳ TODO
│   │   ├── src/
│   │   │   ├── index.ts              # Main app
│   │   │   ├── providers/            # Provider implementations
│   │   │   ├── strategies/           # Routing strategies
│   │   │   └── failover.ts           # Failover logic
│   │   ├── wrangler.toml             # With Durable Objects
│   │   └── package.json
│   │
│   ├── call-management/               # ⏳ TODO
│   │   ├── src/
│   │   │   ├── index.ts              # Main app
│   │   │   ├── router.ts             # Call routing
│   │   │   ├── executor.ts           # Call execution
│   │   │   └── webhooks.ts           # Twilio webhooks
│   │   ├── wrangler.toml             # With Durable Objects + Queues
│   │   └── package.json
│   │
│   └── integration-hub/               # ⏳ TODO
│       ├── src/
│       │   ├── index.ts              # Main app
│       │   ├── oauth.ts              # OAuth flows
│       │   ├── connectors/           # CRM connectors
│       │   └── sync.ts               # Sync logic
│       ├── wrangler.toml             # With Queues
│       └── package.json
│
├── frontend/                          # React Applications
│   │
│   ├── client-portal/                 # ✅ EXISTS (app.vocalized.app)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── routes/
│   │   │   ├── data/                 # Mock data (needs API integration)
│   │   │   └── providers/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── admin-portal/                  # ✅ EXISTS (admin.vocalized.app)
│       ├── src/
│       │   ├── components/
│       │   ├── routes/
│       │   └── data/                 # Mock data (needs API integration)
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
│
├── database/                          # Database Management
│   ├── migrations/                    # ✅ All 9 migration files
│   │   ├── 0001_platform_admins.sql
│   │   ├── 0002_client_users_workspaces.sql
│   │   ├── 0003_phone_numbers_agents.sql
│   │   ├── 0004_voice_ai_gateway.sql
│   │   ├── 0005_integrations.sql
│   │   ├── 0006_calls.sql
│   │   ├── 0007_usage_billing.sql
│   │   ├── 0008_platform_settings.sql
│   │   └── 0009_seed_data.sql
│   ├── schema.sql                     # ✅ Consolidated reference
│   └── setup.sh                       # ✅ Setup script
│
├── scripts/                           # Deployment & Utility Scripts
│   ├── deploy-all.sh                  # ✅ Deploy all workers
│   ├── deploy-worker.sh               # ✅ Deploy single worker
│   └── setup-secrets.sh               # ✅ Configure secrets
│
├── docs/                              # Documentation
│   ├── plans/                         # ✅ Implementation plans
│   │   ├── 1. DATABASE SCHEMA.md
│   │   ├── 2. API Endpoints.md
│   │   ├── 3. AUTHENTICATION & AUTHORIZATION.md
│   │   ├── 4. VOICE AI GATEWAY - Part 1.md
│   │   ├── 4. VOICE AI GATEWAY - Part 2.md
│   │   ├── 5. CALL MANAGEMENT ENGINE - Part 1.md
│   │   ├── 5. CALL MANAGEMENT ENGINE - Part 2.md
│   │   ├── 6. INTEGRATION HUB - Part 1.md
│   │   ├── 6. INTEGRATION HUB - Part 2.md
│   │   ├── 6. INTEGRATION HUB - Part 3.md
│   │   ├── 7. BILLING & ANALYTICS - Part 1.md
│   │   ├── 7. BILLING & ANALYTICS - Part 2.md
│   │   ├── 7. BILLING & ANALYTICS - Part 3.md
│   │   └── 8. DEPLOYMENT & CONFIGURATION.md
│   ├── IMPLEMENTATION_STATUS.md       # ✅ Original status
│   ├── IMPLEMENTATION_PROGRESS.md     # ✅ Detailed progress
│   └── PROJECT_STRUCTURE.md           # ✅ This file
│
├── workspace/                         # ⏳ Legacy - to be removed
│   └── ...                            # Old structure
│
├── package.json                       # Root workspace config
├── tsconfig.json                      # Root TypeScript config
├── .gitignore
└── README.md                          # ✅ Updated main README

```

---

## 🎯 Structure Benefits

### 1. **Follows Official Pattern**
- Matches [8. DEPLOYMENT & CONFIGURATION.md](plans/8.%20DEPLOYMENT%20%26%20CONFIGURATION.md) exactly
- Each worker is self-contained in `workers/`
- Frontend apps separated in `frontend/`
- Database files centralized in `database/`

### 2. **Microservices Architecture**
- Each worker is independently deployable
- Clear separation of concerns
- Easy to scale individual services
- Isolated dependencies

### 3. **Developer-Friendly**
- Each worker has its own `package.json`
- Independent development servers
- Clear directory naming
- Comprehensive documentation

### 4. **Deployment-Ready**
- Deployment scripts in `scripts/`
- Database setup automation
- Secrets management script
- CI/CD compatible structure

---

## 🚀 Deployment URLs

Once deployed, workers will be accessible at:

| Worker | Development | Production |
|--------|-------------|------------|
| **API Gateway** | `localhost:8787` | `api.vocalized.app` |
| **Voice Gateway** | `localhost:8788` | `voice.vocalized.app` |
| **Call Management** | `localhost:8789` | `calls.vocalized.app` |
| **Integration Hub** | `localhost:8790` | `integrations.vocalized.app` |
| **Billing & Analytics** | `localhost:8791` | `billing.vocalized.app` |
| **Client Portal** | `localhost:5173` | `app.vocalized.app` |
| **Admin Portal** | `localhost:4173` | `admin.vocalized.app` |

---

## 📦 Worker Dependencies

### API Gateway
```json
{
  "dependencies": {
    "hono": "^4.0.0"
  }
}
```

### Billing & Analytics
```json
{
  "dependencies": {
    "hono": "^4.0.0"
  }
}
```

### Voice Gateway (TODO)
```json
{
  "dependencies": {
    "hono": "^4.0.0",
    "@elevenlabs/api": "^x.x.x",
    "vapi-sdk": "^x.x.x"
  }
}
```

---

## 🔄 Migration from Old Structure

The old structure under `workspace/` is being migrated to the new pattern:

**Old → New Mapping:**
```
workspace/vocalized-api/          → workers/api-gateway/
workspace/vocalized-billing-analytics/ → workers/billing-analytics/
workspace/vocalized/              → frontend/client-portal/
workspace/vocalized-admin/        → frontend/admin-portal/
workspace/docs/                   → docs/
```

---

## 📝 Next Steps

1. **Complete remaining workers**:
   - Voice Gateway
   - Call Management Engine
   - Integration Hub

2. **Remove legacy workspace/ directory** once migration is verified

3. **Update package.json workspaces** to reference new structure

4. **Update CI/CD pipelines** to use new paths

---

## 🔗 Related Documentation

- [Main README](../README.md) - Quick start guide
- [Implementation Progress](IMPLEMENTATION_PROGRESS.md) - Current status
- [Deployment Plans](plans/8.%20DEPLOYMENT%20%26%20CONFIGURATION.md) - Deployment specifications

---

**Structure Last Updated**: 2025-11-04
**Follows Pattern From**: `docs/plans/8. DEPLOYMENT & CONFIGURATION.md`
