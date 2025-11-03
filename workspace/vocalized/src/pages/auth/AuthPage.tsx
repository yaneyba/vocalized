import { useState } from "react";
import { Bot, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useToast } from "../../providers/ToastProvider";

type AuthMode = "login" | "signup";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const { pushToast } = useToast();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 lg:flex-row">
      <div className="flex w-full flex-1 flex-col justify-between border-b border-slate-100 px-8 py-10 lg:border-r">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-slate-900">Vocalized</span>
          </div>
          <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            Premium
          </span>
        </div>

        <div className="space-y-10">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Design smarter voice experiences
            </h1>
            <p className="mt-4 text-base text-slate-500">
              Vocalized brings AI-native conversations, real-time analytics, and seamless
              integrations to your customer operations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard
              icon={<Bot className="h-5 w-5 text-primary" />}
              title="Adaptive agents"
              description="Deploy custom voice agents that book appointments, qualify leads, and close revenue."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-primary" />}
              title="Enterprise-grade security"
              description="SOC 2 compliant infrastructure with granular controls for multi-team workspaces."
            />
          </div>
        </div>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Vocalized Labs Inc. All rights reserved.
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-between rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-500">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "login" ? "bg-white text-slate-900 shadow" : ""}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full px-4 py-2 transition ${mode === "signup" ? "bg-white text-slate-900 shadow" : ""}`}
            >
              Create account
            </button>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              pushToast({
                title: mode === "login" ? "Welcome back" : "Account created",
                description:
                  mode === "login"
                    ? "You are now signed in to Vocalized."
                    : "Start building your first voice agent.",
                variant: "success",
              });
            }}
          >
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input type="email" required className="input mt-2" placeholder="you@company.com" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input type="password" required className="input mt-2" placeholder="••••••••" />
            </label>

            {mode === "signup" ? (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Company</span>
                <input type="text" className="input mt-2" placeholder="Vocalized Labs" />
              </label>
            ) : null}

            <div className="flex items-center justify-between text-sm text-slate-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-primary" />
                <span>Stay signed in</span>
              </label>
              <button type="button" className="font-semibold text-primary">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn-primary w-full">
              {mode === "login" ? "Sign in" : "Create workspace"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            OR CONTINUE WITH
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className="btn w-full border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

