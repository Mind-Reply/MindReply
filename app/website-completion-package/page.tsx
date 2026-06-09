import Link from "next/link";
import {
  ArrowRight,
  BadgePoundSterling,
  CheckCircle2,
  ClipboardList,
  FileText,
  LockKeyhole,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";

const packagePaymentUrl = process.env.NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL || "";
const packageCtaHref = packagePaymentUrl || "/contact?intent=website-completion";
const packageCtaLabel = packagePaymentUrl ? "Pay for package" : "Request invoice";
const packagePaymentStatus = packagePaymentUrl ? "Direct payment link configured" : "Invoice request path active";

const outcomes = [
  "A ranked action queue for the most urgent website, message, reply, or follow-up friction.",
  "Send-ready copy for the next step: page section, reply, offer block, or assisted-close note.",
  "A concise receipt showing what was processed, what changed, and what remains blocked.",
];

const proofRows = [
  { label: "Processed", value: "messaging, offer, trust, path to pay", icon: ClipboardList },
  { label: "Returned", value: "ranked queue plus send-ready copy", icon: MessageSquareText },
  { label: "Receipt", value: "privacy-safe summary, not raw sensitive text", icon: ReceiptText },
];

const receiptRows = [
  { label: "actionKind", value: "website-completion" },
  { label: "riskLevel", value: "low-to-medium, depending on claims and sensitive context" },
  { label: "confidence", value: "medium until the owner accepts scope and payment route" },
  { label: "rawContentRedacted", value: "true" },
  { label: "inputHash", value: "present; raw text absent" },
  { label: "ownerDecisionNeeded", value: "confirm scope, route invoice or payment link, approve the next close-ready move" },
];

const ladder = [
  { title: "Free first output", copy: "Use MRagent to prove relief before checkout." },
  { title: "Website Completion Package", copy: "Buy one focused rescue pass when the site or offer is blocking action." },
  { title: "Growth", copy: "Move into recurring support when the overload repeats every week." },
  { title: "Pro", copy: "Add continuity, approved integrations, and deeper communication intelligence when the work is persistent." },
];

const trust = [
  "Raw private input is not used as public proof.",
  "Memory and continuity require consent.",
  "Sensitive work can be handled through assisted close instead of forcing self-serve checkout.",
  "Revenue and conversion claims stay tied to verified sources only.",
];

const assets = [
  "LinkedIn opener: Your site already has the product. The leak is the buying path. I can turn the current page into a ranked action queue and send-ready close copy.",
  "Cold email opener: I noticed the offer is doing more explaining than closing. MindReply can compress the next buying step into a Website Completion Package.",
  "Follow-up line: The goal is not a redesign. It is one clear path from pressure to purchase, with a receipt for what changed.",
];

export default function WebsiteCompletionPackagePage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/agent" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              MRagent
            </Link>
            <a href={packageCtaHref} className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              {packageCtaLabel}
            </a>
          </nav>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" /> First paid offer
            </p>
            <h1 className="mt-7 font-serif text-5xl font-bold leading-[0.96] md:text-7xl">Website Completion Package</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              A focused GBP 600 rescue pass for overloaded websites, offers, replies, and follow-ups. MindReply turns scattered pressure into a ranked action queue, send-ready copy, and a narrow receipt.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#91d2c8]">Price and route</p>
            <div className="mt-4 flex items-end gap-3">
              <BadgePoundSterling aria-hidden className="mb-2 h-8 w-8 text-[#e2b757]" />
              <p className="font-serif text-5xl font-bold">GBP 600</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#d9e3e7]">
              {packagePaymentStatus}. Keep revenue claims tied to verified payment or invoice sources before calling anything sold, recurring, or booked.
            </p>
            <a href={packageCtaHref} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
              {packageCtaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">What the buyer gets</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Not a redesign. A buying-friction rescue.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The package is for founders, operators, consultants, and client-facing teams who already have something real, but the page, offer, or follow-up path is leaking clarity.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {proofRows.map((row) => {
              const Icon = row.icon;
              return (
                <article key={row.label} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                  <Icon aria-hidden className="h-6 w-6 text-[#2f6f72]" />
                  <h3 className="mt-4 font-serif text-2xl font-bold">{row.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#59687b]">{row.value}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg bg-[#103b39] p-6 text-[#f8f5f0]">
            <div className="flex items-center gap-3 text-[#91d2c8]">
              <Timer aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Delivery outcome</p>
            </div>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">The buyer leaves with the next move already shaped.</h2>
            <div className="mt-6 grid gap-3">
              {outcomes.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-[#d3e5e2]">
                  <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#e2b757]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#122033]/10 bg-[#f7f4ed] p-6">
            <div className="flex items-center gap-3 text-[#2f6f72]">
              <ShieldCheck aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Trust proof</p>
            </div>
            <div className="mt-6 grid gap-3">
              {trust.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b]">
                  <LockKeyhole aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#91d2c8]">Sample delivery receipt</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">This is the proof object, not a vague strategy note.</h2>
            <p className="mt-5 text-sm leading-7 text-[#d9e3e7]">
              The buyer should be able to inspect what was processed, what was withheld, what decision is needed, and where the payment path stands.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {receiptRows.map((row) => (
              <div key={row.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2b757]">{row.label}</p>
                <p className="mt-3 text-sm leading-6 text-[#d3e5e2]">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Commercial ladder</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Free relief first. Paid continuity after proof.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ladder.map((step) => (
              <article key={step.title} className="rounded-lg border border-[#122033]/10 bg-white p-5">
                <h3 className="font-serif text-2xl font-bold leading-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#59687b]">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <div className="flex items-center gap-3 text-[#2f6f72]">
              <FileText aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Assisted-close assets</p>
            </div>
            <div className="mt-6 grid gap-3">
              {assets.map((asset) => (
                <p key={asset} className="rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-7 text-[#59687b]">{asset}</p>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-[#122033] p-6 text-[#f8f5f0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#91d2c8]">Booking page line</p>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">Bring the page, message, or follow-up that is leaking the sale.</h2>
            <p className="mt-4 text-sm leading-7 text-[#d9e3e7]">
              MindReply returns a ranked action queue, one send-ready asset, and a narrow receipt so the next commercial move is visible.
            </p>
            <a href={packageCtaHref} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
              {packageCtaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
