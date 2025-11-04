export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="admin-card border border-slate-800/80">
        <h2 className="text-lg font-semibold text-white">Security policies</h2>
        <p className="mt-2 text-sm text-slate-400">
          Configure password requirements, session length, and SSO providers. This placeholder
          highlights where advanced controls will live as we expand the admin experience.
        </p>
      </div>
      <div className="admin-card border border-slate-800/80">
        <h2 className="text-lg font-semibold text-white">Workspace automation</h2>
        <p className="mt-2 text-sm text-slate-400">
          Automate agent provisioning and alerting. Future iterations will offer rule-based
          automations tied to audit events and usage thresholds.
        </p>
      </div>
    </div>
  );
}
