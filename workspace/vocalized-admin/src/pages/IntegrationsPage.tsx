import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Cloudy, Plus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchIntegrations, integrations, type IntegrationSummary } from "../data/adminData";
import { cn, formatNumber } from "../lib/utils";

export function IntegrationsPage() {
  const { data: integrationList = integrations } = useQuery({ queryKey: ["integrations"], queryFn: fetchIntegrations });
  const [selected, setSelected] = useState<IntegrationSummary | null>(null);

  const usageChart = useMemo(
    () => integrationList.map((integration) => ({ name: integration.name, value: integration.workspacesUsing })),
    [integrationList],
  );

  const failures = integrationList.filter((integration) => integration.failures24h > 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Platform integrations</h2>
          <p className="text-xs text-slate-500">Monitor adoption, reliability, and coverage for every connector.</p>
        </div>
        <button className="admin-btn-primary">
          <Plus className="h-4 w-4" /> Add integration type
        </button>
      </header>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {integrationList.map((integration) => (
            <article
              key={integration.id}
              className={cn(
                "rounded-2xl border border-slate-900 bg-slate-900/60 p-5",
                selected?.id === integration.id && "border-blue-500/60",
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">{integration.name}</h3>
                  <p className="text-xs text-slate-500">{formatNumber(integration.workspacesUsing)} workspaces</p>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{integration.status === "enabled" ? "Enabled" : "Disabled"}</span>
                  <input type="checkbox" defaultChecked={integration.status === "enabled"} className="h-4 w-4 rounded border-slate-700" />
                </label>
              </div>
              <dl className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <div>
                  <dt>Total syncs</dt>
                  <dd className="text-slate-200">{integration.totalSyncs.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Failures (24h)</dt>
                  <dd className={integration.failures24h ? "text-amber-300" : "text-slate-500"}>{integration.failures24h}</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <button className="admin-btn-ghost border border-slate-800/70" onClick={() => setSelected(integration)}>
                  Configure
                </button>
                <button className="rounded-xl border border-slate-800/70 px-3 py-2 text-xs text-blue-200">View analytics</button>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <h3 className="text-sm font-semibold text-white">Usage distribution</h3>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer>
              <BarChart data={usageChart}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis stroke="#475569" />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", color: "white" }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </aside>
      </section>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Failed sync alerts</h3>
          <span className="text-xs text-slate-500">Last 24 hours</span>
        </div>
        {failures.length === 0 ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
            <Cloudy className="h-4 w-4" /> All integrations healthy
          </p>
        ) : (
          <ul className="mt-4 space-y-3 text-xs text-slate-400">
            {failures.map((integration) => (
              <li key={integration.id} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/50 px-4 py-3">
                <span className="flex items-center gap-2 text-slate-200">
                  <AlertTriangle className="h-4 w-4 text-amber-300" /> {integration.name}
                </span>
                <span>{integration.failures24h} failures</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <IntegrationConfigModal integration={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function IntegrationConfigModal({
  integration,
  onClose,
}: {
  integration: IntegrationSummary | null;
  onClose: () => void;
}) {
  if (!integration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-900 bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-900 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Configure integration</p>
            <h2 className="text-xl font-semibold text-white">{integration.name}</h2>
          </div>
          <button className="admin-btn-ghost border border-slate-800" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="grid gap-6 bg-slate-950 px-6 py-6 lg:grid-cols-2">
          <div className="space-y-4 text-xs text-slate-400">
            <label className="block text-sm text-slate-200">
              Client ID
              <input
                type="text"
                defaultValue="vocalized-admin"
                className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <label className="block text-sm text-slate-200">
              Client secret
              <input
                type="password"
                defaultValue="••••••••••"
                className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
              <span>Enable integration</span>
              <input type="checkbox" defaultChecked={integration.status === "enabled"} className="h-4 w-4 rounded border-slate-700" />
            </label>
          </div>
          <div className="space-y-4 text-xs text-slate-400">
            <label className="block text-sm text-slate-200">
              Sync frequency (minutes)
              <input
                type="number"
                defaultValue={15}
                className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <label className="block text-sm text-slate-200">
              Retry policy
              <select className="mt-2 h-11 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-4 text-sm text-slate-200 outline-none focus:border-blue-500">
                <option>Retry 3 times</option>
                <option>Retry 5 times</option>
                <option>Fail fast</option>
              </select>
            </label>
            <div className="rounded-xl border border-slate-900 bg-slate-900/60 p-3 text-xs text-slate-300">
              <p>Usage summary</p>
              <p className="mt-1 text-slate-500">
                {formatNumber(integration.workspacesUsing)} workspaces · {integration.totalSyncs.toLocaleString()} syncs · {integration.failures24h} failures (24h)
              </p>
            </div>
            <button className="admin-btn-primary w-full justify-center border border-blue-500/40">Save settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
