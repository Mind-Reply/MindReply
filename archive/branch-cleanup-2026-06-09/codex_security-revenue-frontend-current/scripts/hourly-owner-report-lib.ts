import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export type DeliveryStatus = "sent" | "skipped" | "dry_run" | "failed" | "blocked";
export type DeliveryResult = { channel: "email" | "slack" | "console"; status: DeliveryStatus; detail: string };

export const ownerEmail = "ANGELLLKR@GMAIL.COM";
export const reportDir = join(process.cwd(), "reports", "owner");
export const reportPath = join(reportDir, "hourly-owner-report.md");
export const checkPath = join(reportDir, "hourly-owner-report-check.json");
export const blueprintAuditPath = join(reportDir, "hourly-owner-blueprint-audit.json");
export const deliveryReceiptPath = join(reportDir, "hourly-owner-delivery-receipt.json");

export function envFlag(name: string, fallback = false) {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;
  return value.toLowerCase() === "true";
}

export function parseList(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function requestedChannels() {
  const allowed = new Set(["console", "email", "slack"]);
  const parsed = parseList(process.env.MINDREPLY_REPORT_CHANNELS || "email,slack").filter((channel) => allowed.has(channel));
  return parsed.length ? [...new Set(parsed)] : ["email", "slack"];
}

export function reportRecipients() {
  return [...new Set([ownerEmail, ...parseList(process.env.MINDREPLY_REPORT_EMAIL), ...parseList(process.env.MINDREPLY_REPORT_EMAILS)])];
}

export function slackWebhookUrl() {
  return process.env.MINDREPLY_SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL || "";
}

export function textFromMarkdown(markdown: string) {
  return markdown.replace(/^# /gm, "").replace(/^## /gm, "\n").replace(/^- /gm, "- ");
}

export async function ensureReportDir() {
  await mkdir(reportDir, { recursive: true });
}

export async function writeJsonFile(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readReportMarkdown() {
  return readFile(reportPath, "utf8");
}

export function githubContext() {
  return {
    repo: process.env.GITHUB_REPOSITORY || "Mind-Reply/MindReply",
    branch: process.env.GITHUB_REF_NAME || "main",
    sha: process.env.GITHUB_SHA || "unknown",
    actor: process.env.GITHUB_ACTOR || "unknown",
    runId: process.env.GITHUB_RUN_ID || "local",
  };
}

export function shortSha(value: string) {
  return value === "unknown" ? value : value.slice(0, 7);
}

export async function fetchVercelStatus() {
  const { repo, sha } = githubContext();
  const token = process.env.GITHUB_TOKEN;
  if (!token || sha === "unknown") return { state: "amber", detail: "GitHub status lookup skipped; GITHUB_TOKEN or SHA missing." };

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/commits/${sha}/status`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "mindreply-hourly-owner-report",
      },
    });

    if (!response.ok) return { state: "amber", detail: `GitHub status lookup failed with ${response.status}.` };

    const data = (await response.json()) as { state?: string; statuses?: Array<{ context?: string; state?: string; target_url?: string }> };
    const vercel = data.statuses?.find((item) => item.context === "Vercel" || item.context?.toLowerCase().includes("vercel"));
    if (!vercel) return { state: data.state || "unknown", detail: "No Vercel status found on this commit." };
    return { state: vercel.state || "unknown", detail: vercel.target_url ? `Vercel ${vercel.state}: ${vercel.target_url}` : `Vercel ${vercel.state}` };
  } catch (error) {
    return { state: "amber", detail: error instanceof Error ? error.message : "GitHub status lookup failed." };
  }
}
