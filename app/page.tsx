import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, CreditCard, MessageSquare, Shield, Sparkles, Target, Users, Zap } from "lucide-react";
import OperationsHeroVisual from "@/components/OperationsHeroVisual";

const proofSteps = [
  "Paste overloaded emails, Slack notes, tasks, or follow-ups.",
  "MindReply returns urgency, owner, next action, and the send-ready response.",
  "Process the next batch with credits or upgrade when daily overload repeats.",
];

const tools = [
  {
    title: "Ops Overload Analyzer",
    href: "/tools/ops-overload-analyzer",
    description: "Turn 5-10 urgent messages and tasks into a ranked action queue.",
    icon: Zap,
  },
  {
    title: "Prospect Reply Analyzer",
    href: "/tools/prospect-reply-analyzer",
    description: "Find why replies stalled and get the next message, offer, and close.",
    icon: Target,
  },
  {
    title: "Email Polisher",
    href: "/tools/email-polisher",
    description: "Convert rough drafts into calm, professional, send-ready wording.",
    icon: MessageSquare,
  },
];

const trust = [
  { icon: Clock, title: "Value in minutes", detail: "The first useful output is an action queue or a send-ready message." },
  { icon: CreditCard, title: "Credits for delivery", detail: "Buy a pack when the first output proves the time saving." },
  { icon: Users, title: "Professional support", detail: "Use the marketplace when sensitive work needs expert review." },
  { icon: Shield, title: "Private by design", detail: "Built for sensitive professional communication and decision support." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[hsl(40_20%_96%)]">
      <section className="relative overflow-hidden bg-[hsl(220_55%_20%)] px-4 pb-20 pt-32">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-[hsl(43_80%_60%)]" style={{ borderColor: "rgba(201,169,97,0.3)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              MRagent and micro-tools are ready
            </div>
            <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-[hsl(43_70%_88%)] md:text-6xl lg:text-7xl">
              Reclaim 2+ hours daily <span className="italic text-[hsl(43_80%_60%)]">within 24 hours</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-[rgba(248,245,240,0.75)] md:text-xl lg:mx-0">
              MindReply helps overloaded operators, founders, and client-facing teams process messages, tasks, and follow-ups before critical work slips.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/tools/ops-overload-analyzer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(43_80%_60%)] px-8 py-4 font-semibold text-[hsl(220_45%_13%)] shadow-lg transition hover:opacity-90">
                Process 10 Urgent Items <ArrowRight size={16} />
              </Link>
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-lg border px-8 py-4 font-medium text-[hsl(43_70%_88%)] transition hover:text-[hsl(43_80%_60%)]" style={{ borderColor: "rgba(248,245,240,0.3)" }}>
                Ask MRagent
              </Link>
            </div>
          </div>
          <OperationsHeroVisual />
        </div>
      </section>

      <section className="border-y bg-[hsl(218_38%_12%)] px-4 py-10" style={{ borderColor: "rgba(201,169,97,0.22)" }}>
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {trust.map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.055] p-5">
              <item.icon size={20} className="text-[hsl(43_80%_60%)]" />
              <h2 className="mt-3 text-sm font-bold text-[hsl(43_70%_88%)]">{item.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[rgba(248,245,240,0.68)]">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[hsl(43_80%_42%)]">Working proof</p>
            <h2 className="font-serif text-3xl font-bold text-[hsl(220_45%_13%)] md:text-4xl">Start with the queue that is already costing time.</h2>
            <p className="mt-4 text-sm leading-relaxed text-[hsl(220_25%_45%)]">No long setup. Paste the active mess, get a ranked response plan, then process the next batch when the first output is useful.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group rounded-2xl border bg-white p-6 transition hover:-translate-y-0.5 hover:border-[hsl(43_80%_60%)] hover:shadow-lg" style={{ borderColor: "hsl(40 25% 88%)" }}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(220_55%_20%)] text-[hsl(43_70%_88%)]">
                  <tool.icon size={18} />
                </span>
                <h3 className="mt-5 font-serif text-xl font-bold text-[hsl(220_45%_13%)]">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(220_25%_45%)]">{tool.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-[hsl(220_55%_20%)] group-hover:gap-2">
                  Use now <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(220_45%_13%)] px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[hsl(43_80%_60%)]">First-session activation</p>
            <h2 className="font-serif text-3xl font-bold text-[hsl(43_70%_88%)] md:text-4xl">The user should feel relief before checkout.</h2>
            <p className="mt-4 text-sm leading-relaxed text-[rgba(248,245,240,0.72)]">MindReply sells when the first output removes hesitation: what matters, who owns it, what to send, and what to do next.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/memberships" className="inline-flex items-center justify-center rounded-lg bg-[hsl(43_80%_60%)] px-6 py-3 text-sm font-semibold text-[hsl(220_45%_13%)]">
                Compare Growth and Pro
              </Link>
              <Link href="/professionals" className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-[hsl(43_70%_88%)]">
                Book expert review
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {proofSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(43_80%_60%)] text-sm font-bold text-[hsl(220_45%_13%)]">{index + 1}</span>
                <p className="mt-4 text-sm leading-relaxed text-[rgba(248,245,240,0.78)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 text-center shadow-sm" style={{ borderColor: "hsl(40 25% 88%)" }}>
          <Sparkles className="mx-auto text-[hsl(43_80%_42%)]" size={24} />
          <h2 className="mt-4 font-serif text-3xl font-bold text-[hsl(220_45%_13%)]">Recover the next 10 items now.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(220_25%_45%)]">Start with the overload analyzer. If it gives you a usable queue, buy credits for the next batch or move to Growth when this happens every day.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/tools/ops-overload-analyzer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(220_55%_20%)] px-6 py-3 text-sm font-semibold text-[hsl(43_70%_88%)]">
              Open Analyzer <ArrowRight size={14} />
            </Link>
            <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold text-[hsl(220_45%_13%)]" style={{ borderColor: "hsl(40 25% 88%)" }}>
              View all tools <CheckCircle2 size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
