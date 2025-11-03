import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, PlugZap } from "lucide-react";
import type { Integration } from "../../data/types";
import { useDataProvider } from "../../providers/DataProviderContext";
import { useToast } from "../../providers/ToastProvider";
import { EmptyState } from "../../components/ui/EmptyState";

export function IntegrationsPage() {
  const dataProvider = useDataProvider();
  const { pushToast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    dataProvider.getIntegrations().then(setIntegrations);
  }, [dataProvider]);

  const { connected, available } = useMemo(() => {
    return integrations.reduce(
      (acc, integration) => {
        if (integration.status === "connected") {
          acc.connected.push(integration);
        } else {
          acc.available.push(integration);
        }
        return acc;
      },
      { connected: [] as Integration[], available: [] as Integration[] },
    );
  }, [integrations]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Integrations</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sync data bi-directionally across your CRM, calendar, and payment tools.
          </p>
        </div>
        <button type="button" className="btn-primary">
          <PlugZap className="h-4 w-4" />
          Request integration
        </button>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Connected</h2>
          <p className="text-xs text-slate-500">
            Manage live connections and control data sync schedules.
          </p>
        </div>
        {connected.length === 0 ? (
          <EmptyState
            title="No integrations connected yet"
            description="Connect Vocalized to your source systems to unlock hands-free workflows."
            action={
              <button type="button" className="btn-primary">
                Connect your first integration
              </button>
            }
            illustration={<PlugZap className="h-8 w-8" />}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {connected.map((integration) => (
              <article
                key={integration.id}
                className="card flex flex-col gap-4 border border-primary/10 bg-primary/5 p-6 text-sm text-slate-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{integration.name}</h3>
                    <p className="text-xs text-slate-500">{integration.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-500 shadow-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Connected
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-xs text-slate-500">
                  <span>Syncs every 15 minutes</span>
                  <span>Last synced {integration.lastSynced}</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    Settings
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Available integrations</h2>
          <p className="text-xs text-slate-500">
            Connect with enterprise-ready OAuth flows and granular field mapping.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {available.map((integration) => (
            <article key={integration.id} className="card space-y-4 p-6 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{integration.name}</h3>
                  <p className="text-xs text-slate-500">{integration.category}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-primary">
                  {integration.name.slice(0, 2)}
                </span>
              </div>
              <p>{integration.description}</p>
              <button
                type="button"
                className="btn-primary w-full"
                onClick={() =>
                  pushToast({
                    title: `Connecting ${integration.name}`,
                    description: "Redirecting you to a secure OAuth flow.",
                    variant: "info",
                  })
                }
              >
                Connect
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

