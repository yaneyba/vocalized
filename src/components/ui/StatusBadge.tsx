interface StatusBadgeProps {
  status: string;
}

const palette: Record<string, string> = {
  Live: "bg-emerald-50 text-emerald-600",
  Paused: "bg-amber-50 text-amber-600",
  Draft: "bg-slate-100 text-slate-500",
  Completed: "bg-emerald-50 text-emerald-600",
  Missed: "bg-rose-50 text-rose-500",
  "In Progress": "bg-primary/10 text-primary",
  Voicemail: "bg-indigo-50 text-indigo-600",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${palette[status] ?? "bg-slate-100 text-slate-600"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span className="ml-2">{status}</span>
    </span>
  );
}

