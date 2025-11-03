import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminActions, adminActions } from "../data/adminData";
import { formatDateTime } from "../lib/utils";
import { Pagination } from "../components/Pagination";

export function AdminActivityPage() {
  const { data = adminActions } = useQuery({ queryKey: ["admin-actions"], queryFn: fetchAdminActions });
  const [adminFilter, setAdminFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const admins = useMemo(() => Array.from(new Set(data.map((entry) => entry.admin))), [data]);
  const actions = useMemo(() => Array.from(new Set(data.map((entry) => entry.action))), [data]);

  const filtered = useMemo(() => {
    return data.filter((entry) => {
      const matchesAdmin = adminFilter === "all" || entry.admin === adminFilter;
      const matchesAction = actionFilter === "all" || entry.action === actionFilter;
      return matchesAdmin && matchesAction;
    });
  }, [data, adminFilter, actionFilter]);

  useEffect(() => {
    setPage(1);
  }, [adminFilter, actionFilter, data]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <label className="flex items-center gap-2">
          Admin
          <select
            value={adminFilter}
            onChange={(event) => setAdminFilter(event.target.value)}
            className="rounded-xl border border-slate-900 bg-slate-900/60 px-3 py-1 text-xs text-slate-200"
          >
            <option value="all">All</option>
            {admins.map((admin) => (
              <option key={admin} value={admin}>
                {admin}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Action
          <select
            value={actionFilter}
            onChange={(event) => setActionFilter(event.target.value)}
            className="rounded-xl border border-slate-900 bg-slate-900/60 px-3 py-1 text-xs text-slate-200"
          >
            <option value="all">All</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="rounded-2xl border border-slate-900 bg-slate-900/60">
        <table className="min-w-full divide-y divide-slate-900 text-sm text-slate-300">
          <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">Admin</th>
              <th className="px-5 py-3 text-left">Action</th>
              <th className="px-5 py-3 text-left">Resource</th>
              <th className="px-5 py-3 text-left">Timestamp</th>
              <th className="px-5 py-3 text-left">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {paginated.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-900/50">
                <td className="px-5 py-3 text-white">{entry.admin}</td>
                <td className="px-5 py-3">{entry.action}</td>
                <td className="px-5 py-3 text-slate-200">{entry.resource}</td>
                <td className="px-5 py-3 text-xs text-slate-500">{formatDateTime(entry.timestamp)}</td>
                <td className="px-5 py-3 text-xs text-slate-500">{entry.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}
