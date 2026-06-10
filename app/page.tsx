import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gauge,
  HeartHandshake,
  Languages,
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
const checkoutHref = "/checkout?package=website-completion";
const packageCtaHref = packagePaymentUrl || checkoutHref;
const packageCtaLabel = packagePaymentUrl ? "Pay GBP 600" : "Checkout or request invoice";
const packageRouteLabel = packagePaymentUrl ? "Direct payment enabled" : "Checkout and invoice route ready";
const packageRouteCopy = packagePaymentUrl
  ? "Scope is confirmed first, then the configured payment link is used before delivery."
  : "No payment link is required to begin. MindReply confirms scope, collects billing name and billing email, then routes the GBP 600 invoice before delivery so the invoice-first route works for B2B buyers.";

const navItems = [
  { label: "Offer", href: "#offer" },
  { label: "Products", href: "/products" },
  { label: "How it works", href: "#how" },
  { label: "Trust", href: "#proof" },
  { label: "Pricing", href: "/pricing" },
];

const packageRows = [
  {
    title: "Overloaded website messaging",
    value: "GBP 200",
    copy: "The homepage, offer, contact path, and buyer hesitation points are read as one sales path, then tightened into clearer language.",
    icon: Brain,
  },
  {
    title: "Ranked action queue",
    value: "GBP 200",
    copy: "You receive the fixes in commercial order: what removes confusion, what builds trust, and what pushes the visitor toward action.",
    icon: ClipboardList,
  },
  {
    title: "Send-ready copy and receipt",
    value: "GBP 200",
    copy: "You get usable page copy, reply structure, next-step wording, privacy consent language, and a narrow receipt for what changed.",
    icon: ReceiptText,
  },
];

const toolRows = [
  {
    title: "Ops Overload Analyzer",
    copy: "Turns scattered tasks, Slack notes, and page confusion into the next action queue.",
    icon: Gauge,
  },
  {
    title: "Prospect Reply Analyzer",
    copy: "Reads buyer hesitation and produces the next reply without sounding needy or blunt.",
    icon: Target,
  },
  {
    title: "Email Polisher",
    copy: "Tightens a sensitive draft into a clear, warm, send-ready message.",
    icon: Mail,
  },
];

const authoritySignals = [
  {
    title: "Discipline-specific language",
    copy: "Founder updates, client delivery, legal-sensitive wording, finance pressure, clinical tone, recruiting replies, and executive messages each need different restraint.",
    icon: FileText,
  },
  {
    title: "Behavioral expression read",
    copy: "MRagent names the protected feeling, the likely friction, and the next move without turning the answer into a long essay.",
    icon: HeartHandshake,
  },
  {
    title: "10 refinement tools",
    copy: "Clarity, brevity, warmth, firmness, risk reduction, empathy, structure, polish, de-escalation, and next-step framing support the final output.",
    icon: Languages,
  },
  {
    title: "Private by design",
    copy: "Sensitive material stays redacted by default. Human handoff, memory, and integrations require consent and configuration before being claimed as active.",
    icon: ShieldCheck,
  },
];

const howSteps = [
  {
    step: "01",
    title: "Paste what is stuck",
    copy: "Use MRagent with a page section, prospect reply, email, Slack note, objection, or follow-up that is slowing action.",
  },
  {
    step: "02",
    title: "Get one read",
    copy: "MindReply returns the hidden friction, one recommended move, risk level, confidence, and a receipt marker without making you choose from a menu.",
  },
  {
    step: "03",
    title: "Act or buy",
    copy: "Use the answer if it solves one moment. Use the GBP 600 Website Completion Package when the website, offer, or reply path needs a full rescue.",
  },
  {
    step: "04",
    title: "Upgrade only when repeated",
    copy: "Choose Growth for weekly overload. Choose Pro for sensitive continuity, approved memory, receipt review, and integration planning.",
  },
];

