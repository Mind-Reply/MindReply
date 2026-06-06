"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, MessageSquare, Shield, Sparkles, Zap } from "lucide-react";
import { messageRescueOffer } from "@/lib/rescue-offer";

const painPoints = [
  "Sensitive client follow-ups sitting unsent",
  "Staff messages that need calm authority",
  "Fee, apology, boundary, or decision wording that keeps getting rewritten",
];

const outcomes = [
  `${messageRescueOffer.messages} send-ready messages shaped for pressure, clarity, and trust`,
  `${messageRescueOffer.deliveryMinutes}-minute outcome path for the messages you are avoiding today`,
  "Calm wording that protects the relationship while moving the decision forward",
];

const urgentMoments = [
  "You are about to delay a client reply for another day",
  "A team message could create confusion if the wording is wrong",
  "A deal, booking, refund, complaint, or boundary depends on the next sentence",
];

export default function RescuePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout/rescue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        setError("Direct checkout is being prepared. Use a live tool now or request direct access from MindReply.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Direct checkout is being prepared. Use a live tool now or request direct access from MindReply.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[hsl(40_20%_96%)]">
      <section className="relative overflow-hidden bg-[hsl(220_55%_20%)] px-4 pb-20 pt-32 text-[hsl(43_70%_88%)]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 18% 38%, white 1px, transparent 1px), radial-gradient(circle at 78% 58%, white 1px, transparent 1px)", backgroundSize: "58px 58px" }} />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[rgba(201,169,97,0.34)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_60%)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              For the message you keep avoiding
            </div>
            <h1 className="font-serif text-5xl font-bold leading-[0.98] md:text-6xl lg:text-7xl">
              Your next {messageRescueOffer.messages} difficult messages finished in {messageRescueOffer.deliveryMinutes} minutes
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[rgba(248,245,240,0.76)]">
              Paste the client, staff, fee, apology, or follow-up messages you are avoiding. MindReply turns them into calm, send-ready wording today.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startCheckout}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(43_80%_60%)] px-7 py-4 text-sm font-bold text-[hsl(220_45%_13%)] shadow-lg transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
              >
                {loading ? "Opening checkout" : `Get ${messageRescueOffer.messages} messages handled`}
                <ArrowRight size={17} />
              </button>
              <Link href="/tools/email-polisher" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[rgba(248,245,240,0.26)] px-7 py-4 text-sm font-semibold text-[hsl(43_70%_88%)] transition hover:text-[hsl(43_80%_60%)]">
                Try one message first
                <Sparkles size={16} />
              </Link>
            </div>
            {error && <p className="mt-4 max-w-xl rounded-lg border border-[rgba(201,169,97,0.32)] bg-[rgba(255,255,255,0.06)] px-4 py-3 text-sm text-[rgba(248,245,240,0.74)]">{error}</p>}
          </div>

          <div className="rounded-[2rem] border border-[rgba(248,245,240,0.14)] bg-[rgba(8,18,35,0.44)] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
            <div className="rounded-[1.5rem] border border-[rgba(248,245,240,0.14)] bg-[hsl(218_43%_12%)] p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(43_80%_60%)] text-[hsl(220_45%_13%)]">
                    <MessageSquare size={21} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[hsl(43_80%_60%)]">Message Rescue</p>
                    <p className="text-sm text-[rgba(248,245,240,0.68)]">Direct outcome path</p>
                  </div>
                </div>
                <div className="rounded-full border border-emerald-300/30 px-3 py-1 text-xs font-bold text-emerald-200">
                  Today
                </div>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Messages", value: messageRescueOffer.messages },
                  { label: "Minutes", value: messageRescueOffer.deliveryMinutes },
                  { label: "Price", value: `£${messageRescueOffer.price}` },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-[rgba(248,245,240,0.1)] bg-white/[0.045] p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-[rgba(248,245,240,0.5)]">{metric.label}</p>
                    <p className="mt-3 font-serif text-3xl font-bold text-[hsl(43_70%_88%)]">{metric.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7 space-y-3">
                {outcomes.map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl bg-white/[0.035] p-4 text-sm leading-6 text-[rgba(248,245,240,0.72)]">
                    <CheckCircle2 className="mt-0.5 flex-none text-[hsl(43_80%_60%)]" size={18} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_45%)]">What you stop doing</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[hsl(220_45%_13%)]">Stop losing the hour before you even send the message.</h2>
          </div>
          <div className="grid gap-4 lg:col-span-2 sm:grid-cols-3">
            {painPoints.map((item) => (
              <div key={item} className="rounded-xl border border-[hsl(40_25%_88%)] bg-white p-5 shadow-sm">
                <Zap size={20} className="text-[hsl(43_80%_45%)]" />
                <p className="mt-4 text-sm font-semibold leading-6 text-[hsl(220_45%_13%)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[hsl(40_25%_88%)] bg-white px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_45%)]">When this is urgent</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[hsl(220_45%_13%)]">Buy when delay costs more than £49.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {urgentMoments.map((item) => (
              <div key={item} className="rounded-xl bg-[hsl(220_45%_13%)] p-5 text-[hsl(43_70%_88%)]">
                <Clock size={20} className="text-[hsl(43_80%_60%)]" />
                <p className="mt-4 text-sm font-semibold leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_45%)]">How it works</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[hsl(220_45%_13%)]">Pay, paste, get send-ready wording.</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                "Checkout in one step",
                "Paste the stuck messages",
                "Use the finished wording today",
              ].map((step, index) => (
                <div key={step} className="rounded-xl border border-[hsl(40_25%_88%)] bg-white p-5">
                  <p className="font-serif text-3xl font-bold text-[hsl(43_80%_45%)]">0{index + 1}</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[hsl(220_45%_13%)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[hsl(40_25%_88%)] bg-[hsl(220_55%_20%)] p-6 text-[hsl(43_70%_88%)] shadow-xl">
            <Shield size={22} className="text-[hsl(43_80%_60%)]" />
            <h3 className="mt-4 font-serif text-2xl font-bold">The first-session value moment</h3>
            <p className="mt-3 text-sm leading-6 text-[rgba(248,245,240,0.72)]">
              The user pastes one difficult message and immediately sees the calm version, the stronger version, and the exact line that removes pressure.
            </p>
            <button
              type="button"
              onClick={startCheckout}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(43_80%_60%)] px-6 py-4 text-sm font-bold text-[hsl(220_45%_13%)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? "Opening checkout" : `Start for £${messageRescueOffer.price}`}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
