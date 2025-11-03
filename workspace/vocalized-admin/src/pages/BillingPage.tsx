import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fetchInvoices, fetchWorkspaces, invoices } from "../data/adminData";
import { cn, formatCurrency } from "../lib/utils";

export function BillingPage() {
  const { data: invoiceList = invoices } = useQuery({ queryKey: ["invoices"], queryFn: fetchInvoices });
  const { data: workspaces = [] } = useQuery({ queryKey: ["workspaces"], queryFn: fetchWorkspaces });

  const revenue30 = useMemo(() => workspaces.reduce((total, workspace) => total + workspace.revenue, 0), [workspaces]);
  const mrr = revenue30 / 12;
  const arr = mrr * 12;
  const avgPerWorkspace = workspaces.length ? revenue30 / workspaces.length : 0;

  const revenueByTier = useMemo(() => {
    const totals = new Map<string, number>();
    workspaces.forEach((workspace) => {
      totals.set(workspace.tier, (totals.get(workspace.tier) ?? 0) + workspace.revenue);
    });
    return Array.from(totals.entries()).map(([tier, value]) => ({ name: tier, value }));
  }, [workspaces]);

  const invoiceCounts = useMemo(() => {
    return invoiceList.reduce(
      (acc, invoice) => {
        acc[invoice.status] += 1;
        return acc;
      },
      { paid: 0, pending: 0, overdue: 0 },
    );
  }, [invoiceList]);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-4">
        <BillingMetric title="Revenue (30d)" value={formatCurrency(revenue30)} helper="Gross platform revenue" />
        <BillingMetric title="MRR" value={formatCurrency(mrr)} helper="Monthly recurring" />
        <BillingMetric title="ARR" value={formatCurrency(arr)} helper="Projected annual" />
        <BillingMetric
          title="Avg / workspace"
          value={formatCurrency(avgPerWorkspace)}
          helper={`${workspaces.length} active workspaces`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,1fr]">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <header className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Revenue by tier</h3>
            <button className="admin-btn-ghost border border-slate-800">Download CSV</button>
          </header>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={revenueByTier}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="#0f172a"
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", color: "white" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
          <h3 className="text-sm font-semibold text-white">Invoice overview</h3>
          <dl className="mt-4 grid grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 text-center">
              <dt>Paid</dt>
              <dd className="mt-2 text-xl font-semibold text-emerald-300">{invoiceCounts.paid}</dd>
            </div>
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 text-center">
              <dt>Pending</dt>
              <dd className="mt-2 text-xl font-semibold text-amber-300">{invoiceCounts.pending}</dd>
            </div>
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 text-center">
              <dt>Overdue</dt>
              <dd className="mt-2 text-xl font-semibold text-red-300">{invoiceCounts.overdue}</dd>
            </div>
          </dl>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noreferrer"
            className="admin-btn-ghost mt-6 inline-flex w-full justify-center border border-slate-800"
          >
            Open Stripe dashboard
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
        <header className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Workspace billing</h3>
          <button className="admin-btn-ghost border border-slate-800">Export invoices</button>
        </header>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-900">
          <table className="min-w-full divide-y divide-slate-900 text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left">Workspace</th>
                <th className="px-5 py-3 text-right">Balance</th>
                <th className="px-5 py-3 text-right">Status</th>
                <th className="px-5 py-3 text-right">Last payment</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {invoiceList.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-900/50">
                  <td className="px-5 py-4 text-white">{invoice.workspace}</td>
                  <td className="px-5 py-4 text-right text-white">{formatCurrency(invoice.balance)}</td>
                  <td className="px-5 py-4 text-right">
                    <StatusPill status={invoice.status} />
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-slate-500">
                    {new Date(invoice.lastPayment).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-xl border border-slate-800/60 bg-slate-900/40 px-3 py-2 text-xs">
                        View invoice
                      </button>
                      <button className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        Void
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function BillingMetric({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "paid" | "pending" | "overdue" }) {
  const tone = {
    paid: "bg-emerald-500/20 text-emerald-200",
    pending: "bg-amber-500/20 text-amber-200",
    overdue: "bg-red-500/20 text-red-200",
  };
  return <span className={cn("admin-badge", tone[status])}>{status}</span>;
}
