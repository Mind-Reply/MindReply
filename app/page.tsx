import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gauge,
  HeartHandshake,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import MRAgentChat from "@/components/MRAgentChat";

const supportEmail = "info@mind-reply.com";
const packagePaymentUrl = process.env.NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL || "";
const packageCtaHref = packagePaymentUrl || "/contact?intent=website-completion";
const packageCtaLabel = packagePaymentUrl ? "Pay for the package" : "Request invoice";
const packageRouteLabel = packagePaymentUrl ? "Direct payment enabled" : "Invoice request ready";

const navItems = [
  { label: "Offer", href: "#offer" },
  { label: "Authority", href: "#authority" },
  { label: "Proof", href: "#proof" },
  { label: "Pricing", href: "/pricing" },
];

const packageRows = [
  {
    title: "Overloaded website messaging",
    value: "GBP 200",
    copy: "The scattered homepage, offer, and contact story are read as one commercial system, then tightened into buyer-ready language.",
    icon: Brain,
  },
  {
    title: "Ranked action queue",
    value: "GBP 200",
    copy: "You receive the next fixes in commercial order: what removes confusion, what builds trust, and what pushes the visitor toward action.",
    icon: ClipboardList,
  },
  {
    title: "Send-ready copy and receipt",
    value: "GBP 200",
    copy: "The package includes usable website copy, a reply or next-step structure, memory consent wording, and a privacy-safe receipt.",
    icon: ReceiptText,
  },
];

const authoritySignals = [
  {
    title: "Discipline-specific language",
    copy: "MindReply does not sell generic output volume. It refines how founders, operators, and client-facing teams explain high-pressure work.",
    icon: FileText,
  },
  {
    title: "Behavioral expression read",
    copy: "MRagent names what the pressure is really about, where the reflex is coming from, and which move protects the relationship and the outcome.",
    icon: HeartHandshake,
  },
  {
    title: "Measurable communication structure",
    copy: "Outputs are shaped as a synthesis, action, risk level, confidence, and receipt so the result can be inspected instead of admired vaguely.",
    icon: Gauge,
  },
  {
    title: "Trust before expansion",
    copy: "Slack, email, memory, and security lanes are treated as approved capabilities. They are not advertised as active until credentials and consent exist.",
    icon: ShieldCheck,
  },
];

const proofItems = [
  "Public contact uses info@mind-reply.com only.",
  "MRagent is the first support route; contact is the assisted close when the question needs human follow-up.",
  "Receipts are narrow by design and should not expose raw private pressure in public reports.",
  "Revenue, deployment, and integration claims stay tied to real sources instead of optimistic wording.",
];

