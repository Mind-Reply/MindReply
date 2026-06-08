type Workstream = {
  name: string;
  owner: string;
  priority: "critical" | "high" | "steady";
  nextMove: string;
  winSignal: string;
};

const now = new Date();
const repo = process.env.GITHUB_REPOSITORY || "Mind-Reply/MindReply";
const sha = process.env.GITHUB_SHA || "local";
const ref = process.env.GITHUB_REF_NAME || process.env.GITHUB_REF || "unknown";
const timezone = process.env.REPORT_TIMEZONE || "Europe/Kiev";
const dryRun = process.env.MINDREPLY_REPORT_DRY_RUN === "1" || process.env.REPORT_DRY_RUN === "1";
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : "not available";

const localTime = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: timezone,
}).format(now);

const slackConfigured = Boolean(process.env.SLACK_WEBHOOK_URL);
const slackFieldConfigured = Boolean(process.env.SLACK_APP_FIELD_ID);
const webhookConfigured = Boolean(process.env.OPS_REPORT_WEBHOOK_URL);
const emailConfigured = Boolean(process.env.RESEND_API_KEY && (process.env.OPS_REPORT_EMAIL_TO || process.env.REPORT_TO_EMAIL));

const workstreams: Workstream[] = [
  {
    name: "Deployment",
    owner: "Infrastructure Agent",
    priority: "critical",
    nextMove: "Clear the Vercel build-rate-limit in the dashboard, then redeploy PR #12.",
    winSignal: "Preview opens and /api/health returns ready.",
  },
  {
    name: "Public Surface",
    owner: "Frontend Agent",
    priority: "high",
    nextMove: "Keep / and /agent focused on one synthesis and one recommended action.",
    winSignal: "No internal operating language appears on public pages.",
  },
  {
    name: "MRagent",
    owner: "Reasoning Agent",
    priority: "high",
    nextMove: "Keep every response warm, calm, useful, and receipt-backed.",
    winSignal: "A visitor can paste pressure and receive one clear move.",
  },
  {
    name: "Security",
    owner: "Security Agent",
    priority: "critical",
    nextMove: "Keep secrets out of code and require dashboard/provider-side env configuration.",
    winSignal: "Secret scan stays clean before merge.",
  },
  {
    name: "Revenue Pack",
    owner: "Business Agent",
    priority: "high",
    nextMove: "Offer an annual Executive Nervous System setup plus credit load for handled decisions.",
    winSignal: "One buyer path: founder invite -> decision sample -> annual setup.",
  },
  {
    name: "Conversion Copy",
    owner: "Growth Agent",
    priority: "steady",
    nextMove: "Use calm high-pressure language: next move, private receipt, memory, risk check.",
    winSignal: "Visitor understands the outcome without reading feature lists.",
  },
  {
    name: "Operations",
    owner: "DevOps Agent",
    priority: "high",
    nextMove: "Run scheduled reports and preserve artifacts for every operating loop.",
    winSignal: "Reports arrive or artifact is available without manual inspection.",
  },
  {
    name: "Integrations",
    owner: "Integration Agent",
    priority: "steady",
    nextMove: "Keep Gmail/IMAP, calendar, browser-extension intake opt-in and privacy-safe.",
    winSignal: "Input enters without storing raw content by default.",
  },
];

function lineFor(stream: Workstream) {
  return `- ${stream.name} (${stream.owner}, ${stream.priority}): ${stream.nextMove} Win signal: ${stream.winSignal}`;
}

function configuredLine(label: string, configured: boolean) {
  return `- ${label}: ${configured ? "configured" : "not configured"}`;
}

const angelPack = [
  "## Personal Angel Pack",
  "",
  "- Completed move: added a scheduled Angel Pack report lane with Slack/email-ready delivery hooks and artifact retention.",
  "- Revenue move: keep the paid path as annual setup plus prepaid handled-decision credit loads, with visible usage and clear boundaries.",
  "- Gift build: create a private executive brief card that shows one useful implementation idea, the exact surface it touches, and a tiny verification checklist.",
  "- Design gift: keep the first viewport as a private operating room for decisions: command input, executive brief, agent/status modules, risk/receipt strip.",
  "- Verification: report artifact exists, no secrets are committed, delivery only activates when runtime secrets are configured.",
];

const report = [
  "# MindReply Angel Pack Report",
  "",
  `Generated: ${now.toISOString()}`,
  `Local time (${timezone}): ${localTime}`,
  `Repository: ${repo}`,
  `Ref: ${ref}`,
  `Commit: ${sha}`,
  `Workflow: ${runUrl}`,
  `Dry run: ${dryRun ? "yes" : "no"}`,
  "",
  "## Delivery Status",
  "",
  configuredLine("Slack webhook", slackConfigured),
  configuredLine("Slack app field label", slackFieldConfigured),
  configuredLine("Generic webhook", webhookConfigured),
  configuredLine("Email delivery", emailConfigured),
  "- Secret values are never printed in this report.",
  "",
  "## Current Deploy Truth",
  "",
  "- Active PR: #12, `codex/executive-nervous-system-main-sync`.",
  "- Known blocker: Vercel status points to `upgradeToPro=build-rate-limit`.",
  "- Code-side protection: ignored-build guard and `.vercelignore` are present on the branch.",
  "- Owner action: confirm Vercel Pro or wait for the rate-limit window, then redeploy once.",
  "",
  "## 8 Workstreams",
  "",
  ...workstreams.map(lineFor),
  "",
  "## Revenue Pack",
  "",
  "- Annual setup: private Executive Nervous System installation for the founder or operator.",
  "- Credit load: a handled-decision bundle for reply rescue, risk checks, memory receipts, and follow-up placement.",
  "- Starter/Growth/Scale can map to access, implementation support, and workflow rollout depth.",
  "- First win: paste one pressure-heavy message and receive one synthesis, one recommended action, one private receipt.",
  "- Upgrade moment: after the first useful decision, offer a handled-decision pack instead of more menus.",
  "",
  ...angelPack,
  "",
  "## Surprise Build Slot",
  "",
  "Next small code improvement should be one of: stronger receipt persistence, cleaner MRagent preview, or provider-side deploy evidence capture.",
].join("\n");

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with ${response.status}`);
  }
}

async function maybeSend() {
  if (dryRun) {
    console.log("Report delivery skipped because dry-run mode is active.");
    return;
  }

  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  const genericWebhook = process.env.OPS_REPORT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.OPS_REPORT_EMAIL_TO || process.env.REPORT_TO_EMAIL;
  const emailFrom = process.env.OPS_REPORT_EMAIL_FROM || process.env.RESEND_FROM || "MindReply Ops <ops@mind-reply.com>";

  if (slackWebhook) {
    await postJson(slackWebhook, { text: report.slice(0, 3800) });
  }

  if (genericWebhook) {
    await postJson(genericWebhook, { title: "MindReply Angel Pack Report", generatedAt: now.toISOString(), report });
  }

  if (resendKey && emailTo) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `angel-pack-${process.env.GITHUB_RUN_ID || sha}-${process.env.GITHUB_RUN_ATTEMPT || "1"}`,
      },
      body: JSON.stringify({
        from: emailFrom,
        to: emailTo.split(",").map((item) => item.trim()).filter(Boolean),
        subject: "MindReply Angel Pack Report",
        text: report,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email send failed with ${response.status}`);
    }
  }
}

console.log(report);

maybeSend().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
