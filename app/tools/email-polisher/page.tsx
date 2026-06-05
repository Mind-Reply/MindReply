"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Mail, Send } from "lucide-react";
import CreditPurchasePanel from "@/components/CreditPurchasePanel";

export default function EmailPolisherPage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function polish() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/tools/email-polisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });
      const data = await response.json();
      setResult(data.result ?? "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4" style={{ background: "hsl(40 20% 96%)" }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70" style={{ color: "hsl(220 55% 20%)" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Email Polisher</h1>
            <p className="text-sm mt-1" style={{ color: "hsl(220 25% 45%)" }}>Transform rough email drafts into executive-grade correspondence.</p>
          </div>
          <span className="hidden sm:flex w-12 h-12 rounded-xl items-center justify-center" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}><Mail size={20} /></span>
        </div>

        <div className="mb-6">
          <CreditPurchasePanel currentCost={2} compact context="Email Polisher" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "hsl(220 25% 45%)" }}>Draft Email</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 p-4 rounded-lg border text-sm outline-none focus:border-[hsl(43_80%_60%)] resize-none" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }} placeholder="Paste your rough email draft here." />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-lg border px-3 py-3 text-sm outline-none" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }}>
                {["professional", "warm", "assertive", "empathetic", "concise", "diplomatic"].map((value) => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}
              </select>
              <button onClick={polish} disabled={loading || !text.trim()} className="flex-1 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
                <Send size={16} /> {loading ? "Polishing..." : "Polish Email"}
              </button>
            </div>
          </section>

          <section className="bg-white border rounded-xl p-6 shadow-sm relative" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "hsl(220 25% 45%)" }}>Polished Output</label>
            <div className="w-full h-64 p-4 rounded-lg border text-sm overflow-y-auto whitespace-pre-line" style={{ borderColor: "hsl(40 25% 88%)", background: "hsl(40 20% 98%)", color: "hsl(220 45% 13%)" }}>
              {result || <span className="opacity-50 italic">Your polished email will appear here.</span>}
            </div>
            {result && (
              <button onClick={() => navigator.clipboard.writeText(result)} className="absolute bottom-10 right-10 p-2 rounded-lg border shadow-sm hover:bg-gray-50" style={{ borderColor: "hsl(40 25% 88%)", background: "white" }}>
                <Copy size={16} style={{ color: "hsl(220 55% 20%)" }} />
              </button>
            )}
          </section>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <p className="text-sm font-bold" style={{ color: "hsl(220 45% 13%)" }}>This is the upgrade moment.</p>
            <p className="mt-1 text-sm" style={{ color: "hsl(220 25% 45%)" }}>If polished email saves a senior conversation, Growth gives repeat credits and memory. Pro adds unlimited memory plus Slack, Gmail, and Notion so this becomes daily workflow, not a one-off tool.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/tools" className="rounded-lg px-3 py-2 text-xs font-semibold" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>Buy credits on Tools</Link>
              <Link href="/memberships" className="rounded-lg border px-3 py-2 text-xs font-semibold" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }}>Upgrade to Growth or Pro</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
