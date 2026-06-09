import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, MessageCircle, ShieldCheck } from "lucide-react";

const email = "info@mind-reply.com";

const reasons = [
  "Request the Website Completion Package.",
  "Send a sensitive website, reply, or follow-up for assisted close.",
  "Ask about Growth or Pro when the overload is recurring.",
  "Share a security or privacy concern through the public route.",
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <Link href="/agent" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
            Ask MRagent first
          </Link>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e2b757]">
              <MessageCircle aria-hidden className="h-4 w-4" /> Assisted close
            </p>
            <h1 className="mt-7 font-serif text-5xl font-bold leading-[0.96] md:text-7xl">Ask MRagent first. Send the hard case here.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              MindReply is built for pressure that needs a calmer next move. Start with MRagent for immediate relief. Use contact when the work needs human review, package scoping, or a sensitive commercial close.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#91d2c8]">Public route</p>
            <a href={`mailto:${email}?subject=Website%20Completion%20Package%20request`} className="mt-4 flex items-center gap-3 break-all font-serif text-3xl font-bold text-[#f8f5f0] transition hover:text-[#e2b757]">
              <Mail aria-hidden className="h-7 w-7 shrink-0 text-[#e2b757]" /> {email}
            </a>
            <p className="mt-4 text-sm leading-7 text-[#d9e3e7]">
              Include the page, message, or follow-up that is blocking the sale. Do not send passwords, API keys, or private credentials.
            </p>
            <a href={`mailto:${email}?subject=Website%20Completion%20Package%20request`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
              Email package request <ArrowRight aria-hidden className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Use contact for</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Paid package, sensitive review, or recurring overload.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {reasons.map((reason) => (
              <div key={reason} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-5 text-sm leading-6 text-[#59687b] shadow-sm shadow-[#122033]/5">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto rounded-lg bg-[#103b39] p-6 text-[#f8f5f0] md:max-w-4xl">
          <div className="flex items-center gap-3 text-[#91d2c8]">
            <ShieldCheck aria-hidden className="h-5 w-5" />
            <p className="text-xs font-bold uppercase tracking-[0.22em]">Privacy note</p>
          </div>
          <p className="mt-5 text-sm leading-7 text-[#d3e5e2]">
            Keep the first email narrow: describe the pressure, paste only what is necessary, and remove secrets. If the work needs deeper review, MindReply can request the right context after the owner-approved path is clear.
          </p>
        </div>
      </section>
    </main>
  );
}
