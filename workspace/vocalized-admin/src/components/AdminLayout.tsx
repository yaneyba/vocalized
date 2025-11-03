import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  BadgeCheck,
  Gauge,
  LogOut,
  Settings,
  ShieldHalf,
  Users,
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { label: "Dashboard", to: "/", icon: Gauge },
  { label: "Audit", to: "/audit", icon: Activity },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="flex h-screen flex-col gap-6 border-r border-slate-800/60 bg-slate-950 px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-slate-100">
            <ShieldHalf className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">Vocalized</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">Admin Console</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 text-sm font-medium">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 transition",
                    isActive
                      ? "bg-primary-light text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100",
                  )
                }
                end={item.to === "/"}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Access Controls
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Manage seats, enforce policies, and monitor high-risk actions in real time.
          </p>
          <button className="admin-btn-primary mt-4 w-full justify-center">
            <BadgeCheck className="h-4 w-4" />
            Manage roles
          </button>
        </div>

        <button className="admin-btn-ghost mt-auto w-full justify-center border border-transparent hover:border-slate-700">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <div className="flex max-h-screen flex-col">
        <header className="border-b border-slate-800/70 bg-slate-950/70 px-8 py-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">Workspace</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Vocalized HQ — Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">Morgan Carter</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-accent text-white">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-950 px-8 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
