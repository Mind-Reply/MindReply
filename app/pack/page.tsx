import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  ClipboardList,
  FileText,
  LockKeyhole,
  Mail,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

export const metadata = {
  title: "Website Completion Package | MindReply",
  description:
    "A GBP 600 MindReply package for overloaded website messaging, ranked action plans, send-ready copy, and privacy-safe receipts.",
};

const supportEmail = "info@mind-reply.com";
const transactionCount = process.env.NEXT_PUBLIC_PACK_TRANSACTION_COUNT || "0";
const revenueTotal = process.env.NEXT_PUBLIC_PACK_REVENUE_TOTAL || "GBP 0";
const revenueNote = process.env.NEXT_PUBLIC_PACK_REVENUE_NOTE || "No connected transaction source yet. Revenue is not claimed until a real source is attached.";

const packageRows = [
  {
    title: "Messaging rescue",
    value: "GBP 200",
    copy: "The overloaded homepage, offer, FAQ, and contact language are read as one buyer journey and rewritten for clarity.",
    icon: FileText,
  },
  {
    title: "Ranked action plan",
    value: "GBP 200",
    copy: "The buyer receives the exact order of fixes: what removes confusion, what builds trust, and what should be shipped first.",
    icon: ClipboardList,
  },
  {
    title: "Copy, consent, receipt",
    value: "GBP 200",
    copy: "Delivery includes send-ready website copy, reply or next-step structure, memory consent wording, and a privacy-safe processing receipt.",
    icon: ReceiptText,
  },
];

const deliverables = [
  "One visible reply artifact or website copy pass that can be used immediately.",
  "One ranked action queue separating urgent fixes from optional polish.",
  "One trust and privacy note that keeps raw sensitive content out of public reporting.",
  "One assisted-close route: MRagent first, then contact if the question needs human follow-up.",
];

const boundaries = [
  "Public contact stays on info@mind-reply.com.",
  "No personal owner inbox is printed on public pages.",
  "Revenue numbers stay tied to connected payment or invoice sources.",
  "Slack, email, and memory expansion require approved credentials and consent before being described as active for a buyer.",
];

const sequence = [
  {
    title: "Pressure read",
    copy: "Start with MRagent. Paste the messy website note, client pressure, inbox pile, or unclear reply and get one composed read.",
    icon: MessageCircle,
  },
  {
    title: "Package handoff",
    copy: "If the issue is broader than one message, request the Website Completion Package through the contact page or public mailbox.",
    icon: Mail,
  },
  {
    title: "Delivery receipt",
    copy: "The output is a neutral completion bundle: copy, queue, next move, consent wording, and a narrow receipt.",
    icon: ShieldCheck,
  },
];

export default function CompletionPackPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#122033]">
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
            <Link href="/contact?intent=website-completion" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Request package
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/30 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" />
              Paid entry offer
            </div>
            <h1 className="mt-8 max-w-3xl font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              Website Completion Package.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              A GBP 600 fixed-scope rescue for overloaded website messaging, scattered launch notes, reply pressure, and unclear next steps. Buy clarity, not technology theatre.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#91d2c8]">Package total</p>
            <p className="mt-4 font-serif text-6xl font-bold">GBP 600</p>
            <p className="mt-4 text-sm leading-7 text-[#d3e5e2]">
              Three rows, one action queue, one copy artifact, one privacy-safe receipt. Start with MRagent if you want to test the relief first.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Try MRagent <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link href="/contact?intent=website-completion" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                Request package <Mail aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {packageRows.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-[#122033]/10 bg-white p-6 shadow-sm shadow-[#122033]/5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#122033] text-[#e2b757]"><Icon aria-hidden className="h-5 w-5" /></span>
                    <span className="rounded-full bg-[#f8f4ec] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2f6f72]">{item.value}</span>
                  </div>
                  <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">{item.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#59687b]">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Delivery bundle</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">What the buyer gets</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The package is meant to be tangible. It should resolve a queue, sharpen an offer, and create a paper trail without exposing private material.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {deliverables.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-4 text-sm leading-6 text-[#59687b]">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg bg-[#103b39] p-6 text-[#f8f5f0]">
            <div className="flex items-center gap-3 text-[#91d2c8]">
              <Workflow aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">How it sells</p>
            </div>
            <div className="mt-6 grid gap-4">
              {sequence.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-3">
                      <Icon aria-hidden className="h-5 w-5 text-[#e2b757]" />
                      <h3 className="font-serif text-2xl font-bold">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#d3e5e2]">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <div className="flex items-center gap-3 text-[#9b7430]">
              <Banknote aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Revenue truth</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-[#f8f4ec] p-5">
                <p className="text-sm font-semibold text-[#4d5c6f]">Transactions tracked</p>
                <p className="mt-3 font-serif text-5xl font-bold">{transactionCount}</p>
              </div>
              <div className="rounded-lg bg-[#f8f4ec] p-5">
                <p className="text-sm font-semibold text-[#4d5c6f]">Revenue tracked</p>
                <p className="mt-3 font-serif text-5xl font-bold">{revenueTotal}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-6 text-[#59687b]">
              <LockKeyhole aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#d96f4a]" />
              <span>{revenueNote}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#122033]/10 bg-[#fbfaf6] px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Trust boundaries</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Warm sales, strict claims.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {boundaries.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b]">
                <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-[#122033] p-6 text-[#f8f5f0] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91d2c8]">Ready route</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">Ask MRagent first. If the website needs a full rescue, request the package.</h2>
          </div>
          <Link href="/contact?intent=website-completion" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
            Contact MindReply <Mail aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
