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

assert(/schedule:[\s\S]*cron:\s*["']0 \* \* \* \*["']/.test(workflow), "Hourly schedule must run at minute 0 every hour.");
assert(workflow.includes("workflow_dispatch"), "Workflow must support manual dispatch.");
for (const command of ["npm run report:check", "npm run launch:report", "npm run audit:blueprint", "npm run report:send"]) {
  assert(workflow.includes(command), `Workflow must run ${command}.`);
}

assert(workflow.includes("RESEND_API_KEY"), "Workflow must expose RESEND_API_KEY to the sender.");
assert(workflow.includes("MINDREPLY_REPORT_EMAIL"), "Workflow must expose MINDREPLY_REPORT_EMAIL through secrets or variables.");
assert(workflow.includes("MINDREPLY_REPORT_FROM"), "Workflow must expose MINDREPLY_REPORT_FROM.");
assert(workflow.includes("MINDREPLY_SLACK_WEBHOOK_URL") || workflow.includes("SLACK_WEBHOOK_URL"), "Workflow must expose a Slack webhook path.");
assert(workflow.includes("actions/upload-artifact"), "Workflow must upload report artifacts.");

const publicConfigText = [workflow, prompt].join("\n");
assert(!/gmail\.com/i.test(publicConfigText), "Do not hardcode personal Gmail addresses in public workflow or docs.");

const contractText = [prompt, sender, generator].join("\n");
for (const phrase of [
  "Website Completion Package",
  "revenue system",
  "assisted close",
  "defensive security boundary",
  "Slack",
  "email",
]) {
  assert(contractText.toLowerCase().includes(phrase.toLowerCase()), `Missing hourly owner contract phrase: ${phrase}`);
}

console.log("Hourly owner report automation contract verified.");
