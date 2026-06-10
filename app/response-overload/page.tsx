import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Gauge,
  LockKeyhole,
  Mail,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "Response Overload Rescue | MindReply",
  description:
    "Turn overloaded replies, client follow-ups, objections, and urgent message queues into one clear next move. Start free with MRagent, then buy credits, the GBP 600 Website Completion Package, Growth, or Pro only when the trigger is clear.",
  alternates: {
    canonical: "https://www.mind-reply.com/response-overload",
  },
};

const packagePaymentUrl = process.env.NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL || "";
const packageHref = packagePaymentUrl || "/contact?intent=website-completion";
const packageLabel = packagePaymentUrl ? "Pay for the GBP 600 package" : "Request GBP 600 invoice";

const painSignals = [
  "Client replies are taking too long because every answer needs judgement.",
  "The team has urgent messages, objections, and follow-ups but no clear order.",
  "The website or offer asks people to trust you before the buying path is clear.",
  "Sensitive wording needs restraint, not generic AI polish.",
];

const conversionPath = [
  {
    title: "Free MRagent read",
    copy: "Paste one stuck reply, follow-up, objection, or page section. Get one direct read and one safer move.",
    icon: MessageSquareText,
  },
  {
    title: "Credits",
    copy: "Use credits when several messages need quick pressure reads and send-ready polish.",
    icon: Zap,
  },
  {
    title: "GBP 600 package",
    copy: "Use the Website Completion Package when the homepage, offer, pricing, or contact route is leaking buyers.",
    icon: ReceiptText,
  },
  {
    title: "Growth or Pro",
    copy: "Move to Growth when overload repeats weekly. Move to Pro when approved memory, receipt review, or integration planning is needed.",
    icon: ShieldCheck,
  },
];

const trustRows = [
  "Raw private text is not used as public proof.",
  "Receipts use narrow markers and redacted summaries.",
  "Memory and integrations require approval before being claimed as active.",
  "Fixed-price and invoice paths stay visible before delivery starts.",
];

export default function ResponseOverloadPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/pricing" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              Pricing
            </Link>
            <Link href="/agent" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Try free
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e2b757]">
              <Gauge aria-hidden className="h-4 w-4" /> Response overload rescue
            </p>
            <h1 className="mt-7 max-w-4xl font-serif text-5xl font-bold leading-[0.96] md:text-7xl">
              Turn the message pile into one clear next move.
            </h1>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              MindReply is for overloaded operators, founders, and client-facing teams who need judgement before they reply. Start with one free MRagent read, then buy only when the next paid trigger is obvious.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Try MindReply Free <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <a href={packageHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                {packageLabel} <Mail aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">When this page should convert</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">The buyer has pressure, not time for a platform tour.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The offer is intentionally narrow: show useful judgement first, then point to the smallest paid option that fixes the real leak.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {painSignals.map((signal) => (
              <div key={signal} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b] shadow-sm shadow-[#122033]/5">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Paid path</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-5xl">Every purchase needs a trigger.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#59687b]">
              This keeps the page ad-ready: the user sees what to do first, what to buy next, and why the higher plan is not being pushed too early.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {conversionPath.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#122033] text-[#e2b757]">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl font-bold leading-tight">{item.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg bg-[#103b39] p-6 text-[#f8f5f0]">
            <div className="flex items-center gap-3 text-[#91d2c8]">
              <ClipboardList aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">First output</p>
            </div>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">One synthesis. One next move. One receipt marker.</h2>
            <p className="mt-4 text-sm leading-7 text-[#d3e5e2]">
              The first output should prove that MindReply understands the pressure without asking for setup, integrations, or a long onboarding call.
            </p>
          </div>
          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <div className="flex items-center gap-3 text-[#2f6f72]">
              <LockKeyhole aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Trust boundary</p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {trustRows.map((row) => (
                <div key={row} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-6 text-[#59687b]">
                  <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                  <span>{row}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
