# Vocalized Codebase & Architecture Overview

_Last updated: 2025-11-07_

> This document summarizes how the current Vocalized monorepo is organized, the major runtime components in play, and the architectural intentions that are already encoded in the codebase.

## 1. High-Level Platform View

- **Runtime substrate:** Cloudflare Workers + D1 (SQLite) + KV. Workers are authored in TypeScript using the Hono micro-framework for routing (`workers/api-gateway/src/index.ts`, `workers/billing-analytics/src/index.ts`).
- **Frontends:** Two React + Vite applications (client & admin portals) live under `frontend/`. They consume the Workers APIs and share a Tailwind-based design system.
- **Data layer:** `database/` holds the D1 schema, migrations, and a helper script for provisioning databases. Each Worker connects to D1 via Wrangler bindings defined in `wrangler.toml`.
- **Automation:** Shell scripts in `scripts/` wrap multi-worker deployment and secret management. Documentation in `docs/` tracks plans, testing, onboarding, and progress.

```
┌──────────────────────────────────────────────────────┐
│ React Portals (frontend/client-portal, admin-portal) │
└──────────────▲───────────────────────▲───────────────┘
               │ API (HTTPS)           │
        ┌──────┴──────────┐     ┌──────┴───────────────┐
        │ API Gateway      │     │ Billing & Analytics  │
        │ (Cloudflare      │◀──┐ │ Worker              │
        │ Workers + Hono)  │   │ │  (usage, billing)   │
        └──────┬───────────┘   │ └────────┬────────────┘
               │ binds          │         │
      ┌────────┴───────┐   ┌────┴─────┐   │
      │ D1 (SQL schema) │   │ KV (sessions│ │
      │ /database       │   │ + caches)   │ │
      └─────────────────┘   └────────────┘ │
                                (future Stripe, webhooks…)
```

## 2. Repository Layout & Responsibilities

| Path | Purpose | Notes |
|------|---------|-------|
| `workers/api-gateway/` | Main public API (admin + client) | Hono app, JWT auth, routes for auth, workspaces, agents, calls, numbers. Tests in `tests/` use Vitest + mocked D1/KV (`tests/helpers/mock-env.ts`). |
| `workers/billing-analytics/` | Usage tracking & billing microservice | Provides `/usage/*` and `/billing/*` endpoints, calculates markups, updates `billing_periods` + `usage_records`. |
| `frontend/client-portal/` | Customer-facing dashboard | Vite + React Router, context-driven auth (`providers/AuthContext.tsx`), layout in `components/layout`. |
| `frontend/admin-portal/` | Platform admin console | Mirrors client structure; not all routes implemented yet. |
| `database/` | Schema + migrations | `setup.sh` wraps Wrangler commands for provisioning D1, `schema.sql` is the canonical reference generated from migrations. |
| `scripts/` | Deployment helpers | `deploy-all.sh`, `deploy-worker.sh`, `setup-secrets.sh`. |
| `docs/` | Knowledge base | Implementation progress, testing strategy, onboarding steps, feature plans. |

## 3. API Gateway Architecture (`workers/api-gateway`)

- **Entry point:** `src/index.ts` builds a Hono app parameterized with `Env` bindings (`DB`, `SESSIONS`, JWT secrets, environment flags). Global middleware adds logging, CORS, and structured error handling.
- **Routing:** `src/routes/` is segmented by audience:
  - `routes/admin` → `auth`, `dashboard`, `workspaces`, `providers` modules, each composing the `adminRoutes` router. Placeholder TODO comments outline upcoming modules (users, templates, integrations, etc.).
  - `routes/client` → `auth`, `workspaces`, `agents`, `phone-numbers`, `calls`.
  - Every module follows the same pattern: validate input, call helper utilities, interact with D1 via prepared statements, return JSON responses with status codes aligned to the Vitest coverage.
- **Middleware & Utils:** Shared logic (auth validation, JWT parsing, response helpers) lives under `src/middleware` and `src/utils`.
- **Testing:** `tests/` mirror the route taxonomy. Workers-specific mocks (`tests/helpers/mock-env.ts`) implement in-memory D1 tables + KV semantics so Vitest can exercise entire request flows (`tests/admin/auth.test.ts`, `tests/client/auth.test.ts`). Response payloads are typed via `tests/helpers/test-types.ts`.
- **Path aliases:** `tsconfig.json` maps `@/*` → `./src/*`, so everything in routes/tests imports via `@/…` for clarity.

