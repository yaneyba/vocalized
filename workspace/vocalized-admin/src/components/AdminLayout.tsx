import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CloudCog,
  Cpu,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Logs,
  Plug,
  Receipt,
  Search,
  ShieldHalf,
  Users,
  Workflow,
} from "lucide-react";
import { cn } from "../lib/utils";
import { CommandPalette, type CommandPaletteItem } from "./CommandPalette";
import { useAuth } from "../providers/AuthContext";

const navigation = [
  { label: "Overview", to: "/overview", icon: LayoutDashboard },
  { label: "Workspaces", to: "/workspaces", icon: Building2 },
  { label: "Users", to: "/users", icon: Users },
  { label: "Providers", to: "/providers", icon: CloudCog },
  { label: "Integrations", to: "/integrations", icon: Plug },
  { label: "Billing", to: "/billing", icon: Receipt },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "System", to: "/system", icon: Cpu },
  { label: "Logs", to: "/logs", icon: Logs },
  { label: "Admin Activity", to: "/activity", icon: Activity },
];

const notifications = [
  {
    id: "notif-1",
    message: "Failover activated for Vapi",
    timestamp: "2m ago",
  },
  {
    id: "notif-2",
    message: "New workspace onboarded: Quantum CX",
    timestamp: "12m ago",
  },
  {
    id: "notif-3",
    message: "Billing webhook latency spike",
    timestamp: "22m ago",
  },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const paletteItems: CommandPaletteItem[] = useMemo(
    () =>
      navigation.map((item) => ({
        label: item.label,
        href: item.to,
        shortcut: item.label.slice(0, 1).toUpperCase(),
        description: `Go to ${item.label}`,
      })),
    [],
  );

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const mapped = segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const navMatch = navigation.find((item) => item.to === href);
      return {
        label: navMatch?.label ?? segment,
        href,
      };
    });
    return mapped.length ? mapped : [{ label: "Overview", href: "/overview" }];
  }, [location.pathname]);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  const impersonateWorkspace = () => {
    // Placeholder for real impersonation flow
    alert("Impersonation mode activated for 'Prime Voice Labs'");
  };

  return (
    <div className="grid min-h-screen grid-cols-[280px_1fr] bg-slate-950 text-slate-100">
      <aside className="flex h-screen flex-col border-r border-slate-900/70 bg-slate-950 px-6 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-slate-100">
            <ShieldHalf className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">Vocalized</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">Platform Admin</p>
          </div>
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
          >
            <Search className="h-4 w-4" />
            <span>Quick command</span>
            <span className="ml-auto rounded border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              ⌘K
            </span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 text-sm font-medium">
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
                      ? "bg-primary-light/80 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-3 pt-6">
          <button
            type="button"
            onClick={impersonateWorkspace}
            className="admin-btn-primary w-full justify-center border border-blue-500/40 bg-primary-accent/80"
          >
            <Workflow className="h-4 w-4" /> View as workspace
          </button>
          <button
            type="button"
            className="admin-btn-ghost w-full justify-center border border-transparent hover:border-slate-700"
            onClick={handleSignOut}
          >
            <KeyRound className="h-4 w-4" /> Switch account
          </button>
          <button
            className="admin-btn-ghost w-full justify-center border border-transparent hover:border-red-500/40"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex max-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-slate-900/70 bg-slate-950/80 px-10 py-6 backdrop-blur">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-2">
                  {index > 0 ? <span className="text-slate-700">/</span> : null}
                  <span>{crumb.label}</span>
                </span>
              ))}
            </div>
            <h1 className="mt-2 text-2xl font-semibold text-white">{breadcrumbs.at(-1)?.label}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={cn(
                "relative rounded-xl border border-slate-800 bg-slate-900/70 p-2 text-slate-400 transition",
                notificationOpen ? "text-white" : "hover:text-white",
              )}
              onClick={() => setNotificationOpen((open) => !open)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-2 -top-1 rounded-full bg-blue-500 px-1.5 text-[10px] font-semibold text-white">
                {notifications.length}
              </span>
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-slate-500">{user?.role ?? "Administrator"}</p>
            </div>
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-accent/80 text-white transition hover:bg-primary-accent"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <Users className="h-5 w-5" />
              </button>
              {userMenuOpen ? (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 text-sm shadow-xl backdrop-blur">
                  <div className="border-b border-slate-800 px-4 py-3 text-slate-300">
                    <p className="font-semibold text-white">{user?.name ?? "Admin user"}</p>
                    <p className="text-xs text-slate-500">{user?.email ?? "admin@vocalized.app"}</p>
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800/70"
                    onClick={handleSignOut}
                  >
                    <KeyRound className="h-4 w-4" />
                    Switch account
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-rose-300 transition hover:bg-rose-500/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        {notificationOpen ? (
          <div className="border-b border-slate-900/60 bg-slate-950/90 px-10 py-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">Latest alerts</p>
                <ul className="mt-3 grid gap-2 text-sm text-slate-200">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/60 px-4 py-3"
                    >
                      <span>{notification.message}</span>
                      <span className="text-xs text-slate-500">{notification.timestamp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        <main className="flex-1 overflow-y-auto bg-slate-950 px-10 py-10">
          <Outlet />
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={paletteItems} />
    </div>
  );
}
