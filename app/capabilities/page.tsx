import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gauge,
  LockKeyhole,
  MessageSquare,
  MonitorSmartphone,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const serviceLanes = [
  {
    name: "MRagent pressure read",
    status: "Available now",
    signal: "Start here",
    icon: MessageSquare,
    copy: "Paste the tense message, unclear reply, or overloaded note. MRagent returns one synthesis, one recommended move, risk, confidence, and a narrow receipt.",
    proof: ["/agent is the main support entry", "one-action output", "risk and confidence labels", "privacy-safe receipt shape"],
  },
  {
    name: "Website Completion Package",
    status: "Available now",
    signal: "GBP 600 fixed scope",
    icon: ClipboardList,
    copy: "A direct rescue for buying-friction pages: ranked fixes, stronger offer language, send-ready copy, and a clean handoff path.",
    proof: ["GBP 600 package page", "request form", "ranked action queue", "copy and receipt deliverables"],
  },
  {
    name: "Contact handoff",
    status: "Available now",
    signal: "MRagent first",
    icon: MonitorSmartphone,
    copy: "The public path stays simple: ask MRagent first, then use the contact form when a human handoff is needed.",
    proof: ["contact form route", "public mailbox only", "package intent routing", "no personal inbox on site"],
  },
  {
    name: "Privacy receipts",
    status: "Available now",
    signal: "Sensitive by default",
    icon: ReceiptText,
    copy: "Receipts are designed to prove what happened without turning raw private pressure into public proof.",
    proof: ["redacted receipt language", "risk level", "confidence label", "source and timestamp"],
  },
  {
    name: "Professional refinement layer",
    status: "In use",
    signal: "Warm authority",
    icon: FileText,
    copy: "MindReply's language stays calm, premium, and practical: clearer structure, better tone, sharper boundaries, and less hesitation.",
    proof: ["lexicon-aware copy", "tone calibration", "structure optimization", "boundary-aware persuasion"],
  },
  {
    name: "Multilingual surface",
    status: "Active layer",
    signal: "Visitor-matched language",
    icon: Gauge,
    copy: "Visitor IP and browser signals set the first language gently, with a subtle manual selector and Google Translate fallback for full-page translation.",
    proof: ["IP-country route", "browser-language fallback", "manual selector", "Google Translate fallback", "RTL support"],
  },
];

const readinessRows = [
  {
    label: "Ready for visitors",
    copy: "MRagent, Website Completion Package, products, checkout, pricing, contact, privacy, sitemap, metadata, and the footer handoff are the public surfaces that should carry sales now.",
  },
  {
    label: "Needs account connection",
    copy: "Payment links, email delivery, Slack updates, and deeper inbox/calendar flows require approved provider credentials before they can be presented as active for a buyer.",
  },
  {
    label: "Do not publish as a claim",
    copy: "Internal staffing counts, private prompts, tokens, build limits, provider secrets, and owner-only report lanes stay out of public copy.",
  },
];

const proofItems = [
  "Public contact routes through MRagent and the contact form.",
  "The footer keeps the main CTA simple on desktop and phone.",
  "Language detection is helpful but gentle; visitors can change it without a loud widget.",
  "Visitor IP, browser language, and manual selection decide the language assist path.",
  "Revenue and provider claims are shown only when connected evidence exists.",
];

export default function CapabilitiesPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
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
              Try MindReply Free
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" /> Service readiness
            </p>
            <h1 className="mt-7 max-w-3xl font-serif text-5xl font-bold leading-[0.96] md:text-7xl">
              What MindReply can do for a visitor right now.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              This page keeps the promise clean: what is available, what needs an approved connection, and what should never be exposed as public theatre.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">First move</p>
              <p className="mt-3 text-lg font-bold">Try MindReply Free</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Paid offer</p>
              <p className="mt-3 text-lg font-bold">GBP 600 package</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Language layer</p>
              <p className="mt-3 text-lg font-bold">Visitor-matched</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Public capability map</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">Sharp enough to sell. Calm enough to trust.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#59687b]">
              Each lane below is phrased for a buyer, not an internal operator. The goal is clarity, confidence, and a fast path into MRagent or the package.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceLanes.map((lane) => {
              const Icon = lane.icon;
              return (
                <article key={lane.name} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#122033] text-[#e2b757]"><Icon aria-hidden className="h-5 w-5" /></span>
                    <span className="rounded-full bg-[#f7f4ed] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2f6f72]">{lane.status}</span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#9b7430]">{lane.signal}</p>
                  <h3 className="mt-3 font-serif text-2xl font-bold leading-tight">{lane.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{lane.copy}</p>
                  <div className="mt-5 grid gap-2">
                    {lane.proof.map((item) => (
                      <div key={item} className="flex gap-2 text-sm text-[#39485b]">
                        <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Readiness boundary</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Specific claims, no noise.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The site should feel premium because it is restrained. Buyers get the route that works now and a plain label for anything requiring an account connection.
            </p>
          </div>
          <div className="grid gap-4">
            {readinessRows.map((row) => (
              <article key={row.label} className="rounded-lg border border-[#122033]/10 bg-[#f7f4ed] p-5">
                <div className="flex items-center gap-3 text-[#2f6f72]">
                  <ShieldCheck aria-hidden className="h-5 w-5" />
                  <h3 className="font-serif text-2xl font-bold leading-tight">{row.label}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#59687b]">{row.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg bg-[#103b39] p-6 text-[#f8f5f0]">
            <div className="flex items-center gap-3 text-[#91d2c8]">
              <Target aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Recommended buyer path</p>
            </div>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">MRagent first. Package next. Contact only when the handoff needs a person.</h2>
            <p className="mt-4 text-sm leading-7 text-[#d3e5e2]">
              This makes the phone view simple and keeps the page from becoming a maze. A visitor should know where to start within seconds.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Open MRagent <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link href="/website-completion-package" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                View package <FileText aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <div className="flex items-center gap-3 text-[#9b7430]">
              <LockKeyhole aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Trust proof</p>
            </div>
            <div className="mt-6 grid gap-3">
              {proofItems.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-6 text-[#59687b]">
                  <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
