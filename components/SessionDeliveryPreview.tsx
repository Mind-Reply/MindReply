import { Brain, CheckCircle2, MessageSquare, Phone, ShieldCheck, Video } from "lucide-react";

type SessionMode = "text" | "voice" | "video";

type SessionDeliveryPreviewProps = {
  mode: SessionMode;
  professionalName?: string;
  compact?: boolean;
};

const modeConfig = {
  text: {
    icon: MessageSquare,
    title: "Text professional workspace",
    body: "Precise asynchronous review for sensitive drafts, decisions, and wording. The session room opens with a structured brief, copy workspace, and professional response path.",
    promise: "Best when the outcome is a clean message or specialist written guidance.",
  },
  voice: {
    icon: Phone,
    title: "Human-feeling voice room",
    body: "Private voice consultation with agenda framing, tone preparation, and decision notes so the call starts with context instead of confusion.",
    promise: "Best when you need fast advisory support and live clarification.",
  },
  video: {
    icon: Video,
    title: "AI-human video presence",
    body: "A premium video session room with professional presence, pre-session brief, live objective framing, and post-call action clarity.",
    promise: "Best for complex, sensitive, or high-stakes communication decisions.",
  },
} satisfies Record<SessionMode, { icon: typeof Video; title: string; body: string; promise: string }>;

export default function SessionDeliveryPreview({ mode, professionalName = "the field professional", compact = false }: SessionDeliveryPreviewProps) {
  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <section className={`rounded-2xl border ${compact ? "p-4" : "p-5 md:p-6"}`} style={{ borderColor: "rgba(201,169,97,0.32)", background: "linear-gradient(145deg, hsl(220 55% 20%), hsl(220 45% 13%))" }}>
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[rgba(248,245,240,0.16)] bg-[hsl(43_80%_60%)] text-[hsl(220_45%_13%)] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
          <Icon size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[hsl(43_80%_60%)]">
            <CheckCircle2 size={14} />
            Product delivery preview
          </p>
          <h2 className={`${compact ? "text-xl" : "text-2xl"} font-serif font-bold text-[hsl(43_70%_88%)]`}>{config.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[rgba(248,245,240,0.72)]">
            {config.body} Your access opens with {professionalName}.
          </p>
          <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-semibold text-[hsl(43_70%_88%)]">
              <Brain size={13} /> Pre-brief
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-semibold text-[hsl(43_70%_88%)]">
              <ShieldCheck size={13} /> Private room
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-semibold text-[hsl(43_70%_88%)]">
              <CheckCircle2 size={13} /> Action output
            </span>
          </div>
          <p className="mt-4 rounded-xl border border-[rgba(201,169,97,0.24)] bg-[rgba(201,169,97,0.10)] px-3 py-2 text-xs font-semibold leading-relaxed text-[hsl(43_70%_88%)]">
            {config.promise}
          </p>
        </div>
      </div>
    </section>
  );
}
