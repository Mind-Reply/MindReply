"use client";

import { useEffect, useState } from "react";
import { Activity, BrainCircuit, Copy, Network, Play } from "lucide-react";

type OrchestrationResult = {
  id: string;
  status: string;
  risk: string;
  agents: Array<{ role: string; name: string; diagnosis: string; actions: string[]; verification: string }>;
  nextActions: Array<{ id: string; owner: string; title: string; priority: string }>;
  metricLogged: boolean;
};

type LoopResult = {
  id: string;
  status: string;
  cycles: number;
  iterations: Array<{ cycle: number; phase: string; observation: string; decision: string }>;
  metricLogged: boolean;
};

type ActiveAgentStatus = {
  totalActiveAgents: number;
  byLane: Record<string, number>;
  accelerationTarget: string;
};

export default function OrchestratorPage() {
  const [objective, setObjective] = useState("Stabilize MindReply production deployment across Vercel and Azure while preserving the premium communication intelligence experience.");
  const [orchestration, setOrchestration] = useState<OrchestrationResult | null>(null);
  const [loop, setLoop] = useState<LoopResult | null>(null);
  const [agentStatus, setAgentStatus] = useState<ActiveAgentStatus | null>(null);
  const [loading, setLoading] = useState<"orchestrate" | "loop" | null>(null);

  useEffect(() => {
    fetch("/api/agents/active")
      .then((response) => response.json())
      .then((data) => setAgentStatus(data))
      .catch(() => setAgentStatus(null));
  }, []);

  async function runOrchestrator() {
    if (!objective.trim()) return;
    setLoading("orchestrate");
    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, urgency: "high" }),
      });
      setOrchestration(await response.json());
    } finally {
      setLoading(null);
    }
  }

  async function runLoop() {
    if (!objective.trim()) return;
    setLoading("loop");
    try {
      const response = await fetch("/api/background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, cycles: 4 }),
      });
      setLoop(await response.json());
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="pt-20 min-h-screen" style={{ background: "hsl(40 33% 97%)" }}>
      <section className="py-14 px-4" style={{ background: "hsl(220 55% 20%)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(43 80% 60%)" }}>MR-Core</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: "hsl(43 70% 88%)" }}>Autonomous Orchestrator</h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "rgba(248,245,240,0.72)" }}>Coordinate architecture, integration, research, marketing, and deployment agents from one production-safe operator surface.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-6">
          <div className="rounded-2xl border bg-white p-5 md:col-span-2" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(43 80% 45%)" }}>Active Staff Layer</p>
            <p className="mt-2 font-serif text-4xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>{agentStatus?.totalActiveAgents ?? 60}</p>
            <p className="mt-1 text-sm" style={{ color: "hsl(220 25% 45%)" }}>operating desks across revenue, platform, trust, and intelligence.</p>
          </div>
          {["revenue", "platform", "trust", "intelligence"].map((lane) => (
            <div key={lane} className="rounded-2xl border bg-white p-5" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(220 25% 45%)" }}>{lane}</p>
              <p className="mt-3 font-serif text-3xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>{agentStatus?.byLane?.[lane] ?? "-"}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-2xl border p-5" style={{ borderColor: "rgba(201,169,97,0.35)", background: "hsl(43 80% 60% / 0.12)" }}>
          <p className="text-sm font-semibold" style={{ color: "hsl(220 45% 13%)" }}>{agentStatus?.accelerationTarget ?? "82x faster triage through visible owner, evidence, and handoff routing."}</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 mb-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
          <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "hsl(220 25% 45%)" }}>Objective</label>
          <textarea value={objective} onChange={(event) => setObjective(event.target.value)} rows={4} className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[hsl(43_80%_60%)] resize-none" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)", background: "hsl(40 20% 96%)" }} />
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button onClick={runOrchestrator} disabled={loading !== null || !objective.trim()} className="flex-1 rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
              <Network size={16} /> {loading === "orchestrate" ? "Coordinating..." : "Run Multi-Agent Orchestration"}
            </button>
            <button onClick={runLoop} disabled={loading !== null || !objective.trim()} className="flex-1 rounded-lg py-3 text-sm font-semibold border flex items-center justify-center gap-2 disabled:opacity-40" style={{ borderColor: "hsl(220 55% 20%)", color: "hsl(220 55% 20%)" }}>
              <BrainCircuit size={16} /> {loading === "loop" ? "Reasoning..." : "Run Background Reasoning Loop"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border rounded-2xl p-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2" style={{ color: "hsl(220 45% 13%)" }}><Activity size={20} /> Agent Reports</h2>
              {orchestration && <span className="text-xs font-semibold uppercase" style={{ color: "hsl(43 80% 45%)" }}>{orchestration.risk} risk</span>}
            </div>
            {orchestration ? (
              <div className="space-y-4">
                {orchestration.agents.map((agent) => (
                  <article key={agent.role} className="rounded-xl border p-4" style={{ borderColor: "hsl(40 25% 88%)" }}>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "hsl(220 45% 13%)" }}>{agent.name}</h3>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "hsl(220 25% 45%)" }}>{agent.diagnosis}</p>
                    <ul className="space-y-1">
                      {agent.actions.slice(0, 2).map((action) => <li key={action} className="text-xs flex gap-2" style={{ color: "hsl(220 45% 13%)" }}><span style={{ color: "hsl(43 80% 45%)" }}>-</span>{action}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>Run orchestration to assign the objective across the MindReply execution desks.</p>
            )}
          </section>

          <section className="bg-white border rounded-2xl p-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-2" style={{ color: "hsl(220 45% 13%)" }}><Play size={20} /> Execution Loop</h2>
              {loop && <button onClick={() => navigator.clipboard.writeText(JSON.stringify(loop, null, 2))} className="text-xs flex items-center gap-1" style={{ color: "hsl(220 25% 45%)" }}><Copy size={12} /> Copy JSON</button>}
            </div>
            {loop ? (
              <div className="space-y-3">
                {loop.iterations.map((iteration) => (
                  <article key={iteration.cycle} className="rounded-xl border p-4" style={{ borderColor: "hsl(40 25% 88%)" }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "hsl(43 80% 45%)" }}>Cycle {iteration.cycle}: {iteration.phase}</p>
                    <p className="text-xs mb-2" style={{ color: "hsl(220 25% 45%)" }}>{iteration.observation}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "hsl(220 45% 13%)" }}>{iteration.decision}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>Run a reasoning loop to turn the objective into a bounded diagnose, design, execute, and verify sequence.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
