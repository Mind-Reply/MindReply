export {};

type Channel = "console" | "slack" | "email";

type SendResult = {
  channel: Channel;
  status: "sent" | "skipped" | "dry_run" | "failed";
  detail: string;
};

const env = process.env;
const enabled = env.MINDREPLY_REPORT_ENABLED === "true";
const dryRun = env.MINDREPLY_REPORT_DRY_RUN !== "false";
const requireDelivery = env.MINDREPLY_REPORT_REQUIRE_DELIVERY === "true";
const personalOnly = env.MINDREPLY_REPORT_PERSONAL_ONLY !== "false";
const requestedChannels = parseChannels(env.MINDREPLY_REPORT_CHANNELS || "console");
const ownerEmail = env.MINDREPLY_SECURITY_OWNER_EMAIL || "angelllkr@gmail.com";
const publicSecurityEmail = env.MINDREPLY_SECURITY_PUBLIC_EMAIL || "info@mind-reply.com";

const securityLanes = [
  "Headers and browser hardening",
  "Public route containment",
  "Secret handling",
  "Receipt privacy",
  "Dependency posture",
  "Deployment protection",
  "Runtime observability",
  "Incident response",
];

const promotionLanes = [
  "Positioning spine",
  "Homepage line",
  "MRagent line",
  "Personal Pack line",
  "Privacy trust line",
  "Founder post",
  "Operator post",
  "Sales reply angle",
  "Support escalation angle",
  "LinkedIn draft",
  "X short draft",
  "Email announcement",
  "Website CTA",
  "Figma asset queue",
  "Remotion spot",
  "Screenshot queue",
  "Demo script",
  "Case narrative",
  "Launch blocker watch",
  "Domain readiness",
  "Vercel readiness",
  "Analytics readiness",
  "Conversion event readiness",
  "Revenue truth",
  "Audience reply tracker",
  "Ad copy bank",
  "Distribution permission check",
  "Next move",
];

function parseList(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseChannels(value: string): Channel[] {
  const allowed = new Set<Channel>(["console", "slack", "email"]);
  const parsed = value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is Channel => allowed.has(item as Channel));
  return parsed.length ? [...new Set(parsed)] : ["console"];
}

function shortSha(value: string | undefined) {
  if (!value) return "unknown";
  return value.slice(0, 7);
}

function emailRecipients() {
  return [...new Set([...parseList(env.MINDREPLY_REPORT_EMAILS), ...parseList(env.MINDREPLY_REPORT_EMAIL)])];
}

function emailAllowed(email: string) {
  const allowlist = parseList(env.MINDREPLY_REPORT_EMAIL_ALLOWLIST).map((item) => item.toLowerCase());
  if (!personalOnly) return true;
  return allowlist.length > 0 && allowlist.includes(email.toLowerCase());
}

function reportMarkdown() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";
  const now = new Date().toISOString();
  const repo = env.GITHUB_REPOSITORY || "Mind-Reply/MindReply";
  const sha = shortSha(env.GITHUB_SHA);
  const recipients = emailRecipients();

  return [
    "# MindReply Activation Pack",
    "",
    `Generated: ${now}`,
    `Repo: ${repo}`,
    `Commit: ${sha}`,
    "Mode: authorized defensive security plus promotion preparation",
    "",
    "## Boundary",
    "- Defensive review, backup readiness, reporting, and approved promotion preparation only.",
    "- No unauthorized access, credential theft, stealth posting, scraping, spam, or third-party attack activity.",
    "- No revenue, conversion, or audience claims without a connected verified source.",
    "- All security data sent in reports must be evidence-first and redacted: no raw secrets, tokens, private pressure text, or credentials.",
    "",
    "## Owner Decision Desk",
    `- Owner route: ${ownerEmail}`,
    `- Public security route: ${publicSecurityEmail}`,
    "- Security findings become owner decision packets before changes that affect behavior, access, data retention, delivery, billing, or production rollout.",
    "- Each packet includes affected surface, evidence, impact, recommended decision, rollback or rotation note, and whether email or Slack delivery succeeded.",
    "- Urgent containment can pause exposure first, then the owner report records what changed and why.",
    "",
    "## Security Team - 8 lanes",
    ...securityLanes.map((lane, index) => `- ${String(index + 1).padStart(2, "0")} ${lane}: active watch, prepare owner decision packet, escalate only authorized fixes.`),
    "",
    "## Social And Ad Team - 28 lanes",
    ...promotionLanes.map((lane, index) => `- ${String(index + 1).padStart(2, "0")} ${lane}: prepare, review, and wait for connected account permission before external send.`),
    "",
    "## Current copy bank",
    "- Read the pressure. Move with grace. Keep the receipt narrow.",
    "- For the charged second before your tone becomes the story.",
    "- The pack does not perform. It reports.",
    "- Pressure is not a souvenir.",
    "",
    "## Delivery",
    `- Email recipients: ${recipients.length ? recipients.join(", ") : "not configured"}`,
    `- Slack: ${env.MINDREPLY_SLACK_WEBHOOK_URL ? "configured" : "not configured"}`,
    `- Dry run: ${dryRun ? "on" : "off"}`,
    `- Require delivery: ${requireDelivery ? "on" : "off"}`,
    "",
    "## Links",
    `- Home: ${siteUrl}/`,
    `- MRagent: ${siteUrl}/agent`,
    `- Personal Pack: ${siteUrl}/pack`,
    `- ChatGPT MCP: ${siteUrl}/mcp`,
    "- FigJam operating map: https://www.figma.com/board/G0lSiegpqHSoQDpmgoYKDL",
  ].join("\n");
}

