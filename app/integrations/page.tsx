import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, MessageSquare, NotebookTabs, ShieldCheck } from "lucide-react";
import { getIntegrationConnectActions } from "@/lib/integrations";

const iconByKey = {
  slack: MessageSquare,
  gmail: Mail,
  notion: NotebookTabs,
};

export default function IntegrationsPage() {
  const integrations = getIntegrationConnectActions();
  const configured = integrations.filter((integration) => integration.status === "configured").length;

  return (
    <main className="min-h-screen pt-24 pb-16 px-4" style={{ background: "hsl(40 33% 97%)" }}>
      <section className="mx-auto max-w-6xl">
        <div className="rounded-3xl border p-7 md:p-9" style={{ borderColor: "rgba(201,169,97,0.32)", background: "linear-gradient(145deg, hsl(220 55% 20%), hsl(220 45% 13%))" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_60%)]">Pro system takeover</p>
          <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold text-[hsl(43_70%_88%)] md:text-5xl">Connect Slack, Gmail, and Notion into the operational brain.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[rgba(248,245,240,0.72)]">
            Signal is temporary. Growth remembers for 30 days. Pro becomes the invisible layer inside team chat, inbox pressure, and operating memory so users feel the cost of switching it off.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-[hsl(43_70%_88%)]">{configured}/3 configured</span>
            <span className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-[hsl(43_70%_88%)]">Pro dependency wedge</span>
            <span className="rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-[hsl(43_70%_88%)]">Slack + Gmail minimum</span>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {integrations.map((integration) => {
            const Icon = iconByKey[integration.key];
            return (
              <article key={integration.key} className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: "hsl(40 25% 88%)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
                    <Icon size={22} />
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: integration.status === "configured" ? "hsl(150 45% 92%)" : "hsl(43 80% 92%)", color: integration.status === "configured" ? "hsl(150 40% 28%)" : "hsl(38 75% 32%)" }}>
                    {integration.status}
                  </span>
                </div>
                <h2 className="mt-5 font-serif text-2xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>{integration.name}</h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>{integration.revenueUse}</p>
                <p className="mt-3 rounded-xl border px-3 py-2 text-xs font-semibold leading-relaxed" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)", background: "hsl(40 20% 96%)" }}>
                  {integration.dependencyFrame}
                </p>
                <div className="mt-5 grid gap-2">
                  <Link href={integration.connectPath} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold" style={{ background: "hsl(43 80% 60%)", color: "hsl(220 45% 13%)" }}>
                    {integration.connectReady ? "Connect now" : "View setup"} <ArrowRight size={14} />
                  </Link>
                  <code className="rounded-lg px-3 py-2 text-[11px] leading-5" style={{ background: "hsl(40 20% 96%)", color: "hsl(220 25% 42%)" }}>
                    {integration.requiredEnv.join(" + ")}
                  </code>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(43 80% 45%)" }}>Upgrade pressure</p>
            <h2 className="mt-2 font-serif text-2xl font-bold" style={{ color: "hsl(220 45% 13%)" }}>Integrations are not features. They are where dependency forms.</h2>
            <p className="mt-3 text-sm leading-6" style={{ color: "hsl(220 25% 45%)" }}>
              When MindReply sees the inbox, team thread, and operating notes, Pro stops feeling optional. It becomes the continuity layer users do not want to rebuild manually.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(43 80% 45%)" }}><ShieldCheck size={14} /> Activation sequence</p>
            {[
              "Connect Gmail first for daily inbox pressure.",
              "Connect Slack second for team workflow penetration.",
              "Connect Notion third for long-term operating memory.",
              "Push Pro when the user sees repeated context loss.",
            ].map((item) => (
              <div key={item} className="mb-2 flex gap-3 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 35% 30%)" }}>
                <CheckCircle2 size={15} style={{ color: "hsl(43 80% 45%)" }} />
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
