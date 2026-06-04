"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Send, Sparkles } from "lucide-react";

type Message = { role: "agent" | "user"; text: string };
type AgentAnalysis = {
  intent: string;
  emotionalValence: string;
  powerDistance: string;
  clarityFramework: string[];
};

const starter: Message = {
  role: "agent",
  text: "I am MR Agent. Share the outcome you need, the audience, and the draft you are working with. I will shape it into clear professional communication.",
};

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([starter]);
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<AgentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((current) => [...current, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      setAnalysis(data.analysis ?? null);
      setMessages((current) => [...current, { role: "agent", text: data.reply ?? "I have the context. Clarify the desired outcome and I will shape the next message." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-20 min-h-screen" style={{ background: "hsl(40 33% 97%)" }}>
      <section className="py-14 px-4" style={{ background: "hsl(220 55% 20%)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(43 80% 60%)" }}>MR Agent</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: "hsl(43 70% 88%)" }}>Communication Intelligence Assistant</h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "rgba(248,245,240,0.72)" }}>Draft, refine, and structure high-stakes messages with subconscious analysis, power-distance awareness, and clear behavioral intent.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}><Bot size={20} /></span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "hsl(220 45% 13%)" }}>MR Agent</p>
                  <p className="text-xs" style={{ color: "hsl(220 25% 45%)" }}>Online with production fallback intelligence</p>
                </div>
              </div>
              <Link href="/professionals" className="hidden sm:inline-flex text-xs font-semibold px-3 py-2 rounded-lg border" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 55% 20%)" }}>Find a professional</Link>
            </div>

            <div className="h-[460px] overflow-y-auto p-5 space-y-4" style={{ background: "hsl(40 20% 96%)" }}>
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed" style={message.role === "agent" ? { background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" } : { background: "white", color: "hsl(220 45% 13%)", border: "1px solid hsl(40 25% 88%)" }}>
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-sm" style={{ color: "hsl(220 25% 45%)" }}>MR Agent is analyzing intent, valence, and power distance...</div>}
            </div>

            <div className="p-4 border-t" style={{ borderColor: "hsl(40 25% 88%)" }}>
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask for help with an email, booking, or message..." className="flex-1 rounded-lg border px-3 py-3 text-sm outline-none focus:border-[hsl(43_80%_60%)]" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }} />
                <button onClick={send} disabled={loading || !input.trim()} className="px-4 rounded-lg flex items-center gap-2 text-sm font-semibold hover:opacity-90 disabled:opacity-40" style={{ background: "hsl(43 80% 60%)", color: "hsl(220 45% 13%)" }}><Send size={16} /> Send</button>
              </div>
            </div>
          </div>

          <aside className="bg-white border rounded-2xl p-5 h-fit" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "hsl(43 80% 45%)" }}><Sparkles size={13} /> Live Analysis</p>
            {analysis ? (
              <div className="space-y-4">
                {[
                  ["Intent", analysis.intent],
                  ["Emotional Valence", analysis.emotionalValence],
                  ["Power Distance", analysis.powerDistance],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs mb-1" style={{ color: "hsl(220 25% 45%)" }}>{label}</p>
                    <p className="text-sm font-semibold capitalize" style={{ color: "hsl(220 45% 13%)" }}>{value.replace(/_/g, " ")}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs mb-2" style={{ color: "hsl(220 25% 45%)" }}>Clarity Framework</p>
                  <ul className="space-y-2">
                    {analysis.clarityFramework.map((item) => (
                      <li key={item} className="text-xs flex gap-2" style={{ color: "hsl(220 45% 13%)" }}><span style={{ color: "hsl(43 80% 45%)" }}>-</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>Send a message to surface intent, emotional valence, power distance, and the communication framework.</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
