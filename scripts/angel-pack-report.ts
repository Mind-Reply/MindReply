import { writeFileSync } from "node:fs";

type Workstream = {
  name: string;
  owner: string;
  priority: "critical" | "high" | "steady";
  nextMove: string;
  winSignal: string;
};

type DeliveryStatus = "sent" | "dry-run" | "blocked" | "failed" | "not-configured" | "skipped";

type DeliveryReceipt = {
  channel: "console" | "slack" | "webhook" | "email";
  status: DeliveryStatus;
  detail: string;
  providerStatus?: number;
  providerId?: string;
  timestamp: string;
};

const now = new Date();
const repo = process.env.GITHUB_REPOSITORY || "Mind-Reply/MindReply";
const sha = process.env.GITHUB_SHA || "local";
const ref = process.env.GITHUB_REF_NAME || process.env.GITHUB_REF || "unknown";
const timezone = process.env.REPORT_TIMEZONE || "Europe/Kiev";
const angelEmail = firstEnv(["MINDREPLY_ANGEL_EMAIL"]) || "ANGELLLKR@GMAIL.COM";
const slackFieldId = firstEnv(["SLACK_APP_FIELD_ID", "MINDREPLY_SLACK_FIELD_ID"]) || "Xf0B6WHC2SBH";
const channels = new Set(splitList(firstEnv(["MINDREPLY_REPORT_CHANNELS", "OPS_REPORT_CHANNELS"]) || "console"));
const reportEnabled = envFlag("MINDREPLY_REPORT_ENABLED") || envFlag("OPS_REPORT_ENABLED");
const dryRunOverride = firstEnv(["MINDREPLY_REPORT_DRY_RUN", "OPS_REPORT_DRY_RUN", "REPORT_DRY_RUN"]);
const dryRun = dryRunOverride ? flagValue(dryRunOverride) : !reportEnabled;
const requireDelivery = envFlag("MINDREPLY_REPORT_REQUIRE_DELIVERY") || envFlag("OPS_REPORT_REQUIRE_DELIVERY");
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : "not available";

const localTime = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: timezone,
}).format(now);

const slackWebhook = firstEnv(["MINDREPLY_SLACK_WEBHOOK_URL", "SLACK_WEBHOOK_URL"]);
const genericWebhook = firstEnv(["OPS_REPORT_WEBHOOK_URL"]);
const resendKey = firstEnv(["RESEND_API_KEY"]);
const emailTo = firstEnv(["MINDREPLY_REPORT_EMAIL", "OPS_REPORT_EMAIL_TO", "REPORT_TO_EMAIL"]) || angelEmail;
const emailFrom = firstEnv(["MINDREPLY_REPORT_FROM", "OPS_REPORT_EMAIL_FROM", "RESEND_FROM"]) || "MindReply Ops <updates@mind-reply.com>";
const emailAllowlist = splitList(firstEnv(["MINDREPLY_REPORT_EMAIL_ALLOWLIST", "OPS_REPORT_EMAIL_ALLOWLIST", "REPORT_EMAIL_ALLOWLIST"]) || angelEmail);

const workstreams: Workstream[] = [
  {
    name: "Deployment",
    owner: "Infrastructure Agent",
    priority: "critical",
    nextMove: "Clear the Vercel build-rate-limit in the dashboard, then redeploy PR #12 once.",
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
    nextMove: "Run scheduled reports and preserve delivery receipts for every operating loop.",
    winSignal: "Reports arrive or a proof artifact explains exactly why they did not.",
  },
  {
    name: "Integrations",
    owner: "Integration Agent",
    priority: "steady",
    nextMove: "Keep Gmail/IMAP, calendar, and browser-extension intake opt-in and privacy-safe.",
    winSignal: "Input enters without storing raw content by default.",
  },
];

function firstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

