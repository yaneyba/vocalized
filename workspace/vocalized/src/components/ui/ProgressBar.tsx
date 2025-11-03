interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className="space-y-2">
      {label ? <p className="text-xs font-medium text-slate-500">{label}</p> : null}
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