### Data Access Pattern

1. Route handler receives a request, optionally gated by auth middleware.
2. Handler reads/writes from D1 tables using parameterized SQL defined inline or via helper modules.
3. Responses are shaped into DTO-style objects (admins, workspaces, agents, calls) for both admin and client flows.
4. Some operations (e.g., admin auth) also touch KV (`SESSIONS`) for session invalidation.

## 4. Billing & Analytics Worker (`workers/billing-analytics`)

- Focused service that records per-workspace usage, calculates markups based on `platform_settings`, and summarizes current billing periods.
- Uses the same Hono patterns as the API gateway but exposes specialized endpoints:
  - `/usage/record` validates payloads, ensures a billing period row exists, and updates usage aggregates.
  - `/usage/:workspaceId/current` and `/billing/:workspaceId/current` read aggregated stats for dashboards or alerts.
- Keeps calculations close to the data layer (D1) and is ready to be called asynchronously from other workers (e.g., once call logs are emitted by the voice gateway/call management workers that are still TODO).

## 5. Frontend Applications (`frontend/`)

### Client Portal (`client-portal`)

- Vite + React 19, React Router for nested routes (`src/App.tsx`) with a `ProtectedLayout` that consults `useAuth` before rendering dashboards.
- Layout components under `components/layout` orchestrate navigation, menu state, and theming. Page folders (`pages/dashboard`, `pages/agents`, etc.) are thin feature modules that eventually call the API gateway.
- Shared utilities (`lib/`) hold API clients and formatting helpers; `providers/` defines contexts (Auth, UI state). Styling leverages Tailwind (`index.css`) and design tokens defined in CSS variables.

### Admin Portal (`admin-portal`)

- Mirrors the client portal structure but targets platform administrators. Provides analytics-heavy views, provider management, and workspace oversight. (See `frontend/admin-portal/src/` for parity components.)

## 6. Database Layer (`database/`)

- `migrations/` contain 9 incremental files spanning 22 tables that cover admins, client users, workspaces, agents, phone numbers, calls, billing, and platform settings.
- `schema.sql` is the authoritative snapshot of the schema; use it for debugging or introspection outside the migration process.
- `setup.sh` automates `wrangler d1` commands (creation, migrations, binding updates) so environments can be spun up consistently.
- Application code accesses the database exclusively through prepared statements (no ORM), keeping logic predictable within the Workers execution constraints.

## 7. Tooling, Testing, and Deployment

- **Testing:** API gateway uses Vitest (`npm run test`) with coverage via `@vitest/coverage-v8`. Tests operate directly on the Hono app with mocked bindings, enabling request/response level assertions without spinning up Wrangler.
- **Type Safety:** Both Workers projects share strict TS configs (ES2022 targets, bundler resolution). Frontend apps compile via Vite with type-checking enforced in the build step (`tsc --noEmit`).
- **Deployment:** Wrangler scripts (`npm run deploy`, `deploy:staging`, `deploy:production`) ship workers. Shell wrappers in `scripts/` orchestrate multi-worker deployments and secrets. Frontend apps follow standard Vite deploy flows (build → upload to hosting/CDN).
- **Docs:** `docs/IMPLEMENTATION_PROGRESS.md` tracks feature completeness, `docs/TESTING.md` explains QA strategy, `docs/KNOWN_ISSUES.md` captures outstanding bugs, and `docs/plans/` holds deeper specs for future workers.

## 8. Current Gaps & Next Steps

1. **Unimplemented workers:** Voice gateway, call management, and integration hub are outlined in the root `README.md` but not yet scaffolded.
2. **Admin/frontend integration:** React portals currently mock data in several pages; wiring them to the API gateway and billing worker is pending.
3. **Extended route coverage:** Admin modules for users, templates, billing, analytics, etc., still have TODO placeholders in `src/routes/admin/index.ts`.
4. **Observability:** Logging is limited to console output; consider adding structured logging/analytics (e.g., Workers Trace Events) once workloads increase.

Use this document as a quick orientation guide. For deeper implementation notes, jump into the specific `README.md` files inside each worker and the planning docs under `docs/plans/`.
