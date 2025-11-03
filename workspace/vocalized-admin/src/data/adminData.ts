import { faker } from "@faker-js/faker";

export type WorkspaceStatus = "Active" | "Trial" | "Suspended";
export type WorkspaceTier = "Starter" | "Growth" | "Scale" | "Enterprise";
export type ProviderStatus = "healthy" | "degraded" | "down";
export type IntegrationStatus = "enabled" | "disabled";
export type LogLevel = "error" | "warn" | "info";

export interface WorkspaceSummary {
  id: string;
  name: string;
  ownerEmail: string;
  industry: string;
  status: WorkspaceStatus;
  tier: WorkspaceTier;
  totalCalls: number;
  revenue: number;
  createdAt: string;
  lastActivity: string;
}

export interface WorkspaceUsagePoint {
  day: string;
  calls: number;
  minutes: number;
}

export interface WorkspaceRecentCall {
  id: string;
  caller: string;
  status: "Completed" | "Failed" | "In Progress";
  agent: string;
  duration: number;
  timestamp: string;
}

export interface WorkspaceDetail extends WorkspaceSummary {
  ownerPhone: string;
  address: string;
  usage: WorkspaceUsagePoint[];
  recentCalls: WorkspaceRecentCall[];
}

export interface WorkspaceAggregate {
  total: number;
  active: number;
  trial: number;
  suspended: number;
}

export interface WorkspaceMetrics {
  workplaces: WorkspaceAggregate;
  totalCallsLast30: number;
  mrr: number;
  churnRate: number;
}

export interface PlatformHealthIndicator {
  label: string;
  status: "good" | "warning" | "critical";
  latencyMs: number;
  incidentsToday: number;
}

export interface ActivityItem {
  id: string;
  type: "signup" | "call" | "error";
  title: string;
  timestamp: string;
  metadata: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface ProviderCard {
  id: string;
  name: string;
  status: ProviderStatus;
  latency: number;
  errorRate: number;
  totalCalls: number;
  cost: number;
  revenue: number;
}

export interface IntegrationSummary {
  id: string;
  name: string;
  workspacesUsing: number;
  totalSyncs: number;
  status: IntegrationStatus;
  failures24h: number;
}

export interface InvoiceSummary {
  id: string;
  workspace: string;
  balance: number;
  status: "paid" | "pending" | "overdue";
  lastPayment: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  worker: string;
  level: LogLevel;
  workspace: string;
  message: string;
  details: string;
}

export interface AdminAction {
  id: string;
  admin: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  workspaceCount: number;
  lastLogin: string;
  status: "Active" | "Invited" | "Suspended";
}

export interface UserDetail extends UserSummary {
  workspaces: Array<{ workspace: string; role: string }>;
  activity: Array<{
    id: string;
    timestamp: string;
    description: string;
  }>;
  loginHistory: Array<{ timestamp: string; ip: string; device: string }>;
}

function randomWorkspace(index: number): WorkspaceSummary {
  const status = faker.helpers.arrayElement<WorkspaceStatus>(["Active", "Trial", "Suspended"]);
  const tier = faker.helpers.arrayElement<WorkspaceTier>(["Starter", "Growth", "Scale", "Enterprise"]);
  const name = `${faker.company.name()} Workspace`.replace(/\s+/g, " ").trim();
  return {
    id: `workspace-${index}`,
    name,
    ownerEmail: faker.internet.email().toLowerCase(),
    industry: faker.commerce.department(),
    status,
    tier,
    totalCalls: faker.number.int({ min: 1200, max: 45000 }),
    revenue: faker.number.float({ min: 1200, max: 42000, fractionDigits: 2 }),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    lastActivity: faker.date.recent({ days: 3 }).toISOString(),
  };
}

const workspaces: WorkspaceSummary[] = Array.from({ length: 32 }, (_, index) => randomWorkspace(index + 1));

export const workspaceMetrics: WorkspaceMetrics = {
  workplaces: {
    total: workspaces.length,
    active: workspaces.filter((workspace) => workspace.status === "Active").length,
    trial: workspaces.filter((workspace) => workspace.status === "Trial").length,
    suspended: workspaces.filter((workspace) => workspace.status === "Suspended").length,
  },
  totalCallsLast30: workspaces.reduce((total, workspace) => total + Math.floor(workspace.totalCalls / 12), 0),
  mrr: workspaces.reduce((total, workspace) => total + workspace.revenue, 0) / 12,
  churnRate: 3.7,
};

export const platformHealth: PlatformHealthIndicator[] = [
  {
    label: "Core API",
    status: "good",
    latencyMs: 124,
    incidentsToday: 0,
  },
  {
    label: "Database",
    status: "warning",
    latencyMs: 212,
    incidentsToday: 1,
  },
  {
    label: "Providers",
    status: "good",
    latencyMs: 168,
    incidentsToday: 0,
  },
  {
    label: "Realtime Events",
    status: "good",
    latencyMs: 92,
    incidentsToday: 0,
  },
];

export const activityFeed: ActivityItem[] = Array.from({ length: 12 }, () => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(["signup", "call", "error"]),
  title: faker.company.catchPhrase(),
  timestamp: faker.date.recent({ days: 1 }).toISOString(),
  metadata: faker.lorem.sentence(),
}));

export const revenueSeries: RevenuePoint[] = Array.from({ length: 12 }, (_, index) => ({
  month: faker.date.recent({ days: 365 }).toLocaleString("default", { month: "short" }),
  revenue: faker.number.float({ min: 20000, max: 120000, fractionDigits: 2 }),
}));

