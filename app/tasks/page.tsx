"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, Play } from "lucide-react";

type TaskKind = "route-audit" | "health-audit" | "orchestrate" | "reasoning-loop" | "deployment-brief";

const TASKS: Array<{ kind: TaskKind; title: string; description: string }> = [
  { kind: "route-audit", title: "Route Audit", description: "Validate core App Router route coverage." },
  { kind: "health-audit", title: "Health Audit", description: "Inspect runtime readiness signals." },
  { kind: "orchestrate", title: "Orchestrate", description: "Coordinate five execution agents." },
  { kind: "reasoning-loop", title: "Reasoning Loop", description: "Run diagnose, design, execute, verify." },
  { kind: "deployment-brief", title: "Deployment Brief", description: "Produce Vercel and Azure deployment steps." },
];

export default function TasksPage() {
  const [objective, setObjective] = useState("Advance MindReply production readiness and verify deployment health.");
  const [active, setActive] = useState<TaskKind>("route-audit");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  async function execute() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: active, objective }),
      });
      setResult(await response.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-20 min-h-screen" style={{ background: "hsl(40 33% 97%)" }}>
      <section className="py-14 px-4" style={{ background: "hsl(220 55% 20%)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(43 80% 60%)" }}>Autonomous Execution</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: "hsl(43 70% 88%)" }}>Task Command Center</h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "rgba(248,245,240,0.72)" }}>Execute bounded production tasks through the same backend contracts used by MR-Core orchestration and metrics.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-2">
            {TASKS.map((task) => (
              <button key={task.kind} onClick={() => setActive(task.kind)} className={`w-full text-left p-4 rounded-xl border transition-all ${active === task.kind ? "border-[hsl(43_80%_60%)] bg-[hsl(43_80%_60%_/_0.08)] shadow-sm" : "border-[hsl(40_25%_88%)] bg-white hover:-translate-y-0.5"}`}>
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: active === task.kind ? "hsl(220 55% 20%)" : "hsl(40 20% 92%)", color: active === task.kind ? "hsl(43 70% 88%)" : "hsl(220 25% 45%)" }}><ClipboardList size={17} /></span>
                  <span>
                    <span className="block font-semibold text-sm mb-1" style={{ color: "hsl(220 45% 13%)" }}>{task.title}</span>
                    <span className="block text-xs leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>{task.description}</span>
                  </span>
                </div>
              </button>
            ))}
          </aside>

          <section className="bg-white border rounded-2xl p-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "hsl(220 25% 45%)" }}>Objective</label>
            <textarea value={objective} onChange={(event) => setObjective(event.target.value)} rows={4} className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[hsl(43_80%_60%)] resize-none" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)", background: "hsl(40 20% 96%)" }} />
            <button onClick={execute} disabled={loading || !objective.trim()} className="w-full mt-4 rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
              <Play size={16} /> {loading ? "Executing..." : `Execute ${TASKS.find((task) => task.kind === active)?.title}`}
            </button>

            <div className="mt-6 rounded-xl border p-4 min-h-64" style={{ borderColor: "hsl(40 25% 88%)", background: "hsl(40 20% 96%)" }}>
              {result ? (
                <div>
                  <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "hsl(220 45% 13%)" }}><CheckCircle2 size={16} style={{ color: "hsl(43 80% 45%)" }} /> Task Complete</p>
                  <pre className="text-xs overflow-auto whitespace-pre-wrap" style={{ color: "hsl(220 45% 13%)" }}>{JSON.stringify(result, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-sm" style={{ color: "hsl(220 25% 45%)" }}>Select a task and execute it to view the production-safe result payload.</p>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
