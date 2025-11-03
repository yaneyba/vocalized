import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Phone,
  Settings2,
  Sparkles,
  Waves,
} from "lucide-react";
import type { AgentTemplate, VoiceProfile } from "../../data/types";
import { useDataProvider } from "../../providers/DataProviderContext";
import { useToast } from "../../providers/ToastProvider";

const steps = ["Choose Template", "Configure Voice", "Connect & Launch"] as const;
type Step = (typeof steps)[number];

export function AgentWizardPage() {
  const dataProvider = useDataProvider();
  const { pushToast } = useToast();
  const [activeStep, setActiveStep] = useState<Step>("Choose Template");
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [greeting, setGreeting] = useState(
    "Hi there, thanks for calling! How can I help you today?",
  );
  const [connections, setConnections] = useState<string[]>([]);

  useEffect(() => {
    dataProvider.getAgentTemplates().then(setTemplates);
    dataProvider.getVoiceProfiles().then(setVoices);
  }, [dataProvider]);

  const stepIndex = steps.indexOf(activeStep);

  const goToStep = (direction: "prev" | "next") => {
    const nextIndex = direction === "next" ? stepIndex + 1 : stepIndex - 1;
    if (nextIndex >= 0 && nextIndex < steps.length) {
      setActiveStep(steps[nextIndex]);
    }
  };

  const toggleConnection = (value: string) => {
    setConnections((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const handleActivate = () => {
    pushToast({
      title: "Agent activated",
      description: "Your agent is now live. Calls will be routed in under 60 seconds.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to agents
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Agent Builder</h1>
            <p className="mt-2 text-sm text-slate-500">
              Craft a high-converting voice agent with guided configuration.
            </p>
          </div>
          <button type="button" className="btn-ghost border border-slate-200">
            <Settings2 className="h-4 w-4" />
            View documentation
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <Stepper activeStep={activeStep} />

          {activeStep === "Choose Template" ? (
            <div className="grid gap-4 md:grid-cols-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`rounded-2xl border p-5 text-left transition hover:-translate-y-[2px] hover:border-primary hover:shadow-lg ${
                    selectedTemplate === template.id ? "border-primary shadow-lg" : "border-slate-200"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{template.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{template.description}</p>
                  <span className="mt-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {template.category}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedTemplate("custom")}
                className={`rounded-2xl border border-dashed p-5 text-left transition hover:border-primary hover:text-primary ${
                  selectedTemplate === "custom" ? "border-primary text-primary shadow-lg" : "border-slate-200 text-slate-500"
                }`}
              >
                <h3 className="text-base font-semibold">Start from scratch</h3>
                <p className="mt-2 text-sm">
                  Define every prompt, fallback, and action with full control.
                </p>
              </button>
            </div>
          ) : null}

          {activeStep === "Configure Voice" ? (
            <div className="space-y-6">
              <div className="card space-y-4 p-6">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Voice provider</span>
                  <select
                    className="input mt-2"
                    value={selectedVoice ?? ""}
                    onChange={(event) => setSelectedVoice(event.target.value)}
                  >
                    <option value="" disabled>
                      Choose a provider
                    </option>
                    {Array.from(new Set(voices.map((voice) => voice.provider))).map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">Greeting</span>
                  <textarea
                    value={greeting}
                    onChange={(event) => setGreeting(event.target.value)}
                    className="input mt-2 min-h-[120px] resize-none"
                  />
                </label>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Preview voices</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {voices.map((voice) => (
                      <button
                        key={voice.id}
                        type="button"
                        onClick={() => setSelectedVoice(voice.id)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                          selectedVoice === voice.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-slate-200 text-slate-600 hover:border-primary"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold">{voice.name}</p>
                          <p className="text-xs text-slate-500">{voice.provider}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                          <Headphones className="h-4 w-4" />
                          Preview
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeStep === "Connect & Launch" ? (
            <div className="space-y-6">
              <div className="card space-y-5 p-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Phone number</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {["+1 (415) 555-9012", "+1 (646) 555-2244", "+1 (206) 555-7722"].map((number) => (
                      <button
                        key={number}
                        type="button"
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="rounded-xl border border-dashed border-primary/40 px-4 py-2 text-sm font-semibold text-primary"
                    >
                      + Purchase new
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Integrations</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {["Google Calendar", "Salesforce", "Square", "HubSpot"].map((integration) => {
                      const selected = connections.includes(integration);
                      return (
                        <label
                          key={integration}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            selected ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-slate-600 hover:border-primary"
                          }`}
                        >
                          <span>{integration}</span>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleConnection(integration)}
                            className="h-4 w-4 rounded border-slate-300 text-primary"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="card space-y-4 p-6">
            <h3 className="text-sm font-semibold text-slate-900">Launch checklist</h3>
            <StepSummary
              label="Template selected"
              completed={Boolean(selectedTemplate)}
              description="Pick an industry starter or start fresh."
            />
            <StepSummary
              label="Voice profile configured"
              completed={Boolean(selectedVoice)}
              description="Give your agent a branded tone."
            />
            <StepSummary
              label="Connections ready"
              completed={connections.length > 0}
              description="Sync calendars, CRMs, and payment flows."
            />
          </div>

          <div className="card space-y-4 p-6 bg-primary text-white">
            <p className="text-sm font-semibold">Activation checklist</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" /> Smart fallbacks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" /> Auto logging in CRM
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" /> Payment-ready flows
              </li>
            </ul>
            <button
              type="button"
              className="btn mt-2 w-full border border-white/60 bg-white/10 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Review compliance
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Waves className="h-5 w-5 text-primary" />
          <span>
            Launching closes the loop between your agent and live systems. You can pause anytime.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goToStep("prev")}
            disabled={stepIndex === 0}
            className="btn-ghost border border-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          {stepIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => goToStep("next")}
              className="btn-primary"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={handleActivate}>
              <Phone className="h-4 w-4" />
              Activate agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface StepperProps {
  activeStep: Step;
}

function Stepper({ activeStep }: StepperProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-500 md:grid-cols-3">
      {steps.map((step) => {
        const isActive = activeStep === step;
        const passed = steps.indexOf(step) < steps.indexOf(activeStep);
        return (
          <div
            key={step}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 transition ${
              isActive
                ? "bg-primary/10 text-primary"
                : passed
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs">
              {steps.indexOf(step) + 1}
            </span>
            {step}
          </div>
        );
      })}
    </div>
  );
}

interface StepSummaryProps {
  label: string;
  description: string;
  completed: boolean;
}

function StepSummary({ label, description, completed }: StepSummaryProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="rounded-full bg-white p-1.5">
        <CheckCircle className={`h-4 w-4 ${completed ? "text-emerald-500" : "text-slate-300"}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

