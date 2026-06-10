import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function readRequired(relativePath: string) {
  const filePath = path.join(root, relativePath);
  if (!existsSync(filePath)) throw new Error(`Missing required file: ${relativePath}`);
  return readFileSync(filePath, "utf8");
}

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const packageJson = JSON.parse(readRequired("package.json")) as { scripts?: Record<string, string> };
const workflow = readRequired(".github/workflows/hourly-owner-report.yml");
const prompt = readRequired("docs/hourly_owner_goal_prompt.md");
const sender = readRequired("scripts/send-hourly-owner-report.ts");
const generator = readRequired("scripts/hourly-owner-report.ts");
const slackOps = readRequired("docs/ops/slack-email-reporting.md");
const slackApi = readRequired("site/automation/slack-api.yml");
const reportSchema = readRequired("site/automation/report-schema.yml");

const scanSkipDirs = new Set([".git", ".next", "node_modules", "reports", ".vercel"]);
const scanTextExts = new Set([".md", ".ts", ".tsx", ".js", ".mjs", ".json", ".yml", ".yaml", ".txt"]);
const forbiddenSlackPatterns = [
  /join\.slack\.com/i,
  /slack\.com\/join/i,
  /slack\.com\/invite/i,
  /shareDM\/zt-/i,
  /hooks\.slack\.com\/services/i,
  /xox[baprs]-[A-Za-z0-9-]+/i,
];

function scanTextFiles(dir = root) {
  const matches: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (scanSkipDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(root, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      matches.push(...scanTextFiles(fullPath));
      continue;
    }

    if (!entry.isFile() || !scanTextExts.has(path.extname(entry.name).toLowerCase())) continue;
    const content = readFileSync(fullPath, "utf8");
    if (forbiddenSlackPatterns.some((pattern) => pattern.test(content))) matches.push(relativePath);
  }
  return matches;
}

const requiredScripts = ["report:check", "launch:report", "audit:blueprint", "report:send", "verify:live-revenue"];
for (const script of requiredScripts) {
  assert(packageJson.scripts?.[script], `Missing package script: ${script}`);
}

assert(workflow.includes("MindReply Hourly Owner Report"), "Workflow must be named for the hourly owner report cadence.");
assert(/schedule:[\s\S]*cron:\s*["']0 \* \* \* \*['"]/.test(workflow), "Hourly schedule must run at minute 0 every hour.");
assert(!workflow.includes("minute_mod") && !workflow.includes("SHOULD_SEND_REPORT"), "Hourly workflow must not use the old 50-minute gate.");
assert(workflow.includes("workflow_dispatch"), "Workflow must support manual dispatch.");
assert(!/push:[\s\S]*paths:/.test(workflow), "Workflow push trigger must not be path-limited; every main implementation push needs an owner report when push is enabled.");
assert(workflow.includes("mindreply-hourly-owner-report-${{ github.ref }}"), "Workflow concurrency must be scoped to the branch ref.");
assert(workflow.includes("cancel-in-progress: true"), "Workflow must cancel stale owner report runs during rapid implementation pushes.");
assert(workflow.includes("retention-days: 7"), "Workflow should keep private report artifacts on short retention.");
for (const command of ["npm run report:check", "npm run launch:report", "npm run audit:blueprint", "npm run verify:live-revenue", "npm run report:send"]) {
  assert(workflow.includes(command), `Workflow must run ${command}.`);
}

