import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Flame, Gauge, Settings2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  fetchProviders,
  providerCards,
  type ProviderCard,
} from "../data/adminData";
import { cn, formatCurrency } from "../lib/utils";

const routingStrategies = ["Cost optimized", "Quality optimized", "Custom weights"];

export function ProvidersPage() {
  const { data: providers = providerCards } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    refetchInterval: 20000,
  });
  const [selectedProvider, setSelectedProvider] = useState<ProviderCard | null>(null);
  const [strategy, setStrategy] = useState<string>(routingStrategies[0]);

  const costComparison = useMemo(
    () =>
      providers.map((provider) => ({
        provider: provider.name,
        cost: provider.cost,
        revenue: provider.revenue,
        margin: provider.revenue - provider.cost,
      })),
    [providers],
  );

  const latencyTrend = useMemo(
    () =>
      providers.map((provider) => ({
        name: provider.name,
        latency: provider.latency,
        errors: provider.errorRate,
      })),
    [providers],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Voice AI gateway</h2>
          <p className="text-xs text-slate-500">Balance provider health, cost, and quality across the platform.</p>
        </div>
        <button className="admin-btn-primary">
          <Settings2 className="h-4 w-4" /> Global configuration
        </button>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((provider) => (
            <article
              key={provider.id}
              className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5 transition hover:border-blue-500/40"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">{provider.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{provider.totalCalls.toLocaleString()} calls</p>
                </div>
                <StatusPill status={provider.status} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div>
                  <dt>Latency</dt>
                  <dd className="text-slate-200">{provider.latency}ms</dd>
                </div>
                <div>
                  <dt>Error rate</dt>
                  <dd className="text-slate-200">{provider.errorRate}%</dd>
                </div>
                <div>
                  <dt>Cost</dt>
                  <dd>{formatCurrency(provider.cost, 0)}</dd>
                </div>
                <div>
                  <dt>Revenue</dt>
                  <dd>{formatCurrency(provider.revenue, 0)}</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                <button className="admin-btn-ghost border border-slate-800/60" onClick={() => setSelectedProvider(provider)}>
                  Configure
                </button>
                <button className="rounded-xl border border-slate-800/60 px-3 py-2 text-xs text-blue-200">Run health check</button>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <h3 className="text-sm font-semibold text-white">Global routing strategy</h3>
          <p className="mt-2 text-xs text-slate-500">Combinations control how providers are prioritized.</p>
          <div className="mt-4 space-y-2 text-xs">
            {routingStrategies.map((option) => (
              <button
                key={option}
                className={cn(
                  "w-full rounded-xl border px-3 py-2 text-left",
                  strategy === option
                    ? "border-blue-500/60 bg-blue-500/10 text-blue-200"
                    : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200",
                )}
                onClick={() => setStrategy(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3 text-xs text-slate-400">
            <p>Failover chain</p>
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <span key={provider.id} className="rounded-full border border-slate-800 px-3 py-1">
                  {provider.name}
                </span>
              ))}
            </div>
            <button className="admin-btn-ghost w-full justify-center border border-slate-800/60">
              Test routing
            </button>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <h3 className="text-sm font-semibold text-white">Performance comparison</h3>
          <div className="mt-4 h-[220px]">
            <ResponsiveContainer width="100%" minHeight={220}>
              <LineChart data={latencyTrend}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip
                  contentStyle={{ background: "#0f172a", color: "white", border: "1px solid rgba(148,163,184,0.2)" }}
                />
                <Legend />
                <Line type="monotone" dataKey="latency" stroke="#38bdf8" strokeWidth={3} />
                <Line type="monotone" dataKey="errors" stroke="#f97316" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <h3 className="text-sm font-semibold text-white">Cost vs revenue</h3>
          <div className="mt-4 h-[220px]">
            <ResponsiveContainer width="100%" minHeight={220}>
              <BarChart data={costComparison}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                <XAxis dataKey="provider" stroke="#475569" />
                <YAxis stroke="#475569" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, 0)}
                  contentStyle={{ background: "#0f172a", color: "white", border: "1px solid rgba(148,163,184,0.2)" }}
                />
                <Legend />
                <Bar dataKey="cost" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <ProviderSettingsModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />
    </div>
  );
}

function StatusPill({ status }: { status: ProviderCard["status"] }) {
  const tone = {
    healthy: "bg-emerald-500/15 text-emerald-200",
    degraded: "bg-amber-500/15 text-amber-200",
    down: "bg-red-500/15 text-red-200",
  };
  return <span className={cn("admin-badge", tone[status])}>{status}</span>;
}

interface ProviderSettingsModalProps {
  provider: ProviderCard | null;
  onClose: () => void;
}

function ProviderSettingsModal({ provider, onClose }: ProviderSettingsModalProps) {
  if (!provider) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-900 bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-900 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Configure provider</p>
            <h2 className="text-xl font-semibold text-white">{provider.name}</h2>
          </div>
          <button className="admin-btn-ghost border border-slate-800" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="grid gap-6 bg-slate-950 px-6 py-6 lg:grid-cols-2">
          <div className="space-y-4 text-xs text-slate-400">
            <label className="block text-sm text-slate-200">
              API key
              <input
                type="password"
                defaultValue="••••••••••••"
                className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <label className="block text-sm text-slate-200">
              Priority (1 highest)
              <input
                type="number"
                min={1}
                max={10}
                defaultValue={1}
                className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
              <span>Enabled</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-700" />
            </div>
            <label className="block text-sm text-slate-200">
              Cost per unit ($)
              <input
                type="number"
                defaultValue={0.004}
                step={0.001}
                className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
          </div>
          <div className="space-y-4 text-xs text-slate-400">
            <h3 className="text-sm font-semibold text-white">Health checks</h3>
            <label className="block">
              Interval (seconds)
              <input
                type="number"
                defaultValue={30}
                className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <label className="block">
              Retry attempts
              <input
                type="number"
                defaultValue={3}
                className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3 text-xs">
              <p className="text-slate-300">Latest result</p>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-500">
                <li>• Status: {provider.status}</li>
                <li>• Latency: {provider.latency}ms</li>
                <li>• Error rate: {provider.errorRate}%</li>
              </ul>
            </div>
            <button className="admin-btn-primary w-full justify-center border border-blue-500/40">
              <Gauge className="h-4 w-4" /> Save configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
