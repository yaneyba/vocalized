export type UserStatus = "Active" | "Invited" | "Suspended";
export type UserRole = "Owner" | "Admin" | "Manager" | "Agent";

export interface AdminMetrics {
  totalUsers: number;
  activeSeats: number;
  pendingInvites: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  seatsUsed: number;
  lastActive: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  channel: "Policy" | "Access" | "Billing";
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  users: AdminUser[];
  auditEvents: AuditEvent[];
}

const dashboardFixture: AdminDashboardData = {
  metrics: {
    totalUsers: 128,
    activeSeats: 92,
    pendingInvites: 7,
  },
  users: [
    {
      id: "user-1",
      name: "Devon Hart",
      email: "devon@vocalized.ai",
      role: "Owner",
      status: "Active",
      seatsUsed: 2,
      lastActive: "2025-11-03T17:22:00Z",
    },
    {
      id: "user-2",
      name: "Maya Chen",
      email: "maya.chen@vocalized.ai",
      role: "Admin",
      status: "Active",
      seatsUsed: 1,
      lastActive: "2025-11-03T16:48:00Z",
    },
    {
      id: "user-3",
      name: "Elliot Summers",
      email: "elliot@vocalized.ai",
      role: "Manager",
      status: "Invited",
      seatsUsed: 1,
      lastActive: "2025-11-01T12:05:00Z",
    },
    {
      id: "user-4",
      name: "Priya Nair",
      email: "priya@vocalized.ai",
      role: "Agent",
      status: "Active",
      seatsUsed: 1,
      lastActive: "2025-11-03T10:32:00Z",
    },
    {
      id: "user-5",
      name: "Santiago Ruiz",
      email: "sruiz@vocalized.ai",
      role: "Agent",
      status: "Suspended",
      seatsUsed: 0,
      lastActive: "2025-10-29T19:10:00Z",
    },
  ],
  auditEvents: [
    {
      id: "audit-1",
      actor: "Devon Hart",
      action: "updated role",
      target: "Maya Chen → Admin",
      timestamp: "2025-11-03T15:45:00Z",
      channel: "Access",
    },
    {
      id: "audit-2",
      actor: "Morgan Carter",
      action: "invited new member",
      target: "elliot@vocalized.ai",
      timestamp: "2025-11-03T14:12:00Z",
      channel: "Policy",
    },
    {
      id: "audit-3",
      actor: "Priya Nair",
      action: "exported billing report",
      target: "October 2025 CSV",
      timestamp: "2025-11-03T11:05:00Z",
      channel: "Billing",
    },
    {
      id: "audit-4",
      actor: "Security Bot",
      action: "flagged login attempt",
      target: "Santiago Ruiz (2FA required)",
      timestamp: "2025-11-02T21:50:00Z",
      channel: "Access",
    },
  ],
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  await pause(150);
  return clone(dashboardFixture);
}
