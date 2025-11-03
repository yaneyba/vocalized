import type { PropsWithChildren, ReactNode } from "react";

interface PageHeaderProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  helper?: ReactNode;
}

export function PageHeader({ title, subtitle, actions, helper, children }: PageHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
          {helper ? <div>{helper}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

