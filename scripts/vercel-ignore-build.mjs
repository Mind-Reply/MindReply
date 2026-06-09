#!/usr/bin/env node

import { execSync } from "node:child_process";

const env = process.env.VERCEL_ENV || "";
const branch = process.env.VERCEL_GIT_COMMIT_REF || "";
const prId = process.env.VERCEL_GIT_PULL_REQUEST_ID || "";
const forceValue = process.env.MINDREPLY_FORCE_VERCEL_BUILD || process.env.VERCEL_FORCE_BUILD || "";
const forceBuild = /^(1|true|yes)$/i.test(forceValue);
const extraAllowedBranches = (process.env.MINDREPLY_VERCEL_BUILD_BRANCHES || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const allowedBranches = new Set([
  "main",
  "codex/executive-nervous-system-main-sync",
  ...extraAllowedBranches,
]);

const allowedPrefixes = ["release/", "deploy/"];

const reportingOnlyFiles = [
  /^docs\//,
  /^\.github\//,
  /^\.circleci\//,
  /^scripts\/(angel-pack-report|growth-pulse-report|launch-readiness-report|mragent-short-digest|ops-report|vercel-status-context-audit)\.ts$/,
  /^scripts\/verify-(growth-pulse|playbooks|preview-capture|vercel-skip-coverage)\.ts$/,
  /^scripts\/fixtures\//,
  /^artifacts\//,
  /^mindreply-.*\.json$/,
  /^README(\.md)?$/,
];

function continueBuild(reason) {
  console.log(`Vercel ignored-build guard: continue build. ${reason}`);
  process.exit(1);
}

function skipBuild(reason) {
  console.log(`Vercel ignored-build guard: skip build. ${reason}`);
  process.exit(0);
}

function changedFiles() {
  const candidates = [
    "git diff-tree --no-commit-id --name-only -r HEAD",
    "git diff --name-only HEAD~1 HEAD",
  ];

  for (const command of candidates) {
    try {
      const output = execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      const files = output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (files.length > 0) {
        return files;
      }
    } catch {
      // Try the next git strategy before falling back to build.
    }
  }

  return [];
}

function isReportingOnlyChange(files) {
  return files.length > 0 && files.every((file) => reportingOnlyFiles.some((pattern) => pattern.test(file)));
}

if (forceBuild) {
  continueBuild("Force-build flag is set.");
}

if (!env || !branch) {
  continueBuild("Missing Vercel environment metadata; defaulting to build.");
}

const files = changedFiles();

if (isReportingOnlyChange(files)) {
  skipBuild(`Only reporting/docs/workflow files changed: ${files.join(", ")}.`);
}

if (env === "production") {
  continueBuild("Production deploy contains runtime or unknown changes.");
}

if (allowedBranches.has(branch) || allowedPrefixes.some((prefix) => branch.startsWith(prefix))) {
  continueBuild(`Allowed preview branch: ${branch}${prId ? ` (PR ${prId})` : ""}.`);
}

skipBuild(`Preview branch ${branch} is not in the active launch allowlist.`);
