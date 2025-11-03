import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Filter, RefreshCcw, Search } from "lucide-react";
import { fetchLogs, logEntries, type LogEntry } from "../data/adminData";
import { cn, formatDateTime } from "../lib/utils";
import { Pagination } from "../components/Pagination";

const levels: LogEntry["level"][] = ["error", "warn", "info"];

export function LogsPage() {
  const { data = logEntries, refetch } = useQuery({ queryKey: ["logs"], queryFn: fetchLogs, refetchInterval: 15000 });
  const [level, setLevel] = useState<LogEntry["level"] | "all">("all");
  const [search, setSearch] = useState("");
  const [workerFilter, setWorkerFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    const id = window.setInterval(() => {
      refetch();
    }, 60000);
    return () => window.clearInterval(id);
  }, [refetch]);

  const workers = useMemo(() => Array.from(new Set(data.map((entry) => entry.worker))), [data]);

  const filtered = useMemo(() => {
    return data.filter((entry) => {
      const matchesLevel = level === "all" || entry.level === level;
      const matchesWorker = workerFilter === "all" || entry.worker === workerFilter;
      const matchesSearch = search
        ? [entry.message, entry.details, entry.workspace]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;
      return matchesLevel && matchesWorker && matchesSearch;
    });
  }, [data, level, workerFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [level, workerFilter, search, data]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const errorGroups = useMemo(() => {
    const grouped = new Map<string, number>();
    filtered
      .filter((entry) => entry.level === "error")
      .forEach((entry) => grouped.set(entry.message, (grouped.get(entry.message) ?? 0) + 1));
    return Array.from(grouped.entries()).map(([message, count]) => ({ message, count }));
  }, [filtered]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs"
            className="w-72 rounded-xl border border-slate-900 bg-slate-900/60 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-600" />
        </div>
        <div className="flex gap-2 text-xs">
          <label className="flex items-center gap-2">
            Level
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as LogEntry["level"] | "all")}
              className="rounded-lg border border-slate-900 bg-slate-900/60 px-3 py-1 text-xs text-slate-200"
            >
              <option value="all">All</option>
              {levels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Worker
            <select
              value={workerFilter}
              onChange={(event) => setWorkerFilter(event.target.value)}
              className="rounded-lg border border-slate-900 bg-slate-900/60 px-3 py-1 text-xs text-slate-200"
            >
              <option value="all">All</option>
              {workers.map((worker) => (
                <option key={worker} value={worker}>
                  {worker}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="admin-btn-ghost border border-slate-800">
            <Download className="h-4 w-4" /> Export logs
          </button>
          <button className="admin-btn-ghost border border-slate-800" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-900">
          <table className="min-w-full divide-y divide-slate-900 text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left">Timestamp</th>
                <th className="px-5 py-3 text-left">Worker</th>
                <th className="px-5 py-3 text-left">Level</th>
                <th className="px-5 py-3 text-left">Message</th>
                <th className="px-5 py-3 text-left">Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
            {paginated.map((entry) => (
                <tr key={entry.id} className="align-top hover:bg-slate-900/50">
                  <td className="px-5 py-3 text-xs text-slate-500">{formatDateTime(entry.timestamp)}</td>
                  <td className="px-5 py-3 text-xs text-slate-400">{entry.worker}</td>
                  <td className="px-5 py-3">
                    <LevelBadge level={entry.level} />
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-200">{entry.message}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{entry.workspace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <h3 className="text-sm font-semibold text-white">Error grouping</h3>
          <ul className="mt-4 space-y-3 text-xs text-slate-400">
            {errorGroups.slice(0, 8).map((group) => (
              <li key={group.message} className="rounded-xl border border-slate-900 bg-slate-900/40 px-4 py-3">
                <p className="text-slate-200">{group.message}</p>
                <p className="mt-1 text-[11px] text-slate-500">{group.count} occurrences</p>
              </li>
            ))}
            {errorGroups.length === 0 ? <li className="text-xs text-emerald-300">No active error clusters</li> : null}
          </ul>
        </div>
      </div>

      <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
    </div>
  );
}

function LevelBadge({ level }: { level: LogEntry["level"] }) {
  const tone = {
    error: "bg-red-500/20 text-red-200",
    warn: "bg-amber-500/20 text-amber-200",
    info: "bg-blue-500/20 text-blue-200",
  };
  return <span className={cn("admin-badge", tone[level])}>{level}</span>;
}
