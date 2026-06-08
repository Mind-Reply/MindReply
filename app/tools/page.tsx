"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Copy, FileText, Globe2, GraduationCap, Mail, Maximize2, MessageSquare, Minimize2, PhoneCall, RotateCcw, SlidersHorizontal, Sparkles, Target, Wand2, Zap } from "lucide-react";
import Link from "next/link";
import CreditPurchasePanel from "@/components/CreditPurchasePanel";
import DiagnosticTools from "@/components/DiagnosticTools";

type ToolSlug =
  | "ops-overload-analyzer"
  | "text-refiner"
  | "email-polisher"
  | "call-scripter"
  | "planning-assistant"
  | "correction-engine"
  | "teaching-optimizer"
  | "lexicon-refiner"
  | "tone-adjuster"
  | "tone-calibrator"
  | "shortener"
  | "expander"
  | "professional-rewrite"
  | "clarity-booster"
  | "structure-architect"
  | "cultural-adapter"
  | "prospect-reply-analyzer";
type ToolResponse = {
  result?: string;
  suggestions?: string[];
  analysis?: { clarity: number; authority: number; warmth: number; brevity: number };
  creditCost?: number;
  source?: "azure-openai" | "openai" | "local";
  metricLogged?: boolean;
};

const TONES = ["professional", "warm", "assertive", "empathetic", "concise", "diplomatic"];
const FREE_PREVIEW_LIMIT = 10;

const TOOLS: Array<{ id: ToolSlug; icon: React.ReactNode; title: string; desc: string; placeholder: string }> = [
  { id: "ops-overload-analyzer", icon: <Zap size={18} />, title: "Ops Overload Analyzer", desc: "Paste overloaded messages/tasks and get urgency, owner, next action, and the 24-hour recovery move.", placeholder: "Paste 5-10 urgent emails, Slack messages, tasks, or follow-up notes..." },
  { id: "prospect-reply-analyzer", icon: <Target size={18} />, title: "Prospect Reply Analyzer", desc: "Find why replies did not convert and rewrite the offer, close, and follow-up.", placeholder: "Paste 3-10 real prospect replies, objections, or no-response messages..." },
  { id: "text-refiner", icon: <Wand2 size={18} />, title: "Text Refiner", desc: "Refine casual text into polished professional language.", placeholder: "Paste a rough message or informal note..." },
  { id: "email-polisher", icon: <Mail size={18} />, title: "Email Polisher", desc: "Transform draft emails into executive correspondence.", placeholder: "Paste your email draft..." },
  { id: "call-scripter", icon: <PhoneCall size={18} />, title: "Call Scripter", desc: "Generate focused call openings, discovery prompts, objections, and closes.", placeholder: "Describe the call goal, recipient, and desired outcome..." },
  { id: "planning-assistant", icon: <Target size={18} />, title: "Planning Assistant", desc: "Turn a goal into milestones and communication checkpoints.", placeholder: "Describe the goal, timeframe, and constraints..." },
  { id: "correction-engine", icon: <CheckCircle2 size={18} />, title: "Correction Engine", desc: "Find weak phrasing, ambiguity, and authority leaks.", placeholder: "Paste text that needs correction..." },
  { id: "teaching-optimizer", icon: <GraduationCap size={18} />, title: "Teaching Optimizer", desc: "Restructure instructional content for understanding and retention.", placeholder: "Paste training, teaching, or explanatory content..." },
  { id: "lexicon-refiner", icon: <BookOpen size={18} />, title: "Lexicon Refiner", desc: "Adapt language to discipline-specific professional vocabulary.", placeholder: "Paste text that needs professional lexicon alignment..." },
  { id: "tone-adjuster", icon: <SlidersHorizontal size={18} />, title: "Tone Adjuster", desc: "Shift a message into a precise communication register.", placeholder: "Paste text that needs a different tone..." },
  { id: "tone-calibrator", icon: <MessageSquare size={18} />, title: "Tone Calibrator", desc: "Tune emotional valence, directness, and professional register.", placeholder: "Paste text that needs tone calibration..." },
  { id: "shortener", icon: <Minimize2 size={18} />, title: "Shortener", desc: "Compress communication without losing intent.", placeholder: "Paste text that should be shorter..." },
  { id: "expander", icon: <Maximize2 size={18} />, title: "Expander", desc: "Expand terse notes into complete professional wording.", placeholder: "Paste terse notes or a short instruction..." },
  { id: "professional-rewrite", icon: <FileText size={18} />, title: "Professional Rewrite", desc: "Rewrite informal phrasing for high-trust settings.", placeholder: "Paste text that needs a professional rewrite..." },
  { id: "clarity-booster", icon: <CheckCircle2 size={18} />, title: "Clarity Booster", desc: "Remove ambiguity and strengthen the next action.", placeholder: "Paste text with unclear ownership or next steps..." },
  { id: "structure-architect", icon: <FileText size={18} />, title: "Structure Architect", desc: "Rebuild message flow for clarity, decision speed, and recipient confidence.", placeholder: "Paste text that needs stronger structure..." },
  { id: "cultural-adapter", icon: <Globe2 size={18} />, title: "Cultural Adapter", desc: "Adapt phrasing for cross-cultural clarity and relationship context.", placeholder: "Paste text and describe the cultural or relationship context..." },
];

