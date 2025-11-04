import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Filter, Lock, Trash2 } from "lucide-react";
import { fetchUsers, getUserDetail, type UserSummary } from "../data/adminData";
import { cn, formatDateTime } from "../lib/utils";
import { Pagination } from "../components/Pagination";

const statusFilters = ["All", "Active", "Invited", "Suspended"];

export function UsersPage() {
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: fetchUsers, refetchInterval: 15000 });
  const [status, setStatus] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesStatus = status === "All" || user.status === status;
      const matchesSearch = search
        ? [user.email, user.name].join(" ").toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [users, status, search]);

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users"
            className="w-72 rounded-xl border border-slate-900 bg-slate-900/60 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-slate-600" />
        </div>
        <div className="flex gap-2 text-xs">
          {statusFilters.map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={cn(
                "rounded-full border px-3 py-1",
                status === item
                  ? "border-blue-500/60 bg-blue-500/10 text-blue-300"
                  : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-900">
        <table className="min-w-full divide-y divide-slate-900 text-sm text-slate-300">
          <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">User</th>
              <th className="px-5 py-3 text-left">Workspaces</th>
              <th className="px-5 py-3 text-left">Last login</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {currentPageItems.map((user) => (
              <tr key={user.id} className="hover:bg-slate-900/50">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </td>
                <td className="px-5 py-4">{user.workspaceCount}</td>
                <td className="px-5 py-4 text-xs text-slate-500">{formatDateTime(user.lastLogin)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      onClick={() => setActiveUserId(user.id)}
                    >
                      <Eye className="mr-1 inline h-3.5 w-3.5" /> View
                    </button>
                    <button className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-amber-300 hover:border-amber-500/40">
                      <Lock className="mr-1 inline h-3.5 w-3.5" /> Deactivate
                    </button>
                    <button className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                      <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />

      <UserDetailModal id={activeUserId} onClose={() => setActiveUserId(null)} />
    </div>
  );
}

function StatusBadge({ status }: { status: UserSummary["status"] }) {
  const styles = {
    Active: "bg-emerald-500/20 text-emerald-200",
    Invited: "bg-blue-500/20 text-blue-200",
    Suspended: "bg-red-500/20 text-red-200",
  };
  return <span className={cn("admin-badge", styles[status])}>{status}</span>;
}

interface UserDetailModalProps {
  id: string | null;
  onClose: () => void;
}

function UserDetailModal({ id, onClose }: UserDetailModalProps) {
  const detail = id ? getUserDetail(id) : null;
  if (!id || !detail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-900 bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-900 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">User detail</p>
            <h2 className="text-xl font-semibold text-white">{detail.name}</h2>
            <p className="text-xs text-slate-500">{detail.email}</p>
          </div>
          <button className="admin-btn-ghost border border-slate-800" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="grid gap-6 bg-slate-950 px-6 py-6 lg:grid-cols-[1.3fr,1fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-white">Workspace membership</h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-400">
                {detail.workspaces.map((workspace) => (
                  <li key={workspace.workspace} className="flex items-center justify-between">
                    <span className="text-slate-200">{workspace.workspace}</span>
                    <span>{workspace.role}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-white">Activity history</h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-400">
                {detail.activity.map((entry) => (
                  <li key={entry.id} className="rounded-xl border border-slate-900 bg-slate-900/50 px-3 py-2">
                    <p className="text-slate-200">{entry.description}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{formatDateTime(entry.timestamp)}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <section className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4 text-xs text-slate-400">
            <h3 className="text-sm font-semibold text-white">Login history</h3>
            <ul className="mt-3 space-y-2">
              {detail.loginHistory.map((login) => (
                <li key={login.timestamp} className="rounded-xl border border-slate-900 bg-slate-900/40 px-3 py-2">
                  <p className="text-slate-200">{formatDateTime(login.timestamp)}</p>
                  <p>{login.ip} · {login.device}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2">
              <button className="admin-btn-ghost w-full justify-start border border-slate-800/60">
                Force password reset
              </button>
              <button className="admin-btn-ghost w-full justify-start border border-slate-800/60">
                Download audit trail
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
