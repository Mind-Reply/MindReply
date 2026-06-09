import { writeFileSync } from "node:fs";

type RawStatus = {
  context?: string;
  state?: string;
  target_url?: string;
  description?: string;
  updated_at?: string;
};

type CombinedStatusResponse = {
  state?: string;
  statuses?: RawStatus[];
};

type ClassifiedStatus = {
  context: string;
  state: string;
  targetUrl: string;
  description: string;
  updatedAt: string;
  canonical: boolean;
  duplicate: boolean;
  quotaLinked: boolean;
};

const repository = firstEnv(["MINDREPLY_GITHUB_REPOSITORY", "GITHUB_REPOSITORY"]) || "Mind-Reply/MindReply";
const commitSha = process.argv[2] || firstEnv(["MINDREPLY_STATUS_SHA", "GITHUB_SHA"]);
const token = firstEnv(["GITHUB_TOKEN", "GH_TOKEN"]);
const outputPath = process.env.MINDREPLY_STATUS_AUDIT_PATH || "mindreply-vercel-status-audit.json";
const requireSingleContext = flag(process.env.MINDREPLY_REQUIRE_SINGLE_VERCEL_CONTEXT);

function firstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

function flag(value?: string) {
  return ["1", "true", "yes", "on"].includes((value || "").trim().toLowerCase());
}

function normalizeContext(value: string) {
  return value.toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
}

function isCanonicalMindReplyStatus(status: RawStatus) {
  const context = normalizeContext(status.context || "");
  const targetUrl = (status.target_url || "").toLowerCase();

  return (
    (context.includes("vercel") && /(^|[^a-z0-9])mind-reply([^a-z0-9]|$)/.test(context)) ||
    targetUrl.includes("/mind-reply/")
  );
}

function classify(status: RawStatus): ClassifiedStatus {
  const context = status.context || "(missing context)";
  const targetUrl = status.target_url || "";
  const canonical = isCanonicalMindReplyStatus(status);
  const text = `${context} ${targetUrl} ${status.description || ""}`.toLowerCase();

  return {
    context,
    state: status.state || "unknown",
    targetUrl,
    description: status.description || "",
    updatedAt: status.updated_at || "",
    canonical,
    duplicate: !canonical,
    quotaLinked: text.includes("upgradetopro=build-rate-limit") || text.includes("build-rate-limit"),
  };
}

async function fetchCombinedStatus() {
  if (!commitSha) {
    return {
      configured: false,
      error: "No commit SHA configured. Set MINDREPLY_STATUS_SHA, pass a SHA argument, or run inside GitHub Actions with GITHUB_SHA.",
      response: undefined,
    };
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "MindReply-vercel-status-context-audit/1.0",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`https://api.github.com/repos/${repository}/commits/${commitSha}/status`, { headers });
  const text = await response.text();

  if (!response.ok) {
    return {
      configured: true,
      error: `GitHub status request failed with ${response.status}: ${text.slice(0, 300)}`,
      response: undefined,
    };
  }

  return {
    configured: true,
    error: "",
    response: JSON.parse(text) as CombinedStatusResponse,
  };
}

function writeAndPrint(summary: unknown, lines: string[]) {
  writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(lines.join("\n"));
}

async function main() {
  const result = await fetchCombinedStatus();

  if (!result.configured || result.error || !result.response) {
    const summary = {
      generatedAt: new Date().toISOString(),
      repository,
      commitSha: commitSha || "",
      status: "not-verifiable",
      requireSingleContext,
      error: result.error,
    };

    writeAndPrint(summary, [
      "# MindReply Vercel Status Context Audit",
      "",
      `Repository: ${repository}`,
      `Commit: ${commitSha || "(not configured)"}`,
      "Status: not-verifiable",
      `Error: ${result.error}`,
      `JSON receipt: ${outputPath}`,
    ]);

    if (requireSingleContext) process.exitCode = 1;
    return;
  }

  const vercelStatuses = (result.response.statuses || [])
    .filter((status) => normalizeContext(status.context || "").includes("vercel"))
    .map(classify);
  const canonicalStatuses = vercelStatuses.filter((status) => status.canonical);
  const duplicateStatuses = vercelStatuses.filter((status) => status.duplicate);
  const quotaLinkedStatuses = vercelStatuses.filter((status) => status.quotaLinked);
  const singleCanonicalContext = canonicalStatuses.length === 1 && duplicateStatuses.length === 0;
  const status = singleCanonicalContext ? "single-canonical" : "needs-provider-action";

  const summary = {
    generatedAt: new Date().toISOString(),
    repository,
    commitSha,
    status,
    requireSingleContext,
    combinedState: result.response.state || "unknown",
    counts: {
      vercel: vercelStatuses.length,
      canonical: canonicalStatuses.length,
      duplicate: duplicateStatuses.length,
      quotaLinked: quotaLinkedStatuses.length,
    },
    statuses: vercelStatuses,
    notes: [
      "This command is read-only and does not create, update, delete, or redeploy anything.",
      "Canonical status is the Vercel context targeting the mind-reply project.",
      "Duplicate contexts must be disconnected, disabled, or made non-required provider-side.",
    ],
  };

  const lines = [
    "# MindReply Vercel Status Context Audit",
    "",
    `Repository: ${repository}`,
    `Commit: ${commitSha}`,
    `Status: ${status}`,
    `Combined state: ${summary.combinedState}`,
    `Vercel contexts: ${vercelStatuses.length}`,
    `Canonical contexts: ${canonicalStatuses.length}`,
    `Duplicate contexts: ${duplicateStatuses.length}`,
    `Quota-linked contexts: ${quotaLinkedStatuses.length}`,
    "",
    "Contexts:",
    ...vercelStatuses.map((statusItem) => {
      const role = statusItem.canonical ? "canonical" : "duplicate";
      const quota = statusItem.quotaLinked ? " quota-linked" : "";
      return `- ${statusItem.context}: ${statusItem.state} ${role}${quota} ${statusItem.targetUrl}`;
    }),
    "",
    "Safe next action:",
    "- Disconnect, disable, or make non-required every duplicate Vercel context before treating PR deployment status as clean.",
    "",
    `JSON receipt: ${outputPath}`,
  ];

  writeAndPrint(summary, lines);

  if (requireSingleContext && !singleCanonicalContext) {
    process.exitCode = 1;
  }
}

void main();
