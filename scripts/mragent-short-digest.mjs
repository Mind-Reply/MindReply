import { existsSync, readFileSync, writeFileSync } from "node:fs";

const monitorPath = process.env.MRAGENT_REPORT_JSON || "mragent-monitor-status.json";
const growthPath = process.env.MRAGENT_GROWTH_PULSE_JSON || "mragent-growth-pulse.json";
const digestPath = process.env.MRAGENT_SHORT_DIGEST_JSON || "mragent-short-digest.json";
const markdownPath = process.env.MRAGENT_SHORT_DIGEST_MD || "mragent-short-digest.md";

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

function value(input, fallback = "unknown") {
  return typeof input === "string" && input.length > 0 ? input : fallback;
}

const monitor = readJson(monitorPath);
const growth = readJson(growthPath);
const generatedAt = new Date().toISOString();
const blocker = value(monitor?.summary?.currentBlocker, "monitor missing");
const nextAction = value(monitor?.summary?.nextAction || growth?.next?.recommendedAction, "no next action recorded");
const promise = value(growth?.positioning?.promise, "growth pulse missing");
const decisionApi = value(monitor?.summary?.decisionApi, "unknown");
const preferredAgentApi = value(monitor?.summary?.preferredAgentApi, "unknown");
const fallbackIntakeApi = value(monitor?.summary?.fallbackIntakeApi, "unknown");
const activeDeployment = value(monitor?.commitStatus?.deployment?.primary?.state, "unknown");
const legacyDeployment = value(monitor?.commitStatus?.deployment?.legacy?.state, "unknown");
const preview = value(monitor?.siteUrl ? `${monitor.siteUrl}/agent` : "https://www.mind-reply.com/agent");

const digest = {
  generatedAt,
  status: blocker === "none detected" ? "clear" : "attention",
  preview,
  activeDeployment,
  legacyDeployment,
  decisionApi,
  preferredAgentApi,
  fallbackIntakeApi,
  blocker,
  promise,
  nextAction,
  sourceFiles: {
    monitor: monitorPath,
    growth: growthPath,
  },
};

const markdown = [
  "# MRagent short digest",
  "",
  `Status: ${digest.status}`,
  `Preview: ${preview}`,
  `Active Vercel: ${activeDeployment}`,
  `Legacy Vercel: ${legacyDeployment}`,
  `Decision API: ${decisionApi} (agent ${preferredAgentApi}, fallback ${fallbackIntakeApi})`,
  `Blocker: ${blocker}`,
  `Promise: ${promise}`,
  `Next: ${nextAction}`,
  "",
].join("\n");

writeFileSync(digestPath, `${JSON.stringify(digest, null, 2)}\n`, "utf-8");
writeFileSync(markdownPath, markdown, "utf-8");
console.log(markdown);
