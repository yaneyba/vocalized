# Vocalized Workspace

This repository hosts the multi-app workspace for the Vocalized platform.

## Apps

- `workspace/vocalized` – customer-facing dashboard that surfaces agent performance, analytics, billing, and settings.
- `workspace/vocalized-admin` – admin console for managing seats, monitoring audit activity, and configuring policies.

Each app is an independent Vite + React + TypeScript project using Tailwind CSS. The root `package.json` defines npm workspaces so you can install dependencies once and run scripts for each app via workspace commands.

## Getting Started

Install dependencies for all workspaces:

```bash
npm install
```

Run the customer dashboard:

```bash
npm run dev --workspace vocalized
```

Run the admin console:

```bash
npm run dev --workspace vocalized-admin
```

Build everything:

```bash
npm run build
```

Each app also ships with app-specific documentation in its `docs/` folder. See `workspace/vocalized/docs/` and `workspace/vocalized-admin/docs/` for details.

## Repository Structure

```
workspace/
  vocalized/         # Primary customer dashboard
  vocalized-admin/   # Admin control center
```

Shared resources (linting, CI, etc.) can live at the repository root. Add new apps under `workspace/` and register them in the root `package.json` to include them in the workspace.
