import { existsSync, readFileSync, writeFileSync } from "node:fs";

const monitorPath = process.env.MRAGENT_REPORT_JSON || "mragent-monitor-status.json";
const growthPath = process.env.MRAGENT_GROWTH_PULSE_JSON || "mragent-growth-pulse.json";
const digestPath = process.env.MRAGENT_SHORT_DIGEST_JSON || "mragent-short-digest.json";
const markdownPath = process.env.MRAGENT_SHORT_DIGEST_MD || "mragent-short-digest.md";
const branchMapPath = process.env.MRAGENT_BRANCH_MAP || "site/automation/branch-consolidation.yml";

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

function readBranchMap(path) {
  if (!existsSync(path)) {
    return {
      present: false,
      storageBranch: "unknown",
      deployBranch: "unknown",
      nextDelete: "none recorded",
      nextPort: "none recorded",
    };
  }

  const text = readFileSync(path, "utf-8");
  return {
    present: true,
    storageBranch: matchValue(text, /storage_branch:\s*([^\n]+)/),
    deployBranch: matchValue(text, /deploy_branch:\s*([^\n]+)/),
    nextDelete: matchListItem(text, /recommended_next_deletes:\s*\n([\s\S]*?)(?:\n\S|$)/),
    nextPort: matchListItem(text, /recommended_next_ports:\s*\n([\s\S]*?)(?:\n\S|$)/),
  };
}

function matchValue(text, pattern, fallback = "unknown") {
  const match = text.match(pattern);
  return match?.[1]?.trim() || fallback;
}

function matchListItem(text, sectionPattern, fallback = "none recorded") {
  const section = text.match(sectionPattern)?.[1] || "";
  const item = section.match(/-\s+([^\n]+)/)?.[1];
  return item?.trim() || fallback;
}

function value(input, fallback = "unknown") {
  return typeof input === "string" && input.length > 0 ? input : fallback;
}

const monitor = readJson(monitorPath);
const growth = readJson(growthPath);
const branchMap = readBranchMap(branchMapPath);
const generatedAt = new Date().toISOString();
const blocker = value(monitor?.summary?.currentBlocker, "monitor missing");
const nextAction = value(monitor?.summary?.nextAction || growth?.next?.recommendedAction, "no next action recorded");
const promise = value(growth?.positioning?.promise, "growth pulse missing");
const decisionApi = value(monitor?.summary?.decisionApi, "unknown");
const preferredAgentApi = value(monitor?.summary?.preferredAgentApi, "unknown");
const fallbackIntakeApi = value(monitor?.summary?.fallbackIntakeApi, "unknown");
const activeDeployment = value(monitor?.commitStatus?.deployment?.primary?.state, "unknown");
const legacyDeployment = value(monitor?.commitStatus?.deployment?.legacy?.state, "unknown");
const productionVersion = monitor?.productionVersion?.matchesRun === false
  ? "stale"
  : monitor?.productionVersion?.matchesRun === true
    ? "current"
    : "unknown";
const preview = value(monitor?.siteUrl ? `${monitor.siteUrl}/agent` : "https://www.mind-reply.com/agent");

const digest = {
  generatedAt,
  status: blocker === "none detected" ? "clear" : "attention",
  preview,
  activeDeployment,
  legacyDeployment,
  productionVersion,
  decisionApi,
  preferredAgentApi,
  fallbackIntakeApi,
  blocker,
  promise,
  nextAction,
  branchStorage: {
    mapPresent: branchMap.present,
    deployBranch: branchMap.deployBranch,
    storageBranch: branchMap.storageBranch,
    nextDelete: branchMap.nextDelete,
    nextPort: branchMap.nextPort,
  },
  sourceFiles: {
    monitor: monitorPath,
    growth: growthPath,
    branchMap: branchMapPath,
  },
};

const markdown = [
  "# MRagent short digest",
  "",
  `Status: ${digest.status}`,
  `Preview: ${preview}`,
  `Active Vercel: ${activeDeployment}`,
  `Legacy Vercel: ${legacyDeployment}`,
  `Production version: ${productionVersion}`,
  `Decision API: ${decisionApi} (agent ${preferredAgentApi}, fallback ${fallbackIntakeApi})`,
  `Branch plan: ${branchMap.deployBranch} deploy, ${branchMap.storageBranch} storage`,
  `Branch cleanup: delete ${branchMap.nextDelete}; port ${branchMap.nextPort}`,
  `Blocker: ${blocker}`,
  `Promise: ${promise}`,
  `Next: ${nextAction}`,
  "",
].join("\n");

writeFileSync(digestPath, `${JSON.stringify(digest, null, 2)}\n`, "utf-8");
writeFileSync(markdownPath, markdown, "utf-8");
console.log(markdown);
