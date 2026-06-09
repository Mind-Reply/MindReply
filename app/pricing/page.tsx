import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

const supportEmail = "info@mind-reply.com";

const plans = [
  {
    name: "Signal",
    price: "Free start",
    audience: "First useful read before checkout",
    cta: "Try MindReply free",
    href: "/agent",
    accent: "bg-[#f7f4ed] text-[#122033]",
    features: [
      "Use MRagent for the first pressure read",
      "Get one synthesis and one recommended next move",
      "See risk and confidence before acting",
      "Use the contact form only when MRagent cannot resolve it",
    ],
  },
  {
    name: "Growth",
    price: "GBP 49/mo",
    audience: "For recurring inbox, client, or team pressure",
    cta: "Start with MRagent",
    href: "/agent",
    accent: "bg-[#103b39] text-[#f8f5f0]",
    features: [
      "More monthly reads and reply preparation",
      "Short-term context for active workstreams",
      "Priority support through the public MindReply mailbox",
      "Best fit when the same pressure returns every week",
    ],
  },
  {
    name: "Pro",
    price: "GBP 129/mo",
    audience: "For high-trust operators who need continuity",
    cta: "Ask about Pro",
    href: "/contact",
    accent: "bg-[#122033] text-[#f8f5f0]",
    features: [
      "Longer memory and profile direction once approved",
      "Slack/email integration lane when credentials are connected",
      "Advanced reporting and receipt review",
      "Designed for founder, executive, legal, finance, and client-facing workflows",
    ],
  },
];

const proof = [
  "Public support uses info@mind-reply.com only.",
  "Raw private text is kept narrow by default and should not be used for public reporting.",
  "No revenue, customer, integration, or compliance claim appears unless a real source supports it.",
  "MRagent is the first support route; contact is the fallback when the agent cannot solve the question.",
];

const faqs = [
  {
    q: "What does MindReply do?",
    a: "It helps an overloaded professional turn a tense message, task pile, or reply decision into one clear read and one safer next move.",
  },
  {
    q: "Do I need setup first?",
    a: "No. Start with MRagent. Paste the pressure, get the read, then decide whether the result is useful enough to continue.",
  },
  {
    q: "Are Slack, email, and memory fully automatic today?",
    a: "They are capability lanes that require approved credentials and user consent. The site should not imply they are active for an account before that setup exists.",
  },
  {
    q: "Where should users contact MindReply?",
    a: `Ask MRagent first. If it cannot resolve the question, use the contact form or ${supportEmail}.`,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/capabilities" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              Capabilities
            </Link>
            <Link href="/agent" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Try free
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" /> Clear path to paid
            </p>
            <h1 className="mt-7 font-serif text-5xl font-bold leading-[0.96] md:text-7xl">Try the read first. Pay when the relief is real.</h1>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              MindReply should not make a visitor decode clever language before they understand the offer. Start with MRagent, feel the value, then choose the plan that matches how often communication pressure hits.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Try MindReply free <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                Contact after MRagent <Mail aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className="rounded-lg border border-[#122033]/10 bg-white p-6 shadow-sm shadow-[#122033]/5">
                <div className={`rounded-lg p-5 ${plan.accent}`}>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">{plan.audience}</p>
                  <h2 className="mt-4 font-serif text-4xl font-bold">{plan.name}</h2>
                  <p className="mt-3 text-2xl font-bold">{plan.price}</p>
                </div>
                <div className="mt-6 grid gap-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-3 text-sm leading-6 text-[#59687b]">
                      <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href={plan.href} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#122033] px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:bg-[#1c3150]">
                  {plan.cta} <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Trust posture</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Trust claims stay modest until proof exists.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              That is better for sales, not worse. High-trust buyers can feel when a site overreaches. MindReply should sound capable, specific, and honest.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {proof.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#f7f4ed] p-4 text-sm leading-6 text-[#59687b]">
                <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
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
              <MessageCircle aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Activation sequence</p>
            </div>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">1. Ask MRagent. 2. Use the answer. 3. Upgrade only when the pattern repeats.</h2>
            <p className="mt-4 text-sm leading-7 text-[#d3e5e2]">
              This is the cleanest revenue path from the audit: free relief first, then Growth for regular use, then Pro for continuity and approved integrations.
            </p>
          </div>
          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <div className="flex items-center gap-3 text-[#d96f4a]">
              <TriangleAlert aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Do not overpromise</p>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-6 text-[#59687b]">
                <LockKeyhole aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#d96f4a]" />
                <span>Do not claim AES-256, SOC 2, GDPR readiness, customer logos, or revenue unless verified assets exist.</span>
              </div>
              <div className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-6 text-[#59687b]">
                <Clock3 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#d96f4a]" />
                <span>Do not claim 10 sales/day. Track it when payments are connected; until then, show readiness and next action.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">FAQ</p>
          <div className="mt-5 grid gap-3">
            {faqs.map((faq) => (
              <article key={faq.q} className="rounded-lg border border-[#122033]/10 bg-white p-5">
                <h3 className="font-serif text-2xl font-bold leading-tight">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-[#59687b]">{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
