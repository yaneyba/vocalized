import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { LoginPage } from "./pages/LoginPage";
import { PlatformOverviewPage } from "./pages/PlatformOverviewPage";
import { WorkspacesPage } from "./pages/WorkspacesPage";
import { UsersPage } from "./pages/UsersPage";
import { ProvidersPage } from "./pages/ProvidersPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { BillingPage } from "./pages/BillingPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SystemPage } from "./pages/SystemPage";
import { LogsPage } from "./pages/LogsPage";
import { AdminActivityPage } from "./pages/AdminActivityPage";
import { useAuth } from "./providers/AuthContext";
import { LandingPage } from "./pages/LandingPage";
import { useMemo } from "react";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route element={<ProtectedLayout />}>
        <Route path="overview" element={<PlatformOverviewPage />} />
        <Route path="workspaces" element={<WorkspacesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="providers" element={<ProvidersPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="system" element={<SystemPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="activity" element={<AdminActivityPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const content = useMemo(() => {
    if (loading) {
      return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">Checking access…</div>;
    }
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <AdminLayout />;
  }, [loading, user]);

  return content;
}

function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">Loading…</div>;
  }
  if (user) {
    return <Navigate to="/overview" replace />;
  }
  return <LoginPage />;
}
