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

export const metadata = {
  title: "Website Completion Package | MindReply",
  description:
    "A GBP 600 buying-friction rescue for overloaded websites, offers, replies, and follow-up paths. Request invoice-first scope through MindReply.",
  alternates: {
    canonical: "https://www.mind-reply.com/website-completion-package",
  },
  openGraph: {
    title: "Website Completion Package | MindReply",
    description:
      "MindReply turns overloaded website messaging into a ranked action queue, send-ready copy, and a privacy-safe receipt.",
    url: "https://www.mind-reply.com/website-completion-package",
    siteName: "MindReply",
    type: "website",
  },
};

const packagePaymentUrl = process.env.NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL || "";
const packageCtaHref = packagePaymentUrl || "/contact?intent=website-completion";
const packageCtaLabel = packagePaymentUrl ? "Pay for package" : "Request invoice";
const packagePaymentStatus = packagePaymentUrl ? "Direct payment link configured" : "Invoice-first request path active";
const routeExplainer = packagePaymentUrl
  ? "Scope is confirmed before the configured payment link is used, so the buyer still knows what will be delivered."
  : "No payment link is required to begin. MindReply confirms scope, collects billing name and billing email, then routes the GBP 600 invoice before delivery.";

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

const closeChecks = [
  "Scope first, invoice/payment before delivery.",
  "Billing name and billing email are collected before the invoice route.",
  "Owner evidence stays private unless explicitly approved for public proof.",
];

const receiptRows = [
  { label: "actionKind", value: "website-completion" },
  { label: "riskLevel", value: "low-to-medium, depending on claims and sensitive context" },
  { label: "confidence", value: "medium until the owner accepts scope and payment route" },
  { label: "paymentPath", value: "invoice-first unless a configured direct payment link is present" },
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

const buyerProofChecklist = [
  "The buyer can inspect the GBP 600 price before sending private context.",
  "The buyer can choose invoice-first when a direct payment link is not configured.",
  "The buyer can see what is processed: messaging, offer, trust, and path to pay.",
  "The buyer can see what is returned: ranked queue, send-ready copy, and receipt.",
  "The buyer can see what is protected: raw sensitive text stays out of public proof.",
];

const outboundDms = [
  { label: "DM 1", copy: "Your offer is close, but the page is asking the buyer to think too hard. I can turn it into a ranked action queue and one send-ready close path." },
  { label: "DM 2", copy: "I would not start with a redesign. I would fix the exact point where a serious buyer loses the next step." },
  { label: "DM 3", copy: "Your product looks useful. The buying path needs sharper proof, price clarity, and one calmer route to act." },
  { label: "DM 4", copy: "If the page is getting attention but not decisions, MindReply can compress the offer into the next paid move without adding noise." },
  { label: "DM 5", copy: "Send the page or reply that is slowing the sale. I will return the friction list, the next wording, and what should be protected." },
];

const coldEmails = [
  {
    subject: "Your page is explaining more than it is closing",
    body: "I noticed the offer has enough substance, but the next buying step is not doing enough work. MindReply can turn the current page into a Website Completion Package: ranked friction, send-ready copy, trust proof, and a clear checkout or invoice route.",
  },
  {
    subject: "One focused rescue pass for the buying path",
    body: "This is not a redesign pitch. It is a GBP 600 pass to find where buyers hesitate, rewrite the pressure points, and return a privacy-safe receipt showing what changed and what still needs a decision.",
  },
  {
    subject: "A faster way to make the offer inspectable",
    body: "High-trust buyers need price, proof, scope, and privacy boundaries before they share context. MindReply packages those pieces into one clear path so the page can move from interest to action.",
  },
];

const followUps = [
  { label: "Follow-up 1", copy: "Worth doing only if the page is already getting qualified attention. The package is meant to remove buying friction, not decorate the site." },
  { label: "Follow-up 2", copy: "The smallest useful next step is to send the page, offer block, or reply path that feels stuck. I will return the ranked friction and the close-ready move." },
];

const objectionResponses = [
  {
    objection: "We do not need a redesign.",
    response: "Correct. The package is not sold as a redesign. It fixes clarity, proof, pricing route, and next-step copy where the buyer hesitates.",
  },
  {
    objection: "We are not ready to share sensitive details.",
    response: "Start with the public page or a redacted sample. Raw private input is not used as public proof, and the receipt can stay privacy-safe.",
  },
  {
    objection: "Why pay before seeing the work?",
    response: "Use MRagent first for the free read. Buy the package only when the first output proves the friction is real and the fixed path is worth completing.",
  },
  {
    objection: "Is this for startups or service businesses?",
    response: "Use it when a buyer must understand scope, proof, price, and next action quickly. That applies to operators, consultants, agencies, founders, and client-facing teams.",
  },
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
            <p className="mt-4 text-sm font-semibold leading-7 text-[#91d2c8]">{packagePaymentStatus}.</p>
            <p className="mt-3 text-sm leading-7 text-[#d9e3e7]">
              {routeExplainer} Keep revenue claims tied to verified payment or invoice sources before calling anything sold, recurring, or booked.
            </p>
            <div className="mt-5 grid gap-3">
              {closeChecks.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-3 text-sm leading-6 text-[#d9e3e7]">
                  <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#e2b757]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
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

      <section className="border-b border-[#122033]/10 bg-[#fbfaf6] px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Buyer proof checklist</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">The package must feel inspectable before payment.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              This is the credibility layer for the GBP 600 offer: clear price, clear route, clear output, and a clean privacy boundary.
            </p>
          </div>
          <div className="grid gap-3">
            {buyerProofChecklist.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b] shadow-sm shadow-[#122033]/5">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{item}</span>
              </div>
            ))}
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
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <div className="flex items-center gap-3 text-[#2f6f72]">
              <FileText aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Assisted-close assets</p>
            </div>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">Use these when a buyer is interested but the next move is soft.</h2>
            <p className="mt-4 text-sm leading-7 text-[#59687b]">
              The outreach stays direct: name the leak, offer one focused rescue, and keep sensitive proof private until the buyer chooses scope.
            </p>
            <div className="mt-6 grid gap-3">
              {outboundDms.map((asset) => (
                <p key={asset.label} className="rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-7 text-[#59687b]">
                  <span className="font-bold text-[#122033]">{asset.label}: </span>
                  {asset.copy}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-[#122033] p-6 text-[#f8f5f0]">
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

      <section className="border-t border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Cold email set</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Three emails for buyers who need proof before a call.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              Each email sells the smallest paid move: fix the buying path, return proof, and keep claims tied to verified sources.
            </p>
          </div>
          <div className="grid gap-4">
            {coldEmails.map((email) => (
              <article key={email.subject} className="rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2f6f72]">Subject</p>
                <h3 className="mt-2 font-serif text-2xl font-bold leading-tight">{email.subject}</h3>
                <p className="mt-4 text-sm leading-7 text-[#59687b]">{email.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#122033]/10 bg-[#f7f4ed] px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2f6f72]">Two follow-ups</p>
            <div className="mt-6 grid gap-3">
              {followUps.map((item) => (
                <p key={item.label} className="rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-7 text-[#59687b]">
                  <span className="font-bold text-[#122033]">{item.label}: </span>
                  {item.copy}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7430]">Objection handling</p>
            <div className="mt-6 grid gap-3">
              {objectionResponses.map((item) => (
                <div key={item.objection} className="rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4">
                  <p className="font-serif text-xl font-bold leading-tight">{item.objection}</p>
                  <p className="mt-3 text-sm leading-7 text-[#59687b]">{item.response}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
