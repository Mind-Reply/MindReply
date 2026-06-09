import Link from "next/link";
import { Banknote, Bell, Crown, Gem, Gift, Mail, MessageCircle, ReceiptText, ShieldCheck, Sparkles, TicketCheck } from "lucide-react";

export const metadata = {
  title: "Personal Pack | MindReply",
  description: "A private MindReply pack for delivery, receipts, revenue truth, and the next useful move.",
};

const transactionCount = process.env.NEXT_PUBLIC_PACK_TRANSACTION_COUNT || "0";
const revenueTotal = process.env.NEXT_PUBLIC_PACK_REVENUE_TOTAL || "$0";
const revenueNote = process.env.NEXT_PUBLIC_PACK_REVENUE_NOTE || "No connected transaction source yet.";
const reportEmails = `${process.env.MINDREPLY_REPORT_EMAILS || ""},${process.env.MINDREPLY_REPORT_EMAIL || ""}`.toLowerCase();
const slackReady = Boolean(process.env.MINDREPLY_SLACK_WEBHOOK_URL);

const lanes = [
  {
    title: "Mind Read Pulse",
    copy: "Reads the pressure, names the calmer move, and keeps the receipt quiet.",
    rhythm: "Every pack cycle",
    icon: Bell,
  },
  {
    title: "Delivery Ribbon",
    copy: "Sends the update to email and Slack when the private delivery keys are present.",
    rhythm: "Phone-first",
    icon: MessageCircle,
  },
  {
    title: "Receipt Keeper",
    copy: "Keeps the proof of what moved without exposing raw pressure or storage links.",
    rhythm: "Private record",
    icon: ReceiptText,
  },
  {
    title: "Revenue Ledger",
    copy: "Shows transaction count and revenue only when a real source is connected.",
    rhythm: "Truth only",
    icon: Banknote,
  },
];

const signals = [
  "Front door language now speaks in pressure, posture, and grace.",
  "MRagent session copy is calmer, more exact, and less familiar.",
  "Reports name delivery status instead of implying private channels are already live.",
  "Revenue remains honest until a real transaction source is attached.",
];

function emailReady(email: string) {
  return reportEmails.includes(email.toLowerCase());
}

const delivery = [
  { label: "Gmail", value: "angelllkr@gmail.com", icon: Mail, status: emailReady("angelllkr@gmail.com") ? "On" : "Needs setup" },
  { label: "MindReply", value: "Info@mind-reply.com", icon: Mail, status: emailReady("Info@mind-reply.com") ? "On" : "Needs setup" },
  { label: "Slack", value: "angelllkr@gmail.com", icon: MessageCircle, status: slackReady ? "On" : "Needs setup" },
];

const gifts = ["Presence receipt", "One useful line", "Pack win", "Next move"];

function statusClass(status: string) {
  if (status === "On") return "bg-[#2f6f52]/10 text-[#2f6f52]";
  return "bg-[#e2b757]/15 text-[#755d24]";
}

export default function PersonalPackPage() {
  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#162033]">
      <section className="border-b border-[#162033]/10 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#162033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/agent" className="rounded-full border border-[#162033]/15 px-4 py-2 text-sm font-semibold text-[#162033] transition hover:border-[#e2b757]">
              MRagent
            </Link>
            <Link href="/" className="rounded-full bg-[#162033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#22314d]">
              Home
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-12">
        <div className="flex min-h-[36rem] flex-col justify-between rounded-2xl bg-[#162033] p-6 text-[#f8f5f0] shadow-2xl shadow-[#162033]/20 md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/30 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#e2b757]">
              <Crown aria-hidden className="h-4 w-4" />
              Personal Pack
            </div>
            <h1 className="mt-8 max-w-2xl font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              It reaches you. It stays yours.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#d8deea]">
              A private front room for MindReply: what moved, where it landed, what it earned, and what deserves your next bit of attention.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {gifts.map((gift) => (
              <div key={gift} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold text-[#d8deea]">
                <Gift aria-hidden className="h-4 w-4 text-[#e2b757]" />
                {gift}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <section className="rounded-2xl border border-[#162033]/10 bg-[#fffaf0] p-6 shadow-xl shadow-[#162033]/10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Revenue so far</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-5 shadow-sm shadow-[#162033]/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#4c5a70]"><TicketCheck aria-hidden className="h-4 w-4" /> Transactions</div>
                <p className="mt-3 font-serif text-5xl font-bold">{transactionCount}</p>
                <p className="mt-2 text-sm text-[#4c5a70]">tracked</p>
              </div>
              <div className="rounded-xl bg-white p-5 shadow-sm shadow-[#162033]/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#4c5a70]"><Gem aria-hidden className="h-4 w-4" /> Revenue</div>
                <p className="mt-3 font-serif text-5xl font-bold">{revenueTotal}</p>
                <p className="mt-2 text-sm text-[#4c5a70]">so far</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#162033]/10 bg-white p-4 text-sm leading-6 text-[#4c5a70]">
              <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f52]" />
              <span>{revenueNote}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-[#162033]/10 bg-white p-6 shadow-xl shadow-[#162033]/10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Delivery</p>
            <div className="mt-5 grid gap-3">
              {delivery.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={`${item.label}-${item.value}`} className="flex items-center justify-between gap-4 rounded-xl border border-[#162033]/10 bg-[#f8f5f0] p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#162033] text-[#e2b757]"><Icon aria-hidden className="h-4 w-4" /></span>
                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-[#4c5a70]">{item.value}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${statusClass(item.status)}`}>{item.status}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-[#162033]/10 bg-[#fffaf0] px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Signal board</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">The pack does not perform. It reports.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#4c5a70]">
              This surface is built to keep your presence intact: no false numbers, no noisy control room, no public theater around private work.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {signals.map((signal) => (
              <div key={signal} className="flex gap-3 rounded-xl border border-[#162033]/10 bg-white p-4 text-sm leading-6 text-[#4c5a70] shadow-sm shadow-[#162033]/5">
                <Sparkles aria-hidden className="mt-1 h-4 w-4 shrink-0 text-[#9b7430]" />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Four quiet lanes</p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {lanes.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-[#162033]/10 bg-white p-5 shadow-sm shadow-[#162033]/5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#162033] text-[#e2b757]"><Icon aria-hidden className="h-4 w-4" /></span>
                    <span className="rounded-full bg-[#f4efe4] px-3 py-1 text-xs font-bold text-[#755d24]">{item.rhythm}</span>
                  </div>
                  <h2 className="mt-5 font-serif text-2xl font-bold leading-tight">{item.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-[#4c5a70]">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
