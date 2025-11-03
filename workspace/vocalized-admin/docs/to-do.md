# ADMIN DASHBOARD (admin.vocalized.app)

Build a powerful admin dashboard for "Vocalized" - the super admin control panel for managing the entire SaaS platform.

DESIGN STYLE:
- Dark mode preferred (dark blue/gray theme)
- Dense information display (data-heavy)
- Color scheme: Dark background (#0F172A), accent blue (#3B82F6), white text
- Professional, technical aesthetic
- Charts and metrics everywhere

PAGES & FEATURES:

1. ADMIN LOGIN
- Dark themed login form
- Email/password only (no social login)
- 2FA code input field
- Vocalized Admin logo

2. PLATFORM OVERVIEW
- Top nav: Logo, "Platform Admin", notifications bell, admin user menu
- Sidebar: Overview, Workspaces, Users, Providers, Integrations, Billing, Analytics, System, Logs
- Giant metric cards (4 across):
  * Total Workspaces (with active/trial/suspended breakdown)
  * Total Calls (last 30 days)
  * Monthly Recurring Revenue (MRR)
  * Churn Rate %
- Platform health indicators: API status, Database, Providers (green/yellow/red dots)
- Real-time activity feed: Recent signups, calls, errors
- Revenue chart (last 12 months, area chart)
- Top workspaces table: Name, calls, revenue, status
- Provider health grid: Each provider with status, latency, error rate

3. WORKSPACES PAGE
- Search bar and filters: Status, tier, industry
- Action buttons: Suspend, Change Tier, Delete (with confirmation)
- Workspaces table:
  * Name, owner email, industry
  * Status badge
  * Subscription tier
  * Total calls, revenue
  * Created date
  * Actions dropdown (view, edit, suspend, delete)
- Click row → Workspace detail modal:
  * Full workspace info
  * Owner details
  * Usage graphs
  * Recent calls
  * Quick actions

4. USERS PAGE
- User search with filters
- Users table:
  * Email, name
  * Workspaces count
  * Last login
  * Status
  * Actions (view, deactivate, delete)
- User detail modal:
  * All workspaces with roles
  * Activity history
  * Login history with IPs

5. PROVIDERS PAGE (Voice AI Gateway Management)
- Provider cards grid:
  * Provider logo/name (ElevenLabs, Deepgram, Vapi, Retell)
  * Status indicator (healthy/degraded/down)
  * Current latency
  * Error rate %
  * Total usage (calls)
  * Cost vs Revenue
  * Configure button
- Provider configuration modal:
  * API key input (masked)
  * Priority setting
  * Enable/disable toggle
  * Cost per unit
  * Health check settings
- Global routing strategy section:
  * Default strategy selector (cost/quality/custom)
  * Failover chain configuration
  * Test routing button
- Provider analytics:
  * Performance comparison chart
  * Cost breakdown
  * Success rate trends

6. INTEGRATIONS (Platform-wide)
- Available integrations list:
  * Integration logo, name
  * Number of workspaces using it
  * Total syncs
  * Enable/disable toggle
  * Configure button
- Add new integration type form
- Integration usage analytics
- Failed syncs alert list

7. BILLING (Platform Revenue)
- Revenue overview cards:
  * Total revenue (30d)
  * MRR, ARR
  * Average revenue per workspace
  * Payment success rate
- Revenue by tier breakdown (pie chart)
- Invoices overview:
  * Paid, pending, overdue counts
- Workspaces billing table:
  * Workspace name
  * Current balance
  * Payment status
  * Last payment date
  * Actions (view invoice, void)
- Stripe dashboard quick link

8. ANALYTICS
- Platform metrics tabs: Calls, Performance, Costs, Growth
- Calls tab:
  * Total calls chart (daily)
  * Calls by provider
  * Success rate over time
  * Geographic distribution map
- Performance tab:
  * Average call duration trend
  * Peak hours heatmap
  * Provider latency comparison
- Costs tab:
  * Cost vs revenue chart
  * Profit margin trend
  * Cost by provider breakdown
  * Optimization recommendations
- Growth tab:
  * New workspaces over time
  * Churn rate
  * User growth
  * Cohort retention matrix

9. SYSTEM PAGE
- Database status:
  * D1 size, query performance
  * Recent slow queries
- KV status:
  * Storage usage
  * Request rate
- R2 buckets:
  * Storage used
  * Bandwidth
- Durable Objects:
  * Active objects count
  * CPU time
- Workers:
  * Request count per worker
  * Error rates
  * CPU time
- Configuration settings:
  * Platform-wide settings editor (JSON)
  * Feature flags toggles
  * Pricing markup percentage
  * Trial duration

10. LOGS PAGE
- Real-time log viewer with auto-refresh
- Filters: Worker, log level (error/warn/info), time range, workspace
- Log entries table:
  * Timestamp
  * Worker ID
  * Level badge (red for errors)
  * Message
  * Expand icon for full details
- Error grouping with count
- Export logs button
- Search functionality

11. ADMIN ACTIVITY
- Audit trail of all admin actions
- Table: Admin user, action, resource, timestamp, IP
- Filter by admin user or action type

SPECIAL COMPONENTS:
- Real-time updating charts (use WebSocket simulation)
- Advanced data tables with sorting, filtering, pagination
- System health dashboard with live status indicators
- Dark mode optimized color schemes
- Alert/notification system for critical events
- Quick action command palette (Cmd+K style)
- Breadcrumbs for navigation
- Expandable/collapsible sections for dense data

CRITICAL FEATURES:
- Impersonation mode: "View as workspace" button to see client view
- Bulk actions on tables (select multiple, take action)
- Export to CSV for all major tables
- Advanced search across entire platform
- Keyboard shortcuts for power users
- Confirmation dialogs for dangerous operations (red warnings)

TECHNICAL STACK:
- React with TypeScript
- Tailwind CSS (dark mode)
- Recharts + D3.js for advanced charts
- Lucide React for icons
- React Router
- React Query for data fetching
- Virtualized tables for large datasets

Make it feel powerful and professional - like a Bloomberg terminal for SaaS platform management. Dense with information but still navigable and beautiful.