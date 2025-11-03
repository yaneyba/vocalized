import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn, Mail } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/overview");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-900 bg-slate-900/60 p-10 shadow-card">
        <div className="flex items-center gap-3 text-blue-400">
          <Lock className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Vocalized Admin</h1>
        </div>
        <p className="mt-2 text-sm text-slate-400">Secure access to platform controls.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-300">
            Email address
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2">
              <Mail className="h-4 w-4 text-slate-600" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                className="h-10 flex-1 bg-transparent text-sm text-white outline-none"
                placeholder="admin@vocalized.app"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              className="mt-2 h-12 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 text-sm text-white outline-none focus:border-blue-500/60"
              placeholder="••••••••"
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            2FA Code
            <input
              value={twoFactor}
              onChange={(event) => setTwoFactor(event.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              className="mt-2 h-12 w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 text-center text-lg tracking-widest text-white outline-none focus:border-blue-500/60"
              placeholder="000000"
            />
          </label>

          <button type="submit" className="admin-btn-primary w-full justify-center">
            <LogIn className="h-4 w-4" />
            Enter console
          </button>
        </form>
      </div>
    </div>
  );
}
