import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import { DashboardHome } from "./pages/dashboard/DashboardHome";
import { AgentsPage } from "./pages/agents/AgentsPage";
import { AgentWizardPage } from "./pages/agents/AgentWizardPage";
import { CallsPage } from "./pages/calls/CallsPage";
import { IntegrationsPage } from "./pages/integrations/IntegrationsPage";
import { AnalyticsPage } from "./pages/analytics/AnalyticsPage";
import { BillingPage } from "./pages/billing/BillingPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { AuthPage } from "./pages/auth/AuthPage";
import { LandingPage } from "./pages/LandingPage";
import { useAuth } from "./providers/AuthContext";
import { useMemo } from "react";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthRoute />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="agents">
          <Route index element={<AgentsPage />} />
          <Route path="new" element={<AgentWizardPage />} />
          <Route path=":agentId" element={<AgentWizardPage />} />
        </Route>
        <Route path="calls" element={<CallsPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="settings" element={<SettingsPage />} />
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
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
          Loading workspace…
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    return <RootLayout />;
  }, [loading, user]);

  return content;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading…
      </div>
    );
  }
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <AuthPage />;
}
