import { ArrowRight, ShieldCheck, Sparkle, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Multi-workspace control",
    description: "Monitor every Voice AI deployment with unified analytics, incident response, and billing oversight.",
  },
  {
    title: "Provider orchestration",
    description: "Route calls across ElevenLabs, Deepgram, Vapi, and Retell with real-time health checks and failovers.",
  },
  {
    title: "Governance ready",
    description: "SOC 2 controls, granular audit trails, and impersonation tooling built for enterprise compliance teams.",
  },
];

const stats = [
  { label: "Global workspaces", value: "320+" },
  { label: "Monthly calls", value: "12M" },
  { label: "Uptime", value: "99.95%" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3 text-blue-400">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            <Sparkle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Vocalized Admin</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">Platform control</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#capabilities" className="transition hover:text-white">
            Capabilities
          </a>
          <a href="#security" className="transition hover:text-white">
            Security
          </a>
          <a href="#platform" className="transition hover:text-white">
            Platform
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl border border-slate-800/70 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 md:flex"
          >
            Launch console <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Secure admin experience
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Command the Vocalized platform like a mission control console.
            </h1>
            <p className="max-w-xl text-lg text-slate-400">
              Real-time visibility across workspaces, providers, billing, and compliance. Built for enterprise teams that need
              precision, guardrails, and blazing-fast response.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/30 transition hover:bg-blue-400"
              >
                Access dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#platform"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-5 py-2.5 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                Explore platform
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-800/70 bg-slate-900/60 px-5 py-4">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -translate-x-6 -translate-y-6 rounded-3xl bg-blue-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-2xl shadow-blue-500/10">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Live oversight</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-3 py-1 text-emerald-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> Active
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <HighlightCard
                  title="Provider orchestration"
                  description="ElevenLabs recovered from latency spike · rerouted 18% of traffic"
                  tag="Automation"
                  accent="bg-blue-500/15 text-blue-200"
                />
                <HighlightCard
                  title="Workspace financials"
                  description="ARR +12% QoQ · 98% payment success · 3 overdue invoices"
                  tag="Billing"
                  accent="bg-emerald-500/15 text-emerald-200"
                />
                <HighlightCard
                  title="Platform guardrails"
                  description="New feature flag rolled out to 42 pilot workspaces"
                  tag="Governance"
                  accent="bg-amber-500/15 text-amber-200"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="mt-20 grid gap-6 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 text-sm text-slate-400 backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-white">{highlight.title}</h3>
              <p className="mt-3 leading-relaxed">{highlight.description}</p>
            </article>
          ))}
        </section>

        <section id="platform" className="mt-20 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 text-sm text-slate-400">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="text-xl font-semibold text-white">Built for cross-functional operators</h2>
              <p>
                Vocalized Admin is engineered for RevenueOps, Security, and Platform teams that need a shared source of truth.
                Every control surface is permission-aware, auditable, and lightning fast.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              View admin console
              <Workflow className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer id="security" className="border-t border-slate-900/60 bg-slate-950/80 px-6 py-8 text-xs text-slate-500">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Vocalized Labs · Admin Platform</p>
          <div className="flex items-center gap-4">
            <span>Security</span>
            <span>Status</span>
            <span>Documentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HighlightCard({
  title,
  description,
  tag,
  accent,
}: {
  title: string;
  description: string;
  tag: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 text-sm text-slate-200">
      <p className="text-xs uppercase tracking-wide text-slate-500">{tag}</p>
      <h4 className="mt-2 text-base font-semibold text-white">{title}</h4>
      <p className="mt-2 text-xs text-slate-400">{description}</p>
      <span className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] ${accent}`}>
        <Sparkle className="h-3 w-3" /> Automated insight
      </span>
    </div>
  );
}

