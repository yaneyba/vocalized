# Vocalized Admin Console

The admin console provides seat management, audit insight, and policy configuration for the Vocalized platform.

## Scripts

Run inside the workspace root:

```bash
npm run dev --workspace vocalized-admin
npm run build --workspace vocalized-admin
npm run preview --workspace vocalized-admin
```

## Key Paths

- `src/components/AdminLayout.tsx` – Shell with navigation and header.
- `src/pages/DashboardPage.tsx` – Main dashboard view with metrics, user table, and audit feed.
- `src/data/mock.ts` – Typed fixtures powering the dashboard.
- `docs/to-do.md` – Checklist that tracks implementation status.

Extend the app by adding more routes under `src/pages` and wiring them into `App.tsx`.
