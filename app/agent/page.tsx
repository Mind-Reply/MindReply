import { ArrowDown, Bot, CheckCircle2, Network, ShieldCheck, UserRound } from "lucide-react";
import MOAConsole from "@/components/MOAConsole";
import { MOA_AGENTS, MOA_CONTROLLER_CONTRACT, orchestrateGoal } from "@/lib/moa";

const flow = [
  { label: "USER", icon: <UserRound size={18} /> },
  { label: "Master Orchestrator Agent (MOA)", icon: <Bot size={18} /> },
  { label: "Task Routing Layer", icon: <Network size={18} /> },
  { label: "15-Agent Specialist Layer", icon: <CheckCircle2 size={18} /> },
  { label: "MOA Validates Outputs", icon: <ShieldCheck size={18} /> },
  { label: "Final Combined Result to USER", icon: <UserRound size={18} /> },
];

const initialResult = orchestrateGoal({
  goal: "Expand MindReply with secure AI orchestration, visible platform functionality, automation, integrations, and growth support.",
});

const controllerPromise =
  "MOA acts as the central brain of the MindReply multi-agent ecosystem, enforcing order, clarity, stability, and one unified high-quality output.";

export default function AgentPage() {
  return (
    <main className="min-h-screen bg-[hsl(40_20%_96%)] pt-24 text-[hsl(220_45%_13%)]">
      <section className="border-b border-[hsl(40_25%_88%)] bg-[hsl(220_55%_20%)] px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_60%)]">
              Master Orchestrator Agent
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-[hsl(43_70%_88%)] md:text-5xl">
              MOA routes every goal through the full specialist layer.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(248,245,240,0.72)]">
              User intent enters one control point, the routing layer activates all domain agents, MOA validates each output, and the platform returns one combined result.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] lg:grid-cols-1">
            {flow.map((step, index) => (
              <div key={step.label} className="contents lg:block">
                <div className="flex items-center gap-3 rounded-lg border border-[rgba(248,245,240,0.14)] bg-white/5 px-4 py-3 text-sm font-semibold text-[hsl(43_70%_88%)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(43_80%_60%)] text-[hsl(220_45%_13%)]">
                    {step.icon}
                  </span>
                  {step.label}
                </div>
                {index < flow.length - 1 && (
                  <div className="hidden items-center justify-center text-[hsl(43_80%_60%)] sm:flex lg:my-1">
                    <ArrowDown className="hidden lg:block" size={18} />
                    <span className="lg:hidden">/</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <MOAConsole initialResult={initialResult} />
        </div>
      </section>

      <section className="border-t border-[hsl(40_25%_88%)] bg-[hsl(40_20%_96%)] px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_40%)]">Controller Contract</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[hsl(220_45%_13%)]">MOA is the only user-facing control point.</h2>
            <p className="mt-3 text-sm leading-6 text-[hsl(220_25%_45%)]">{controllerPromise}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {MOA_CONTROLLER_CONTRACT.coreRules.slice(0, 6).map((rule) => (
              <div key={rule} className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-4 shadow-sm">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-[hsl(43_80%_60%_/_0.18)] text-[hsl(43_80%_35%)]">
                    <CheckCircle2 size={14} />
                  </span>
                  <p className="text-sm font-medium leading-6 text-[hsl(220_45%_13%)]">{rule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[hsl(40_25%_88%)] bg-white px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_40%)]">Specialist Layer</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-[hsl(220_45%_13%)]">All agents active</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {MOA_AGENTS.length}/15 online
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MOA_AGENTS.map((agent) => (
              <article key={agent.id} className="rounded-lg border border-[hsl(40_25%_88%)] bg-[hsl(40_20%_96%)] p-4">
                <h3 className="font-semibold text-[hsl(220_45%_13%)]">{agent.name}</h3>
                <p className="mt-2 text-xs leading-5 text-[hsl(220_25%_45%)]">{agent.domain}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
