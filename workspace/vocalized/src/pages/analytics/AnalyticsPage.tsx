import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsSummary } from "../../data/types";
import { useDataProvider } from "../../providers/DataProviderContext";
import { LoadingSkeleton } from "../../components/ui/LoadingSkeleton";

const colors = ["#1E40AF", "#3B82F6", "#38BDF8", "#A855F7", "#fb7185"];

export function AnalyticsPage() {
  const dataProvider = useDataProvider();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dataProvider.getAnalyticsSummary().then((data) => {
      if (mounted) {
        setAnalytics(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [dataProvider]);

  if (isLoading || !analytics) {
    return (
      <div className="space-y-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
        <LoadingSkeleton className="h-96 rounded-3xl" />
        <LoadingSkeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
        <p className="mt-2 text-sm text-slate-500">
          Understand how your AI agents convert across channels and moments.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {analytics.metrics.map((metric, index) => (
          <div key={metric.label} className="card space-y-3 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {metric.label}
            </p>
            <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
            {typeof metric.change === "number" ? (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  metric.change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                }`}
              >
                {metric.change >= 0 ? "+" : ""}
                {metric.change.toFixed(1)}%
              </span>
            ) : null}
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="card h-96 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Call volume</h2>
              <p className="text-xs text-slate-500">Weekly trend across inbound and outbound</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Rolling 12 weeks
            </span>
          </div>
          <div className="mt-6 h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={analytics.callVolume}>
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.4} />
                    <stop offset="90%" stopColor="#1E40AF" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E0E7FF",
                  }}
                />
                <Area
                  dataKey="total"
                  type="monotone"
                  stroke="#1E40AF"
                  fill="url(#area)"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-6 p-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Calls by status</h2>
            <p className="text-xs text-slate-500">Distribution by lifecycle outcome</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={analytics.callsByStatus}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {analytics.callsByStatus.map((entry, index) => (
                    <Cell key={entry.status} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E0E7FF",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3 text-xs">
            {analytics.callsByStatus.map((entry, index) => (
              <div key={entry.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="font-medium text-slate-600">{entry.status}</span>
                </div>
                <span className="font-semibold text-slate-900">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[3fr,2fr]">
        <div className="card h-96 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Calls by agent</h2>
              <p className="text-xs text-slate-500">Agent-level distribution of handled calls</p>
            </div>
          </div>
          <div className="mt-6 h-[260px]">
            <ResponsiveContainer>
              <BarChart data={analytics.callsByAgent}>
                <CartesianGrid vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="agent" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E0E7FF",
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                  {analytics.callsByAgent.map((entry, index) => (
                    <Cell key={entry.agent} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-5 p-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Peak hours</h2>
            <p className="text-xs text-slate-500">Call intensity by hour of day</p>
          </div>
          <div className="grid gap-2 text-xs">
            {analytics.peakHours.map((entry) => (
              <div key={entry.hour} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">{entry.hour}</span>
                  <span className="text-slate-400">
                    {entry.inbound + entry.outbound} total
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 flex-1 rounded-full bg-primary/10">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${entry.inbound}%` }}
                    />
                  </div>
                  <div className="h-2 flex-1 rounded-full bg-emerald-50">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${entry.outbound}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,3fr]">
        <div className="card h-80 p-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Sentiment</h2>
            <p className="text-xs text-slate-500">Share of positive vs neutral vs negative</p>
          </div>
          <div className="mt-6 h-[200px]">
            <ResponsiveContainer>
              <BarChart data={analytics.sentiment}>
                <CartesianGrid vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="sentiment" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E0E7FF",
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                  {analytics.sentiment.map((entry, index) => (
                    <Cell key={entry.sentiment} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card overflow-hidden p-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Agent performance</h2>
            <p className="text-xs text-slate-500">Compare success rate and average duration</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-3 text-left">Agent</th>
                  <th className="py-3 text-right">Success rate</th>
                  <th className="py-3 text-right">Avg duration</th>
                  <th className="py-3 text-right">Calls handled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {analytics.agentPerformance.map((entry) => (
                  <tr key={entry.agent}>
                    <td className="py-4 font-semibold text-slate-900">{entry.agent}</td>
                    <td className="py-4 text-right">{entry.successRate}%</td>
                    <td className="py-4 text-right">{entry.avgDuration.toFixed(1)} min</td>
                    <td className="py-4 text-right">{entry.callsHandled.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

