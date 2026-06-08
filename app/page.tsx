"use client";

import { useMemo, useState } from "react";

type ActionKind = "reply" | "schedule" | "resolve" | "escalate";

type DecisionState = {
  synthesis: string;
  recommended_action: ActionKind;
  risk: "low" | "medium" | "high";
  importance: number;
  urgency: number;
  memory_update: string;
};

const sample =
  "Client is concerned about the revised timeline and wants a response before end of day.";

const initialDecision: DecisionState = {
  synthesis: "Client concern needs a same-day response. Recommended action: reply.",
  recommended_action: "reply",
  risk: "medium",
  importance: 76,
  urgency: 82,
  memory_update: "Tone and follow-up preference retained silently.",
};

export default function Home() {
  const [intake, setIntake] = useState(sample);
  const [decision, setDecision] = useState<DecisionState>(initialDecision);
  const [handled, setHandled] = useState(false);
  const [busy, setBusy] = useState(false);

  const actionLabel = useMemo(() => {
    if (decision.recommended_action === "reply") return "Prepare reply";
    if (decision.recommended_action === "schedule") return "Set hold";
    if (decision.recommended_action === "resolve") return "Close thread";
    return "Escalate for review";
  }, [decision.recommended_action]);

  async function assess() {
    setBusy(true);
    setHandled(false);
    const response = await fetch("/api/intake", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: intake, devicePrivacyFlag: true }),
    });
    const result = (await response.json()) as DecisionState;
    setDecision(result);
    setBusy(false);
  }

  async function proceed() {
    setBusy(true);
    await fetch("/api/action", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        synthesis: decision.synthesis,
        recommended_action: decision.recommended_action,
      }),
    });
    await fetch("/api/memory", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        synthesis: decision.synthesis,
        recommended_action: decision.recommended_action,
        signal: intake,
      }),
    });
    setHandled(true);
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-[#0f1412] text-[#f4efe4]">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-5 py-8 md:px-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#b99758]">
            Executive Nervous System
          </p>
          <h1 className="text-5xl font-semibold leading-[0.96] tracking-normal md:text-7xl">
            MindReply turns pressure into one next action.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#c9c1b0]">
            MindReply is Decision Infrastructure between input and action. It turns scattered signal into one synthesis, one recommended action, and a quiet memory update.
          </p>
          <div className="mt-10 grid gap-3 text-sm text-[#d9d1c0]">
            <div className="border-l border-[#b99758] pl-4">Subtract before adding.</div>
            <div className="border-l border-[#b99758] pl-4">Protect before acting.</div>
            <div className="border-l border-[#b99758] pl-4">Guide toward one move.</div>
          </div>
        </div>

        <section aria-label="MindReply intake surface" className="rounded-lg border border-[#403b31] bg-[#171d1a] p-4 shadow-2xl shadow-black/30 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#403b31] pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#b99758]">Intake Layer</p>
              <h2 className="mt-1 text-xl font-semibold">One synthesis. One action.</h2>
            </div>
            <span className="rounded-full border border-[#403b31] px-3 py-1 text-xs text-[#c9c1b0]">
              private by default
            </span>
          </div>

          <label className="block text-sm font-medium text-[#f4efe4]" htmlFor="intake">
            Input
          </label>
          <textarea
            id="intake"
            value={intake}
            onChange={(event) => setIntake(event.target.value)}
            className="mt-2 min-h-32 w-full resize-none rounded-md border border-[#403b31] bg-[#101512] p-4 text-base leading-7 text-[#f4efe4] outline-none transition focus:border-[#b99758]"
          />
          <button
            type="button"
            onClick={assess}
            disabled={busy}
            className="mt-4 h-11 rounded-md bg-[#b99758] px-5 text-sm font-semibold text-[#101512] transition hover:bg-[#d0b16c] disabled:cursor-wait disabled:opacity-70"
          >
            {busy ? "Reading signal" : "Assess intake"}
          </button>

          <div className="mt-6 grid gap-4">
            <article className="rounded-md border border-[#403b31] bg-[#101512] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#b99758]">Synthesis</p>
              <p className="mt-2 leading-7 text-[#f4efe4]">{decision.synthesis}</p>
            </article>

            <article className="rounded-md border border-[#403b31] bg-[#101512] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#b99758]">Action Layer</p>
                  <p className="mt-2 text-2xl font-semibold capitalize">{decision.recommended_action}</p>
                  <p className="mt-1 text-sm text-[#c9c1b0]">Risk: {decision.risk}</p>
                </div>
                <button
                  type="button"
                  onClick={proceed}
                  disabled={busy}
                  className="h-11 rounded-md border border-[#b99758] px-5 text-sm font-semibold text-[#f4efe4] transition hover:bg-[#b99758] hover:text-[#101512] disabled:cursor-wait disabled:opacity-70"
                >
                  {actionLabel}
                </button>
              </div>
            </article>

            <article className="rounded-md border border-[#403b31] bg-[#101512] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#b99758]">Memory Layer</p>
              <p className="mt-2 leading-7 text-[#c9c1b0]">
                {handled ? "This has been handled. " : "Proceed when ready. "}
                {decision.memory_update}
              </p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
