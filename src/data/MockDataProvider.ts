import type {
  Agent,
  AgentTemplate,
  AnalyticsSummary,
  BillingSummary,
  CallDetail,
  CallRecord,
  DashboardOverview,
  IDataProvider,
  Integration,
  SettingsSnapshot,
  VoiceProfile,
} from "./types";

const agents: Agent[] = [
  {
    id: "agent-1",
    name: "Sierra Assist",
    status: "Live",
    phoneNumber: "+1 (415) 555-9012",
    totalCalls: 482,
    successRate: 92,
    avatarColor: "bg-primary/90",
  },
  {
    id: "agent-2",
    name: "Nova Concierge",
    status: "Paused",
    phoneNumber: "+1 (646) 555-2244",
    totalCalls: 318,
    successRate: 84,
    avatarColor: "bg-emerald-500",
  },
  {
    id: "agent-3",
    name: "Atlas Support",
    status: "Draft",
    phoneNumber: "+1 (206) 555-7722",
    totalCalls: 126,
    successRate: 0,
    avatarColor: "bg-amber-500",
  },
];

const callRecords: CallRecord[] = [
  {
    id: "call-001",
    caller: "Jordan Smith",
    agentName: "Sierra Assist",
    agentId: "agent-1",
    durationMinutes: 7.4,
    status: "Completed",
    direction: "Inbound",
    timestamp: "2025-11-03T07:45:00Z",
    sentiment: "Positive",
    cost: 0.94,
  },
  {
    id: "call-002",
    caller: "+1 (415) 555-3088",
    agentName: "Nova Concierge",
    agentId: "agent-2",
    durationMinutes: 3.1,
    status: "Voicemail",
    direction: "Inbound",
    timestamp: "2025-11-03T05:12:00Z",
    sentiment: "Neutral",
    cost: 0.38,
  },
  {
    id: "call-003",
    caller: "Tessa Quinn",
    agentName: "Sierra Assist",
    agentId: "agent-1",
    durationMinutes: 5.9,
    status: "Completed",
    direction: "Outbound",
    timestamp: "2025-11-02T22:21:00Z",
    sentiment: "Positive",
    cost: 0.71,
  },
  {
    id: "call-004",
    caller: "Michael Lee",
    agentName: "Atlas Support",
    agentId: "agent-3",
    durationMinutes: 0.8,
    status: "Missed",
    direction: "Inbound",
    timestamp: "2025-11-02T18:02:00Z",
    sentiment: "Neutral",
    cost: 0.11,
  },
  {
    id: "call-005",
    caller: "Morgan Rivers",
    agentName: "Nova Concierge",
    agentId: "agent-2",
    durationMinutes: 10.2,
    status: "Completed",
    direction: "Inbound",
    timestamp: "2025-11-02T16:48:00Z",
    sentiment: "Positive",
    cost: 1.22,
  },
  {
    id: "call-006",
    caller: "+1 (323) 555-1988",
    agentName: "Sierra Assist",
    agentId: "agent-1",
    durationMinutes: 4.2,
    status: "Completed",
    direction: "Inbound",
    timestamp: "2025-11-02T14:39:00Z",
    sentiment: "Positive",
    cost: 0.52,
  },
  {
    id: "call-007",
    caller: "Aiden Flores",
    agentName: "Atlas Support",
    agentId: "agent-3",
    durationMinutes: 2.4,
    status: "In Progress",
    direction: "Outbound",
    timestamp: "2025-11-02T13:26:00Z",
    sentiment: "Neutral",
    cost: 0.29,
  },
  {
    id: "call-008",
    caller: "Harper Clinic",
    agentName: "Sierra Assist",
    agentId: "agent-1",
    durationMinutes: 6.5,
    status: "Completed",
    direction: "Inbound",
    timestamp: "2025-11-02T08:14:00Z",
    sentiment: "Positive",
    cost: 0.81,
  },
];