function textFromMarkdown(markdown: string) {
  return markdown.replace(/^# /gm, "").replace(/^## /gm, "\n").replace(/^- /gm, "- ");
}

async function sendSlack(markdown: string): Promise<SendResult> {
  const webhookUrl = env.MINDREPLY_SLACK_WEBHOOK_URL;
  if (!webhookUrl) return { channel: "slack", status: "skipped", detail: "MINDREPLY_SLACK_WEBHOOK_URL is not configured." };
  if (!enabled) return { channel: "slack", status: "skipped", detail: "MINDREPLY_REPORT_ENABLED is not true." };
  if (dryRun) return { channel: "slack", status: "dry_run", detail: "Slack payload prepared but not sent." };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: textFromMarkdown(markdown) }),
  });

  if (!response.ok) return { channel: "slack", status: "failed", detail: `Slack returned ${response.status}.` };
  return { channel: "slack", status: "sent", detail: "Slack activation pack sent." };
}

async function sendEmail(markdown: string): Promise<SendResult> {
  const apiKey = env.RESEND_API_KEY;
  const to = emailRecipients();
  const from = env.MINDREPLY_REPORT_FROM;

  if (!apiKey || !to.length || !from) {
    return { channel: "email", status: "skipped", detail: "RESEND_API_KEY, MINDREPLY_REPORT_EMAILS, or MINDREPLY_REPORT_FROM is missing." };
  }

  const blocked = to.filter((email) => !emailAllowed(email));
  if (blocked.length) {
    return { channel: "email", status: "skipped", detail: "One or more recipients are not in MINDREPLY_REPORT_EMAIL_ALLOWLIST while personal-only mode is enabled." };
  }

  if (!enabled) return { channel: "email", status: "skipped", detail: "MINDREPLY_REPORT_ENABLED is not true." };
  if (dryRun) return { channel: "email", status: "dry_run", detail: `Email payload prepared for ${to.length} recipient(s) but not sent.` };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `MindReply activation pack - ${shortSha(env.GITHUB_SHA)}`,
      text: textFromMarkdown(markdown),
    }),
  });

  if (!response.ok) return { channel: "email", status: "failed", detail: `Resend returned ${response.status}.` };
  return { channel: "email", status: "sent", detail: `Activation pack sent to ${to.length} recipient(s).` };
}

function deliveryMissing(results: SendResult[]) {
  const requestedDelivery = requestedChannels.some((channel) => channel === "slack" || channel === "email");
  const delivered = results.some((result) => (result.channel === "slack" || result.channel === "email") && result.status === "sent");
  return requestedDelivery && !delivered;
}

async function main() {
  const markdown = reportMarkdown();
  const results: SendResult[] = [];

  if (requestedChannels.includes("console")) {
    console.log(markdown);
    results.push({ channel: "console", status: "sent", detail: "Activation pack printed to console." });
  }

  if (requestedChannels.includes("slack")) results.push(await sendSlack(markdown));
  if (requestedChannels.includes("email")) results.push(await sendEmail(markdown));

  console.log("\nDelivery results:");
  for (const result of results) console.log(`- ${result.channel}: ${result.status} - ${result.detail}`);

  if (results.some((result) => result.status === "failed")) process.exitCode = 1;
  if (requireDelivery && deliveryMissing(results)) {
    console.error("Required activation-pack delivery did not reach Slack or email.");
    process.exitCode = 1;
  }
}

void main();
