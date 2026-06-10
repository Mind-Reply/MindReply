import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { createHash } from "node:crypto";

export const ROOT = process.cwd();
export const REPORT_DIR = path.join(ROOT, ".mindreply", "reports");
export const REPORT_PATH = path.join(REPORT_DIR, "latest_owner_report.md");
export const RECEIPT_PATH = path.join(REPORT_DIR, "delivery_receipt.json");
export const CHECK_PATH = path.join(REPORT_DIR, "report_check.json");
export const AUDIT_PATH = path.join(REPORT_DIR, "blueprint_audit.json");
export const OWNER_EMAILS = (
  process.env.MINDREPLY_REPORT_EMAILS ||
  process.env.MINDREPLY_REPORT_EMAIL ||
  "angellllkr@gmail.com,info@mind-reply.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
export const OWNER_EMAIL = OWNER_EMAILS[0] || "angellllkr@gmail.com";

export function ensureReportDir() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

export function writeJson(filePath, payload) {
  ensureReportDir();
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

export function boolEnv(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  return value.toLowerCase() === "true";
}

export function reportSettings() {
  const channels = (process.env.MINDREPLY_REPORT_CHANNELS || "email,slack")
    .split(",")
    .map((channel) => channel.trim().toLowerCase())
    .filter(Boolean);

  const emailReady = Boolean(process.env.RESEND_API_KEY && process.env.MINDREPLY_REPORT_FROM && OWNER_EMAILS.length > 0);
  const slackUrl = process.env.MINDREPLY_SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL || "";
  const slackReady = Boolean(slackUrl);
  const enabled = boolEnv("MINDREPLY_REPORT_ENABLED", false);
  const dryRun = boolEnv("MINDREPLY_REPORT_DRY_RUN", true);

  const blockers = [];
  if (!enabled) blockers.push("report lane disabled");
  if (channels.includes("email") && !emailReady && !dryRun) blockers.push("email secret missing");
  if (channels.includes("slack") && !slackReady && !dryRun) blockers.push("Slack webhook missing");

  return {
    timestamp: new Date().toISOString(),
    owner_email: OWNER_EMAIL,
    owner_emails: OWNER_EMAILS,
    channels,
    enabled,
    dry_run: dryRun,
    email_ready: emailReady,
    slack_ready: slackReady,
    slack_url: slackUrl,
    status: blockers.length > 0 ? "amber" : "green",
    blockers,
  };
}

export function reportId(seed = "") {
  return createHash("sha256")
    .update(`${new Date().toISOString()}|${OWNER_EMAIL}|${seed}`)
    .digest("hex")
    .slice(0, 16);
}

export function buildOwnerReport(receipt = null) {
  const settings = reportSettings();
  const status = receipt?.status || settings.status;
  const blockers = receipt?.blockers || settings.blockers;
  const blockerText = blockers.length > 0 ? blockers[0] : "none";
  const deployStatus =
    process.env.VERCEL_DEPLOY_STATUS ||
    process.env.VERCEL_URL ||
    "pending confirmation from Vercel project signal";
  const emailState = receipt?.channels?.email?.status || "pending";
  const slackState = receipt?.channels?.slack?.status || "pending";

  return `# MindReply Owner Report

- Current status: ${status}
- What changed this hour: private report lane checked revenue surface, trust proof, deploy continuity, assisted close, and buying-friction removal.
- Top blocker: ${blockerText}
- Next revenue move: sell Website Completion Package first, then remove the single buying friction found this hour.
- Owner decision needed: approve the next close action or hold until the blocker clears.
- Website Completion Package progress: authority layer, trust proof, pricing clarity, assisted close, and delivery proof are the active lanes.
- Vercel deploy status: ${deployStatus}
- Slack/email delivery receipt: email=${emailState}; slack=${slackState}

Private lane rule: no public page may claim active internal staff count or expose internal prompts.
Evidence rule: owner report carries redacted proof only.
`;
}

export function postJson(url, headers, body) {
  return new Promise((resolve) => {
    const payload = JSON.stringify(body);
    const request = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
          ...headers,
        },
      },
      (response) => {
        let responseBody = "";
        response.on("data", (chunk) => {
          responseBody += chunk;
        });
        response.on("end", () => {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status_code: response.statusCode,
            body: responseBody.slice(0, 500),
          });
        });
      },
    );

    request.on("error", (error) => {
      resolve({ ok: false, status_code: 0, body: error.message });
    });
    request.write(payload);
    request.end();
  });
}
