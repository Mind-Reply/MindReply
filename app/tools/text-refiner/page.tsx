"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wand2, Copy, Check } from "lucide-react";
import CreditPurchasePanel from "@/components/CreditPurchasePanel";

export default function TextRefinerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefine = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/tools/text-refiner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      setOutput(data.result ?? "");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4" style={{ background: "hsl(40 20% 96%)" }}>
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity" style={{ color: "hsl(220 55% 20%)" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Text Refiner</h1>
            <p className="text-sm mt-1" style={{ color: "hsl(220 25% 45%)" }}>Instantly refine casual messages for professional contexts. (Costs 1 Credit)</p>
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: "hsl(43 80% 60% / 0.2)", color: "hsl(43 80% 40%)" }}>
            Credits Remaining: 4
          </div>
        </div>

        <div className="mb-6">
          <CreditPurchasePanel currentCost={1} compact context="Text Refiner" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white border rounded-xl p-6 shadow-sm" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "hsl(220 25% 45%)" }}>Original Draft</label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., hey, just checking in on that thing we talked about, let me know when you can chat."
              className="w-full h-64 p-4 rounded-lg border text-sm outline-none focus:ring-2 resize-none"
              style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }}
            />
            <button 
              onClick={handleRefine}
              disabled={isProcessing || !input.trim()}
              className="w-full mt-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}
            >
              {isProcessing ? "Analyzing Subconscious Tone..." : <><Wand2 size={16} /> Refine Text</>}
            </button>
          </div>

          {/* Output */}
          <div className="bg-white border rounded-xl p-6 shadow-sm relative" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "hsl(220 25% 45%)" }}>Refined Output</label>
            <div className="w-full h-64 p-4 rounded-lg border text-sm overflow-y-auto" style={{ borderColor: "hsl(40 25% 88%)", background: "hsl(40 20% 98%)", color: "hsl(220 45% 13%)" }}>
              {isProcessing ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "hsl(43 80% 60%)", borderTopColor: "transparent" }} />
                </div>
              ) : output ? (
                output
              ) : (
                <span className="opacity-50 italic">Refined professional text will appear here...</span>
              )}
            </div>
            {output && !isProcessing && (
              <button 
                onClick={copyToClipboard}
                className="absolute bottom-10 right-10 p-2 rounded-lg border shadow-sm hover:bg-gray-50 transition-colors"
                style={{ borderColor: "hsl(40 25% 88%)", background: "white" }}
              >
                {copied ? <Check size={16} style={{ color: "#10b981" }} /> : <Copy size={16} style={{ color: "hsl(220 55% 20%)" }} />}
              </button>
            )}
          </div>
        </div>

        {output && (
          <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <p className="text-sm font-bold" style={{ color: "hsl(220 45% 13%)" }}>Do not lose this momentum.</p>
            <p className="mt-1 text-sm" style={{ color: "hsl(220 25% 45%)" }}>Buy credits for repeated refinements, or upgrade to Growth when you want 30 days of memory instead of rebuilding context every time.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/tools" className="rounded-lg px-3 py-2 text-xs font-semibold" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>Buy credits on Tools</Link>
              <Link href="/memberships" className="rounded-lg border px-3 py-2 text-xs font-semibold" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }}>Compare Growth and Pro</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
