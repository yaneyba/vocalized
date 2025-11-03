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

const defaultRedirect = <Navigate to="/overview" replace />;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AdminLayout />}>
        <Route index element={defaultRedirect} />
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
      <Route path="*" element={defaultRedirect} />
    </Routes>
  );
}

export default App;
