import fs from "node:fs";
import path from "node:path";
import { AUDIT_PATH, readText, ROOT, writeJson } from "./report-shared.mjs";

function includesAll(text, values) {
  return values.every((value) => text.includes(value));
}

const packageJson = JSON.parse(readText("package.json"));
const workflow = readText(".github/workflows/hourly-owner-report.yml");
const prompt = readText("docs/hourly_owner_goal_prompt.md");
const security = readText("docs/owner_security_blueprint.md");
const failures = [];

if (!workflow.includes('cron: "0 * * * *"')) failures.push("hourly cadence missing");
if (!workflow.includes("workflow_dispatch")) failures.push("manual trigger missing");
if (!workflow.includes("ANGELLLKR@GMAIL.COM")) failures.push("owner email missing");
if (!includesAll(workflow, ["MINDREPLY_SLACK_WEBHOOK_URL", "SLACK_WEBHOOK_URL"])) {
  failures.push("Slack delivery path missing");
}
if (!workflow.includes("RESEND_API_KEY")) failures.push("email provider secret missing");

for (const scriptName of ["report:check", "launch:report", "audit:blueprint", "report:send"]) {
  if (!packageJson.scripts?.[scriptName]) failures.push(`${scriptName} missing`);
}

for (const command of ["npm run report:check", "npm run launch:report", "npm run audit:blueprint", "npm run report:send"]) {
  if (!workflow.includes(command)) failures.push(`${command} not wired`);
}

if (!prompt.includes("Website Completion Package")) failures.push("package language missing");
if (!prompt.toLowerCase().includes("revenue-first")) failures.push("revenue-first rule missing");
if (!prompt.includes("assisted close")) failures.push("assisted close missing");
if (!prompt.toLowerCase().includes("redacted")) failures.push("redaction boundary missing");
if (!security.toLowerCase().includes("consent")) failures.push("owner consent boundary missing");

const reportScriptPath = path.join(ROOT, "scripts", "report-send.mjs");
if (!fs.existsSync(reportScriptPath)) failures.push("report sender missing");

const result = {
  status: failures.length === 0 ? "green" : "red",
  checked_at: new Date().toISOString(),
  failures,
};

writeJson(AUDIT_PATH, result);
console.log(`Blueprint audit: ${result.status}`);
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
