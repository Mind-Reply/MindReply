import { existsSync, readFileSync } from "node:fs";
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

const requiredScripts = ["report:check", "launch:report", "audit:blueprint", "report:send"];
for (const script of requiredScripts) {
  assert(packageJson.scripts?.[script], `Missing package script: ${script}`);
}

assert(workflow.includes("MindReply 50-Minute Owner Report"), "Workflow must be named for the 50-minute report cadence.");
assert(/schedule:[\s\S]*cron:\s*["']\*\/10 \* \* \* \*["']/.test(workflow), "Workflow must poll every 10 minutes.");
assert(workflow.includes("minute_mod") && workflow.includes("% 50"), "Workflow must enforce the 50-minute send gate.");
assert(workflow.includes("SHOULD_SEND_REPORT"), "Workflow must skip delivery outside the 50-minute window.");
assert(workflow.includes("workflow_dispatch"), "Workflow must support manual dispatch.");
for (const command of ["npm run report:check", "npm run launch:report", "npm run audit:blueprint", "npm run report:send"]) {
  assert(workflow.includes(command), `Workflow must run ${command}.`);
}

assert(workflow.includes("RESEND_API_KEY"), "Workflow must expose RESEND_API_KEY to the sender.");
assert(workflow.includes("MINDREPLY_REPORT_EMAIL"), "Workflow must expose MINDREPLY_REPORT_EMAIL through secrets or variables.");
assert(workflow.includes("ANGELLLKR@GMAIL.COM"), "Workflow must default owner reports to ANGELLLKR@GMAIL.COM.");
assert(workflow.includes("MINDREPLY_REPORT_FROM"), "Workflow must expose MINDREPLY_REPORT_FROM.");
assert(workflow.includes("MINDREPLY_PACKAGE_REQUEST_TO"), "Workflow must expose MINDREPLY_PACKAGE_REQUEST_TO.");
assert(workflow.includes("MINDREPLY_PACKAGE_REQUEST_FROM"), "Workflow must expose MINDREPLY_PACKAGE_REQUEST_FROM.");
assert(workflow.includes("MINDREPLY_PACKAGE_REQUEST_DRY_RUN"), "Workflow must expose MINDREPLY_PACKAGE_REQUEST_DRY_RUN.");
assert(workflow.includes("MINDREPLY_SLACK_WEBHOOK_URL") || workflow.includes("SLACK_WEBHOOK_URL"), "Workflow must expose a Slack webhook path.");
assert(workflow.includes("NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL"), "Workflow must expose the package payment URL variable.");
assert(workflow.includes("actions/upload-artifact"), "Workflow must upload report artifacts.");

const contractText = [prompt, sender, generator].join("\n");
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
  "email",
]) {
  assert(contractText.toLowerCase().includes(phrase.toLowerCase()), `Missing owner report contract phrase: ${phrase}`);
}

assert(generator.includes("Assisted Close / Package Request"), "Owner report must include assisted-close package request status.");
assert(generator.includes("packageRequest"), "Owner receipt must include package request readiness data.");
assert(generator.includes("MINDREPLY_PACKAGE_REQUEST_TO"), "Owner generator must inspect package request recipient configuration.");
assert(generator.includes("MINDREPLY_PACKAGE_REQUEST_FROM"), "Owner generator must inspect package request sender configuration.");
assert(generator.includes("RESEND_API_KEY"), "Owner generator must inspect package request provider configuration.");

console.log("50-minute owner report automation contract verified.");