function todayUsageKey() {
  return `mindreply.tools.processed.${new Date().toISOString().slice(0, 10)}`;
}

export default function Tools() {
  const [active, setActive] = useState<ToolSlug>("ops-overload-analyzer");
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<ToolResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [queuedCount, setQueuedCount] = useState(0);

  const current = TOOLS.find((tool) => tool.id === active) ?? TOOLS[0];
  const showTone = active === "email-polisher" || active === "tone-adjuster" || active === "tone-calibrator";
  const remaining = Math.max(FREE_PREVIEW_LIMIT - processedCount, 0);
  const atLimit = remaining === 0;

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(todayUsageKey()) ?? "0");
    if (Number.isFinite(saved)) {
      setProcessedCount(Math.min(Math.max(saved, 0), FREE_PREVIEW_LIMIT));
    }
  }, []);

  function setDailyProcessed(nextValue: number) {
    const next = Math.min(Math.max(nextValue, 0), FREE_PREVIEW_LIMIT);
    setProcessedCount(next);
    window.localStorage.setItem(todayUsageKey(), String(next));
  }

  function reset() {
    setInput("");
    setResult(null);
  }

  function copy() {
    navigator.clipboard.writeText(result?.result ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function run() {
    if (!input.trim()) return;

    if (atLimit) {
      const nextQueuedCount = queuedCount + 1;
      setQueuedCount(nextQueuedCount);
      setResult({
        result: `Queued: ${nextQueuedCount} item${nextQueuedCount === 1 ? "" : "s"} waiting. Upgrade to process immediately and stop missing critical messages or tasks.`,
        suggestions: [
          "The free preview has reached 10/10 processed items today.",
          "New items stay queued until unlimited processing is unlocked.",
          "Use Growth when this overload repeats daily.",
        ],
        creditCost: 1,
        source: "local",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/tools/${active}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, tone }),
      });
      const nextResult = await response.json();
      setResult(nextResult);
      setDailyProcessed(processedCount + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-20 min-h-screen" style={{ background: "hsl(40 33% 97%)" }}>
      <section className="py-14 px-4" style={{ background: "hsl(220 55% 20%)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(43 80% 60%)" }}>Intelligence Suite</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: "hsl(43 70% 88%)" }}>Behavioral AI Tools</h1>
          <p className="text-sm max-w-2xl" style={{ color: "rgba(248,245,240,0.7)" }}>Paste overloaded messages, tasks, and follow-ups. Get the urgent queue, owner, next action, and response that saves the next 2+ hours.</p>
        </div>
      </section>

      <DiagnosticTools />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: atLimit ? "hsl(43 80% 60%)" : "hsl(40 25% 88%)" }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(43 80% 42%)" }}>Free preview</p>
                <h2 className="mt-1 font-serif text-2xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Messages processed: {processedCount}/{FREE_PREVIEW_LIMIT}</h2>
                <p className="mt-1 text-sm" style={{ color: "hsl(220 25% 45%)" }}>
                  {atLimit ? "Limit reached. New items queue until unlimited processing is unlocked." : `${remaining} free preview item${remaining === 1 ? "" : "s"} left today.`}
                </p>
                {queuedCount > 0 && <p className="mt-2 text-xs font-semibold" style={{ color: "hsl(43 80% 38%)" }}>{queuedCount} queued item{queuedCount === 1 ? "" : "s"} waiting.</p>}
              </div>
              <Link href="/memberships" className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
                Unlock unlimited processing
              </Link>
            </div>
          </div>
          <CreditPurchasePanel currentCost={result?.creditCost ?? 1} context="tool" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <aside className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:px-0 lg:pb-0">
            {TOOLS.map((tool) => (
              <button key={tool.id} onClick={() => { setActive(tool.id); setResult(null); }} className={`min-w-[220px] text-left p-4 rounded-xl border transition-all lg:w-full lg:min-w-0 ${active === tool.id ? "border-[hsl(43_80%_60%)] bg-[hsl(43_80%_60%_/_0.08)] shadow-sm" : "border-[hsl(40_25%_88%)] bg-white hover:-translate-y-0.5"}`}>
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: active === tool.id ? "hsl(220 55% 20%)" : "hsl(40 20% 92%)", color: active === tool.id ? "hsl(43 70% 88%)" : "hsl(220 25% 45%)" }}>{tool.icon}</span>
                  <span>
                    <span className="block font-semibold text-sm mb-1" style={{ color: "hsl(220 45% 13%)" }}>{tool.title}</span>
                    <span className="block text-xs leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>{tool.desc}</span>
                  </span>
                </div>
              </button>
            ))}
          </aside>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white border rounded-2xl p-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>{current.title}</h2>
                  <p className="text-sm mt-1" style={{ color: "hsl(220 25% 45%)" }}>{current.desc}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: atLimit ? "hsl(43 80% 60%)" : "hsl(43 80% 60% / 0.18)", color: atLimit ? "hsl(220 45% 13%)" : "hsl(43 80% 36%)" }}>{atLimit ? "Limit reached" : `${result?.creditCost ?? 1} credit`}</span>
              </div>

              {showTone && (
                <div className="mb-3">
                  <label className="text-xs block mb-1.5 font-semibold uppercase tracking-wide" style={{ color: "hsl(220 25% 45%)" }}>Target tone</label>
                  <select value={tone} onChange={(event) => setTone(event.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none border border-[hsl(40_25%_88%)]" style={{ background: "hsl(40 20% 92%)", color: "hsl(220 45% 13%)" }}>
                    {TONES.map((value) => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}
                  </select>
                </div>
              )}

              <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={10} placeholder={current.placeholder} className="w-full rounded-lg px-3 py-3 text-sm outline-none border border-[hsl(40_25%_88%)] focus:border-[hsl(43_80%_60%)] transition-colors resize-none leading-relaxed" style={{ background: "hsl(40 20% 92%)", color: "hsl(220 45% 13%)" }} />
              <button onClick={run} disabled={!input.trim() || loading} className="w-full mt-4 font-medium py-3 rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity text-sm flex items-center justify-center gap-2" style={{ background: atLimit ? "hsl(43 80% 60%)" : "hsl(220 55% 20%)", color: atLimit ? "hsl(220 45% 13%)" : "hsl(43 70% 88%)" }}>
                {loading ? "Processing..." : <><Sparkles size={15} />{atLimit ? "Queue item until upgrade" : "Run Intelligence"}</>}
              </button>
            </section>

            <section className="bg-white border rounded-2xl p-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Result</h2>
                {result?.result && (
                  <div className="flex gap-3">
                    <button onClick={copy} className="text-xs flex items-center gap-1 hover:text-[hsl(220_55%_20%)]" style={{ color: "hsl(220 25% 45%)" }}><Copy size={12} /> {copied ? "Copied" : "Copy"}</button>
                    <button onClick={reset} className="text-xs flex items-center gap-1 hover:text-[hsl(220_55%_20%)]" style={{ color: "hsl(220 25% 45%)" }}><RotateCcw size={12} /> Reset</button>
                  </div>
                )}
              </div>

              {!result && !loading && (
                <div className="h-64 flex flex-col items-center justify-center text-sm text-center gap-2" style={{ color: "hsl(220 25% 45%)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "hsl(40 20% 92%)" }}><Sparkles size={20} style={{ color: "rgba(10,22,40,0.25)" }} /></div>
                  <p>{atLimit ? "New items will queue here until unlimited processing is unlocked." : "Your processed result and behavioral scores will appear here."}</p>
                </div>
              )}

              {loading && <div className="h-64 flex items-center justify-center text-sm" style={{ color: "hsl(220 25% 45%)" }}>Processing communication intelligence...</div>}

              {result?.result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border px-3 py-2 text-xs" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 25% 45%)" }}>
                    <span>Processing mode</span>
                    <span className="font-semibold" style={{ color: result.source === "local" ? "hsl(220 45% 13%)" : "hsl(43 80% 38%)" }}>
                      {result.source === "local" ? "MindReply Core" : "Advanced intelligence"}
                    </span>
                  </div>
                  <div className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line border border-[hsl(40_25%_88%)]" style={{ background: "hsl(40 20% 92% / 0.5)", color: "hsl(220 45% 13%)" }}>{result.result}</div>

                  {result.analysis && (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(result.analysis).map(([key, value]) => (
                        <div key={key} className="rounded-lg border p-3" style={{ borderColor: "hsl(40 25% 88%)" }}>
                          <p className="text-xs capitalize mb-1" style={{ color: "hsl(220 25% 45%)" }}>{key}</p>
                          <p className="font-serif text-2xl font-bold" style={{ color: "hsl(220 55% 20%)" }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {(result.suggestions ?? []).length > 0 && (
                    <div className="border-t pt-3" style={{ borderColor: "hsl(40 25% 88%)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "hsl(220 25% 45%)" }}>Intelligence Notes</p>
                      <ul className="space-y-1.5">
                        {(result.suggestions ?? []).map((suggestion) => (
                          <li key={suggestion} className="text-xs flex gap-2" style={{ color: "hsl(220 25% 45%)" }}><span style={{ color: "hsl(43 80% 45%)" }}>-</span>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="rounded-xl border p-4" style={{ borderColor: "hsl(40 25% 88%)", background: atLimit ? "hsl(43 80% 60% / 0.16)" : "hsl(43 80% 60% / 0.08)" }}>
                    <p className="text-sm font-bold" style={{ color: "hsl(220 45% 13%)" }}>{atLimit ? "Stop missing critical items." : "Value moment unlocked"}</p>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>
                      {atLimit ? "Unlock immediate processing and reclaim your day when the next urgent batch arrives." : "Process the next 10 messages/tasks before another urgent item slips. Buy credits for the batch or upgrade to Growth when daily overload is costing time."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link href="/memberships" className="rounded-lg px-3 py-2 text-xs font-semibold" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>Unlock unlimited processing</Link>
                      <Link href="/professionals" className="rounded-lg border px-3 py-2 text-xs font-semibold" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }}>Book expert review</Link>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
