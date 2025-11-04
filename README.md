# Vocalized - Voice AI Platform

A comprehensive Voice AI platform built on Cloudflare Workers, enabling businesses to create and manage AI-powered voice agents.

## 📁 Project Structure

```
vocalized/
├── workers/                    # Cloudflare Workers (Microservices)
│   ├── api-gateway/           # ✅ Main API Gateway (Hono + D1)
│   ├── billing-analytics/     # ✅ Billing & Analytics Worker
│   ├── voice-gateway/         # ⏳ Voice AI Gateway (TODO)
│   ├── call-management/       # ⏳ Call Management Engine (TODO)
│   └── integration-hub/       # ⏳ Integration Hub (TODO)
│
├── frontend/                   # React Applications
│   ├── client-portal/         # Customer dashboard (app.vocalized.app)
│   └── admin-portal/          # Admin console (admin.vocalized.app)
│
├── database/                   # Database Schema & Migrations
│   ├── migrations/            # D1 migration files (9 files)
│   ├── schema.sql             # Consolidated schema
│   └── setup.sh               # Database setup script
│
├── scripts/                    # Deployment Scripts
│   ├── deploy-all.sh          # Deploy all workers
│   ├── deploy-worker.sh       # Deploy single worker
│   └── setup-secrets.sh       # Configure secrets
│
└── docs/                       # Documentation
    ├── plans/                 # Implementation plans
    └── IMPLEMENTATION_PROGRESS.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### 1. Setup Database

```bash
# Authenticate with Cloudflare
wrangler login

# Setup database
cd database
./setup.sh
```

### 2. Start Development

```bash
# API Gateway
cd workers/api-gateway
npm install
npm run dev

# Test API
curl http://localhost:8787/health
```

### 3. Run Frontend Apps

```bash
# Customer Portal
npm run dev --workspace client-portal

# Admin Portal
npm run dev --workspace admin-portal
```

## 📊 Implementation Status

**Overall Progress: ~45% Complete**

✅ **Completed:**
- Database Schema (22 tables, 9 migrations)
- Admin Authentication (Login, logout, refresh)
- Client Authentication (Signup, login, password reset)
- Workspace Management (CRUD, members, roles)
- Billing & Analytics Worker

🚧 **In Progress:**
- Voice Agents endpoints
- Phone Numbers management
- Calls endpoints

⏳ **Planned:**
- Voice AI Gateway Worker
- Call Management Engine Worker
- Integration Hub Worker

See [IMPLEMENTATION_PROGRESS.md](docs/IMPLEMENTATION_PROGRESS.md) for details.

## 🛠️ Development Commands

```bash
# API Gateway
cd workers/api-gateway
npm run dev          # Start dev server (port 8787)
npm run deploy       # Deploy to Cloudflare

# Billing & Analytics
cd workers/billing-analytics
npm run dev          # Start dev server
npm run deploy       # Deploy to Cloudflare

# Customer Portal
npm run dev --workspace client-portal

# Admin Portal
npm run dev --workspace admin-portal
```

## 📖 Documentation

- [Implementation Progress](docs/IMPLEMENTATION_PROGRESS.md) - Detailed progress
- [Implementation Plans](docs/plans/) - Component specifications
- [API Documentation](workers/api-gateway/README.md) - API endpoints

---

**Built with Cloudflare Workers, Hono, D1, and React**
