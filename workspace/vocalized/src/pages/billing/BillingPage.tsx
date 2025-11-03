import { useEffect, useState } from "react";
import { CreditCard, Pencil, ReceiptText, ShieldAlert } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BillingSummary } from "../../data/types";
import { useDataProvider } from "../../providers/DataProviderContext";
import { formatCurrency } from "../../lib/utils";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { LoadingSkeleton } from "../../components/ui/LoadingSkeleton";

export function BillingPage() {
  const dataProvider = useDataProvider();
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dataProvider.getBillingSummary().then((data) => {
      if (mounted) {
        setSummary(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [dataProvider]);

  if (isLoading || !summary) {
    return <LoadingSkeleton className="h-96 rounded-3xl" />;
  }

  const usagePercent = (summary.currentPeriod.usage / summary.currentPeriod.limit) * 100;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Billing</h1>
          <p className="mt-2 text-sm text-slate-500">
            Track usage, invoices, and spend safeguards for your workspace.
          </p>
        </div>
        <button type="button" className="btn-primary">
          <ReceiptText className="h-4 w-4" />
          Download statement
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="card space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                {summary.currentPeriod.label}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {summary.currentPeriod.dateRange}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Estimated total updates continuously throughout the billing period.
              </p>
            </div>
            <div className="rounded-2xl bg-primary/10 px-5 py-4 text-right">
              <p className="text-xs font-semibold uppercase text-primary/80">Estimated total</p>
              <p className="text-2xl font-semibold text-primary">
                {formatCurrency(summary.currentPeriod.estimatedTotal, summary.currentPeriod.currency)}
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Metric label="Usage so far" value={formatCurrency(summary.currentPeriod.usage)} />
            <Metric label="Monthly limit" value={formatCurrency(summary.currentPeriod.limit)} />
            <Metric
              label="Remaining budget"
              value={formatCurrency(
                summary.currentPeriod.limit - summary.currentPeriod.usage,
                summary.currentPeriod.currency,
              )}
            />
          </div>
          <ProgressBar value={usagePercent} label="Usage toward monthly limit" />
        </div>

        <div className="card space-y-4 border border-primary/10 bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            <span title="Guardrails">
              <ShieldAlert className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Spending guardrails</p>
              <p className="text-xs text-slate-500">
                Keep agents within budget with automated controls and approvals.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-600 shadow-sm">
            <ul className="space-y-2 text-xs text-slate-500">
              <li>• Auto-pause {summary.alerts.autoPause ? "enabled" : "disabled"}</li>
              <li>• Finance approval required above $5,000</li>
              <li>• Daily digest sent to ops and finance</li>
            </ul>
            <button type="button" className="btn-ghost mt-4 border border-slate-200">
              Configure guardrails
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="card overflow-hidden p-6">
          <h2 className="text-sm font-semibold text-slate-900">Usage breakdown</h2>
          <table className="mt-4 w-full divide-y divide-slate-100 text-sm text-slate-600">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="py-3 text-left">Resource</th>
                <th className="py-3 text-right">Quantity</th>
                <th className="py-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.usageBreakdown.map((item) => (
                <tr key={item.resource}>
                  <td className="py-3 font-semibold text-slate-900">{item.resource}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(item.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card space-y-4 p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Payment method</p>
              <p className="text-xs text-slate-500">
                Charged automatically at the end of each billing period.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm">
            <p className="font-semibold text-slate-900">
              {summary.paymentMethod.brand} ending in {summary.paymentMethod.last4}
            </p>
            <p className="mt-1 text-xs text-slate-500">Expires {summary.paymentMethod.exp}</p>
            <button type="button" className="btn-ghost mt-4 border border-slate-200">
              <Pencil className="h-4 w-4" />
              Update method
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="card h-80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Cost trend</h2>
              <p className="text-xs text-slate-500">Last 6 months of total spend</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Forecast ready
            </span>
          </div>
          <div className="mt-6 h-[200px]">
            <ResponsiveContainer>
              <AreaChart data={summary.costTrend}>
                <defs>
                  <linearGradient id="billingTrend" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.35} />
                    <stop offset="90%" stopColor="#1E40AF" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E0E7FF",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#1E40AF"
                  strokeWidth={3}
                  fill="url(#billingTrend)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-4 border border-primary/10 bg-primary/5 p-6">
          <p className="text-sm font-semibold text-slate-900">Usage alerts</p>
          <p className="text-sm text-slate-600">
            Trigger notifications when you hit {summary.alerts.threshold}% of your plan.
          </p>
          <div className="space-y-3 text-xs text-slate-500">
            <p>Primary recipients: finance@vocalized.ai</p>
            <p>Escalation: ops-lead@vocalized.ai</p>
          </div>
          <button type="button" className="btn-ghost border border-slate-200">
            Manage alerting
          </button>
        </div>
      </section>

      <section className="card overflow-hidden p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Billing history</h2>
            <p className="text-xs text-slate-500">Invoices for the last 6 months</p>
          </div>
        </div>
        <table className="mt-4 w-full divide-y divide-slate-100 text-sm text-slate-600">
          <thead className="text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="py-3 text-left">Invoice</th>
              <th className="py-3 text-left">Date</th>
              <th className="py-3 text-right">Amount</th>
              <th className="py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {summary.billingHistory.map((invoice) => (
              <tr key={invoice.invoiceNumber}>
                <td className="py-3 font-semibold text-slate-900">{invoice.invoiceNumber}</td>
                <td className="py-3">{invoice.date}</td>
                <td className="py-3 text-right">{formatCurrency(invoice.amount)}</td>
                <td className="py-3 text-right">
                  <span
                    className={`badge ${
                      invoice.status === "Paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : invoice.status === "Open"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-rose-50 text-rose-500"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-2xl bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-600">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-lg text-slate-900">{value}</p>
    </div>
  );
}
