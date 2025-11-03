# Architecture Overview

The Vocalized dashboard is a Vite + React + TypeScript application tailored for a modern SaaS experience. This document outlines the main architectural pieces and how they work together.

## Core Concepts

- **Vite + React** — Vite handles bundling and dev server duties; React powers the SPA experience.
- **TypeScript** — strict typing ensures reliability and helps document data contracts.
- **React Router** — route-driven pages map to feature areas like Dashboard, Agents, Calls, etc.
- **Tailwind CSS** — rapid styling with a custom theme that matches the Vocalized brand.
- **Mock Data Provider** — central data abstraction that can later be replaced with live APIs.

## High-Level Flow

1. `main.tsx` bootstraps React, wraps the app with router, data provider context, and toast provider.
2. `App.tsx` defines routes. Nested routes reuse `RootLayout` so navigation stays consistent.
3. Each page pulls data from the `useDataProvider` hook, which resolves to the current implementation (mock for now).
4. Shared components (cards, tables, charts) render UI primitives, using Tailwind utility classes and Lucide icons.

## Directory Structure

- `src/components/layout` — global layout (`RootLayout`) with sidebar, topbar, and responsive workspace selector.
- `src/components/ui` — reusable primitives (badges, cards, skeletons, modals).
- `src/components/charts` & `src/components/tables` — Recharts charts and structured data tables.
- `src/data` — type definitions, mock implementation, and factory for the data provider.
- `src/pages` — route-aligned screens. Each page handles data fetching, loading states, and rendering.
- `src/providers` — React context utilities (`DataProviderContext`, `ToastProvider`).
- `src/lib` — helpers like `cn`, formatting utilities, etc.

## Data Flow

```
Component -> useDataProvider() -> IDataProvider method -> MockDataProvider (async) -> returns typed data
```

Pages render loading skeletons while data resolves. All mocks add a slight delay to simulate real APIs.

## Styling Strategy

- Tailwind config defines primary colors, font family (Inter), shadows, and radius tokens.
- `index.css` composes base utility classes into semantic helpers (`card`, `btn`, etc.) for consistency.
- Components combine semantic classes with raw Tailwind utilities for layout adjustments.

## Navigation & Layout

- Sidebar uses React Router links to highlight active routes.
- Workspace switcher handles search + selection with outside click handling.
- Toasts surface user feedback for quick actions (e.g., agent operations).

## Future Extensions

- Replace `MockDataProvider` with real API clients; keep the same `IDataProvider` interface for easy swapping.
- Add authentication context to gate routes behind login.
- Introduce state management (React Query, Zustand, etc.) if data loading becomes complex.
- Implement dynamic imports for heavy feature areas to reduce initial bundle size.

Understanding this architecture will help you extend functionality without duplicating logic or styling.

