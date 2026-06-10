import {
  DeliveryResult,
  deliveryReceiptPath,
  envFlag,
  readReportMarkdown,
  reportRecipients,
  requestedChannels,
  slackWebhookUrl,
  textFromMarkdown,
  writeJsonFile,
} from "./hourly-owner-report-lib";

const enabled = envFlag("MINDREPLY_REPORT_ENABLED", false);
const dryRun = envFlag("MINDREPLY_REPORT_DRY_RUN", true);
const requireDelivery = envFlag("MINDREPLY_REPORT_REQUIRE_DELIVERY", false);
const channels = requestedChannels();
const markdown = await readReportMarkdown();
const text = textFromMarkdown(markdown);

async function sendEmail(): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MINDREPLY_REPORT_FROM;
  const to = reportRecipients();

  if (!apiKey || !from || !to.length) {
    return { channel: "email", status: "blocked", detail: "RESEND_API_KEY, MINDREPLY_REPORT_FROM, or owner recipient is missing." };
  }

  if (!enabled) return { channel: "email", status: "skipped", detail: "MINDREPLY_REPORT_ENABLED is not true." };
  if (dryRun) return { channel: "email", status: "dry_run", detail: `Email payload prepared for ${to.join(", ")} but not sent.` };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "MindReply Hourly Owner Report",
      text,
    }),
  });

  if (!response.ok) return { channel: "email", status: "failed", detail: `Resend returned ${response.status}.` };
  return { channel: "email", status: "sent", detail: `Email sent to ${to.join(", ")}.` };
}

async function sendSlack(): Promise<DeliveryResult> {
  const webhookUrl = slackWebhookUrl();

  if (!webhookUrl) return { channel: "slack", status: "blocked", detail: "MINDREPLY_SLACK_WEBHOOK_URL or SLACK_WEBHOOK_URL is missing." };
  if (!enabled) return { channel: "slack", status: "skipped", detail: "MINDREPLY_REPORT_ENABLED is not true." };
  if (dryRun) return { channel: "slack", status: "dry_run", detail: "Slack payload prepared but not sent." };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) return { channel: "slack", status: "failed", detail: `Slack returned ${response.status}.` };
  return { channel: "slack", status: "sent", detail: "Slack report sent." };
}

const results: DeliveryResult[] = [];
if (channels.includes("console")) {
  console.log(markdown);
  results.push({ channel: "console", status: "sent", detail: "Report printed to console." });
}
if (channels.includes("email")) results.push(await sendEmail());
if (channels.includes("slack")) results.push(await sendSlack());

const delivered = results.some((result) => (result.channel === "email" || result.channel === "slack") && result.status === "sent");
const receipt = {
  generatedAt: new Date().toISOString(),
  enabled,
  dryRun,
  requireDelivery,
  channels,
  delivered,
  results,
};

await writeJsonFile(deliveryReceiptPath, receipt);

console.log("Hourly owner delivery receipt:");
for (const result of results) console.log(`- ${result.channel}: ${result.status} - ${result.detail}`);

const hardFailure = results.some((result) => result.status === "failed") || (requireDelivery && !delivered);
if (hardFailure) process.exitCode = 1;
