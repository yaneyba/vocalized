import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock3, UserPlus } from "lucide-react";
import { fetchAdminDashboard, type AdminDashboardData, type AdminUser } from "../data/mock";
import { formatDateTime, formatNumber } from "../lib/utils";

export function DashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard().then((payload) => {
      setData(payload);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="grid gap-6">
        <SkeletonRow />
        <SkeletonRow rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Total users"
          value={formatNumber(data.metrics.totalUsers)}
          helper="Across all workspaces"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
        />
        <MetricCard
          title="Active seats"
          value={`${data.metrics.activeSeats}`}
          helper="Seats consuming quota"
          icon={<ArrowUpRight className="h-5 w-5 text-blue-400" />}
        />
        <MetricCard
          title="Pending invites"
          value={`${data.metrics.pendingInvites}`}
          helper="Awaiting acceptance"
          icon={<UserPlus className="h-5 w-5 text-amber-300" />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="admin-card border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">User management</h2>
              <p className="text-sm text-slate-400">Roles, seats, and account health</p>
            </div>
            <button className="admin-btn-primary">
              Invite user
            </button>
          </div>
          <UserTable users={data.users} />
        </div>

        <div className="admin-card border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent activity</h2>
              <p className="text-sm text-slate-400">Audit log snapshot (24h)</p>
            </div>
          </div>
          <AuditFeed events={data.auditEvents} />
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  helper,
  icon,
}: {
  title: string;
  value: string;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <div className="admin-card border border-slate-800/80">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-3 text-xs text-slate-500">{helper}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-100">
          {icon}
        </div>
      </div>
    </div>
  );
}

function UserTable({ users }: { users: AdminUser[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800/60">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/70 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3">Name</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Seat usage</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Last active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-900/60">
              <td className="px-5 py-4">
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </td>
              <td className="px-5 py-4">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-5 py-4 text-slate-300">{user.seatsUsed}</td>
              <td className="px-5 py-4">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-5 py-4 text-right text-xs text-slate-400">
                {formatDateTime(user.lastActive)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleBadge({ role }: { role: AdminUser["role"] }) {
  const styles: Record<AdminUser["role"], string> = {
    Owner: "bg-purple-500/20 text-purple-200",
    Admin: "bg-blue-500/20 text-blue-200",
    Manager: "bg-emerald-500/20 text-emerald-200",
    Agent: "bg-slate-500/20 text-slate-200",
  };
  return <span className={`admin-badge ${styles[role]}`}>{role}</span>;
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  const styles: Record<AdminUser["status"], string> = {
    Active: "bg-emerald-500/20 text-emerald-200",
    Invited: "bg-amber-500/20 text-amber-200",
    Suspended: "bg-red-500/20 text-red-200",
  };
  return <span className={`admin-badge ${styles[status]}`}>{status}</span>;
}

function AuditFeed({ events }: { events: AdminDashboardData["auditEvents"] }) {
  return (
    <ol className="mt-6 space-y-4 text-sm text-slate-300">
      {events.map((event) => (
        <li key={event.id} className="flex gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-slate-300">
            <Clock3 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-slate-500">{event.channel}</p>
            <p className="mt-1 text-sm text-white">
              <span className="font-semibold">{event.actor}</span> {event.action}{" "}
              <span className="text-slate-300">{event.target}</span>
            </p>
            <p className="mt-2 text-xs text-slate-500">{formatDateTime(event.timestamp)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function SkeletonRow({ rows = 1 }: { rows?: number }) {
  return (
    <div className="admin-card border border-slate-900">
      <div className="grid gap-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-900/80" />
        ))}
      </div>
    </div>
  );
}