assert(workflow.includes("RESEND_API_KEY"), "Workflow must expose RESEND_API_KEY to the sender.");
assert(workflow.includes("MINDREPLY_REPORT_EMAIL"), "Workflow must expose MINDREPLY_REPORT_EMAIL through secrets or variables.");
assert(workflow.includes("MINDREPLY_REPORT_FROM"), "Workflow must expose MINDREPLY_REPORT_FROM.");
assert(workflow.includes("MINDREPLY_REPORT_REQUIRE_LIVE_PROOF"), "Workflow must require live-domain proof before sending when configured.");
assert(workflow.includes("MINDREPLY_LIVE_VERIFY_URL"), "Workflow must pass the live domain URL into the verifier.");
assert(workflow.includes("MINDREPLY_REQUIRE_LIVE_SHA_MATCH"), "Workflow must set live SHA verification mode explicitly.");
assert(workflow.includes("continue-on-error: true"), "Workflow must continue after live verifier failure so the failed proof can be attached to the owner report.");
assert(workflow.includes("mindreply-live-revenue-surface.json"), "Workflow must upload the live revenue surface proof artifact.");
assert(workflow.includes("MINDREPLY_PACKAGE_REQUEST_TO"), "Workflow must expose MINDREPLY_PACKAGE_REQUEST_TO.");
assert(workflow.includes("MINDREPLY_PACKAGE_REQUEST_FROM"), "Workflow must expose MINDREPLY_PACKAGE_REQUEST_FROM.");
assert(workflow.includes("MINDREPLY_PACKAGE_REQUEST_DRY_RUN"), "Workflow must expose MINDREPLY_PACKAGE_REQUEST_DRY_RUN.");
assert(workflow.includes("MINDREPLY_SLACK_WEBHOOK_URL") || workflow.includes("SLACK_WEBHOOK_URL"), "Workflow must expose a Slack webhook path.");
assert(workflow.includes("MINDREPLY_SLACK_DM_INVITE_AVAILABLE"), "Workflow must expose the non-secret Slack DM invite availability flag.");
assert(workflow.includes("NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL"), "Workflow must expose the package payment URL variable.");
assert(workflow.includes("actions/upload-artifact"), "Workflow must upload report artifacts.");

const publicConfigText = [workflow, prompt, slackOps, slackApi, reportSchema].join("\n");
assert(!/gmail\.com/i.test(publicConfigText), "Do not hardcode personal Gmail addresses in public workflow or docs.");
assert(!/join\.slack\.com/i.test(publicConfigText), "Do not commit private Slack invite URLs in workflow or docs.");
assert(scanTextFiles().length === 0, "Committed text files must not contain Slack invite links, webhook URLs, or Slack tokens.");

const contractText = [prompt, sender, generator, workflow, slackOps, slackApi, reportSchema].join("\n");
for (const phrase of [
  "Website Completion Package",
  "revenue system",
  "assisted close",
  "package request",
  "/api/package-request",
  "rawContentRedacted",
  "fallback email",
  "payment",
  "invoice",
  "defensive security boundary",
  "Slack",
  "Slack DM invite",
  "MINDREPLY_SLACK_DM_INVITE_AVAILABLE",
  "email",
  "Live Production Revenue Surface",
]) {
  assert(contractText.toLowerCase().includes(phrase.toLowerCase()), `Missing hourly owner contract phrase: ${phrase}`);
}

assert(generator.includes("Assisted Close / Package Request"), "Hourly report must include assisted-close package request status.");
assert(generator.includes("packageRequest"), "Hourly receipt must include package request readiness data.");
assert(generator.includes("MINDREPLY_PACKAGE_REQUEST_TO"), "Hourly generator must inspect package request recipient configuration.");
assert(generator.includes("MINDREPLY_PACKAGE_REQUEST_FROM"), "Hourly generator must inspect package request sender configuration.");
assert(generator.includes("RESEND_API_KEY"), "Hourly generator must inspect package request provider configuration.");
assert(sender.includes("readLiveRevenueProof"), "Sender must attach live revenue proof when available.");
assert(sender.includes("MINDREPLY_REPORT_REQUIRE_LIVE_PROOF"), "Sender must be able to block delivery when live proof is missing.");
assert(sender.includes("liveRevenueSurface"), "Delivery receipt must include live revenue surface status.");
assert(sender.includes("redactSensitiveTransportText"), "Sender must redact private Slack routing before email or Slack delivery.");
assert(sender.includes("sensitiveTransportRedaction"), "Delivery receipt must include sensitive transport redaction status.");
assert(generator.includes("dmInviteAvailable"), "Hourly receipt must include Slack DM invite availability status.");
assert(generator.includes("scanForSlackSecrets"), "Hourly generator must scan text files before claiming Slack invite/webhook exposure state.");
assert(generator.includes("inviteUrlCommitted"), "Hourly receipt must include measured Slack invite/webhook exposure status.");

console.log("Hourly owner report automation contract verified.");
