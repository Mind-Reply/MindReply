"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, Copy, Loader2, Network, Play, ShieldCheck } from "lucide-react";
import type { OrchestratedGoal } from "@/lib/moa";

type MOAConsoleProps = {
  initialResult: OrchestratedGoal;
};

const DEFAULT_GOAL =
  "Expand MindReply with secure AI orchestration, visible platform functionality, automation, integrations, and growth support.";

function ResponseBlock({ children }: { children: string }) {
  return (
    <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-[hsl(40_20%_96%)] p-4 text-sm leading-6 text-[hsl(220_45%_13%)]">
      {children}
    </div>
  );
}

export default function MOAConsole({ initialResult }: MOAConsoleProps) {
  const [goal, setGoal] = useState(initialResult.userGoal || DEFAULT_GOAL);
  const [result, setResult] = useState<OrchestratedGoal>(initialResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const routingStats = useMemo(() => {
    const primary = result.taskRoutingLayer.filter((agent) => agent.priority === "primary").length;
    const support = result.taskRoutingLayer.filter((agent) => agent.priority === "support").length;
    const observer = result.taskRoutingLayer.filter((agent) => agent.priority === "observer").length;

    return { primary, support, observer };
  }, [result]);

  async function runOrchestration() {
    const trimmed = goal.trim();
    if (!trimmed) {
      setError("Enter a goal before running the orchestrator.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/agent/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: trimmed }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to run orchestration.");
      }

      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run orchestration.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    const text = [
      result.finalCombinedResult.summary,
      "",
      "Next actions:",
      ...result.finalCombinedResult.nextActions.map((action) => `- ${action}`),
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[hsl(220_55%_20%)] text-[hsl(43_80%_60%)]">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[hsl(220_45%_13%)]">MOA Console</h2>
            <p className="text-xs text-[hsl(220_25%_45%)]">User goal intake and live task routing</p>
          </div>
        </div>

        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[hsl(220_25%_45%)]">
          User Goal
        </label>
        <textarea
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          rows={8}
          className="w-full resize-none rounded-lg border border-[hsl(40_25%_88%)] bg-[hsl(40_20%_96%)] px-3 py-3 text-sm leading-6 text-[hsl(220_45%_13%)] outline-none transition-colors focus:border-[hsl(43_80%_60%)]"
        />
        <button
          onClick={runOrchestration}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(220_55%_20%)] px-4 py-3 text-sm font-semibold text-[hsl(43_70%_88%)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
          Run Orchestration
        </button>
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 flex-shrink-0" size={15} />
            {error}
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[hsl(43_80%_40%)]">Final Combined Result</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-[hsl(220_45%_13%)]">
                {result.finalCombinedResult.visibleResult}
              </h2>
            </div>
            <button
              onClick={copyResult}
              className="inline-flex items-center gap-2 rounded-md border border-[hsl(40_25%_88%)] px-3 py-2 text-xs font-semibold text-[hsl(220_25%_45%)] hover:text-[hsl(220_55%_20%)]"
            >
              <Copy size={13} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <ResponseBlock>{result.finalCombinedResult.summary}</ResponseBlock>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-4">
            <p className="text-xs text-[hsl(220_25%_45%)]">Primary</p>
            <p className="font-serif text-3xl font-bold text-[hsl(220_55%_20%)]">{routingStats.primary}</p>
          </div>
          <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-4">
            <p className="text-xs text-[hsl(220_25%_45%)]">Support</p>
            <p className="font-serif text-3xl font-bold text-[hsl(220_55%_20%)]">{routingStats.support}</p>
          </div>
          <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-4">
            <p className="text-xs text-[hsl(220_25%_45%)]">Observer</p>
            <p className="font-serif text-3xl font-bold text-[hsl(220_55%_20%)]">{routingStats.observer}</p>
          </div>
        </div>

        <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={17} className="text-emerald-600" />
            <h3 className="font-semibold text-[hsl(220_45%_13%)]">MOA Validation</h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-[hsl(220_25%_45%)]">{result.validation.validationSummary}</p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {result.validation.confidenceScore}% confidence
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[hsl(43_80%_45%)]" />
            <h3 className="font-semibold text-[hsl(220_45%_13%)]">Prioritized Next Actions</h3>
          </div>
          <ol className="space-y-2">
            {result.finalCombinedResult.nextActions.map((action, index) => (
              <li key={action} className="flex gap-3 text-sm leading-6 text-[hsl(220_45%_13%)]">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(43_80%_60%_/_0.18)] text-xs font-bold text-[hsl(43_80%_35%)]">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-[hsl(40_25%_88%)] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Network size={17} className="text-[hsl(220_55%_20%)]" />
            <h3 className="font-semibold text-[hsl(220_45%_13%)]">Task Routing Layer</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {result.taskRoutingLayer.map((agent) => (
              <div key={agent.id} className="rounded-md border border-[hsl(40_25%_88%)] bg-[hsl(40_20%_96%)] px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[hsl(220_45%_13%)]">{agent.name}</p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[hsl(220_25%_45%)]">
                    {agent.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-[hsl(220_25%_45%)]">{agent.output.evidence}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(43_80%_35%)]">
                  Format: {agent.output.requiredFormat}
                </p>
                <p className="mt-1 text-xs leading-5 text-[hsl(220_25%_45%)]">{agent.output.boundaryCheck}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
