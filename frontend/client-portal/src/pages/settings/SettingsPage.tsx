import { useEffect, useMemo, useState } from "react";
import { Mail, Plus, ShieldCheck, Users } from "lucide-react";
import type { NotificationSetting, SettingsSnapshot, TeamMember } from "../../data/types";
import { useDataProvider } from "../../providers/DataProviderContext";
import { LoadingSkeleton } from "../../components/ui/LoadingSkeleton";

const tabs = ["General", "Team", "Notifications", "Billing Settings"] as const;
type Tab = (typeof tabs)[number];

export function SettingsPage() {
  const dataProvider = useDataProvider();
  const [snapshot, setSnapshot] = useState<SettingsSnapshot | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("General");

  useEffect(() => {
    let mounted = true;
    dataProvider.getSettingsSnapshot().then((data) => {
      if (mounted) {
        setSnapshot(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, [dataProvider]);

  if (!snapshot) {
    return <LoadingSkeleton className="h-96 rounded-3xl" />;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Workspace settings</h1>
          <p className="mt-2 text-sm text-slate-500">
            Control your workspace identity, team, and compliance preferences.
          </p>
        </div>
        <button type="button" className="btn-primary">
          Save changes
        </button>
      </header>

      <nav className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-500">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === tab ? "bg-primary/10 text-primary" : "hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "General" ? <GeneralTab data={snapshot} /> : null}
      {activeTab === "Team" ? <TeamTab members={snapshot.team} /> : null}
      {activeTab === "Notifications" ? (
        <NotificationsTab notifications={snapshot.notifications} />
      ) : null}
      {activeTab === "Billing Settings" ? <BillingTab /> : null}
    </div>
  );
}

interface GeneralTabProps {
  data: SettingsSnapshot;
}

function GeneralTab({ data }: GeneralTabProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="card space-y-6 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Workspace identity</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Workspace name" value={data.general.workspaceName} />
          <Field label="Industry" value={data.general.industry} />
          <Field label="Timezone" value={data.general.timezone} />
          <Field label="Primary voice" value="Maya (ElevenLabs)" />
        </div>
        <button type="button" className="btn-ghost border border-slate-200">
          Update branding
        </button>
      </div>

      <div className="card space-y-4 border border-primary/10 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Compliance lock</p>
            <p className="text-xs text-slate-500">
              Enable two-person approval for changes to regulated flows.
            </p>
          </div>
        </div>
        <button type="button" className="btn-primary">
          Enable guardrails
        </button>
      </div>
    </section>
  );
}

interface TeamTabProps {
  members: TeamMember[];
}

function TeamTab({ members }: TeamTabProps) {
  const grouped = useMemo(() => {
    return members.reduce(
      (acc, member) => {
        acc[member.role] = acc[member.role] ? [...acc[member.role], member] : [member];
        return acc;
      },
      {} as Record<string, TeamMember[]>,
    );
  }, [members]);

  return (
    <section className="space-y-6">
      <div className="card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Team members</h2>
            <p className="text-xs text-slate-500">
              Manage access levels across your revenue and operations teams.
            </p>
          </div>
          <button type="button" className="btn-primary">
            <Plus className="h-4 w-4" />
            Invite teammate
          </button>
        </div>
        <div className="space-y-4">
          {Object.entries(grouped).map(([role, roleMembers]) => (
            <div key={role} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {role}
              </p>
              <div className="mt-3 space-y-3">
                {roleMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ${member.avatarColor}`}
                      >
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"
                    >
                      {role}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface NotificationsTabProps {
  notifications: NotificationSetting[];
}

function NotificationsTab({ notifications }: NotificationsTabProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="card space-y-4 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Email notifications</h2>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <label
              key={notification.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{notification.label}</p>
                <p className="text-xs text-slate-500">{notification.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={notification.enabled}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-primary"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="card space-y-4 border border-primary/10 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Digest emails</p>
            <p className="text-xs text-slate-500">
              Weekly summaries of agent performance sent Mondays at 8 AM.
            </p>
          </div>
        </div>
        <button type="button" className="btn-primary">
          Customize cadence
        </button>
      </div>
    </section>
  );
}

function BillingTab() {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="card space-y-5 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Usage guardrails</h2>
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-900">Usage limit</p>
            <p className="mt-2 text-xs text-slate-500">
              Pause agent activity automatically when you hit this threshold.
            </p>
            <input type="range" defaultValue={85} className="mt-4 w-full" />
          </div>
          <div className="rounded-2xl bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-900">Payment escalation</p>
            <p className="mt-2 text-xs text-slate-500">
              Require approval from finance when invoices exceed $5,000.
            </p>
            <button type="button" className="btn-ghost mt-4 border border-slate-200">
              Configure escalation
            </button>
          </div>
        </div>
      </div>

      <div className="card space-y-4 bg-primary text-white p-6">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-white/70" />
          <div>
            <p className="text-sm font-semibold">Workspace roles</p>
            <p className="text-xs text-white/70">
              Grant finance, RevOps, and legal the right controls.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn w-full border border-white/60 bg-white/10 text-white hover:bg-white/20"
        >
          View permission matrix
        </button>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <input type="text" defaultValue={value} className="input mt-2" />
    </label>
  );
}

