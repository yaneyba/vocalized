# Getting Started

This guide walks through setting up and running the Vocalized dashboard locally.

## Prerequisites

- Node.js 18+ (tested with Node 20)
- npm 9+ (ships with recent Node versions)

## Installation

```bash
npm install
```

This installs React, Vite, Tailwind CSS, Lucide icons, Recharts, and TypeScript tooling.

## Development Workflow

- **Start dev server**

  ```bash
  npm run dev
  ```

  Vite serves the app on `http://localhost:5173` with fast refresh.

- **Type check & build**

  ```bash
  npm run build
  ```

  Runs TypeScript for type checking and builds the production bundle to `dist/`.

- **Preview production build**

  ```bash
  npm run preview
  ```

  Serves the contents of `dist/` with Vite’s preview server.

## Project Layout

```
├─ src/
│  ├─ components/       // shared UI + layout
│  ├─ data/             // data contracts and mock provider
│  ├─ pages/            // route-aligned screens
│  ├─ providers/        // React context utilities
│  ├─ main.tsx          // app bootstrap
│  └─ index.css         // Tailwind base + design tokens
├─ docs/                // reference guides
├─ tailwind.config.cjs  // theme customizations
├─ vite.config.ts       // Vite + React plugin config
└─ tsconfig.json        // TypeScript compiler settings
```

## Troubleshooting

- **Missing styles** — make sure `index.css` imports Tailwind directives and the file is imported in `main.tsx`.
- **Type errors from Vite modules** — run `npm install` to ensure `@vitejs/plugin-react` and other types are present.
- **Build size warning** — Vite warns about bundle size; consider lazy-loading routes or splitting vendor chunks if needed.

If you run into issues not covered here, document the fix in this folder so the next engineer benefits from it.

