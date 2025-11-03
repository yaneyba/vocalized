import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { AuditPage } from "./pages/AuditPage";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

