import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  activityFeed,
  fetchProviders,
  fetchWorkspaces,
  platformHealth,
  providerCards,
  revenueSeries,
  workspaceMetrics,
} from "../data/adminData";
import { Activity, CheckCircle2, Flame, PauseCircle, ServerCrash } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn, formatCurrency, formatNumber } from "../lib/utils";

export function PlatformOverviewPage() {
  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
    refetchInterval: 15000,
  });
  const { data: providers = providerCards } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    refetchInterval: 20000,
  });

  const topWorkspaces = useMemo(
    () => [...workspaces].sort((a, b) => b.revenue - a.revenue).slice(0, 6),
    [workspaces],
  );

  return (
    <div className="space-y-10">
      <section className="grid gap-5 lg:grid-cols-4">
        <MetricCard
          title="Total workspaces"
          value={workspaceMetrics.workplaces.total.toString()}
          helper={`${workspaceMetrics.workplaces.active} active / ${workspaceMetrics.workplaces.trial} trial / ${workspaceMetrics.workplaces.suspended} suspended`}
        />
        <MetricCard
          title="Calls (30d)"
          value={formatNumber(workspaceMetrics.totalCallsLast30)}
          helper="Across all providers"
        />
        <MetricCard
          title="Monthly recurring revenue"
          value={formatCurrency(workspaceMetrics.mrr)}
          helper="Rolling 30 day"
        />
        <MetricCard
          title="Churn rate"
          value={`${workspaceMetrics.churnRate.toFixed(1)}%`}
          helper="Trailing 90 days"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr,1fr]">
        <div className="admin-card border border-slate-900">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Platform health</h2>
              <p className="text-xs text-slate-500">Live signals across critical components</p>
            </div>
            <button className="admin-btn-ghost border border-slate-800/60">Export status</button>
          </header>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {platformHealth.map((item) => (
              <div key={item.label} className="space-y-2 rounded-2xl border border-slate-900 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <StatusBullet status={item.status} />
                </div>
                <p className="text-xs text-slate-500">Latency {item.latencyMs}ms • Incidents today {item.incidentsToday}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card border border-slate-900">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Realtime activity</h2>
              <p className="text-xs text-slate-500">Latest signups, calls, and alerts</p>
            </div>
            <button className="admin-btn-ghost border border-slate-800">View all</button>
          </header>
          <ul className="mt-4 space-y-3 text-sm">
            {activityFeed.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 rounded-xl border border-slate-900 bg-slate-900/60 p-3">
                <span className="rounded-full bg-slate-900 p-2 text-slate-300">
                  {entry.type === "signup" ? <CheckCircle2 className="h-4 w-4" /> : null}
                  {entry.type === "call" ? <Activity className="h-4 w-4" /> : null}
                  {entry.type === "error" ? <ServerCrash className="h-4 w-4 text-red-400" /> : null}
                </span>
                <div>
                  <p className="text-sm text-white">{entry.title}</p>
                  <p className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                  <p className="mt-1 text-xs text-slate-400">{entry.metadata}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="admin-card border border-slate-900">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Revenue performance</h2>
              <p className="text-xs text-slate-500">Trailing 12 months across all plans</p>
            </div>
            <button className="admin-btn-ghost border border-slate-800">Download CSV</button>
          </header>
          <div className="mt-6 h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    borderRadius: 12,
                    border: "1px solid rgba(148,163,184,0.2)",
                    color: "white",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="url(#rev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card border border-slate-900">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Provider health</h2>
              <p className="text-xs text-slate-500">Latency & error monitoring</p>
            </div>
            <button className="admin-btn-ghost border border-slate-800">Test routing</button>
          </header>
          <div className="mt-4 space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between rounded-2xl border border-slate-900 bg-slate-900/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{provider.name}</p>
                  <p className="text-xs text-slate-500">{provider.totalCalls.toLocaleString()} calls</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Latency {provider.latency}ms</span>
                  <span>Error {provider.errorRate}%</span>
                  <StatusBadge status={provider.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="admin-card border border-slate-900">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Top workspaces</h2>
              <p className="text-xs text-slate-500">By revenue impact</p>
            </div>
            <button className="admin-btn-ghost border border-slate-800">Export</button>
          </header>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-900">
            <table className="min-w-full divide-y divide-slate-900 text-sm">
              <thead className="bg-slate-900/50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left">Workspace</th>
                  <th className="px-5 py-3 text-right">Calls</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {topWorkspaces.map((workspace) => (
                  <tr key={workspace.id} className="hover:bg-slate-900/50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-white">{workspace.name}</p>
                        <p className="text-xs text-slate-500">{workspace.ownerEmail}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-300">
                      {workspace.totalCalls.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right text-white">{formatCurrency(workspace.revenue)}</td>
                    <td className="px-5 py-4 text-right">
                      <WorkspaceStatus status={workspace.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card border border-slate-900">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Automation actions</h2>
              <p className="text-xs text-slate-500">Stay ahead with proactive controls</p>
            </div>
          </header>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-3 rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
              <Flame className="mt-1 h-4 w-4 text-amber-400" />
              <div>
                <p className="text-white">Enable anomaly detection</p>
                <p className="text-xs text-slate-500">Automatically throttle providers when error rate spikes.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
              <PauseCircle className="mt-1 h-4 w-4 text-blue-400" />
              <div>
                <p className="text-white">Suspend inactive workspaces</p>
                <p className="text-xs text-slate-500">Auto-pause accounts with no calls in 30 days.</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
              <Activity className="mt-1 h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-white">Broadcast incident update</p>
                <p className="text-xs text-slate-500">Notify all workspaces of current degraded providers.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <div className="admin-card border border-slate-900">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function StatusBullet({ status }: { status: "good" | "warning" | "critical" }) {
  const color = {
    good: "bg-emerald-400",
    warning: "bg-amber-400",
    critical: "bg-red-500",
  }[status];
  return <span className={cn("h-2.5 w-2.5 rounded-full", color)} />;
}

function StatusBadge({ status }: { status: "healthy" | "degraded" | "down" }) {
  const color = {
    healthy: "text-emerald-300",
    degraded: "text-amber-300",
    down: "text-red-400",
  }[status];
  return <span className={cn("text-xs font-semibold uppercase", color)}>{status}</span>;
}

function WorkspaceStatus({ status }: { status: "Active" | "Trial" | "Suspended" }) {
  const styles = {
    Active: "bg-emerald-500/15 text-emerald-200",
    Trial: "bg-blue-500/15 text-blue-200",
    Suspended: "bg-red-500/15 text-red-200",
  };
  return <span className={cn("admin-badge", styles[status])}>{status}</span>;
}
