import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Archive, Download, Filter, MoreHorizontal, PauseCircle, Play, Trash2 } from "lucide-react";
import {
  fetchWorkspaceDetail,
  fetchWorkspaces,
  type WorkspaceSummary,
} from "../data/adminData";
import { cn, formatCurrency, formatDateTime } from "../lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const statusFilters = ["All", "Active", "Trial", "Suspended"];
const tierFilters = ["All", "Starter", "Growth", "Scale", "Enterprise"];

export function WorkspacesPage() {
  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
    refetchInterval: 20000,
  });
  const [status, setStatus] = useState<string>("All");
  const [tier, setTier] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return workspaces.filter((workspace) => {
      const matchesStatus = status === "All" || workspace.status === status;
      const matchesTier = tier === "All" || workspace.tier === tier;
      const matchesSearch = search
        ? [workspace.name, workspace.ownerEmail, workspace.industry]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;
      return matchesStatus && matchesTier && matchesSearch;
    });
  }, [workspaces, status, tier, search]);

  const toggleSelection = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const allChecked = selected.length > 0 && selected.length === filtered.length;

  const toggleAll = () => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(filtered.map((workspace) => workspace.id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-72 rounded-xl border border-slate-900 bg-slate-900/60 px-4 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Search workspaces, owners, industry"
          />
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-slate-600" />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {statusFilters.map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={cn(
                "rounded-full border px-3 py-1 transition",
                status === item
                  ? "border-blue-500/60 bg-blue-500/10 text-blue-300"
                  : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {tierFilters.map((item) => (
            <button
              key={item}
              onClick={() => setTier(item)}
              className={cn(
                "rounded-full border px-3 py-1 transition",
                tier === item
                  ? "border-blue-500/60 bg-blue-500/10 text-blue-300"
                  : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="admin-btn-ghost border border-slate-800">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button className="admin-btn-primary">
            <Play className="h-4 w-4" /> Create workspace
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-slate-500">{selected.length} selected</span>
        <button className="admin-btn-ghost border border-amber-500/40 text-amber-200">
          <PauseCircle className="h-4 w-4" /> Suspend
        </button>
        <button className="admin-btn-ghost border border-blue-500/40 text-blue-200">
          <Archive className="h-4 w-4" /> Change tier
        </button>
        <button className="admin-btn-ghost border border-red-500/40 text-red-300">
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-900">
        <table className="min-w-full divide-y divide-slate-900 text-sm">
          <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="rounded border-slate-700" />
              </th>
              <th className="px-5 py-3 text-left">Workspace</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Tier</th>
              <th className="px-5 py-3 text-right">Calls</th>
              <th className="px-5 py-3 text-right">Revenue</th>
              <th className="px-5 py-3 text-right">Created</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-300">
            {filtered.map((workspace) => (
              <tr
                key={workspace.id}
                className="cursor-pointer hover:bg-slate-900/50"
                onClick={() => setActiveWorkspaceId(workspace.id)}
              >
                <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(workspace.id)}
                    onChange={() => toggleSelection(workspace.id)}
                    className="rounded border-slate-700"
                  />
                </td>
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-white">{workspace.name}</p>
                    <p className="text-xs text-slate-500">{workspace.ownerEmail}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusPill status={workspace.status} />
                </td>
                <td className="px-5 py-4 text-slate-200">{workspace.tier}</td>
                <td className="px-5 py-4 text-right">{workspace.totalCalls.toLocaleString()}</td>
                <td className="px-5 py-4 text-right text-white">{formatCurrency(workspace.revenue)}</td>
                <td className="px-5 py-4 text-right text-xs text-slate-500">
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                  <button className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WorkspaceDetailModal
        workspaceId={activeWorkspaceId}
        onClose={() => setActiveWorkspaceId(null)}
      />
    </div>
  );
}

function StatusPill({ status }: { status: WorkspaceSummary["status"] }) {
  const tone = {
    Active: "bg-emerald-500/20 text-emerald-200",
    Trial: "bg-blue-500/20 text-blue-200",
    Suspended: "bg-red-500/20 text-red-200",
  };
  return <span className={cn("admin-badge", tone[status])}>{status}</span>;
}

interface WorkspaceDetailModalProps {
  workspaceId: string | null;
  onClose: () => void;
}

function WorkspaceDetailModal({ workspaceId, onClose }: WorkspaceDetailModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["workspace-detail", workspaceId],
    queryFn: () => fetchWorkspaceDetail(workspaceId ?? ""),
    enabled: Boolean(workspaceId),
  });

  if (!workspaceId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-900 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Workspace profile</p>
            <h2 className="text-xl font-semibold text-white">{data?.name ?? "Loading"}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="admin-btn-ghost border border-blue-500/40 text-blue-200">Impersonate</button>
            <button className="admin-btn-ghost border border-slate-800" onClick={onClose}>
              Close
            </button>
          </div>
        </header>
        <div className="grid gap-6 bg-slate-950 px-6 py-6 lg:grid-cols-[1.4fr,1fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-white">Account</h3>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-400">
                <div>
                  <dt>Owner</dt>
                  <dd className="text-white">{data?.ownerEmail}</dd>
                </div>
                <div>
                  <dt>Industry</dt>
                  <dd>{data?.industry}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{data?.status}</dd>
                </div>
                <div>
                  <dt>Tier</dt>
                  <dd>{data?.tier}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{data ? new Date(data.createdAt).toLocaleDateString() : ""}</dd>
                </div>
                <div>
                  <dt>Last activity</dt>
                  <dd>{data ? formatDateTime(data.lastActivity) : ""}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-white">Usage (7d)</h3>
              <div className="mt-4 h-[160px]">
                <ResponsiveContainer>
                  <AreaChart data={data?.usage ?? []}>
                    <defs>
                      <linearGradient id="usage" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#475569" fontSize={11} />
                    <YAxis stroke="#475569" fontSize={11} />
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 12 }}
                    />
                    <Area type="monotone" dataKey="calls" stroke="#22d3ee" fill="url(#usage)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-white">Recent calls</h3>
              <ul className="mt-3 divide-y divide-slate-900 text-xs text-slate-400">
                {data?.recentCalls.map((call) => (
                  <li key={call.id} className="flex items-center justify-between py-3">
                    <span>
                      <span className="text-slate-200">{call.caller}</span> · {call.agent}
                    </span>
                    <span className="text-right">
                      <span className="text-slate-200">{call.status}</span>
                      <span className="ml-2">{call.duration}m</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4 text-sm text-slate-300">
              <h3 className="text-sm font-semibold text-white">Quick actions</h3>
              <div className="mt-3 space-y-2">
                <button className="admin-btn-ghost w-full justify-start border border-slate-800/60">
                  Send usage report
                </button>
                <button className="admin-btn-ghost w-full justify-start border border-slate-800/60">
                  Reset credentials
                </button>
                <button className="admin-btn-ghost w-full justify-start border border-red-500/40 text-red-300">
                  Suspend workspace
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4 text-xs text-slate-400">
              <h3 className="text-sm font-semibold text-white">System notes</h3>
              <ul className="mt-2 space-y-2">
                <li>• 99.1% success rate past 24h</li>
                <li>• Average handle time 6.3 minutes</li>
                <li>• Billing threshold set to 80%</li>
              </ul>
            </div>
          </div>
        </div>
        {isLoading ? <div className="px-6 pb-6 text-xs text-slate-500">Loading workspace detail…</div> : null}
      </div>
    </div>
  );
}
