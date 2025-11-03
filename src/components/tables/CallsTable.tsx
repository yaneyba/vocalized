import { PlayCircle } from "lucide-react";
import type { CallRecord } from "../../data/types";
import { formatDuration, formatTimestamp } from "../../lib/utils";
import { StatusBadge } from "../ui/StatusBadge";

interface CallsTableProps {
  calls: CallRecord[];
  onRowClick?: (call: CallRecord) => void;
}

export function CallsTable({ calls, onRowClick }: CallsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50/80">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-6 py-4">Caller</th>
            <th className="px-6 py-4">Agent</th>
            <th className="px-6 py-4">Direction</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Timestamp</th>
            <th className="px-6 py-4 text-right">Recording</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {calls.map((call) => (
            <tr
              key={call.id}
              onClick={() => onRowClick?.(call)}
              className={`cursor-pointer transition hover:bg-primary/5 ${onRowClick ? "group" : ""}`}
            >
              <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">{call.caller}</td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-600">{call.agentName}</td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${call.direction === "Inbound" ? "bg-emerald-400" : "bg-primary"}`}
                  />
                  {call.direction}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                {formatDuration(call.durationMinutes)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={call.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                {formatTimestamp(call.timestamp)}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                >
                  <PlayCircle className="h-4 w-4" />
                  Play
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

