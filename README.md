# Vocalized Dashboard

Vocalized is a modern SaaS dashboard for managing AI-powered voice agents. It showcases a premium UI, comprehensive feature set, and an extensible data layer ready to plug into real backends.

![Vocalized](docs/cover-placeholder.png "Vocalized Dashboard") <!-- Replace with a real screenshot when available -->

## Features

- **Authentication flow** – polished sign-in/sign-up view with workspace branding.
- **Unified layout** – responsive sidebar navigation, workspace switcher, and top bar actions.
- **Dashboard insights** – KPI cards, call-volume chart, recent-call table, and quick actions.
- **Agent management** – grid of agents plus a guided three-step creation wizard.
- **Call intelligence** – advanced filters, paginated table, and detailed transcript modal.
- **Integrations hub** – catalogue of available/connected integrations with actionable cards.
- **Analytics suite** – multiple charts (area, pie, bar) from Recharts plus performance tables.
- **Billing center** – usage overview, cost trend chart, payment details, and invoice history.
- **Settings workspace** – tabbed experience for general info, team, notifications, and guardrails.
- **Reusable UI primitives** – status badges, skeletons, toasts, confirmation modals, etc.

## Tech Stack

| Layer        | Tools                                                                 |
| ------------ | --------------------------------------------------------------------- |
| App Runtime  | [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/)         |
| Language     | [TypeScript 5](https://www.typescriptlang.org/)                       |
| Styling      | [Tailwind CSS 3](https://tailwindcss.com/) with custom design tokens  |
| Routing      | [React Router 7](https://reactrouter.com/)                            |
| Icons        | [Lucide React](https://lucide.dev/)                                   |
| Charts       | [Recharts](https://recharts.org/)                                     |
| Tooling      | PostCSS, Autoprefixer, ESNext module resolution                       |

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   Vite will start at `http://localhost:5173` with instant hot refresh.

3. **Type check & build**

   ```bash
   npm run build
   ```

   Runs TypeScript in `--noEmit` mode and builds the production bundle to `dist/`.

4. **Preview the production build**

   ```bash
   npm run preview
   ```

   Serves the build output locally for smoke testing.

> **Note:** The mock data provider simulates latency. Loading skeletons disappear once data resolves.

## Project Structure

```
├─ docs/                     # Documentation hub (architecture, data layer, UI patterns, etc.)
├─ src/
│  ├─ components/            # Layout + reusable UI primitives
│  ├─ data/                  # Type definitions and provider implementations
│  ├─ pages/                 # Route-aligned screens
│  ├─ providers/             # React context utilities (data provider, toast)
│  ├─ lib/                   # Helper utilities (formatting, classnames)
│  ├─ main.tsx               # App bootstrap
│  └─ index.css              # Tailwind directives and shared utility classes
├─ tailwind.config.cjs       # Theme extensions (colors, fonts, shadows)
├─ vite.config.ts            # Vite configuration with React plugin
└─ package.json              # Scripts and dependencies
```

## Data Layer

All pages consume data through the `IDataProvider` abstraction defined in `src/data/types.ts`. The app currently uses `MockDataProvider` to serve static sample data with a realistic structure. Swap it for a real implementation by editing `DataProviderFactory` and pointing it to your API client.

Key concepts:

- Asynchronous methods mimic network calls and return cloned data to avoid accidental mutation.
- Loading states are handled in each page with skeleton components.
- Toasts provide feedback for agent activation, workspace switches, etc.

Refer to [`docs/data-layer.md`](docs/data-layer.md) for detailed guidance.

## Design System

Tailwind tokens and utility classes live in `tailwind.config.cjs` and `src/index.css`. Components rely on helper classes (`card`, `btn-primary`, `badge`, etc.) to maintain consistency. See [`docs/ui-components.md`](docs/ui-components.md) for component-specific notes.

## Scripts

| Script            | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`     | Start Vite dev server with hot-module replacement.             |
| `npm run build`   | Type-check and produce a production-ready build in `dist/`.    |
| `npm run preview` | Serve the output of `dist/` for validation before deployment.  |

## Documentation

Additional references live under [`docs/`](docs):

- [`getting-started.md`](docs/getting-started.md)
- [`architecture.md`](docs/architecture.md)
- [`data-layer.md`](docs/data-layer.md)
- [`ui-components.md`](docs/ui-components.md)

Keep these guides updated whenever you introduce new patterns or workflows.

## Roadmap Ideas

- Wire up live APIs by replacing the mock data provider.
- Add authentication and role-based access control.
- Introduce code-splitting for large visualizations.
- Expand analytics with comparative time ranges and export tooling.
- Implement automated testing (unit + integration) around critical flows.

---

Made with ❤️ to showcase how premium voice operations software can look and feel.

