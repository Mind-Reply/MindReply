"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MessageCircle, Send, X } from "lucide-react";

type Msg = { role: "agent" | "user"; text: string };

const GREET: Msg = {
  role: "agent",
  text: "Good day. I am MR Agent, your behavioral intelligence concierge. How can I assist you today?",
};

const SUGGESTIONS = ["Find me a communication coach", "What tools do you offer?", "Tell me about membership", "Book a legal consultation"];

export default function MRAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREET]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  async function send(text: string) {
    const message = text.trim();
    if (!message || typing) return;

    setMessages((current) => [...current, { role: "user", text: message }]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setMessages((current) => [...current, { role: "agent", text: data.reply ?? "I have the context. Clarify the desired outcome and I will shape the next move." }]);
    } catch {
      setMessages((current) => [...current, { role: "agent", text: "I have the context. State the desired outcome, recipient, and time sensitivity, then I will refine the communication path." }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:opacity-90 transition-all ${open ? "hidden" : "flex"}`} style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white animate-pulse" style={{ background: "hsl(43 80% 60%)" }} />
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[hsl(40_25%_88%)]" style={{ maxHeight: "520px", background: "hsl(0 0% 100%)" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: "hsl(220 55% 20%)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ background: "rgba(201,169,97,0.2)", borderColor: "rgba(201,169,97,0.4)" }}>
                <span className="font-serif font-bold text-sm" style={{ color: "hsl(43 80% 60%)" }}>MR</span>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "hsl(43 70% 88%)" }}>MR Agent</p>
                <p className="text-xs flex items-center gap-1" style={{ color: "hsl(43 80% 60%)" }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: "#34d399" }} /> Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="opacity-60 hover:opacity-100" style={{ color: "hsl(43 70% 88%)" }}><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "hsl(40 20% 92% / 0.3)" }}>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === "agent" ? "rounded-tl-sm" : "rounded-tr-sm border border-[hsl(40_25%_88%)]"}`} style={message.role === "agent" ? { background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" } : { background: "white", color: "hsl(220 45% 13%)" }}>
                  {message.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5" style={{ background: "hsl(220 55% 20%)" }}>
                  <span className="flex gap-1 items-center h-4">
                    {[0, 150, 300].map((delay) => <span key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "hsl(43 70% 88%)", animationDelay: `${delay}ms` }} />)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pt-1 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} onClick={() => send(suggestion)} className="text-xs px-2.5 py-1 rounded-full border hover:border-[hsl(43_80%_60%)] hover:text-[hsl(43_80%_60%)] transition-colors" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }}>{suggestion}</button>
              ))}
            </div>
          )}

          <div className="px-3 py-1.5 border-t border-[hsl(40_25%_88%)] flex gap-2 text-xs">
            {[["Professionals", "/professionals"], ["Tools", "/tools"], ["Membership", "/memberships"]].map(([label, href]) => (
              <Link key={href} href={href} className="flex items-center gap-0.5 text-[hsl(220_25%_45%)] hover:text-[hsl(220_55%_20%)] transition-colors">{label} <ChevronRight size={10} /></Link>
            ))}
          </div>

          <div className="p-3 border-t border-[hsl(40_25%_88%)]">
            <div className="flex gap-2">
              <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send(input)} placeholder="Ask MR Agent..." className="flex-1 text-sm rounded-lg px-3 py-2 outline-none border border-[hsl(40_25%_88%)] focus:border-[hsl(43_80%_60%)] transition-colors" style={{ background: "hsl(40 20% 92%)" }} />
              <button onClick={() => send(input)} disabled={!input.trim() || typing} className="px-3 py-2 rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
