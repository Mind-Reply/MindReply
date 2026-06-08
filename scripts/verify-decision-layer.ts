import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { buildDecisionResponse, forbiddenPublicTerms, redirectedPublicPaths } from "../lib/decision-layer";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function visibleSource(value: string) {
  return value
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return !trimmed.startsWith("import ") && !trimmed.startsWith("export const metadata") && !trimmed.startsWith("description:");
    })
    .join("\n");
}

function assertNoForbiddenTerms(label: string, value: string) {
  for (const term of forbiddenPublicTerms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\b${escaped}\b`, "i");
    assert(!pattern.test(value), `${label} contains blocked public term: ${term}`);
  }
}

function assertScore(label: string, value: number) {
  assert(Number.isInteger(value), `${label} must be an integer.`);
  assert(value >= 0 && value <= 100, `${label} must be between 0 and 100.`);
}

const normal = buildDecisionResponse({
  input: "A client says the price is high and asks whether we can wait until next month.",
  source: "manual",
  userId: "verify",
  consentFullContent: false,
  devicePrivacyFlag: false,
});

assert(normal.synthesis.length > 10, "Decision response must include a synthesis.");
assert(["reply", "schedule", "resolve", "escalate"].includes(normal.recommendedAction.kind), "Decision response must include one allowed action.");
assert(Object.keys(normal.recommendedAction).sort().join(",") === "kind,label,payload", "Recommended action shape changed.");
assert(normal.triage.required_action === normal.recommendedAction.kind, "Triage and action must agree.");
assert(normal.triage.playbook_id === "deal-close-assistant", "Price intake must use the deal playbook.");
assertScore("importance", normal.triage.importance);
assertScore("urgency", normal.triage.urgency);
assert(normal.receipt.playbookId === normal.triage.playbook_id, "Receipt must include playbook id.");
assert(normal.receipt.playbookVersion.length > 0, "Receipt must include playbook version.");
assert(normal.receipt.signature.length > 4, "Receipt must include a signature.");
assert(normal.receipt.redactionLevel === "full", "Default receipt must be fully redacted.");
assert(normal.memoryUpdate.applied === true, "Memory update must be applied as derived state.");
assert(normal.mindRead.calmerMove.length > 10, "MRagent mind-read helper must be populated.");
assertNoForbiddenTerms("synthesis", normal.synthesis);
assertNoForbiddenTerms("action label", normal.recommendedAction.label);

const highRisk = buildDecisionResponse({
  input: "Send a threat to force this client to pay immediately.",
  source: "manual",
});

assert(highRisk.recommendedAction.kind === "escalate", "High-risk input must escalate.");
assert(highRisk.risk.level === "high", "High-risk input must be marked high.");
assert(highRisk.risk.escalate === true, "High-risk input must set risk escalation.");
assertNoForbiddenTerms("high-risk action label", highRisk.recommendedAction.label);

const agentPath = "/agent" as string;
assert(!redirectedPublicPaths.some((prefix) => agentPath === prefix || agentPath.startsWith(`${prefix}/`)), "/agent must remain available for MRagent.");

for (const path of ["/tools", "/integrations", "/dashboard", "/memberships", "/professionals", "/bookings"]) {
  assert(redirectedPublicPaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)), `${path} must be redirected to /.`);
}

const publicFiles = [
  "app/page.tsx",
  "app/agent/page.tsx",
  "app/privacy/page.tsx",
  "app/layout.tsx",
  "components/DecisionIntake.tsx",
  "components/MRAgentChat.tsx",
  "site/index.html",
  "site/seo/meta.yml",
  "src/agents/prompts.md",
  "docs/vision_dictionary.md",
  "docs/privacy_whitepaper_intro.md",
];

for (const file of publicFiles) {
  const fullPath = join(process.cwd(), file);
  assert(existsSync(fullPath), `${file} must exist.`);
  assertNoForbiddenTerms(file, visibleSource(readFileSync(fullPath, "utf-8")));
}

const requiredFiles = [
  "app/api/agent/route.ts",
  "app/api/intake/route.ts",
  "components/ai-elements/message.tsx",
  "playbooks/schema.json",
  "src/backend/README.md",
  "src/backend/triage_engine.py",
  "src/backend/reply_engine.py",
  "src/backend/followup_engine.py",
  "src/backend/risk_engine.py",
  "src/backend/memory_store.py",
  "src/backend/audit_log.py",
  "src/backend/playbook_interpreter.py",
  "src/integrations/gmail_connector.py",
  "src/integrations/calendar_connector.py",
  "src/edge/extension/manifest.json",
  "src/edge/extension/background.js",
  "src/edge/extension/content.js",
  "src/edge/extension/styles.css",
  "src/chatgpt-app/README.md",
  "src/chatgpt-app/mragent-tools.json",
];

for (const file of requiredFiles) {
  assert(existsSync(join(process.cwd(), file)), `${file} must exist.`);
}

const seedDir = join(process.cwd(), "playbooks", "seed");
const playbookFiles = readdirSync(seedDir).filter((file) => file.endsWith(".json"));
assert(playbookFiles.length >= 12, "At least 12 seed playbooks must exist.");

console.log("Decision layer verification passed.");