const callDetails: Record<string, CallDetail> = {
  "call-001": {
    ...callRecords[0],
    recordingUrl: "https://example.com/recordings/call-001.mp3",
    intent: "Appointment Scheduling",
    tags: ["Calendar", "New Customer"],
    transcript: [
      {
        speaker: "Agent",
        time: "00:03",
        text: "Hi Jordan, Sierra from Vocalized Dental. How can I help you today?",
      },
      {
        speaker: "Caller",
        time: "00:11",
        text: "I need to reschedule my cleaning. I prefer early mornings.",
      },
      {
        speaker: "Agent",
        time: "00:28",
        text: "Absolutely. We have openings next Tuesday at 8:30 AM. Shall I book that?",
      },
      {
        speaker: "Caller",
        time: "00:37",
        text: "Perfect, thank you!",
      },
    ],
  },
  "call-005": {
    ...callRecords[4],
    recordingUrl: "https://example.com/recordings/call-005.mp3",
    intent: "Service Inquiry",
    tags: ["POS", "Square"],
    transcript: [
      {
        speaker: "Caller",
        time: "00:07",
        text: "I'm wondering if you support weekend consultations.",
      },
      {
        speaker: "Agent",
        time: "00:20",
        text: "We do! Saturdays between 10 AM and 2 PM. Would you like me to schedule you?",
      },
    ],
  },
};

const integrations: Integration[] = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync appointments and automatically update availability.",
    category: "Scheduling",
    status: "connected",
    icon: "calendar",
    lastSynced: "2h ago",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Create and update CRM records directly from live calls.",
    category: "CRM",
    status: "available",
    icon: "crm",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Push agent call summaries into your marketing workflows.",
    category: "CRM",
    status: "connected",
    icon: "hubspot",
    lastSynced: "25m ago",
  },
  {
    id: "square",
    name: "Square",
    description: "Collect payments and issue invoices during calls.",
    category: "Payments",
    status: "available",
    icon: "square",
  },
  {
    id: "fresha",
    name: "Fresha",
    description: "Manage bookings and confirmations across salon locations.",
    category: "Scheduling",
    status: "available",
    icon: "fresha",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Notify your team about VIP callers in real time.",
    category: "Productivity",
    status: "available",
    icon: "slack",
  },
];

const agentTemplates: AgentTemplate[] = [
  {
    id: "dental",
    name: "Modern Dental",
    description: "Appointment scheduling, reminders, and follow-ups.",
    category: "Healthcare",
    icon: "tooth",
  },
  {
    id: "auto-repair",
    name: "Auto Repair Service",
    description: "Service intake, estimates, and availability updates.",
    category: "Automotive",
    icon: "car",
  },
  {
    id: "restaurant",
    name: "Restaurant Concierge",
    description: "Reservations, waitlist management, and private events.",
    category: "Hospitality",
    icon: "chef-hat",
  },
];

const voiceProfiles: VoiceProfile[] = [
  {
    id: "voice-1",
    provider: "ElevenLabs",
    name: "Maya",
    accent: "US Neutral",
    sampleUrl: "https://example.com/audio/maya.mp3",
  },
  {
    id: "voice-2",
    provider: "Deepgram",
    name: "Logan",
    accent: "US West Coast",
    sampleUrl: "https://example.com/audio/logan.mp3",
  },
  {
    id: "voice-3",
    provider: "PlayHT",
    name: "Amelia",
    accent: "UK Modern",
    sampleUrl: "https://example.com/audio/amelia.mp3",
  },
];

const dashboardOverview: DashboardOverview = {
  totalCallsThisMonth: 1248,
  activeAgents: 6,
  successRate: 89,
  currentUsageCost: 842,
  currency: "USD",
  callVolume: [
    { date: "Mon", total: 172 },
    { date: "Tue", total: 189 },
    { date: "Wed", total: 201 },
    { date: "Thu", total: 194 },
    { date: "Fri", total: 208 },
    { date: "Sat", total: 122 },
    { date: "Sun", total: 88 },
  ],
  recentCalls: callRecords.slice(0, 5),
};

const analyticsSummary: AnalyticsSummary = {
  metrics: [
    { label: "Total Calls", value: "12,481", change: 12.4, trend: "up" },
    { label: "Minutes Handled", value: "1,842", change: 6.2, trend: "up" },
    { label: "Success Rate", value: "89%", change: 3.1, trend: "up" },
    { label: "Avg Duration", value: "5m 42s", change: -1.8, trend: "down" },
  ],
  callVolume: Array.from({ length: 12 }).map((_, index) => ({
    date: `Week ${index + 1}`,
    total: 800 + Math.round(Math.random() * 200),
  })),
  callsByStatus: [
    { status: "Completed", value: 68 },
    { status: "Voicemail", value: 14 },
    { status: "Missed", value: 11 },
    { status: "In Progress", value: 7 },
  ],
  callsByAgent: agents.map((agent) => ({
    agent: agent.name,
    value: agent.totalCalls,
  })),
  peakHours: [
    { hour: "8 AM", inbound: 62, outbound: 20 },
    { hour: "10 AM", inbound: 78, outbound: 33 },
    { hour: "12 PM", inbound: 90, outbound: 41 },
    { hour: "2 PM", inbound: 84, outbound: 52 },
    { hour: "4 PM", inbound: 73, outbound: 38 },
  ],
  sentiment: [
    { sentiment: "Positive", value: 64 },
    { sentiment: "Neutral", value: 27 },
    { sentiment: "Negative", value: 9 },
  ],
  agentPerformance: agents.map((agent) => ({
    agent: agent.name,
    successRate: agent.successRate,
    avgDuration: 5.4,
    callsHandled: agent.totalCalls,
  })),
};

