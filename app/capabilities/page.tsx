import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Cloud,
  Cpu,
  DatabaseZap,
  Gauge,
  LockKeyhole,
  Mail,
  MessageSquare,
  MonitorSmartphone,
  Network,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Video,
} from "lucide-react";

const publicEmail = "info@mind-reply.com";

const teams = [
  {
    name: "MRagent core",
    status: "Built",
    signal: "Live app lane",
    icon: BrainCircuit,
    copy: "The pressure-to-action surface: one read, one recommended move, one narrow receipt. Users should start here before contacting support.",
    worksNow: ["/agent surface", "API intake contract", "quiet receipt shape", "risk and confidence labels"],
  },
  {
    name: "ChatGPT app lane",
    status: "Built in repo",
    signal: "Needs deployed build",
    icon: Bot,
    copy: "MCP-facing shape for prepare, render, and receipt fetch. It is meant for Developer Mode connection once the production build is green.",
    worksNow: ["/mcp route files", "tool contract docs", "widget direction", "readiness scripts"],
  },
  {
    name: "Vercel operations",
    status: "Connected",
    signal: "Build repair active",
    icon: Cloud,
    copy: "The canonical project is mindreply. Domains are attached, Speed Insights is mounted, and deploy status is inspectable through Vercel.",
    worksNow: ["production project link", "deployment history", "custom domain ownership", "build failure visibility"],
  },
  {
    name: "AI Elements front end",
    status: "Partial",
    signal: "Markdown renderer target",
    icon: MonitorSmartphone,
    copy: "The right direction is AI Elements message rendering for generated text. The capability is planned around source components, not a black-box widget.",
    worksNow: ["chat component surface", "message rendering target", "React/Next.js structure", "compact and full app modes"],
  },
  {
    name: "Reports and visibility",
    status: "Built",
    signal: "Local scripts exist",
    icon: BarChart3,
    copy: "Readiness, launch, deployment, and delivery reports exist as scripts and report artifacts. They are useful for truth, not theatre.",
    worksNow: ["launch report", "release audit", "deploy preflight", "delivery receipt files"],
  },
  {
    name: "Slack and email pack",
    status: "Connector-ready",
    signal: "Needs approved tokens",
    icon: MessageSquare,
    copy: "Can triage/export/report once credentials and channel permissions are in place. Public contact should use the MindReply mailbox only.",
    worksNow: ["Slack export can be inspected", "email report scripts", "public mailbox", "no personal address policy"],
  },
  {
    name: "Promotion studio",
    status: "Draft lane",
    signal: "Approval-first",
    icon: Sparkles,
    copy: "Campaign angles, positioning, launch copy, and platform variants can be drafted. Publishing must wait for explicit account connection and approval.",
    worksNow: ["campaign copy queue", "public wording guard", "pack page", "review-first posture"],
  },
  {
    name: "NVIDIA AIQ research",
    status: "Not deployed",
    signal: "Runtime missing locally",
    icon: Cpu,
    copy: "AIQ is powerful for a research backend, but real deployment needs Git plus Docker/Python/uv or Kubernetes, and private NVIDIA/search keys.",
    worksNow: ["deployment plan known", "server URL handoff model", "secret rules", "runtime prerequisites mapped"],
  },
  {
    name: "Physical AI / reconstruction",
    status: "Concept-ready",
    signal: "Needs assets and GPU path",
    icon: Network,
    copy: "Neural reconstruction and infrastructure scaling belong in a separate technical lane with USD/scene assets, GPUs, and validation scenes.",
    worksNow: ["capability framing", "infrastructure checklist", "simulation path", "blocked-until-assets label"],
  },
];

const worktrees = [
  {
    folder: "MindReply",
    role: "Canonical production app",
    repo: "Mind-Reply/MindReply",
    status: "Use this for main",
    details: "Linked to Vercel project mindreply and the public domain. Local Git is present but command-line Git is unavailable, so GitHub connector is authoritative.",
  },
  {
    folder: "Mind-Reply",
    role: "Storage / older app copy",
    repo: "angellllkr-eng/Mind-Reply",
    status: "Inspect before copying",
    details: "Contains a separate Next.js app shape with heavier dependencies. Treat as source/storage until specific files are reviewed and moved deliberately.",
  },
  {
    folder: "WebApplication1",
    role: "Duplicate app copy",
    repo: "Mind-Reply/MindReply",
    status: "Do not deploy blindly",
    details: "Looks like another clone of the older app stack. Useful only if it contains missing assets after inspection.",
  },
];