const upgradeSteps = [
  {
    title: "Free first read",
    copy: "Proves relief before checkout: one synthesis, one next move, one receipt marker.",
  },
  {
    title: "GBP 600 package",
    copy: "For website buying friction, repeated follow-up confusion, offer clarity, and page sections that need send-ready copy.",
  },
  {
    title: "Growth",
    copy: "For repeated daily overload: customer responses, follow-ups, sales messages, task threads, and small-team communication rhythm.",
  },
  {
    title: "Pro",
    copy: "For sensitive client, sales, hiring, legal-adjacent, founder, finance, and reputation-critical communication that needs deeper refinement and control.",
  },
];

const firstSessionPath = [
  {
    label: "First user action",
    copy: "Paste one tense reply, overloaded page section, client follow-up, or objection into MRagent.",
  },
  {
    label: "First output",
    copy: "Get one direct read: hidden friction, next move, confidence, risk, and a narrow receipt marker.",
  },
  {
    label: "Aha moment",
    copy: "The buyer sees the message or page does not need more wording; it needs a cleaner decision path.",
  },
  {
    label: "Credit trigger",
    copy: "Buy credits when several replies need the same quick polish but the website offer is not leaking buyers.",
  },
  {
    label: "Package trigger",
    copy: "Buy the GBP 600 package when the homepage, pricing, contact route, or offer copy needs repair.",
  },
  {
    label: "Growth trigger",
    copy: "Move to Growth when the same overload repeats every week across inbox, clients, or small team work.",
  },
  {
    label: "Pro trigger",
    copy: "Move to Pro when approved memory, receipt review, integration planning, or sensitive continuity is required.",
  },
];

const proofItems = [
  "Public contact uses info@mind-reply.com only.",
  "MRagent is the first support route; contact is the assisted close when the question needs human follow-up.",
  "Receipts are narrow by design and should not expose raw private pressure in public reports.",
  "Checkout is fixed-price when the payment URL is configured; invoice-first remains available when it is not.",
  "Revenue, deployment, and integration claims stay tied to real sources instead of optimistic wording.",
];

