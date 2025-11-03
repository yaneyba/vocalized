import { useMemo } from "react";
import { Cpu, Database, Flag, Gauge, HardDrive, Server, Settings } from "lucide-react";
import { cn } from "../lib/utils";

const databaseMetrics = [
  { label: "D1 Size", value: "82 GB", helper: "Growth +4% 30d" },
  { label: "Avg Query", value: "92 ms", helper: "P95 180 ms" },
  { label: "Slow queries", value: "18", helper: "Last 24h" },
];

const kvMetrics = [
  { label: "Storage", value: "182 GB" },
  { label: "Request rate", value: "12.2k req/s" },
];

const workerMetrics = [
  { name: "Agent Orchestrator", requests: 182_000, errors: 12, cpu: "43 ms" },
  { name: "Webhook Relay", requests: 98_200, errors: 5, cpu: "22 ms" },
  { name: "Audit Pipeline", requests: 55_340, errors: 0, cpu: "18 ms" },
];

const featureFlags = [
  { label: "Voice sentiment scoring", enabled: true },
  { label: "Realtime transcription", enabled: true },
  { label: "Provider auto-shift", enabled: false },
];

export function SystemPage() {
  const totals = useMemo(
    () => workerMetrics.reduce((acc, worker) => acc + worker.requests, 0),
    [],
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <SystemCard title="Database" icon={<Database className="h-5 w-5" />} metrics={databaseMetrics} />
        <SystemCard title="KV Storage" icon={<HardDrive className="h-5 w-5" />} metrics={kvMetrics} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <header className="flex items-center gap-3 text-white">
            <Server className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-semibold">Durable Objects</h3>
              <p className="text-xs text-slate-500">Real-time session storage</p>
            </div>
          </header>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div>
              <dt>Active objects</dt>
              <dd className="text-slate-200">412</dd>
            </div>
            <div>
              <dt>CPU time</dt>
              <dd className="text-slate-200">241 ms</dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>18.4 GB</dd>
            </div>
            <div>
              <dt>Replication</dt>
              <dd>3 regions</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <header className="flex items-center gap-3 text-white">
            <Cpu className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold">Workers runtime</h3>
              <p className="text-xs text-slate-500">Edge compute footprint</p>
            </div>
          </header>
          <table className="mt-4 w-full divide-y divide-slate-900 text-xs text-slate-400">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Worker</th>
                <th className="py-2">Requests</th>
                <th className="py-2">Errors</th>
                <th className="py-2">CPU</th>
              </tr>
            </thead>
            <tbody>
              {workerMetrics.map((worker) => (
                <tr key={worker.name} className="text-slate-200">
                  <td className="py-2">{worker.name}</td>
                  <td className="py-2">{worker.requests.toLocaleString()}</td>
                  <td className="py-2">{worker.errors}</td>
                  <td className="py-2">{worker.cpu}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[11px] text-slate-500">Total requests: {totals.toLocaleString()}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr,1fr]">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <header className="flex items-center gap-3 text-white">
            <Settings className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-semibold">Platform configuration</h3>
              <p className="text-xs text-slate-500">Adjust core levers from a single pane.</p>
            </div>
          </header>
          <div className="mt-4 space-y-3 text-xs text-slate-400">
            <label className="block">
              Pricing markup %
              <input
                type="number"
                defaultValue={18}
                className="mt-1 h-10 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-3 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <label className="block">
              Trial duration (days)
              <input
                type="number"
                defaultValue={14}
                className="mt-1 h-10 w-full rounded-xl border border-slate-900 bg-slate-900/60 px-3 text-sm text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <label className="block">
              Platform settings (JSON)
              <textarea
                rows={5}
                defaultValue={`{"call_recording":true,"default_tier":"Growth"}`}
                className="mt-1 w-full rounded-xl border border-slate-900 bg-slate-900/60 p-3 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <button className="admin-btn-primary">
              <Gauge className="h-4 w-4" /> Save configuration
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <header className="flex items-center gap-3 text-white">
            <Flag className="h-5 w-5 text-amber-300" />
            <div>
              <h3 className="text-sm font-semibold">Feature flags</h3>
              <p className="text-xs text-slate-500">Control platform rollouts and experiments.</p>
            </div>
          </header>
          <ul className="mt-4 space-y-3 text-xs text-slate-400">
            {featureFlags.map((flag) => (
              <li key={flag.label} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/50 px-4 py-3">
                <span className="text-slate-200">{flag.label}</span>
                <input type="checkbox" defaultChecked={flag.enabled} className="h-4 w-4 rounded border-slate-700" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function SystemCard({
  title,
  icon,
  metrics,
}: {
  title: string;
  icon: React.ReactNode;
  metrics: Array<{ label: string; value: string; helper?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
      <header className="flex items-center gap-3 text-white">
        {icon}
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-slate-500">Live status and utilization</p>
        </div>
      </header>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-400">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4">
            <dt className="text-slate-500">{metric.label}</dt>
            <dd className="mt-2 text-lg font-semibold text-white">{metric.value}</dd>
            {metric.helper ? <p className="mt-1 text-[11px] text-slate-500">{metric.helper}</p> : null}
          </div>
        ))}
      </dl>
    </div>
  );
}