const closeSteps = [
  {
    step: "01",
    title: "Try the read",
    copy: "Paste the pressure into MRagent and get one synthesis, one action, and the risk gate before paying.",
  },
  {
    step: "02",
    title: "Buy or request invoice",
    copy: "Use the direct payment link when configured, or request an invoice for the Website Completion Package.",
  },
  {
    step: "03",
    title: "Receive the queue",
    copy: "The delivery is concrete: ranked fixes, send-ready copy, a visible reply artifact, consent wording, and a receipt.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MindReply",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://www.mind-reply.com/",
  description:
    "MindReply helps overloaded operators reclaim time through website buying-friction rescue, response overload support, and a Website Completion Package for overloaded websites, messages, and follow-up queues.",
  featureList: [
    "MRagent pressure read",
    "Website buying-friction rescue",
    "Website Completion Package",
    "Ranked action queue",
    "Send-ready copy",
    "Privacy-safe receipt",
    "Risk and confidence labels",
  ],
  offers: {
    "@type": "Offer",
    name: "Website Completion Package",
    price: "600",
    priceCurrency: "GBP",
    availability: "https://schema.org/InStock",
    url: "https://www.mind-reply.com/website-completion-package",
  },
  brand: {
    "@type": "Brand",
    name: "MindReply",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#122033]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="border-b border-[#122033]/10 bg-[#f8f4ec]/95 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-[#4d5c6f] transition hover:bg-white hover:text-[#122033]">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-[#4d5c6f] transition hover:bg-white hover:text-[#122033]">
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/website-completion-package" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              Website Package
            </Link>
            <Link href="/agent" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Try MRagent
            </Link>
          </div>
        </div>
      </header>

      <section
        className="bg-[#122033] bg-cover bg-center px-4 py-8 text-[#f8f5f0] md:px-8 md:py-12"
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(18,32,51,0.98), rgba(18,32,51,0.88) 48%, rgba(47,111,114,0.68)), url('/assets/images/hero-atmosphere.png')",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="py-4">
            <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" />
              High-demand lane: website buying-friction rescue
            </div>
            <h1 className="mt-7 max-w-3xl font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              Reclaim 2+ hours daily within 24 hours.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              MindReply helps overloaded operators, founders, and client-facing teams turn emails, Slack notes, tasks, follow-ups, and website confusion into one action queue or send-ready message with no long setup.
            </p>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#91d2c8]">
              The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Try the Mind Read <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <a href={packageCtaHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                {packageCtaLabel} <Target aria-hidden className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Demand wedge</p>
                <p className="mt-3 text-sm font-semibold">Website buying-friction rescue</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">First output</p>
                <p className="mt-3 text-sm font-semibold">Action queue or send-ready message</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Paid offer</p>
                <p className="mt-3 text-sm font-semibold">GBP 600 Website Completion Package. {packageRouteLabel}.</p>
              </div>
            </div>
          </div>

          <div className="min-h-[43rem] overflow-hidden rounded-lg border border-white/10 bg-[#0d1729] shadow-2xl shadow-black/20">
            <MRAgentChat compact />
          </div>
        </div>
      </section>

      <section id="offer" className="border-b border-[#122033]/10 bg-white px-4 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Paid entry offer</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Website Completion Package</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              This is the first thing to sell: clarity for overloaded websites and communication queues. It is not a technology pitch; it is a fixed-scope rescue for messaging, action order, and send-ready language.
            </p>
            <div className="mt-6 rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7430]">Package total</p>
              <p className="mt-3 font-serif text-5xl font-bold">GBP 600</p>
              <p className="mt-3 text-sm leading-6 text-[#59687b]">Three concrete rows. One clear receipt. No long setup.</p>
              <a href={packageCtaHref} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#122033] px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:bg-[#1c3150]">
                {packageCtaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {packageRows.map((row) => {
              const Icon = row.icon;
              return (
                <article key={row.title} className="rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5 shadow-sm shadow-[#122033]/5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#122033] text-[#e2b757]"><Icon aria-hidden className="h-5 w-5" /></span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2f6f72]">{row.value}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-bold leading-tight">{row.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{row.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="authority" className="px-4 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Authority layer</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">
                Decision Infrastructure, explained without fog.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#59687b]">
              MindReply sells relief first, then earns authority by showing how language, behavior, risk, consent, analytics shape, and receipts work together.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {authoritySignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <article key={signal.title} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#103b39] text-[#91d2c8]"><Icon aria-hidden className="h-5 w-5" /></span>
                  <h3 className="mt-5 font-serif text-2xl font-bold leading-tight">{signal.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{signal.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#103b39] px-4 py-14 text-[#f8f5f0] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#91d2c8]">Assisted close</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">The commercial path is deliberately short.</h2>
            <p className="mt-5 text-sm leading-7 text-[#d3e5e2]">
              The buyer should not have to decode a platform. They should feel the pressure loosen, see a concrete package, and know exactly where to pay or request an invoice.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {closeSteps.map((item) => (
              <article key={item.step} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2b757]">{item.step}</span>
                <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#d3e5e2]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-b border-[#122033]/10 bg-[#fbfaf6] px-4 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Trust proof</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">Warm, premium, and strict about evidence.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              Serious buyers do not need theatre. They need a believable promise, a clear payment or invoice route, and claims that survive inspection.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {proofItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b]">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-[#122033] p-6 text-[#f8f5f0] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91d2c8]">Next revenue move</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">Start with MRagent. Escalate to the Website Completion Package when the queue needs a full rescue.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
              Try MRagent <Zap aria-hidden className="h-4 w-4" />
            </Link>
            <a href={packageCtaHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
              {packageCtaLabel} <Mail aria-hidden className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
