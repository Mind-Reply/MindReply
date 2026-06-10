import fs from "node:fs";
import {
  buildOwnerReport,
  ensureReportDir,
  OWNER_EMAIL,
  OWNER_EMAILS,
  postJson,
  RECEIPT_PATH,
  REPORT_PATH,
  reportId,
  reportSettings,
  writeJson,
} from "./report-shared.mjs";

ensureReportDir();
const settings = reportSettings();
const reportText = fs.existsSync(REPORT_PATH) ? fs.readFileSync(REPORT_PATH, "utf8") : buildOwnerReport();
const receipt = {
  report_id: reportId(reportText),
  created_at: new Date().toISOString(),
  status: settings.status,
  owner_email: OWNER_EMAIL,
  owner_emails: OWNER_EMAILS,
  blockers: [...settings.blockers],
  channels: {},
  security_boundary: "private redacted owner evidence only",
};

async function sendEmail() {
  if (!settings.channels.includes("email")) return { status: "skipped", reason: "channel not selected" };
  if (!settings.enabled) return { status: "blocked", reason: "report lane disabled" };
  if (settings.dry_run) return { status: "dry_run", to: OWNER_EMAILS };
  if (!settings.email_ready) return { status: "blocked", reason: "email secret missing", to: OWNER_EMAILS };

  const result = await postJson(
    "https://api.resend.com/emails",
    { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    {
      from: process.env.MINDREPLY_REPORT_FROM,
      to: OWNER_EMAILS,
      subject: "MindReply owner report",
      text: reportText,
    },
  );

  return {
    status: result.ok ? "sent" : "failed",
    to: OWNER_EMAILS,
    provider_status: result.status_code,
    provider_body: result.body,
  };
}

async function sendSlack() {
  if (!settings.channels.includes("slack")) return { status: "skipped", reason: "channel not selected" };
  if (!settings.enabled) return { status: "blocked", reason: "report lane disabled" };
  if (settings.dry_run) return { status: "dry_run" };
  if (!settings.slack_ready) return { status: "blocked", reason: "Slack webhook missing" };

  const result = await postJson(settings.slack_url, {}, { text: reportText });
  return {
    status: result.ok ? "sent" : "failed",
    provider_status: result.status_code,
    provider_body: result.body,
  };
}

receipt.channels.email = await sendEmail();
receipt.channels.slack = await sendSlack();
receipt.status = Object.values(receipt.channels).some((channel) => channel.status === "failed") ? "red" : settings.status;
receipt.blockers = [
  ...receipt.blockers,
  ...Object.values(receipt.channels)
    .filter((channel) => channel.status === "blocked")
    .map((channel) => channel.reason),
].filter(Boolean);

writeJson(RECEIPT_PATH, receipt);
fs.writeFileSync(REPORT_PATH, buildOwnerReport(receipt), "utf8");
console.log(`Owner report delivery receipt: ${receipt.status}`);
if (receipt.blockers.length > 0) {
  console.log(`Blocked: ${receipt.blockers.join("; ")}`);
}
