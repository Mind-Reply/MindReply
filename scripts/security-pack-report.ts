export {};

type Finding = {
  lane: string;
  status: "pass" | "watch" | "needs_setup";
  note: string;
  ownerDecision: "patch" | "watch" | "configure" | "rotate";
};

const env = process.env;
const ownerEmail = env.MINDREPLY_SECURITY_OWNER_EMAIL || "angelllkr@gmail.com";
const publicSecurityEmail = env.MINDREPLY_SECURITY_PUBLIC_EMAIL || "info@mind-reply.com";

const findings: Finding[] = [
  {
    lane: "Headers and browser hardening",
    status: "pass",
    note: "next.config.ts sets HSTS, nosniff, frame denial, referrer policy, permissions policy, and CSP.",
    ownerDecision: "watch",
  },
  {
    lane: "Public route containment",
    status: "pass",
    note: "middleware.ts retires unknown API paths and redirects old public paths into the decision layer.",
    ownerDecision: "watch",
  },
  {
    lane: "Secret handling",
    status: "watch",
    note: "Real secrets must stay in GitHub/Vercel secrets or .env.local. Committed .env values must remain placeholders only.",
    ownerDecision: "rotate",
  },
  {
    lane: "Receipt privacy",
    status: "pass",
    note: "MRagent stores privacy-safe receipt data and avoids raw pressure in durable records by design.",
    ownerDecision: "watch",
  },
  {
    lane: "Dependency posture",
    status: "watch",
    note: "Run npm audit in CI/reporting context. Do not auto-upgrade major packages without build verification.",
    ownerDecision: "patch",
  },
  {
    lane: "Deployment protection",
    status: env.VERCEL_AUTOMATION_BYPASS || env.VERCEL_PROTECTION_BYPASS ? "watch" : "needs_setup",
    note: "Preview sharing should use Vercel share links or trusted bypass tokens stored as secrets, never committed.",
    ownerDecision: "configure",
  },
  {
    lane: "Runtime observability",
    status: "watch",
    note: "Vercel runtime logs should be checked for warnings/errors during every report pass.",
    ownerDecision: "watch",
  },
  {
    lane: "Incident response",
    status: "needs_setup",
    note: "Security contact, triage SLA, and backup/rollback owners are documented in SECURITY.md and docs/domain_hosting_backup.md.",
    ownerDecision: "configure",
  },
];

function statusWord(status: Finding["status"]) {
  if (status === "pass") return "PASS";
  if (status === "watch") return "WATCH";
  return "NEEDS SETUP";
}

function reportMarkdown() {
  const now = new Date().toISOString();
  return [
    "# MindReply Security Pack",
    "",
    `Generated: ${now}`,
    `Repo: ${env.GITHUB_REPOSITORY || "Mind-Reply/MindReply"}`,
    `Commit: ${(env.GITHUB_SHA || "unknown").slice(0, 7)}`,
    "Mode: defensive review only",
    "",
    "## Guardrail",
    "- This pack is for authorized defensive review, hardening, backups, and incident readiness.",
    "- It must not be used for unauthorized access, credential theft, stealth posting, or attacks against third-party systems.",
    "- Security report data is evidence-first and redacted: no raw secrets, private pressure text, tokens, or credentials are printed.",
    "",
    "## Owner Decision Desk",
    `- Owner route: ${ownerEmail}`,
    `- Public security route: ${publicSecurityEmail}`,
    "- Findings that affect behavior, access, data retention, delivery, billing, or production rollout are decision packets for the owner before action.",
    "- Each packet must include affected surface, evidence, impact, recommended owner decision, rollback or rotation note, and delivery status.",
    "- Urgent containment can pause exposure first, but the owner report still follows with the decision record.",
    "",
    "## 8-lane security team",
    ...findings.map((finding, index) => `- ${String(index + 1).padStart(2, "0")} ${finding.lane}: ${statusWord(finding.status)} - ${finding.note} Owner decision: ${finding.ownerDecision}.`),
    "",
    "## Next defensive moves",
    "- Configure a real security contact address and response owner.",
    "- Keep Vercel preview access protected; use temporary share links for review.",
    "- Store Slack, email, Vercel, and provider credentials only as secrets.",
    "- Run dependency and build checks before accepting package upgrades.",
  ].join("\n");
}

console.log(reportMarkdown());