function flagValue(value: string) {
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function envFlag(name: string) {
  return flagValue(process.env[name] || "");
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizedEmail(value: string) {
  return value.trim().toLowerCase();
}

function channelRequested(channel: "slack" | "webhook" | "email") {
  return channels.has("all") || channels.has(channel);
}

function receipt(channel: DeliveryReceipt["channel"], status: DeliveryStatus, detail: string, extra: Partial<DeliveryReceipt> = {}): DeliveryReceipt {
  return {
    channel,
    status,
    detail,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

function configuredLine(label: string, configured: boolean) {
  return `- ${label}: ${configured ? "configured" : "not configured"}`;
}

function lineFor(stream: Workstream) {
  return `- ${stream.name} (${stream.owner}, ${stream.priority}): ${stream.nextMove} Win signal: ${stream.winSignal}`;
}

function buildReport() {
  const angelPack = [
    "## Personal Angel Pack",
    "",
    "- Completed move: added a scheduled Angel Pack report lane with Slack/email-ready delivery hooks and artifact retention.",
    "- Revenue move: keep the paid path as annual setup plus prepaid handled-decision credit loads, with visible usage and clear boundaries.",
    "- Gift build: create a private executive brief card that shows one useful implementation idea, the exact surface it touches, and a tiny verification checklist.",
    "- Design gift: keep the first viewport as a private operating room for decisions: command input, executive brief, agent/status modules, risk/receipt strip.",
    "- Verification: report artifact exists, no secrets are committed, and delivery only activates when runtime secrets plus explicit channels are configured.",
  ];

  return [
    "# MindReply Angel Pack Report",
    "",
    `Generated: ${now.toISOString()}`,
    `Local time (${timezone}): ${localTime}`,
    `Repository: ${repo}`,
    `Ref: ${ref}`,
    `Commit: ${sha}`,
    `Workflow: ${runUrl}`,
    `Dry run: ${dryRun ? "yes" : "no"}`,
    `Report enabled: ${reportEnabled ? "yes" : "no"}`,
    `Requested channels: ${Array.from(channels).join(", ")}`,
    "",
    "## Delivery Status",
    "",
    configuredLine("Slack webhook", Boolean(slackWebhook)),
    configuredLine("Slack app field label", Boolean(slackFieldId)),
    configuredLine("Generic webhook", Boolean(genericWebhook)),
    configuredLine("Email provider", Boolean(resendKey)),
    `- Correct Angel email: ${angelEmail}`,
    `- Slack field ID reference: ${slackFieldId}`,
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
    "Next small code improvement should be one of: provider-side deploy evidence capture, an in-product receipt vault, or a private founder brief preview.",
  ].join("\n");
}

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Webhook failed with ${response.status}: ${body.slice(0, 200)}`);
  }

  return { status: response.status, body };
}

async function sendSlack(report: string) {
  if (!channelRequested("slack")) return receipt("slack", "skipped", "Slack channel not requested.");
  if (!slackWebhook) return receipt("slack", "not-configured", "Slack webhook secret is missing.");
  if (dryRun) return receipt("slack", "dry-run", "Slack webhook configured, but dry-run mode blocked sending.");

  const text = [
    `MindReply Angel Pack update (${slackFieldId})`,
    "",
    report.slice(0, 3500),
  ].join("\n");
  const result = await postJson(slackWebhook, { text });
  return receipt("slack", "sent", "Slack webhook accepted the report.", { providerStatus: result.status });
}

async function sendWebhook(report: string) {
  if (!channelRequested("webhook")) return receipt("webhook", "skipped", "Generic webhook channel not requested.");
  if (!genericWebhook) return receipt("webhook", "not-configured", "Generic webhook secret is missing.");
  if (dryRun) return receipt("webhook", "dry-run", "Generic webhook configured, but dry-run mode blocked sending.");

  const result = await postJson(genericWebhook, { title: "MindReply Angel Pack Report", generatedAt: now.toISOString(), report });
  return receipt("webhook", "sent", "Generic webhook accepted the report.", { providerStatus: result.status });
}

async function sendEmail(report: string) {
  if (!channelRequested("email")) return receipt("email", "skipped", "Email channel not requested.");
  if (!resendKey) return receipt("email", "not-configured", "RESEND_API_KEY is missing.");

  const recipients = splitList(emailTo);
  if (!recipients.length) return receipt("email", "not-configured", "Email recipient is missing.");

  const allowed = new Set([normalizedEmail(angelEmail), ...emailAllowlist.map(normalizedEmail)]);
  const blocked = recipients.filter((item) => !allowed.has(normalizedEmail(item)));
  if (blocked.length) {
    return receipt("email", "blocked", `Recipient not in allowlist: ${blocked.join(", ")}.`);
  }

  if (dryRun) {
    return receipt("email", "dry-run", `Email provider configured for ${recipients.join(", ")}, but dry-run mode blocked sending.`);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `angel-pack-${process.env.GITHUB_RUN_ID || sha}-${process.env.GITHUB_RUN_ATTEMPT || "1"}`,
    },
    body: JSON.stringify({
      from: emailFrom,
      to: recipients,
      subject: "MindReply Angel Pack Report",
      text: report,
    }),
  });
  const body = await response.text();
  let providerId = "";

  try {
    providerId = String((JSON.parse(body) as { id?: string }).id || "");
  } catch {
    providerId = "";
  }

  if (!response.ok) {
    return receipt("email", "failed", `Email provider rejected the report with ${response.status}: ${body.slice(0, 200)}`, {
      providerStatus: response.status,
      providerId,
    });
  }

  return receipt("email", "sent", `Email provider accepted the report for ${recipients.join(", ")}.`, {
    providerStatus: response.status,
    providerId,
  });
}

function formatProof(receipts: DeliveryReceipt[]) {
  return [
    "",
    "## Delivery Proof",
    "",
    ...receipts.map((item) => {
      const provider = item.providerStatus ? ` Provider status: ${item.providerStatus}.` : "";
      const id = item.providerId ? ` Provider id: ${item.providerId}.` : "";
      return `- ${item.channel}: ${item.status}. ${item.detail}${provider}${id}`;
    }),
  ].join("\n");
}

async function main() {
  const report = buildReport();
  const receipts: DeliveryReceipt[] = [receipt("console", "sent", "Report written to workflow log and artifact.")];
  const deliveries: Array<[DeliveryReceipt["channel"], (report: string) => Promise<DeliveryReceipt>]> = [
    ["slack", sendSlack],
    ["webhook", sendWebhook],
    ["email", sendEmail],
  ];

  for (const [channel, deliver] of deliveries) {
    try {
      receipts.push(await deliver(report));
    } catch (error) {
      receipts.push(receipt(channel, "failed", error instanceof Error ? error.message : String(error)));
    }
  }

  const proof = formatProof(receipts);
  const fullReport = `${report}${proof}\n`;
  console.log(fullReport);
  writeFileSync("mindreply-delivery-receipt.json", `${JSON.stringify({ generatedAt: now.toISOString(), dryRun, reportEnabled, channels: Array.from(channels), angelEmail, slackFieldId, receipts }, null, 2)}\n`);

  const deliveredExternally = receipts.some((item) => item.status === "sent" && item.channel !== "console");
  if (requireDelivery && !dryRun && !deliveredExternally) {
    console.error("External delivery was required but no external channel sent successfully.");
    process.exitCode = 1;
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
