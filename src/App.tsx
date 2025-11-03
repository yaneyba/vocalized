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

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<RootLayout />}>
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

