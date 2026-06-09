import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Bug,
  ChartNoAxesCombined,
  ClipboardCheck,
  CloudCog,
  Eye,
  FileCheck2,
  Fingerprint,
  Gauge,
  GitBranch,
  LockKeyhole,
  MailCheck,
  Megaphone,
  MessageSquareText,
  Network,
  Palette,
  Radar,
  ReceiptText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TestTubeDiagonal,
  Workflow,
} from "lucide-react";

const projectId = "prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3";

const expansionAgents = [
  { name: "MRagent Core", status: "live", lane: "pressure to one action", icon: BrainCircuit, proof: "Runs through /agent and /api/agent." },
  { name: "Risk Gate", status: "live", lane: "confidence, tone, escalation", icon: ShieldCheck, proof: "Returns risk and confidence in the Mind Read contract." },
  { name: "Receipt Keeper", status: "live", lane: "privacy-safe proof", icon: ReceiptText, proof: "Stores derived receipt fields; raw pressure is not the record." },
  { name: "MCP Bridge", status: "live", lane: "ChatGPT Developer Mode", icon: Network, proof: "Exposes prepare, render, and fetch receipt tools at /mcp." },
  { name: "Owner Decision Desk", status: "armed", lane: "security approvals", icon: Fingerprint, proof: "Security changes become owner packets before rollout." },
  { name: "Security Scout", status: "armed", lane: "headers, routes, secrets", icon: SearchCheck, proof: "Covered by report:security-pack." },
  { name: "Security Builder", status: "armed", lane: "small defensive fixes", icon: Bug, proof: "Uses scoped patches only; no offensive activity." },
  { name: "Security Verifier", status: "armed", lane: "build, logs, endpoints", icon: TestTubeDiagonal, proof: "Checks Vercel deployment and build evidence." },
  { name: "Vercel Watch", status: "connected", lane: "deployments and logs", icon: CloudCog, proof: `Bound to Vercel project ${projectId}.` },
  { name: "Report Courier", status: "secret-gated", lane: "email and Slack delivery", icon: MailCheck, proof: "Needs RESEND_API_KEY and Slack webhook before recurring sends." },
  { name: "Pack Messenger", status: "armed", lane: "30-minute Website Completion Package", icon: BellRing, proof: "GitHub workflow exists; delivery is enabled only with secrets." },
  { name: "Growth Scout", status: "ready", lane: "truthful reach expansion", icon: Megaphone, proof: "Prepares material; it does not spam or stealth post." },
  { name: "Pricing Signal", status: "ready", lane: "transactions and revenue truth", icon: ChartNoAxesCombined, proof: "Counters stay environment-driven until a real source connects." },
  { name: "Design Polisher", status: "ready", lane: "premium front end", icon: Palette, proof: "Keeps language warm, calm, and non-technical in public UI." },
  { name: "Copy Editor", status: "ready", lane: "public wording control", icon: MessageSquareText, proof: "Filters hype and forbidden positioning." },
  { name: "SEO Scout", status: "ready", lane: "discoverability without noise", icon: Radar, proof: "Sitemap and public routes remain clear." },
  { name: "QA Reader", status: "ready", lane: "overlap, clarity, mobile scan", icon: Eye, proof: "Targets visible front-end issues before claiming done." },
  { name: "Release Clerk", status: "ready", lane: "change record and rollback", icon: ClipboardCheck, proof: "Keeps commit, deploy, and next task linked." },
  { name: "Business Case", status: "ready", lane: "pack economics", icon: BriefcaseBusiness, proof: "Can prepare offers without inventing revenue." },
  { name: "Platform Archivist", status: "ready", lane: "docs and backup path", icon: FileCheck2, proof: "Keeps backup, domain, and hosting notes findable." },
  { name: "GitHub Runner", status: "connected", lane: "direct repo work", icon: GitBranch, proof: "Main branch changes flow through GitHub into Vercel." },
  { name: "Automation Governor", status: "armed", lane: "limits, consent, safety", icon: LockKeyhole, proof: "Does not bypass billing, auth, provider caps, or consent." },
  { name: "Expansion Planner", status: "ready", lane: "new lanes without chaos", icon: Sparkles, proof: "Adds only visible, testable platform progress." },
  { name: "Ops Gauge", status: "ready", lane: "status at a glance", icon: Gauge, proof: "Separates live facts from local or secret-gated work." },
];

const statusStyles: Record<string, string> = {
  live: "bg-[#103b39] text-[#f7f4ed]",
  armed: "bg-[#122033] text-[#f7f4ed]",
  connected: "bg-[#2f6f72] text-[#f7f4ed]",
  ready: "bg-[#e7d4a0] text-[#122033]",
  "secret-gated": "bg-[#d96f4a] text-white",
};

const commandRules = [
  "Every agent reports evidence, not theatre.",
  "Security decisions route through the owner desk before production-impacting changes.",
  "Slack and email automations need real secrets before recurring delivery can be claimed.",
  "Growth work prepares truthful material; publishing waits for connected accounts and approval.",
];

export default function AgentsPage() {
  const liveCount = expansionAgents.filter((agent) => ["live", "connected"].includes(agent.status)).length;
  const armedCount = expansionAgents.filter((agent) => ["armed", "ready"].includes(agent.status)).length;
  const gatedCount = expansionAgents.filter((agent) => agent.status === "secret-gated").length;

  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/capabilities" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              Capabilities
            </Link>
            <Link href="/agent" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Ask MRagent
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e2b757]">
              <Bot aria-hidden className="h-4 w-4" /> Agent expansion board
            </p>
            <h1 className="mt-7 font-serif text-5xl font-bold leading-[0.96] md:text-7xl">More agents, but with receipts.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              This is the quick expansion layer for MindReply on Vercel. It names the working lanes, the ready lanes, and the secret-gated lanes without pretending limits disappeared.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Live / connected</p>
              <p className="mt-3 text-4xl font-bold">{liveCount}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Armed / ready</p>
              <p className="mt-3 text-4xl font-bold">{armedCount}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#91d2c8]">Secret gated</p>
              <p className="mt-3 text-4xl font-bold">{gatedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Expansion roster</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-5xl">24 lanes now visible.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#59687b]">
              The point is more useful surface area, not noise. Each agent has a lane, status, and proof note so the board can grow without losing trust.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {expansionAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <article key={agent.name} className="rounded-lg border border-[#122033]/10 bg-white p-5 shadow-sm shadow-[#122033]/5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#122033] text-[#e2b757]">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusStyles[agent.status]}`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#9b7430]">{agent.lane}</p>
                  <h3 className="mt-3 font-serif text-2xl font-bold leading-tight">{agent.name}</h3>
                  <p className="mt-4 flex gap-2 text-sm leading-6 text-[#59687b]">
                    <BadgeCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                    <span>{agent.proof}</span>
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Command rules</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Fast, but owner-safe.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The expansion can move quickly because its limits are named. That makes it easier to add agents without breaking trust, privacy, or deployment quality.
            </p>
          </div>
          <div className="grid gap-3">
            {commandRules.map((rule) => (
              <div key={rule} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-[#f7f4ed] p-4 text-sm leading-6 text-[#39485b]">
                <Workflow aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-[#103b39] p-6 text-[#f8f5f0] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#91d2c8]">Next move</p>
            <h2 className="mt-3 font-serif text-3xl font-bold">Connect delivery secrets, then the report courier can actually send.</h2>
          </div>
          <Link href="/pack" className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
            Open pack <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
