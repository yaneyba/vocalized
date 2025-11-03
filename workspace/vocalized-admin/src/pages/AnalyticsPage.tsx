import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProviders,
  fetchWorkspaces,
  providerCards,
  revenueSeries,
  workspaceMetrics,
} from "../data/adminData";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn, formatNumber } from "../lib/utils";

const tabs = ["Calls", "Performance", "Costs", "Growth"] as const;

export function AnalyticsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Calls");
  const { data: providers = providerCards } = useQuery({ queryKey: ["providers"], queryFn: fetchProviders });
  const { data: workspaces = [] } = useQuery({ queryKey: ["workspaces"], queryFn: fetchWorkspaces });

  const callsSeries = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        day: `Day ${index + 1}`,
        total: Math.round(workspaceMetrics.totalCallsLast30 / 14 + Math.random() * 3200),
        success: Math.round(0.93 * (workspaceMetrics.totalCallsLast30 / 14)),
      })),
    [],
  );

  const providerDistribution = useMemo(
    () =>
      providers.map((provider) => ({
        provider: provider.name,
        calls: provider.totalCalls,
        successRate: 100 - provider.errorRate,
      })),
    [providers],
  );

  const costVsRevenue = useMemo(
    () =>
      providers.map((provider) => ({
        name: provider.name,
        cost: provider.cost,
        revenue: provider.revenue,
        profit: provider.revenue - provider.cost,
      })),
    [providers],
  );

  const growthSeries = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        month: revenueSeries[index]?.month ?? `M${index + 1}`,
        newWorkspaces: Math.round(12 + Math.random() * 18),
        churn: Math.round(Math.random() * 5),
        users: Math.round(40 + Math.random() * 60),
      })),
    [],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm",
              tab === item
                ? "border-blue-500/60 bg-blue-500/10 text-blue-200"
                : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Calls" ? (
        <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white">Total calls (daily)</h3>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer>
                <AreaChart data={callsSeries}>
                  <defs>
                    <linearGradient id="calls" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                  <XAxis dataKey="day" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", color: "white" }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="url(#calls)" strokeWidth={3} />
                  <Area type="monotone" dataKey="success" stroke="#22d3ee" fillOpacity={0} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white">Calls by provider</h3>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer>
                <BarChart data={providerDistribution}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                  <XAxis dataKey="provider" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip
                    formatter={(value: number) => formatNumber(value)}
                    contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", color: "white" }}
                  />
                  <Bar dataKey="calls" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "Performance" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white">Average call duration</h3>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer>
                <LineChart data={callsSeries}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                  <XAxis dataKey="day" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip contentStyle={{ background: "#0f172a", color: "white", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white">Provider latency & success</h3>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer>
                <BarChart data={providerDistribution}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                  <XAxis dataKey="provider" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip contentStyle={{ background: "#0f172a", color: "white", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <Bar dataKey="successRate" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "Costs" ? (
        <div className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white">Cost vs revenue</h3>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer>
                <BarChart data={costVsRevenue}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip contentStyle={{ background: "#0f172a", color: "white", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <Bar dataKey="cost" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white">Optimization recommendations</h3>
            <ul className="mt-4 space-y-3 text-xs text-slate-400">
              <li className="rounded-xl border border-slate-900 bg-slate-900/40 px-4 py-3">
                Shift 12% of outbound calls from Vapi → ElevenLabs to reduce cost by 8%.
              </li>
              <li className="rounded-xl border border-slate-900 bg-slate-900/40 px-4 py-3">
                Enable speech compression for Deepgram during off-peak hours.
              </li>
              <li className="rounded-xl border border-slate-900 bg-slate-900/40 px-4 py-3">
                Activate reserved minutes with Retell to capture enterprise margin.
              </li>
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "Growth" ? (
        <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white">Workspace growth</h3>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer>
                <LineChart data={growthSeries}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                  <XAxis dataKey="month" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip contentStyle={{ background: "#0f172a", color: "white", border: "1px solid rgba(148,163,184,0.2)" }} />
                  <Line type="monotone" dataKey="newWorkspaces" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="users" stroke="#22d3ee" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-white">Churn insight</h3>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li>• Current churn: {workspaceMetrics.churnRate.toFixed(1)}%</li>
              <li>• Enterprise churn: 1.3% (stable)</li>
              <li>• Expansion revenue: +12% QoQ</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
