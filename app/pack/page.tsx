import Link from "next/link";
import { Banknote, CheckCircle2, Crown, LineChart, Mail, MessageCircle, ReceiptText, ShieldCheck, Sparkles, Workflow } from "lucide-react";

export const metadata = {
  title: "Completion Pack | MindReply",
  description: "A private MindReply completion pack for delivery, receipts, revenue truth, promotion readiness, and the next useful move.",
};

const supportEmail = "info@mind-reply.com";
const transactionCount = process.env.NEXT_PUBLIC_PACK_TRANSACTION_COUNT || "0";
const revenueTotal = process.env.NEXT_PUBLIC_PACK_REVENUE_TOTAL || "$0";
const revenueNote = process.env.NEXT_PUBLIC_PACK_REVENUE_NOTE || "No connected transaction source yet.";
const reportEmails = `${process.env.MINDREPLY_REPORT_EMAILS || ""},${process.env.MINDREPLY_REPORT_EMAIL || ""}`.toLowerCase();
const slackReady = Boolean(process.env.MINDREPLY_SLACK_WEBHOOK_URL);
const agentCount = process.env.MINDREPLY_REPORT_AGENT_COUNT || "25";

const lanes = [
  {
    title: "Ask MRagent first",
    copy: "Start with the charged message or decision. MRagent reads the pressure, gives one clear move, and keeps the receipt narrow.",
    rhythm: "First step",
    icon: MessageCircle,
  },
  {
    title: "Use the contact route",
    copy: "If MRagent cannot solve the question, send it through the MindReply contact path or write to the public mailbox.",
    rhythm: "Escalate cleanly",
    icon: Mail,
  },
  {
    title: "Keep proof narrow",
    copy: "Reports show what moved, what is blocked, and what needs setup without exposing private wording.",
    rhythm: "Truth first",
    icon: ReceiptText,
  },
  {
    title: "Revenue truth",
    copy: "Transaction and revenue numbers stay tied to connected sources. If no source is connected, the page says so plainly.",
    rhythm: "No fake numbers",
    icon: Banknote,
  },
];

const signals = [
  "Public support now uses info@mind-reply.com only.",
  "User questions should start with MRagent before becoming contact requests.",
  "The pack reports delivery status and blockers without inventing outside activity.",
  "Revenue remains honest until a real transaction source is attached.",
];

const materials = [
  { label: "Website asset", value: "Full front end direction", icon: CheckCircle2 },
  { label: "Report asset", value: `${agentCount}-lane pack`, icon: Workflow },
  { label: "Revenue asset", value: "Annual and credit-load angles", icon: LineChart },
  { label: "Support path", value: supportEmail, icon: Mail },
];

function emailReady(email: string) {
  return reportEmails.includes(email.toLowerCase());
}

const delivery = [
  { label: "Public mailbox", value: supportEmail, icon: Mail, status: emailReady(supportEmail) ? "On" : "Needs setup" },
  { label: "MRagent route", value: "/agent", icon: MessageCircle, status: "On" },
  { label: "Contact form", value: "/contact", icon: Mail, status: "On" },
  { label: "Slack", value: "Connected destination required", icon: MessageCircle, status: slackReady ? "On" : "Needs setup" },
];

function statusClass(status: string) {
  if (status === "On") return "bg-[#2f6f52]/10 text-[#2f6f52]";
  return "bg-[#e2b757]/15 text-[#755d24]";
}

export default function CompletionPackPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#122033]">
      <section className="border-b border-[#122033]/10 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/agent" className="rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72]">
              MRagent
            </Link>
            <Link href="/contact" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1.02fr_0.98fr] md:px-8 md:py-12">
        <div className="flex min-h-[34rem] flex-col justify-between rounded-lg bg-[#122033] p-6 text-[#f8f5f0] shadow-2xl shadow-[#122033]/20 md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/30 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#e2b757]">
              <Crown aria-hidden className="h-4 w-4" />
              Completion Pack
            </div>
            <h1 className="mt-8 max-w-2xl font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              Ask MRagent first. Escalate only when needed.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#d9e3e7]">
              The pack keeps the path simple: use MRagent for the pressure read, then contact MindReply at {supportEmail} or through the contact form when the question needs human follow-up.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {materials.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">
                    <Icon aria-hidden className="h-4 w-4" />
                    {item.label}
                  </div>
                  <p className="mt-3 break-words text-sm font-semibold text-[#f8f5f0]">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <section className="rounded-lg border border-[#122033]/10 bg-white p-6 shadow-xl shadow-[#122033]/10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Revenue so far</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-[#f7f4ed] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#4d5c6f]"><ReceiptText aria-hidden className="h-4 w-4" /> Transactions</div>
                <p className="mt-3 font-serif text-5xl font-bold">{transactionCount}</p>
                <p className="mt-2 text-sm text-[#4d5c6f]">tracked</p>
              </div>
              <div className="rounded-lg bg-[#f7f4ed] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#4d5c6f]"><Banknote aria-hidden className="h-4 w-4" /> Revenue</div>
                <p className="mt-3 font-serif text-5xl font-bold">{revenueTotal}</p>
                <p className="mt-2 text-sm text-[#4d5c6f]">so far</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-6 text-[#59687b]">
              <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
              <span>{revenueNote}</span>
            </div>
          </section>

          <section className="rounded-lg border border-[#122033]/10 bg-white p-6 shadow-xl shadow-[#122033]/10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Support and delivery</p>
            <div className="mt-5 grid gap-3">
              {delivery.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={`${item.label}-${item.value}`} className="flex items-center justify-between gap-4 rounded-lg border border-[#122033]/10 bg-[#f7f4ed] p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#122033] text-[#e2b757]"><Icon aria-hidden className="h-4 w-4" /></span>
                      <div className="min-w-0">
                        <p className="font-semibold">{item.label}</p>
                        <p className="break-words text-sm text-[#4d5c6f]">{item.value}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${statusClass(item.status)}`}>{item.status}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Signal board</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">The pack reports what is real.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#59687b]">
              The useful version is not noise. It is prepared material, delivery status, blockers, proof, and one verified next task.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {signals.map((signal) => (
              <div key={signal} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#f7f4ed] p-4 text-sm leading-6 text-[#59687b]">
                <Sparkles aria-hidden className="mt-1 h-4 w-4 shrink-0 text-[#9b7430]" />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Four active lanes</p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {lanes.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] text-[#e2b757]"><Icon aria-hidden className="h-4 w-4" /></span>
                    <span className="rounded-full bg-[#f7f4ed] px-3 py-1 text-xs font-bold text-[#755d24]">{item.rhythm}</span>
                  </div>
                  <h2 className="mt-5 font-serif text-2xl font-bold leading-tight">{item.title}</h2>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
