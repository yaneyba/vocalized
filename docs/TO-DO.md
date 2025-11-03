Build a modern SaaS dashboard for "Vocalized" - an AI voice agent platform for businesses.

DESIGN STYLE:
- Clean, professional SaaS aesthetic
- Color scheme: Deep blue (#1E40AF) primary, white background, gray (#F3F4F6) sections
- Modern sans-serif font (Inter or similar)
- Smooth animations and transitions
- Mobile-responsive

PAGES & FEATURES:

1. LOGIN/SIGNUP PAGE
- Clean centered form with Vocalized logo
- Email/password fields
- "Sign up" and "Login" tabs
- Social login buttons (Google)
- Forgot password link

2. DASHBOARD HOME
- Top nav: Logo, workspace selector dropdown, user menu (top right)
- Sidebar navigation: Dashboard, Agents, Calls, Integrations, Analytics, Billing, Settings
- Overview cards showing:
  * Total calls (this month)
  * Active agents
  * Success rate percentage
  * Current usage cost
- Recent calls table (5 rows): caller, agent, duration, status, timestamp
- Call volume chart (line chart, last 7 days)
- Quick action buttons: "Create Agent", "View All Calls"

3. AGENTS PAGE
- Page header: "Voice Agents" with "Create New Agent" button (blue, prominent)
- Grid of agent cards (3 columns):
  * Agent name
  * Status badge (Live/Paused/Draft - green/yellow/gray)
  * Phone number
  * Total calls count
  * Edit and pause/play icons
- Empty state: Illustration with "Create your first agent" message

4. CREATE/EDIT AGENT PAGE
- Step-by-step wizard (3 steps indicated at top):
  Step 1: Choose Template
  - Industry template cards: Dental, Auto Repair, Restaurant (with icons)
  - Or "Start from scratch" option
  
  Step 2: Configure Voice
  - Voice provider dropdown (ElevenLabs, Deepgram, etc)
  - Voice preview player
  - Greeting text area
  - Test call button
  
  Step 3: Connect Phone & Go Live
  - Phone number selector
  - Integration checkboxes (Google Calendar, Square, etc)
  - "Activate Agent" big blue button

5. CALLS PAGE
- Filter bar: Date range, agent selector, status dropdown, direction toggle
- Export button (CSV)
- Calls table with:
  * Caller number/name
  * Agent name
  * Direction (inbound/outbound icon)
  * Duration
  * Status badge
  * Timestamp
  * Play recording icon
- Pagination at bottom
- Click row to open call details modal:
  * Full transcript
  * Recording player
  * Metadata (sentiment, intent)
  * Cost breakdown

6. INTEGRATIONS PAGE
- Grid of integration cards (2 columns):
  * Logo, name, description
  * "Connect" button or "Connected" badge with settings icon
  * Popular: Google Calendar, Salesforce, HubSpot, Square, Fresha
- Connected integrations section at top
- Click "Connect" → OAuth flow modal
- Settings modal: Sync frequency, field mappings

7. ANALYTICS PAGE
- Date range selector (top right)
- Key metrics row: Total calls, minutes, success rate, avg duration
- Charts section:
  * Call volume over time (area chart)
  * Calls by status (donut chart)
  * Calls by agent (bar chart)
  * Peak hours heatmap
- Agent performance table
- Sentiment distribution (3 bars: positive/neutral/negative)

8. BILLING PAGE
- Current period card:
  * Period dates
  * Usage so far
  * Estimated total
  * Progress bar showing % of limit
- Usage breakdown table: Resource type, quantity, cost
- Cost trend chart (last 6 months)
- Billing history table: Invoice number, date, amount, status, download icon
- Payment method card: Card ending in ****, Update button
- Usage alerts settings

9. SETTINGS PAGE
- Tabs: General, Team, Notifications, Billing Settings
- General: Workspace name, industry, timezone
- Team: Member list with roles (Owner/Admin/Member), invite button
- Notifications: Email toggles for various events
- Billing: Usage limits, auto-pause toggle, alert threshold slider

UI COMPONENTS TO INCLUDE:
- Toast notifications (top right) for success/error messages
- Loading skeletons for async data
- Confirmation modals for destructive actions
- Empty states with helpful illustrations
- Tooltips on hover for info icons
- Dropdown menus with search for long lists
- Badge components for status indicators

TECHNICAL STACK:
- ViteJs + React with TypeScript
- Use DataProviderFactory pattern with IDataProvider to SOC in-out data 
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- React Router for navigation

Make it feel like a premium SaaS product - professional, trustworthy, and easy to use.