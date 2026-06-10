import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LockKeyhole,
  Mail,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import PackageRequestForm from "@/components/PackageRequestForm";

export const metadata = {
  title: "Contact | MindReply",
  description:
    "Ask MRagent first, then contact MindReply at info@mind-reply.com for the Website Completion Package or human follow-up.",
};

const supportEmail = "info@mind-reply.com";
const mailSubject = "MindReply Website Completion Package";
const mailBody = [
  "Hi MindReply,",
  "",
  "I want help with the Website Completion Package.",
  "",
  "Billing name (for invoice-first package requests):",
  "- ",
  "",
  "Billing email:",
  "- ",
  "",
  "What I need resolved:",
  "- ",
  "",
  "What I have already tried with MRagent:",
  "- ",
  "",
  "Please reply with the next step, scope, and payment/invoice route.",
].join("%0A");
const mailtoHref = `mailto:${supportEmail}?subject=${encodeURIComponent(mailSubject)}&body=${mailBody}`;

const reasons = [
  "You tried MRagent and need a human package handoff.",
  "Your website, offer, or contact path is overloaded and needs a ranked action queue.",
  "You need send-ready website copy, reply structure, or privacy-safe receipt wording.",
  "The question involves billing, security, or owner decisions that should not be handled in public copy.",
];

const packageRows = [
  { label: "Messaging rescue", value: "GBP 200", icon: MessageCircle },
  { label: "Ranked action queue", value: "GBP 200", icon: ClipboardList },
  { label: "Copy and receipt", value: "GBP 200", icon: ReceiptText },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#122033]">
      <section className="border-b border-[#122033]/10 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/website-completion-package" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              Package
            </Link>
            <Link href="/agent" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Ask MRagent
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" />
              Assisted close
            </div>
            <h1 className="mt-7 max-w-3xl font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              Ask MRagent first. Contact MindReply when the answer needs a human handoff.
            </h1>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6">
            <p className="text-sm leading-7 text-[#d9e3e7]">
              Public support uses {supportEmail}. For owner/security decisions, sensitive data should move through the configured private owner channel, not public website copy.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Try MRagent <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <a href={mailtoHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                Fallback email <Mail aria-hidden className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8" data-package-request-route="/api/package-request">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">When to contact</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Use this page for buying friction, not vague browsing.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The clean route is simple: MRagent resolves the pressure when it can. Contact form handles package requests, billing, security owner decisions, and anything that needs a human answer.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {reasons.map((reason) => (
              <div key={reason} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b] shadow-sm shadow-[#122033]/5">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">Contact form</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Website Completion Package, GBP 600.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The package turns overloaded website messaging, scattered launch notes, or reply pressure into a ranked action queue and send-ready copy. The secure contact form posts through /api/package-request.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {packageRows.map((row) => {
              const Icon = row.icon;
              return (
                <article key={row.label} className="rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#122033] text-[#e2b757]"><Icon aria-hidden className="h-5 w-5" /></span>
                  <h3 className="mt-5 font-serif text-2xl font-bold leading-tight">{row.label}</h3>
                  <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-[#2f6f72]">{row.value}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <PackageRequestForm mailtoHref={mailtoHref} supportEmail={supportEmail} />

          <div className="grid gap-4">
            <section className="rounded-lg bg-[#103b39] p-6 text-[#f8f5f0]">
              <div className="flex items-center gap-3 text-[#91d2c8]">
                <ShieldCheck aria-hidden className="h-5 w-5" />
                <p className="text-xs font-bold uppercase tracking-[0.22em]">Security owner route</p>
              </div>
              <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">Security can advise the owner directly, but public copy stays clean.</h2>
              <p className="mt-4 text-sm leading-7 text-[#d3e5e2]">
                Decision data may be summarized privately for the configured owner report address. Secrets, tokens, raw private pressure text, and personal inboxes should not be placed on the public site.
              </p>
            </section>
            <section className="rounded-lg border border-[#122033]/10 bg-white p-6">
              <div className="flex items-center gap-3 text-[#9b7430]">
                <LockKeyhole aria-hidden className="h-5 w-5" />
                <p className="text-xs font-bold uppercase tracking-[0.22em]">Privacy receipt</p>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#59687b]">
                Keep the first message brief and redacted. MindReply can then produce the next-step structure without turning private material into public proof.
              </p>
              <a href={mailtoHref} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#122033]/15 px-5 py-3 text-sm font-bold text-[#122033] transition hover:border-[#2f6f72]">
                Open prefilled email <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
