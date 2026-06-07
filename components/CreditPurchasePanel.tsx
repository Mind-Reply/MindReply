"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Sparkles, TrendingUp, Zap } from "lucide-react";

type CreditPurchasePanelProps = {
  currentCost?: number;
  compact?: boolean;
  context?: string;
};

type StoredCredits = {
  balance: number;
  activatedAt: string;
  lastSessionId?: string | null;
};

const packs = [
  { credits: 5, price: "GBP 9", label: "Starter Pack", note: "Good for quick reply fixes." },
  { credits: 20, price: "GBP 29", label: "Overload Recovery Pack", note: "Best for the next 10 queued items." },
] as const;

function readCredits(): StoredCredits | null {
  try {
    const saved = window.localStorage.getItem("mindreply.credits");
    return saved ? JSON.parse(saved) as StoredCredits : null;
  } catch {
    window.localStorage.removeItem("mindreply.credits");
    return null;
  }
}

export default function CreditPurchasePanel({ currentCost = 1, compact = false, context = "tools" }: CreditPurchasePanelProps) {
  const [credits, setCredits] = useState<StoredCredits | null>(null);
  const [checkoutPack, setCheckoutPack] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCredits(readCredits());
  }, []);

  async function startCreditCheckout(pack: 5 | 20) {
    setCheckoutPack(pack);
    setError("");

    try {
      const response = await fetch("/api/checkout/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: pack }),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        setError(data.error ?? "Credit checkout is not available yet.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Credit checkout is not available right now.");
    } finally {
      setCheckoutPack(null);
    }
  }

  return (
    <section className={`rounded-2xl border ${compact ? "p-4" : "p-5 md:p-6"}`} style={{ borderColor: "hsl(40 25% 88%)", background: "white" }}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(43 80% 42%)" }}>
            <Sparkles size={13} />
            Credits unlock tool output
          </p>
          <h2 className={`${compact ? "text-xl" : "text-2xl"} font-serif font-bold`} style={{ color: "hsl(220 45% 13%)" }}>
            {credits?.balance ? `${credits.balance} credits ready` : "Signal preview is limited"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>
            This {context} action uses {currentCost} credit{currentCost === 1 ? "" : "s"}. Buy credits for immediate overload processing, use Growth for 50 monthly credits, or move to Pro when daily communication needs long-term context and integrations.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[330px]">
          {packs.map((pack) => (
            <button
              key={pack.credits}
              type="button"
              onClick={() => startCreditCheckout(pack.credits)}
              disabled={checkoutPack !== null}
              className="rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-[hsl(43_80%_60%)] disabled:opacity-50"
              style={{ borderColor: "hsl(40 25% 88%)", background: "hsl(40 20% 97%)" }}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold" style={{ color: "hsl(220 45% 13%)" }}>{pack.label}</span>
                <span className="text-sm font-bold" style={{ color: "hsl(43 80% 38%)" }}>{pack.price}</span>
              </span>
              <span className="mt-1 block text-xs" style={{ color: "hsl(220 25% 45%)" }}>
                {checkoutPack === pack.credits ? "Opening checkout..." : `${pack.credits} credits - ${pack.note}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "hsl(40 25% 88%)" }}>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold" style={{ background: "hsl(43 80% 60% / 0.16)", color: "hsl(220 45% 13%)" }}>
            <Zap size={12} /> Upgrade options available
          </span>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold" style={{ background: "hsl(220 55% 20% / 0.08)", color: "hsl(220 45% 13%)" }}>
            <CreditCard size={12} /> Secure checkout ready
          </span>
        </div>
        <Link href="/memberships" className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80" style={{ color: "hsl(220 55% 20%)" }}>
          Compare Growth and Pro <TrendingUp size={14} />
        </Link>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "hsl(43 80% 60% / 0.35)", color: "hsl(220 45% 13%)", background: "hsl(43 80% 60% / 0.12)" }}>
          {error} Use memberships or Message Rescue while checkout access refreshes.
        </p>
      )}
    </section>
  );
}
