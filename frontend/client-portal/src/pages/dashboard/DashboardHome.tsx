import { useEffect, useState } from "react";
import { Coins, Headset, PercentCircle, PhoneIncoming, PlusCircle } from "lucide-react";
import type { DashboardOverview } from "../../data/types";
import { useDataProvider } from "../../providers/DataProviderContext";
import { formatCurrency } from "../../lib/utils";
import { StatCard } from "../../components/ui/StatCard";
import { CallVolumeChart } from "../../components/charts/CallVolumeChart";
import { CallsTable } from "../../components/tables/CallsTable";
import { LoadingSkeleton } from "../../components/ui/LoadingSkeleton";
import { useToast } from "../../providers/ToastProvider";

export function DashboardHome() {
  const dataProvider = useDataProvider();
  const { pushToast } = useToast();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dataProvider.getDashboardOverview().then((data) => {
      if (mounted) {
        setOverview(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [dataProvider]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Command Center</h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor your AI agents, call quality, and operational performance in real time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-ghost border border-slate-200"
            onClick={() =>
              pushToast({
                title: "Workspace switched",
                description: "You are now viewing the Global Ops workspace.",
                variant: "success",
              })
            }
          >
            Switch workspace
          </button>
          <button type="button" className="btn-primary">
            <PlusCircle className="h-4 w-4" />
            Create Agent
          </button>
        </div>
      </div>

      {isLoading || !overview ? (
        <LoadingState />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Calls (Mtd)"
              value={overview.totalCallsThisMonth.toLocaleString()}
              icon={<PhoneIncoming className="h-5 w-5" />}
              delta={12.4}
            />
            <StatCard
              label="Active Agents"
              value={overview.activeAgents.toString()}
              icon={<Headset className="h-5 w-5" />}
              delta={3.5}
            />
            <StatCard
              label="Success Rate"
              value={`${overview.successRate}%`}
              icon={<PercentCircle className="h-5 w-5" />}
              delta={2.1}
            />
            <StatCard
              label="Current Usage"
              value={formatCurrency(overview.currentUsageCost, overview.currency)}
              icon={<Coins className="h-5 w-5" />}
              delta={-1.2}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <CallVolumeChart data={overview.callVolume} />
            <div className="card flex flex-col justify-between p-6">
              <div>
                <p className="text-sm font-semibold text-slate-900">Quick Actions</p>
                <p className="mt-2 text-xs text-slate-500">
                  Launch a new experience for your callers in seconds.
                </p>
              </div>
              <div className="mt-6 space-y-3">
                <ActionButton
                  label="Launch Agent Builder"
                  description="Choose a template and go live in under 5 minutes."
                  onClick={() =>
                    pushToast({
                      title: "Agent builder loading",
                      description: "Redirecting you to the creation wizard.",
                      variant: "info",
                    })
                  }
                />
                <ActionButton
                  label="View All Calls"
                  description="Inspect transcripts, sentiment, and revenue generated."
                  onClick={() =>
                    pushToast({
                      title: "Calls view",
                      description: "Filtering calls from the last 7 days.",
                      variant: "info",
                    })
                  }
                />
                <ActionButton
                  label="Send Team Update"
                  description="Share voice of customer insights with your team."
                  onClick={() =>
                    pushToast({
                      title: "Digest scheduled",
                      description: "Weekly team update will be sent Monday at 8 AM.",
                      variant: "success",
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Recent Calls</h2>
                <p className="text-sm text-slate-500">
                  Track high-impact conversations happening across your agents.
                </p>
              </div>
              <button type="button" className="btn-ghost">
                View all
              </button>
            </div>
            <div className="mt-5">
              <CallsTable calls={overview.recentCalls} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>
      <LoadingSkeleton className="h-72 rounded-3xl" />
      <LoadingSkeleton className="h-80 rounded-3xl" />
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  description: string;
  onClick: () => void;
}

function ActionButton({ label, description, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-[2px] hover:border-primary hover:shadow-lg"
    >
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <span className="mt-2 text-xs text-slate-500">{description}</span>
    </button>
  );
}
