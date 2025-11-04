import { useEffect, useMemo, useState } from "react";
import { PauseCircle, PlayCircle, PlusCircle, Settings2 } from "lucide-react";
import type { Agent } from "../../data/types";
import { useDataProvider } from "../../providers/DataProviderContext";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";
import { useToast } from "../../providers/ToastProvider";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

export function AgentsPage() {
  const dataProvider = useDataProvider();
  const { pushToast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [intendedAction, setIntendedAction] = useState<"pause" | "activate">("pause");

  useEffect(() => {
    let mounted = true;
    dataProvider.getAgents().then((data) => {
      if (mounted) {
        setAgents(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [dataProvider]);

  const hasAgents = agents.length > 0;
  const counts = useMemo(() => {
    return agents.reduce(
      (acc, agent) => {
        acc[agent.status] = (acc[agent.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [agents]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Voice Agents</h1>
          <p className="mt-2 text-sm text-slate-500">
            Launch, monitor, and iterate on your AI workforce.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn-ghost border border-slate-200">
            <Settings2 className="h-4 w-4" />
            Agent templates
          </button>
          <button type="button" className="btn-primary">
            <PlusCircle className="h-4 w-4" />
            Create New Agent
          </button>
        </div>
      </div>

      <div className="grid gap-3 text-xs font-semibold text-slate-500 sm:grid-cols-3">
        <StatPill label="Live" value={counts.Live ?? 0} tone="bg-emerald-50 text-emerald-600" />
        <StatPill label="Paused" value={counts.Paused ?? 0} tone="bg-amber-50 text-amber-600" />
        <StatPill label="Draft" value={counts.Draft ?? 0} tone="bg-slate-100 text-slate-500" />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-2xl bg-slate-200/70" />
          ))}
        </div>
      ) : !hasAgents ? (
        <EmptyState
          title="Create your first agent"
          description="Build an AI agent tailored to your brand voice and workflows."
          action={
            <button type="button" className="btn-primary">
              <PlusCircle className="h-4 w-4" />
              Create Agent
            </button>
          }
          illustration={<PlayCircle className="h-8 w-8" />}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="card flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${agent.avatarColor} text-white`}>
                    {agent.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">{agent.name}</p>
                    <p className="text-xs text-slate-500">{agent.phoneNumber}</p>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-primary/5 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total calls
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {agent.totalCalls.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Success rate
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {agent.successRate ? `${agent.successRate}%` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="btn-primary flex-1"
                  onClick={() =>
                    pushToast({
                      title: "Agent editor",
                      description: `Opening configuration for ${agent.name}.`,
                      variant: "info",
                    })
                  }
                >
                  <Settings2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-ghost flex-1 border border-slate-200"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setIntendedAction(agent.status === "Live" ? "pause" : "activate");
                  }}
                >
                  {agent.status === "Live" ? (
                    <>
                      <PauseCircle className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      Go live
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        open={Boolean(selectedAgent)}
        title={
          intendedAction === "pause"
            ? `Pause ${selectedAgent?.name ?? "agent"}`
            : `Activate ${selectedAgent?.name ?? "agent"}`
        }
        description={
          intendedAction === "pause"
            ? "Pausing will immediately stop routing live calls to this agent. You can reactivate anytime."
            : "Activating sets this agent live and it will begin answering routed calls within 60 seconds."
        }
        confirmLabel={intendedAction === "pause" ? "Pause agent" : "Activate agent"}
        cancelLabel="Cancel"
        onClose={() => setSelectedAgent(null)}
        onConfirm={() => {
          if (!selectedAgent) return;
          pushToast({
            title: intendedAction === "pause" ? "Agent paused" : "Agent activated",
            description: `${selectedAgent.name} is now ${intendedAction === "pause" ? "paused" : "live"}.`,
            variant: "success",
          });
          setSelectedAgent(null);
        }}
      />
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: number;
  tone: string;
}

function StatPill({ label, value, tone }: StatPillProps) {
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 ${tone}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
