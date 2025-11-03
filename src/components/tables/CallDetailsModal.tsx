import { CircleEllipsis, Download, Headphones, X } from "lucide-react";
import type { CallDetail } from "../../data/types";
import { formatCurrency, formatDuration, formatTimestamp } from "../../lib/utils";
import { StatusBadge } from "../ui/StatusBadge";

interface CallDetailsModalProps {
  detail: CallDetail | null;
  onClose: () => void;
}

export function CallDetailsModal({ detail, onClose }: CallDetailsModalProps) {
  if (!detail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Call Details</h3>
            <p className="text-sm text-slate-500">{formatTimestamp(detail.timestamp)}</p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[2fr,3fr]">
          <div className="space-y-6 rounded-2xl bg-slate-50 p-5">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Caller
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{detail.caller}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Agent
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{detail.agentName}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Duration
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatDuration(detail.durationMinutes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Cost
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(detail.cost, "USD")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </span>
                <StatusBadge status={detail.status} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Sentiment
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{detail.sentiment}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Intent
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">{detail.intent}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tags
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {detail.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20"
                    >
                      <CircleEllipsis className="mr-2 h-3.5 w-3.5 opacity-60" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn-primary flex-1"
              >
                <Headphones className="h-4 w-4" />
                Listen
              </button>
              <button
                type="button"
                className="btn-ghost flex-1 border border-slate-200"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 p-5">
            <h4 className="text-sm font-semibold text-slate-900">Transcript</h4>
            <div className="mt-4 space-y-4 overflow-y-auto pr-2 text-sm text-slate-600 max-h-72">
              {detail.transcript.map((entry, index) => (
                <div key={`${entry.speaker}-${index}`} className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                    <span>{entry.speaker}</span>
                    <span>{entry.time}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