const blockers = [
  "Local Git, npm, npx, and gh are not usable from this shell; GitHub and Vercel connectors are the reliable control plane.",
  "The newest Vercel production deployments are failing, so the latest main changes are not live until the build error chain is cleared.",
  "NVIDIA AIQ cannot be honestly marked deployed without the selected runtime and private keys configured outside chat.",
  "Slack/email sending cannot be claimed active until app tokens, channels, and delivery targets are confirmed.",
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
            <Link href="/agent" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Ask MRagent
            </Link>
            <Link href="/contact" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              Contact
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e2b757]">
            <Gauge aria-hidden className="h-4 w-4" /> Capability command board
          </p>
          <div className="mt-7 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <h1 className="font-serif text-5xl font-bold leading-[0.96] md:text-7xl">What teams exist, what works, and what is still gated.</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
                This page separates actual working MindReply lanes from connector-ready ideas. No theatre: built means built, connected means inspectable, and blocked means a credential/runtime/asset is still missing.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Canonical</p>
                <p className="mt-3 text-lg font-bold">MindReply main</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Public email</p>
                <p className="mt-3 break-words text-lg font-bold">{publicEmail}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">First move</p>
                <p className="mt-3 text-lg font-bold">Ask MRagent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Teams and lanes</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">Capability map</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#59687b]">
              The high-end version is disciplined: every lane has a status, a use, and a limit. That keeps the platform warm, sharp, and believable.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team) => {
              const Icon = team.icon;
              return (
                <article key={team.name} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#122033] text-[#e2b757]"><Icon aria-hidden className="h-5 w-5" /></span>
                    <span className="rounded-full bg-[#f7f4ed] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2f6f72]">{team.status}</span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#9b7430]">{team.signal}</p>
                  <h3 className="mt-3 font-serif text-2xl font-bold leading-tight">{team.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#59687b]">{team.copy}</p>
                  <div className="mt-5 grid gap-2">
                    {team.worksNow.map((item) => (
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
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Worktree truth</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Three folders found. One should steer production.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The right operating rule is: build on MindReply main, use Mind-Reply as reviewed storage, and treat WebApplication1 as duplicate material until proven useful.
            </p>
          </div>
          <div className="grid gap-4">
            {worktrees.map((tree) => (
              <article key={tree.folder} className="rounded-lg border border-[#122033]/10 bg-[#f7f4ed] p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold leading-tight">{tree.folder}</h3>
                    <p className="mt-1 text-sm font-semibold text-[#2f6f72]">{tree.role}</p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#9b7430]">{tree.status}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#59687b]">{tree.details}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#59687b]">{tree.repo}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg bg-[#103b39] p-6 text-[#f8f5f0]">
            <div className="flex items-center gap-3 text-[#91d2c8]">
              <ShieldCheck aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">How users should flow</p>
            </div>
            <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">Ask MRagent first. Contact only when the agent cannot solve it.</h2>
            <p className="mt-4 text-sm leading-7 text-[#d3e5e2]">
              That keeps support focused and protects privacy. The public route is MRagent, then contact form, then {publicEmail}. No personal mailbox belongs on the website.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                Open MRagent <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                Contact form <Mail aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[#122033]/10 bg-white p-6">
            <div className="flex items-center gap-3 text-[#d96f4a]">
              <TriangleAlert aria-hidden className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.22em]">Current blockers</p>
            </div>
            <div className="mt-6 grid gap-3">
              {blockers.map((blocker) => (
                <div key={blocker} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-6 text-[#59687b]">
                  <LockKeyhole aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#d96f4a]" />
                  <span>{blocker}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-[#122033]/10 bg-white p-5">
            <DatabaseZap aria-hidden className="h-6 w-6 text-[#2f6f72]" />
            <h3 className="mt-4 font-serif text-2xl font-bold">Data visualization</h3>
            <p className="mt-3 text-sm leading-6 text-[#59687b]">Best used for KPI boards, deployment timelines, receipt counts, and conversion events once the data source is confirmed.</p>
          </div>
          <div className="rounded-lg border border-[#122033]/10 bg-white p-5">
            <Video aria-hidden className="h-6 w-6 text-[#2f6f72]" />
            <h3 className="mt-4 font-serif text-2xl font-bold">Launch media</h3>
            <p className="mt-3 text-sm leading-6 text-[#59687b]">Remotion/Figma-style assets can explain MRagent, but should not delay the core site or publish unreviewed claims.</p>
          </div>
          <div className="rounded-lg border border-[#122033]/10 bg-white p-5">
            <Clock3 aria-hidden className="h-6 w-6 text-[#2f6f72]" />
            <h3 className="mt-4 font-serif text-2xl font-bold">Cadence</h3>
            <p className="mt-3 text-sm leading-6 text-[#59687b]">Recurring reports are designed around checked status and receipts. A real scheduler still needs Vercel Cron or another authorized runner.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
