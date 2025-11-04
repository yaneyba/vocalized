import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  delta?: number;
  deltaLabel?: string;
}

export function StatCard({ label, value, icon, delta, deltaLabel }: StatCardProps) {
  const deltaColor =
    typeof delta === "number" && delta !== 0
      ? delta > 0
        ? "text-emerald-500"
        : "text-rose-500"
      : "text-slate-500";

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {typeof delta === "number" ? (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium">
          <span className={cn("rounded-full px-2 py-1", delta > 0 ? "bg-emerald-50" : "bg-rose-50")}>
            <span className={deltaColor}>{delta > 0 ? "+" : ""}
            {delta.toFixed(1)}%</span>
          </span>
          <span className="text-slate-500">{deltaLabel ?? "vs last period"}</span>
        </div>
      ) : null}
    </div>
  );
}

