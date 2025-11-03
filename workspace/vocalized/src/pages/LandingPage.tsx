import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkle, Waves } from "lucide-react";

const benefits = [
  {
    title: "Enterprise-ready voice agents",
    description:
      "Deploy AI voices that greet, qualify, and schedule in any timezone with brand-perfect scripts and memories.",
  },
  {
    title: "Realtime human handoff",
    description:
      "Blend agents with your team instantly. Trigger live escalations, CRM updates, and calendar syncs in one action.",
  },
  {
    title: "Analytics that convert",
    description:
      "Understand caller intent, sentiment, and conversion all in one beautiful dashboard that updates in realtime.",
  },
];

const stats = [
  { label: "Calls handled", value: "2.4M+", helper: "per month" },
  { label: "Avg. CSAT", value: "4.8/5", helper: "across customers" },
  { label: "Time saved", value: "73%", helper: "teams report" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7">
        <Link to="/" className="flex items-center gap-3 text-blue-400">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Vocalized</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">AI Voice Platform</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#capabilities" className="transition hover:text-white">
            Capabilities
          </a>
          <a href="#analytics" className="transition hover:text-white">
            Analytics
          </a>
          <a href="#customers" className="transition hover:text-white">
            Customers
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="rounded-xl border border-slate-800/70 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="hidden items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 md:flex"
          >
            Launch console <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs text-blue-200">
              <Sparkle className="h-3.5 w-3.5" /> Trusted by leading CX teams
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Delight every caller with AI that sounds remarkably human.
            </h1>
            <p className="max-w-xl text-lg text-slate-400">
              Vocalized automates your inbound and outbound conversations—from discovery calls to scheduling to order capture—without
              sacrificing your brand voice or playbooks.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/30 transition hover:bg-blue-400"
              >
                Start with a live agent demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#capabilities"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-5 py-2.5 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                Explore the platform
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-800/70 bg-slate-900/60 px-5 py-4">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{stat.helper}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -translate-x-6 -translate-y-6 rounded-3xl bg-blue-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-2xl shadow-blue-500/10">
              <h2 className="text-xs uppercase tracking-wide text-slate-500">Inside the console</h2>
              <div className="mt-6 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 text-sm text-slate-200">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{benefit.title}</p>
                    <p className="mt-2 text-xs text-slate-400">{benefit.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[11px] text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Always-on automation
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="mt-20 grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 text-sm text-slate-400">
              <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
              <p className="mt-3 leading-relaxed">{benefit.description}</p>
            </article>
          ))}
        </section>

        <section id="analytics" className="mt-20 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 text-sm text-slate-400">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="text-xl font-semibold text-white">Analytics that act like a copilot</h2>
              <p>
                Everything you need to iterate faster: sentiment insights, success rate trends, and conversion intelligence matched to
                each workflow. Share with your team in one click.
              </p>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              See live analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section id="customers" className="mt-20 grid gap-4 text-sm text-slate-400 md:grid-cols-[1.2fr,1fr]">
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold text-white">Why teams switch to Vocalized</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                <span>Bring AI agents and live reps into one workflow with full context.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                <span>Ship new use cases in minutes using templates, voice tuning, and no-code flows.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                <span>Trust-grade security with audit trails, SOC 2 readiness, and role controls.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-white">Get started today</h3>
            <p className="mt-2 text-slate-400">Spin up your AI voice agent in less than 10 minutes.</p>
            <div className="mt-6 space-y-3 text-xs text-slate-400">
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 px-4 py-3">
                <p className="text-slate-200">1. Choose a template for your industry</p>
              </div>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 px-4 py-3">
                <p className="text-slate-200">2. Tune the voice and fallback prompts</p>
              </div>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 px-4 py-3">
                <p className="text-slate-200">3. Connect your number and go live</p>
              </div>
            </div>
            <Link
              to="/auth"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Create an agent now
              <Sparkle className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900/60 bg-slate-950/80 px-6 py-8 text-xs text-slate-500">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Vocalized Labs · Voice AI Platform</p>
          <div className="flex items-center gap-4">
            <span>Security</span>
            <span>Status</span>
            <span>Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
