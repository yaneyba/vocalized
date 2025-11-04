export type AgentStatus = "Live" | "Paused" | "Draft";

export interface StatMetric {
  label: string;
  value: string;
  change?: number;
  trend?: "up" | "down";
}

export interface CallVolumePoint {
  date: string;
  total: number;
}

export interface DashboardOverview {
  totalCallsThisMonth: number;
  activeAgents: number;
  successRate: number;
  currentUsageCost: number;
  currency: string;
  callVolume: CallVolumePoint[];
  recentCalls: CallRecord[];
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  phoneNumber: string;
  totalCalls: number;
  successRate: number;
  avatarColor: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface VoiceProfile {
  id: string;
  provider: string;
  name: string;
  accent: string;
  sampleUrl: string;
}

export interface CallRecord {
  id: string;
  caller: string;
  agentName: string;
  agentId: string;
  durationMinutes: number;
  status: "Completed" | "Missed" | "In Progress" | "Voicemail";
  direction: "Inbound" | "Outbound";
  timestamp: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  cost: number;
}

export interface CallDetail extends CallRecord {
  transcript: Array<{
    speaker: "Agent" | "Caller";
    time: string;
    text: string;
  }>;
  recordingUrl: string;
  intent: string;
  tags: string[];
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "connected" | "available";
  icon: string;
  lastSynced?: string;
}

export interface AnalyticsSummary {
  metrics: StatMetric[];
  callVolume: CallVolumePoint[];
  callsByStatus: Array<{ status: string; value: number }>;
  callsByAgent: Array<{ agent: string; value: number }>;
  peakHours: Array<{ hour: string; inbound: number; outbound: number }>;
  sentiment: Array<{ sentiment: string; value: number }>;
  agentPerformance: Array<{
    agent: string;
    successRate: number;
    avgDuration: number;
    callsHandled: number;
  }>;
}

export interface BillingSummary {
  currentPeriod: {
    label: string;
    dateRange: string;
    usage: number;
    limit: number;
    estimatedTotal: number;
    currency: string;
  };
  usageBreakdown: Array<{ resource: string; quantity: string; cost: number }>;
  costTrend: Array<{ month: string; cost: number }>;
  billingHistory: Array<{
    invoiceNumber: string;
    date: string;
    amount: number;
    status: "Paid" | "Open" | "Overdue";
  }>;
  paymentMethod: {
    brand: string;
    last4: string;
    exp: string;
  };
  alerts: {
    enabled: boolean;
    threshold: number;
    autoPause: boolean;
  };
}

export interface WorkspaceSettings {
  workspaceName: string;
  industry: string;
  timezone: string;
}

export type TeamRole = "Owner" | "Admin" | "Member";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatarColor: string;
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface BillingSetting {
  usageLimit: number;
  autoPause: boolean;
  alertThreshold: number;
}

export interface SettingsSnapshot {
  general: WorkspaceSettings;
  team: TeamMember[];
  notifications: NotificationSetting[];
  billing: BillingSetting;
}

export interface IDataProvider {
  getDashboardOverview(): Promise<DashboardOverview>;
  getAgents(): Promise<Agent[]>;
  getAgentTemplates(): Promise<AgentTemplate[]>;
  getVoiceProfiles(): Promise<VoiceProfile[]>;
  getCallRecords(): Promise<CallRecord[]>;
  getCallDetail(callId: string): Promise<CallDetail | undefined>;
  getIntegrations(): Promise<Integration[]>;
  getAnalyticsSummary(): Promise<AnalyticsSummary>;
  getBillingSummary(): Promise<BillingSummary>;
  getSettingsSnapshot(): Promise<SettingsSnapshot>;
}