const dataHandlingProof = [
  {
    title: "Raw text stays out of public proof",
    copy: "Reports and website copy use receipt markers, route status, and redacted summaries instead of exposing private messages.",
  },
  {
    title: "Memory requires approval",
    copy: "Growth and Pro can describe memory as a controlled lane only after the user approves the context that should persist.",
  },
  {
    title: "Integrations are consent-gated",
    copy: "Slack, email, and workflow connections are not claimed as active until credentials and channel permissions are configured.",
  },
  {
    title: "Payment path stays inspectable",
    copy: "The GBP 600 package uses a fixed-price checkout when configured, with invoice-first fallback when direct payment is not ready.",
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
    "Ops Overload Analyzer",
    "Prospect Reply Analyzer",
    "Email Polisher",
    "Website buying-friction rescue",
    "Website Completion Package",
    "20+ professional lexicons",
    "10 refinement tools",
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
    url: "https://www.mind-reply.com/checkout?package=website-completion",
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
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/products" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              Products
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
              Website buying-friction rescue
            </div>
            <h1 className="mt-7 max-w-3xl font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              Reclaim 2+ hours daily within 24 hours.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              Reclaim 2+ hours daily when your page, inbox, or follow-up path is leaking decisions. MindReply turns overloaded pages, replies, and client follow-ups into one ranked action queue or one send-ready message.
            </p>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#91d2c8]">
              Start with MRagent. Buy the GBP 600 Website Completion Package when the leak is bigger than one reply.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Try MRagent <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <a href={packageCtaHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                {packageCtaLabel} <Target aria-hidden className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">First output</p>
                <p className="mt-3 text-sm font-semibold">One read before checkout</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Delivery</p>
                <p className="mt-3 text-sm font-semibold">Action queue or send-ready copy</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Paid path</p>
                <p className="mt-3 text-sm font-semibold">GBP 600 package. {packageRouteLabel}.</p>
                <p className="mt-3 text-xs leading-5 text-[#d9e3e7]">{packageRouteCopy}</p>
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
              This is the first thing to buy when the page, reply, or follow-up path is doing too much explaining and not enough closing.
            </p>
            <div className="mt-6 rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7430]">Package total</p>
              <p className="mt-3 font-serif text-5xl font-bold">GBP 600</p>
              <p className="mt-3 text-sm leading-6 text-[#59687b]">Three concrete rows. One clear receipt. No long setup.</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#2f6f72]">{packageRouteCopy}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a href={packageCtaHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#122033] px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:bg-[#1c3150]">
                  {packageCtaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
                <Link href="/website-completion-package" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#122033]/15 px-5 py-3 text-sm font-bold text-[#122033] transition hover:border-[#2f6f72]">
                  See more <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
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

      <section className="border-b border-[#122033]/10 bg-[#fbfaf6] px-4 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">First-session tools</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Use the tool that matches the leak.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              Each tool exists to create the first useful output fast, then show whether the buyer should act, buy credits, request the package, or upgrade.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {toolRows.map((row) => {
              const Icon = row.icon;
              return (
                <article key={row.title} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                  <Icon aria-hidden className="h-6 w-6 text-[#2f6f72]" />
                  <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">{row.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{row.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how" className="bg-[#103b39] px-4 py-14 text-[#f8f5f0] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#91d2c8]">How it works</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">The commercial path is deliberately short.</h2>
            <p className="mt-5 text-sm leading-7 text-[#d3e5e2]">
              The buyer should not decode a platform. They should feel the pressure loosen, see the next move, then know whether to use checkout, request invoice, upgrade, or stay on the free read.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {howSteps.map((item) => (
              <article key={item.step} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2b757]">{item.step}</span>
                <h3 className="mt-4 font-serif text-2xl font-bold leading-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#d3e5e2]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="authority" className="px-4 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Premium depth</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">
                Behavioral communication intelligence, tied to buying behavior.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#59687b]">
              The page sells relief first. The depth explains why the output is safer, sharper, and more usable than generic writing help.
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

      <section className="border-y border-[#122033]/10 bg-white px-4 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Pricing path</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Free relief first. Paid continuity after proof.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The upgrade pressure is simple: if one read is enough, use it. If the pattern repeats or the page is leaking buyers, buy the next level.
            </p>
            <Link href="/pricing" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#122033]/15 px-5 py-3 text-sm font-bold text-[#122033] transition hover:border-[#2f6f72]">
              See more pricing <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {upgradeSteps.map((step) => (
              <article key={step.title} className="rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
                <h3 className="font-serif text-2xl font-bold leading-tight">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#59687b]">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#122033]/10 bg-[#103b39] px-4 py-14 text-[#f8f5f0] md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#91d2c8]">First-session conversion logic</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">The first session should make the next purchase obvious.</h2>
            <p className="mt-5 text-sm leading-7 text-[#d3e5e2]">
              MindReply does not need a long demo to sell. It needs one useful read, one visible next move, and a clear trigger for credits, the package, Growth, or Pro.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {firstSessionPath.map((item) => (
              <article key={item.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e2b757]">{item.label}</p>
                <p className="mt-3 text-sm leading-6 text-[#d3e5e2]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="border-b border-[#122033]/10 bg-[#fbfaf6] px-4 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Trust proof</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">Private by design for sensitive professional communication.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              Serious buyers do not need theatre. They need a believable promise, a clear checkout or invoice route, and claims that survive inspection. Public support uses {supportEmail}.
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
        <div className="mx-auto mt-8 max-w-7xl rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Data handling proof</p>
              <h3 className="mt-3 font-serif text-3xl font-bold leading-tight">Trust is shown through boundaries the buyer can inspect.</h3>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#59687b]">
              These are operational boundaries, not borrowed compliance claims. They make the privacy promise specific without overstating certification.
            </p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {dataHandlingProof.map((item) => (
              <article key={item.title} className="rounded-lg border border-[#122033]/10 bg-[#f7f4ed] p-4">
                <h4 className="font-serif text-xl font-bold leading-tight">{item.title}</h4>
                <p className="mt-3 text-sm leading-6 text-[#59687b]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-[#122033] p-6 text-[#f8f5f0] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91d2c8]">Next revenue move</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">Start with MRagent. Use checkout or request the GBP 600 invoice when the buying path needs a full rescue.</h2>
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
