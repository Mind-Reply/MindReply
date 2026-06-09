import Link from "next/link";
import { ArrowRight, Languages, Mail, ShieldCheck } from "lucide-react";

const footerLinks = [
  { label: "MRagent", href: "/agent" },
  { label: "Website Completion Package", href: "/website-completion-package" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

const demandLanes = [
  "Website buying-friction rescue",
  "Client follow-up compression",
  "Founder response overload",
  "Privacy-safe assisted close",
];

const priorityMarkets = [
  "UK",
  "US",
  "UAE",
  "Saudi Arabia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Spain",
  "India",
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#122033]/10 bg-[#0d1729] px-4 py-10 text-[#f8f5f0] md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e2b757] font-serif text-lg font-bold text-[#122033]">M</span>
            <span className="font-serif text-2xl font-bold tracking-wide">MindReply</span>
          </Link>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#cdd8df]">
            MindReply is built for the expensive middle of modern work: the message is almost ready, the buyer is almost clear, the follow-up is almost sent, and the team is losing time in the last mile. MRagent turns that pressure into one clear move; the Website Completion Package turns a leaky page or offer into a ranked action queue.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {demandLanes.map((lane) => (
              <div key={lane} className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm font-semibold leading-6 text-[#dce7ea]">
                {lane}
              </div>
            ))}
          </div>
          <section className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-2 text-[#91d2c8]">
              <Languages aria-hidden className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-[0.18em]">Auto language and priority markets</p>
            </div>
            <p className="mt-3 text-xs font-semibold leading-6 text-[#cdd8df]">
              Country signal first, browser language second, manual selector always available. Priority SEO lanes: {priorityMarkets.join(" / ")}.
            </p>
          </section>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="flex items-center gap-2 text-[#91d2c8]">
              <ShieldCheck aria-hidden className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-[0.18em]">Evidence rule</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#cdd8df]">
              Public copy stays measured. Delivery, revenue, automation, and security claims are only stated when the files, workflow, endpoint, or connector proof exists.
            </p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e2b757]">Next step</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-4 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Try MRagent <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link href="/contact?intent=website-completion" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                Contact form <Mail aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-xs text-[#9fb0bd] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} MindReply. Pressure in. One clear move out.</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#e2b757]">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
