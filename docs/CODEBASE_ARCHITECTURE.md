# Vocalized Codebase & Architecture Overview

_Last updated: 2025-11-07_

> This doc walks through the Vocalized monorepo so you can skim once and understand what runs where, how the layers connect, and which parts are still on deck.

## 1. High-Level Platform View

- **Runtime layer.** Cloudflare Workers host backend logic. Each worker is written in TypeScript with Hono for routing (`workers/api-gateway/src/index.ts`, `workers/billing-analytics/src/index.ts`). D1 (SQLite) stores relational data and KV keeps short-lived session data.
- **Frontend layer.** Two React + Vite apps live under `frontend/`. They share Tailwind styling and talk to the Workers APIs over HTTPS.
- **Data layer.** `database/` contains the schema, migrations, and `setup.sh`, which wraps Wrangler commands for provisioning D1 in any environment.
- **Automation layer.** Shell scripts in `scripts/` handle multi-worker deployments and secret management. The `docs/` directory records onboarding steps, plans, and testing notes.

```
┌──────────────────────────────────────────────────────┐
│ React portals (frontend/client-portal, admin-portal) │
└──────────────▲───────────────────────▲───────────────┘
               │  HTTPS calls          │
        ┌──────┴──────────┐      ┌─────┴───────────────┐
        │ API Gateway      │     │ Billing & Analytics │
        │ (Cloudflare      │◀──┐ │ Worker              │
        │ Workers + Hono)  │   │ │  (usage, billing)   │
        └──────┬───────────┘   │ └────────────┬────────┘
               │ bindings       │             │
      ┌────────┴────────┐   ┌──┴──────────┐   │
      │ D1 (SQL schema) │   │ KV (sessions│   │
      │ /database       │   │ + caches)   │   │
      └─────────────────┘   └─────────────┘   │
                          (future Stripe, webhooks…)
```

## 2. Repository Layout at a Glance

- `workers/api-gateway/` – Main public API for admin and client personas. Uses Hono with JWT auth and is covered by Vitest suites that plug into mocked D1/KV bindings (`tests/helpers/mock-env.ts`).
- `workers/billing-analytics/` – Companion worker that records usage events, calculates markups, and exposes `/usage/*` plus `/billing/*`.
- `frontend/client-portal/` – Customer dashboard powered by React Router and a context-based auth layer (`providers/AuthContext.tsx`). Layout primitives live under `components/layout`.
- `frontend/admin-portal/` – Admin console that mirrors the client app structure but focuses on platform metrics, provider health, and workspace controls.
- `database/` – Migration files, consolidated schema, and the provisioning script.
- `scripts/` – `deploy-all.sh`, `deploy-worker.sh`, and `setup-secrets.sh` for repeatable operations.
- `docs/` – Living documentation (progress tracker, testing guide, onboarding notes, feature plans).

## 3. API Gateway (`workers/api-gateway`)

### Core building blocks

- `src/index.ts` instantiates the Hono app with strongly typed `Env` bindings, adds logging/CORS middleware, and mounts the admin + client routers.
- `src/routes/admin` holds modules for auth, dashboards, workspaces, and providers. TODO markers in `index.ts` highlight future areas (users, templates, integrations, analytics, billing, etc.).
- `src/routes/client` contains auth, workspace, agent, phone number, and call modules that mirror the admin style but serve workspace users.
- Shared middleware (auth checks, error helpers) sit in `src/middleware`, while reactive helpers, JWT utilities, and SQL snippets live in `src/utils`.
- Path aliases in `tsconfig.json` map `@/*` to `./src/*`, keeping imports tidy across both source and test files.

### Request flow

1. A request enters through global middleware (logger, CORS, error handler) and then optional route-level guards.
2. The handler validates input, runs prepared statements against D1, and touches KV when session data is involved.
3. The response is shaped into predictable DTOs so both client and admin UIs can consume them with minimal mapping.
4. Vitest spins up the Hono app with a mocked `Env`, giving full request/response coverage without Wrangler.

## 4. Billing & Analytics Worker (`workers/billing-analytics`)

- Uses the same Hono patterns but focuses solely on cost tracking.
- `/usage/record` validates payloads, ensures a billing period row exists, records usage entries, and updates period totals.
- `/usage/:workspaceId/current` and `/billing/:workspaceId/current` aggregate spend for dashboards and alerting.
- Keeping billing logic near the data layer makes it easy for future workers (voice gateway, call management, integration hub) to push usage events without reimplementing accounting rules.

## 5. Frontend Applications (`frontend/`)

### Client portal

- `src/App.tsx` defines route nesting. `ProtectedLayout` checks `useAuth` and either renders the dashboard or redirects to `/auth`.
- `components/layout` orchestrates navigation, header, and shell UI, while folders under `pages/` encapsulate feature-specific screens.
- Context providers in `providers/` own auth state and shared UI state. Tailwind classes and CSS variables handle styling (`index.css`).

### Admin portal

- Shares the same architecture so teams can reuse layout and state patterns. Key emphasis is on analytics, provider management, and workspace controls. Several views still use mock data until the remaining admin endpoints are built.

## 6. Database Layer (`database/`)

- Nine migrations define 22 tables across admins, client users, workspaces, phone numbers, agents, usage, billing, and platform settings.
- `schema.sql` is the canonical snapshot for reference or visualization.
- `setup.sh` wraps Wrangler commands to create the D1 database and apply migrations locally or remotely.
- Application code relies on prepared statements rather than an ORM, keeping queries explicit and Workers-friendly.

## 7. Tooling, Testing, and Deployment

- **Testing.** `npm run test` (Vitest) drives request-level tests with mock bindings. `npm run test:coverage` enables `@vitest/coverage-v8`.
- **Type safety.** Workers compile against ES2022 with strict TypeScript settings. Frontends run `tsc --noEmit` during build to catch type issues early.
- **Deployment.** Wrangler handles worker deploys (`deploy`, `deploy:staging`, `deploy:production`). Scripts in `scripts/` orchestrate multi-worker deploys and secret rotation. Frontend apps use the standard Vite flow (`dev`, `build`, `preview`) and can ship via any static host or Cloudflare Pages.
- **Documentation.** Key references include `docs/IMPLEMENTATION_PROGRESS.md`, `docs/TESTING.md`, `docs/KNOWN_ISSUES.md`, and the design/feature plans under `docs/plans/`.

## 8. Current Gaps & Next Steps

1. **Unbuilt workers.** Voice gateway, call management, and integration hub appear on the roadmap but are not yet scaffolded.
2. **Frontend wiring.** Several React screens still rely on mock data; they need to be connected to the API gateway and billing worker.
3. **Admin coverage.** Admin routes for users, templates, analytics, billing, and logs remain TODO items.
4. **Observability.** Logging goes to `console.log` today. Instrumentation via structured logs or Workers Trace Events will matter as traffic grows.

Use this doc as the fast orientation. Dive into each worker’s `README.md` and the specs in `docs/plans/` for deeper details.