export const providerCards: ProviderCard[] = [
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    status: "healthy",
    latency: 143,
    errorRate: 0.7,
    totalCalls: 182341,
    cost: 12432,
    revenue: 28340,
  },
  {
    id: "deepgram",
    name: "Deepgram",
    status: "healthy",
    latency: 167,
    errorRate: 1.2,
    totalCalls: 154231,
    cost: 10341,
    revenue: 24982,
  },
  {
    id: "vapi",
    name: "Vapi",
    status: "degraded",
    latency: 221,
    errorRate: 3.1,
    totalCalls: 92311,
    cost: 6432,
    revenue: 14200,
  },
  {
    id: "retell",
    name: "Retell",
    status: "healthy",
    latency: 189,
    errorRate: 1.8,
    totalCalls: 68432,
    cost: 5430,
    revenue: 11280,
  },
];

export const integrations: IntegrationSummary[] = Array.from({ length: 6 }, (_, index) => ({
  id: `integration-${index}`,
  name: faker.company.name(),
  workspacesUsing: faker.number.int({ min: 12, max: 420 }),
  totalSyncs: faker.number.int({ min: 1200, max: 9800 }),
  status: faker.helpers.arrayElement(["enabled", "disabled"]),
  failures24h: faker.number.int({ min: 0, max: 17 }),
}));

export const invoices: InvoiceSummary[] = Array.from({ length: 15 }, () => ({
  id: faker.finance.iban(),
  workspace: faker.company.name(),
  balance: faker.number.float({ min: -200, max: 4200, fractionDigits: 2 }),
  status: faker.helpers.arrayElement(["paid", "pending", "overdue"]),
  lastPayment: faker.date.recent({ days: 10 }).toISOString(),
}));

export const logEntries: LogEntry[] = Array.from({ length: 120 }, () => ({
  id: faker.string.uuid(),
  timestamp: faker.date.recent({ days: 1 }).toISOString(),
  worker: `worker-${faker.number.int({ min: 1, max: 9 })}`,
  level: faker.helpers.arrayElement(["error", "warn", "info"]),
  workspace: faker.company.name(),
  message: faker.hacker.phrase(),
  details: faker.lorem.sentences(2),
}));

export const adminActions: AdminAction[] = Array.from({ length: 40 }, () => ({
  id: faker.string.uuid(),
  admin: faker.person.fullName(),
  action: faker.hacker.verb(),
  resource: faker.company.name(),
  timestamp: faker.date.recent({ days: 30 }).toISOString(),
  ip: faker.internet.ipv4(),
}));

const users: UserDetail[] = Array.from({ length: 28 }, () => {
  const workspacesForUser = faker.helpers.arrayElements(workspaces, faker.number.int({ min: 1, max: 4 }));
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    workspaceCount: workspacesForUser.length,
    lastLogin: faker.date.recent({ days: 5 }).toISOString(),
    status: faker.helpers.arrayElement(["Active", "Invited", "Suspended"]),
    workspaces: workspacesForUser.map((workspace) => ({ workspace: workspace.name, role: faker.helpers.arrayElement(["Owner", "Admin", "Member"]) })),
    activity: Array.from({ length: 4 }, () => ({
      id: faker.string.uuid(),
      timestamp: faker.date.recent({ days: 7 }).toISOString(),
      description: faker.hacker.phrase(),
    })),
    loginHistory: Array.from({ length: 5 }, () => ({
      timestamp: faker.date.recent({ days: 10 }).toISOString(),
      ip: faker.internet.ipv4(),
      device: faker.commerce.productName(),
    })),
  };
});

export const userSummaries: UserSummary[] = users.map(({ id, name, email, workspaceCount, lastLogin, status }) => ({
  id,
  name,
  email,
  workspaceCount,
  lastLogin,
  status,
}));

export function getUserDetail(id: string) {
  return users.find((user) => user.id === id);
}

export const workspaceDetails: Record<string, WorkspaceDetail> = Object.fromEntries(
  workspaces.map((workspace) => [
    workspace.id,
    {
      ...workspace,
      ownerPhone: faker.phone.number(),
      address: faker.location.streetAddress(),
      usage: Array.from({ length: 7 }, (_, index) => ({
        day: faker.date
          .recent({ days: 7 })
          .toLocaleDateString(undefined, { weekday: "short" }),
        calls: faker.number.int({ min: 40, max: 400 }),
        minutes: faker.number.int({ min: 120, max: 2100 }),
      })),
      recentCalls: Array.from({ length: 5 }, () => ({
        id: faker.string.uuid(),
        caller: faker.person.fullName(),
        status: faker.helpers.arrayElement(["Completed", "Failed", "In Progress"]),
        agent: faker.person.fullName(),
        duration: faker.number.float({ min: 1.1, max: 14.2, fractionDigits: 1 }),
        timestamp: faker.date.recent({ days: 2 }).toISOString(),
      })),
    },
  ]),
);

export function fetchWorkspaces() {
  return Promise.resolve(workspaces);
}

export function fetchUsers() {
  return Promise.resolve(userSummaries);
}

export function fetchProviders() {
  return Promise.resolve(providerCards);
}

export function fetchIntegrations() {
  return Promise.resolve(integrations);
}

export function fetchInvoices() {
  return Promise.resolve(invoices);
}

export function fetchLogs() {
  return Promise.resolve(logEntries);
}

export function fetchAdminActions() {
  return Promise.resolve(adminActions);
}

export function fetchWorkspaceDetail(id: string) {
  return Promise.resolve(workspaceDetails[id]);
}
