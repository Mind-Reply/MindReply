import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ReceiptText, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Trust and Data Handling | MindReply",
  description:
    "MindReply trust proof: privacy-safe receipts, consent-gated memory, public support route, invoice-first buying path, and restrained claims for sensitive professional communication.",
  alternates: {
    canonical: "https://www.mind-reply.com/trust",
  },
};

const proofRows = [
  {
    title: "Raw private text is not public proof",
    copy: "Reports, website language, and delivery evidence use receipt markers, route status, hashes, and redacted summaries instead of publishing private messages.",
    icon: LockKeyhole,
  },
  {
    title: "Receipts are narrow on purpose",
    copy: "The receipt shape is limited to source, timestamp, risk, confidence, action kind, input hash, and rawContentRedacted status.",
    icon: ReceiptText,
  },
  {
    title: "Memory requires explicit approval",
    copy: "Growth and Pro can describe memory only as an approved lane. Sensitive context is not claimed as persistent until the user chooses what should carry forward.",
    icon: ShieldCheck,
  },
  {
    title: "Human handoff uses the public route",
    copy: "Public support and package requests use info@mind-reply.com, the contact form, or the checkout/invoice route. Personal inboxes stay out of public pages.",
    icon: Mail,
  },
];

const claimRules = [
  "No customer count, revenue, staff, compliance badge, payment status, or integration status is stated without evidence.",
  "Slack, email, memory, MCP, and payment routes are described as active only when credentials, permissions, and workflow proof exist.",
  "The Website Completion Package keeps scope, price, and invoice/payment route visible before private context is reviewed.",
  "Security and owner decisions stay in private, redacted reports; public pages explain boundaries without exposing sensitive data.",
];

const publicSurfaces = [
  { label: "Privacy page", href: "/privacy", copy: "Explains raw-input restraint, receipt shape, review, and derived memory." },
  { label: "Contact route", href: "/contact", copy: "Handles human follow-up, package requests, billing details, and security owner routing." },
  { label: "Checkout route", href: "/checkout?package=website-completion", copy: "Shows GBP 600 fixed price, direct-payment readiness, and invoice fallback." },
  { label: "Package page", href: "/website-completion-package", copy: "Shows deliverables, buyer proof checklist, and invoice-first paymentPath receipt." },
];

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <Link href="/agent" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
            Try MindReply Free
          </Link>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-14 text-[#f8f5f0] md:px-8 md:py-18">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#91d2c8]/30 bg-[#91d2c8]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#91d2c8]">
              <ShieldCheck aria-hidden className="h-4 w-4" /> Trust proof
            </p>
            <h1 className="mt-7 max-w-4xl font-serif text-5xl font-bold leading-[0.96] md:text-7xl">Private by design means the boundary is visible.</h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
            MindReply is used for sensitive professional communication, so the trust claim has to be inspectable: what is stored, what is redacted, when memory is allowed, and which routes are actually configured.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {proofRows.map((row) => {
            const Icon = row.icon;
            return (
              <article key={row.title} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#103b39] text-[#91d2c8]">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-serif text-2xl font-bold leading-tight">{row.title}</h2>
                <p className="mt-4 text-sm leading-6 text-[#59687b]">{row.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Claim discipline</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">No borrowed trust badges. No invented proof.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              Testimonials and compliance badges are useful only when they are real. Until then, MindReply shows the operational boundary and keeps unsupported claims out of public copy.
            </p>
          </div>
          <div className="grid gap-3">
            {claimRules.map((rule) => (
              <div key={rule} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-4 text-sm leading-6 text-[#59687b]">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.76fr_1.24fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Inspectable surfaces</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">The proof is spread across public routes buyers can check.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {publicSurfaces.map((surface) => (
              <Link key={surface.href} href={surface.href} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5 transition hover:-translate-y-0.5 hover:border-[#2f6f72]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2f6f72]">{surface.label}</p>
                <p className="mt-4 text-sm leading-6 text-[#59687b]">{surface.copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-[#103b39] p-6 text-[#f8f5f0] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91d2c8]">Next step</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">Use the free read first. Use the GBP 600 package when the trust and buying path need completion.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
              Try MindReply Free <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link href="/website-completion-package" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
              Website Completion Package <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