const billingSummary: BillingSummary = {
  currentPeriod: {
    label: "November 2025",
    dateRange: "Nov 1 - Nov 30",
    usage: 842,
    limit: 1200,
    estimatedTotal: 1049,
    currency: "USD",
  },
  usageBreakdown: [
    { resource: "AI Voice Minutes", quantity: "1,842", cost: 552 },
    { resource: "Phone Numbers", quantity: "8", cost: 120 },
    { resource: "Integrations", quantity: "4", cost: 80 },
    { resource: "Add-ons", quantity: "2", cost: 90 },
  ],
  costTrend: [
    { month: "Jun", cost: 720 },
    { month: "Jul", cost: 780 },
    { month: "Aug", cost: 812 },
    { month: "Sep", cost: 960 },
    { month: "Oct", cost: 998 },
    { month: "Nov", cost: 1049 },
  ],
  billingHistory: [
    { invoiceNumber: "INV-10924", date: "Oct 31, 2025", amount: 998, status: "Paid" },
    { invoiceNumber: "INV-10893", date: "Sep 30, 2025", amount: 960, status: "Paid" },
    { invoiceNumber: "INV-10862", date: "Aug 31, 2025", amount: 812, status: "Paid" },
  ],
  paymentMethod: {
    brand: "Visa",
    last4: "4928",
    exp: "08/27",
  },
  alerts: {
    enabled: true,
    threshold: 85,
    autoPause: false,
  },
};

const settingsSnapshot: SettingsSnapshot = {
  general: {
    workspaceName: "Vocalized Labs",
    industry: "Customer Experience",
    timezone: "America/Los_Angeles",
  },
  team: [
    {
      id: "team-1",
      name: "Amelia Warren",
      email: "amelia@vocalized.ai",
      role: "Owner",
      avatarColor: "bg-primary",
    },
    {
      id: "team-2",
      name: "Devon Hart",
      email: "devon@vocalized.ai",
      role: "Admin",
      avatarColor: "bg-emerald-500",
    },
    {
      id: "team-3",
      name: "Zara Miles",
      email: "zara@vocalized.ai",
      role: "Member",
      avatarColor: "bg-amber-500",
    },
  ],
  notifications: [
    {
      id: "notif-1",
      label: "Agent performance summaries",
      description: "Weekly digest with key metrics and anomalies.",
      enabled: true,
    },
    {
      id: "notif-2",
      label: "Billing threshold alerts",
      description: "Triggered at 80% and 100% of your monthly limit.",
      enabled: true,
    },
    {
      id: "notif-3",
      label: "New integration connections",
      description: "Notify the team when a new integration is connected.",
      enabled: false,
    },
  ],
  billing: {
    usageLimit: 1500,
    autoPause: false,
    alertThreshold: 85,
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export class MockDataProvider implements IDataProvider {
  async getDashboardOverview(): Promise<DashboardOverview> {
    await delay(120);
    return clone(dashboardOverview);
  }

  async getAgents(): Promise<Agent[]> {
    await delay(80);
    return clone(agents);
  }

  async getAgentTemplates(): Promise<AgentTemplate[]> {
    await delay(60);
    return clone(agentTemplates);
  }

  async getVoiceProfiles(): Promise<VoiceProfile[]> {
    await delay(40);
    return clone(voiceProfiles);
  }

  async getCallRecords(): Promise<CallRecord[]> {
    await delay(100);
    return clone(callRecords);
  }

  async getCallDetail(callId: string): Promise<CallDetail | undefined> {
    await delay(110);
    const detail = callDetails[callId];
    return detail ? clone(detail) : undefined;
  }

  async getIntegrations(): Promise<Integration[]> {
    await delay(70);
    return clone(integrations);
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    await delay(140);
    return clone(analyticsSummary);
  }

  async getBillingSummary(): Promise<BillingSummary> {
    await delay(130);
    return clone(billingSummary);
  }

  async getSettingsSnapshot(): Promise<SettingsSnapshot> {
    await delay(90);
    return clone(settingsSnapshot);
  }
}
