import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  CreditCard,
  Gauge,
  Headset,
  Layers,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../providers/AuthContext";

const navigation = [
  { label: "Dashboard", path: "/", icon: Gauge },
  { label: "Agents", path: "/agents", icon: Bot },
  { label: "Calls", path: "/calls", icon: Headset },
  { label: "Integrations", path: "/integrations", icon: Layers },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Billing", path: "/billing", icon: CreditCard },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function RootLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [workspace, setWorkspace] = useState("Vocalized Labs");

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 transform bg-white px-5 pb-6 pt-8 shadow-xl transition duration-300 sm:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:-translate-x-0",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Vocalized</p>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                AI Voice Platform
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:hidden"
          >
            <PlusCircle className="h-5 w-5 rotate-45" />
          </button>
        </div>

        <div className="mt-8 space-y-6">
          <WorkspaceSwitcher value={workspace} onChange={setWorkspace} />

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isPending }) =>
                    cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
                      isPending && "animate-pulse",
                    )
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-primary")} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto hidden space-y-4 rounded-2xl bg-primary/5 px-4 py-5 text-sm text-slate-600 md:block">
          <p className="font-semibold text-slate-800">Scale with Vocalized</p>
          <p className="text-sm leading-6">
            Unlock premium analytics, sentiment intelligence, and advanced compliance tooling.
          </p>
          <NavLink to="/billing" className="btn-primary">
            Upgrade Plan
          </NavLink>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex w-full flex-col sm:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((open) => !open)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden text-sm text-slate-500 sm:block">
                <span className="font-semibold text-slate-900">Welcome back, Amelia</span>
                <span className="ml-2">Here's what's happening today.</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary"
              >
                {workspace}
              </button>
              <button
                type="button"
                className="hidden rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20 md:flex"
              >
                New Agent
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold"
              >
                AW
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-12 pt-8">
          <Outlet />
        </main>
        <footer className="mx-auto w-full max-w-6xl px-6 pb-8 text-xs text-slate-400">
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <p>© {new Date().getFullYear()} Vocalized Labs. All rights reserved.</p>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface WorkspaceSwitcherProps {
  value: string;
  onChange: (workspace: string) => void;
}

function WorkspaceSwitcher({ value, onChange }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const workspaces = useMemo(
    () => ["Vocalized Labs", "Global Ops", "Growth Experiments", "Voice R&D", "CX Pilot Team"],
    [],
  );

  const filtered = useMemo(
    () =>
      workspaces.filter((workspace) =>
        workspace.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [workspaces, query],
  );

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
        onClick={() => {
          setOpen((current) => !current);
          setQuery("");
        }}
        title="Switch workspace"
      >
        {value}
        <Users className="h-4 w-4 opacity-60" />
      </button>
      {open ? (
        <div className="relative">
          <div className="absolute left-0 right-0 z-50 mt-3 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search workspaces…"
              className="input"
              autoFocus
            />
            <div className="max-h-48 space-y-1 overflow-y-auto text-sm">
              {filtered.map((workspaceOption) => (
                <button
                  key={workspaceOption}
                  type="button"
                  onClick={() => {
                    onChange(workspaceOption);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                    workspaceOption === value
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <span>{workspaceOption}</span>
                  {workspaceOption === value ? (
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Active
                    </span>
                  ) : null}
                </button>
              ))}
              {filtered.length === 0 ? (
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  No workspace matches “{query}”
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="btn-ghost w-full border border-dashed border-slate-200"
            >
              + Create new workspace
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

