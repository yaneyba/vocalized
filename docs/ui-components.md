# UI Components & Patterns

Consistent UI primitives keep the Vocalized dashboard maintainable and visually aligned. This reference highlights the reusable building blocks and patterns used across pages.

## Design System Highlights

- **Color tokens** — defined in `tailwind.config.cjs` (`primary`, `surface-muted`, etc.) and used via Tailwind utilities or helper classes.
- **Typography** — Inter font loaded in `index.html`; Tailwind’s default font stack updated via `fontFamily.sans`.
- **Radius & shadows** — `rounded-xl`, `shadow-card`, and related tokens build the premium card aesthetic.

## Global Helpers

- `.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.badge`, `.input` — declared in `src/index.css` and reused throughout components.
- Utility helpers (`cn`, `formatCurrency`, `formatDuration`, `formatTimestamp`) live in `src/lib/utils.ts`.

## Core Components

### Layout

- `RootLayout` — wraps every authenticated route with sidebar navigation, top bar, footer, and workspace selector.
- `ToastProvider` — supplies `useToast()` hook for quick feedback.

### UI Primitives

- `StatCard` — metric card with optional delta indicator.
- `StatusBadge` — status chip with semantic colors (“Live”, “Paused”, etc.).
- `LoadingSkeleton` — simple animated placeholder for loading states.
- `ProgressBar` — stylized progress indicator.
- `ConfirmModal` — portal-based confirmation dialog for destructive actions.
- `EmptyState` — consistent empty list messaging with optional action button.

### Data Displays

- `CallsTable` — tabular layout with hover interactions and status badges.
- `CallDetailsModal` — modal view for call transcripts, sentiment, and metadata.
- `CallVolumeChart` — Recharts line chart with gradient stroke and tooltips.

## Page Composition Patterns

- Each page handles its own data fetching via hooks and shows skeletons while awaiting responses.
- Actions that require feedback (e.g., pause agent) trigger `pushToast()` to notify users.
- Layout spacing uses Tailwind utility classes (`space-y-*`, `grid`, `gap-*`) for consistency.

## Adding New Components

1. Place shared primitives under `src/components/ui`.
2. Export typed props for clarity; prefer composition over configuration-heavy components.
3. Reuse helpers (buttons, cards) rather than recreating styling from scratch; extend via Tailwind utilities if needed.
4. Document any new patterns here so the next contributor understands intended usage.

By building on these established patterns, new features can be added without rethinking layout or styling fundamentals.

