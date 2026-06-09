import { writeFileSync } from "node:fs";

type ProbeKind = "page" | "health";
type Marker = "executive-nervous-system" | "legacy-communication-intelligence" | "unknown";

type Probe = {
  label: string;
  url: string;
  kind: ProbeKind;
  ok: boolean;
  status: number | null;
  marker: Marker;
  healthReady: boolean;
  bytes: number;
  error?: string;
  json?: unknown;
};

const defaultPreviewUrl = "https://mind-reply-git-codex-executive-90aec2-angellllkr-engs-projects.vercel.app";
const defaultProductionUrl = "https://www.mind-reply.com";
const previewUrl = stripTrailingSlash(process.env.MINDREPLY_PREVIEW_URL || defaultPreviewUrl);
const productionUrl = stripTrailingSlash(process.env.MINDREPLY_PRODUCTION_URL || defaultProductionUrl);
const requireLaunchReady = flag(process.env.MINDREPLY_REQUIRE_LAUNCH_READY);
const outputPath = process.env.MINDREPLY_LAUNCH_REPORT_PATH || "mindreply-launch-readiness.json";

function flag(value?: string) {
  return ["1", "true", "yes", "on"].includes((value || "").trim().toLowerCase());
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function buildUrl(base: string, path: string) {
  return `${base}${path}`;
}

function markerFor(body: string): Marker {
  if (/Executive Nervous System/i.test(body) || /MindReply \| Executive Nervous System/i.test(body)) {
    return "executive-nervous-system";
  }

  if (/Executive Communication Intelligence/i.test(body)) {
    return "legacy-communication-intelligence";
  }

  return "unknown";
}

function healthReady(json: unknown) {
  if (!json || typeof json !== "object") return false;
  const value = json as Record<string, unknown>;
  const serialized = JSON.stringify(value).toLowerCase();
  return value.status === "ready" || value.ok === true || serialized.includes("\"ready\"");
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "MindReply-launch-readiness/1.0",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function probe(label: string, url: string, kind: ProbeKind): Promise<Probe> {
  try {
    const response = await fetchWithTimeout(url);
    const text = await response.text();
    const contentType = response.headers.get("content-type") || "";
    let json: unknown;

    if (contentType.includes("application/json")) {
      try {
        json = JSON.parse(text);
      } catch {
        json = undefined;
      }
    }

    const ready = kind === "health" ? healthReady(json) : false;
    return {
      label,
      url,
      kind,
      ok: response.ok,
      status: response.status,
      marker: markerFor(text),
      healthReady: ready,
      bytes: text.length,
      json,
    };
  } catch (error) {
    return {
      label,
      url,
      kind,
      ok: false,
      status: null,
      marker: "unknown",
      healthReady: false,
      bytes: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function lineFor(probeResult: Probe) {
  const status = probeResult.status ?? "ERR";
  const marker =
    probeResult.kind === "health"
      ? `health=${probeResult.healthReady ? "ready" : "not-ready"}`
      : `marker=${probeResult.marker}`;
  const suffix = probeResult.error ? ` error=${probeResult.error}` : "";
  return `- ${probeResult.label}: ${status} ${probeResult.ok ? "OK" : "NEEDS ATTENTION"} ${marker} bytes=${probeResult.bytes}${suffix}`;
}

function isNewSurface(probeResult: Probe) {
  return probeResult.ok && probeResult.marker === "executive-nervous-system";
}

function isEndpointOk(probeResult: Probe) {
  return probeResult.ok && probeResult.status === 200;
}

async function main() {
  const probes = await Promise.all([
    probe("preview /", buildUrl(previewUrl, "/"), "page"),
    probe("preview /agent", buildUrl(previewUrl, "/agent"), "page"),
    probe("preview /api/health", buildUrl(previewUrl, "/api/health"), "health"),
    probe("production /", buildUrl(productionUrl, "/"), "page"),
    probe("production /agent", buildUrl(productionUrl, "/agent"), "page"),
    probe("production /api/health", buildUrl(productionUrl, "/api/health"), "health"),
  ]);

  const [previewRoot, previewAgent, previewHealth, productionRoot, productionAgent, productionHealth] = probes;
  const previewReady =
    isNewSurface(previewRoot) && isEndpointOk(previewAgent) && isEndpointOk(previewHealth) && previewHealth.healthReady;
  const productionReady =
    isNewSurface(productionRoot) &&
    isEndpointOk(productionAgent) &&
    isEndpointOk(productionHealth) &&
    productionHealth.healthReady;

  const status = productionReady
    ? "launch-ready"
    : previewReady
      ? "preview-ready-production-stale"
      : "needs-attention";

  const summary = {
    generatedAt: new Date().toISOString(),
    status,
    requireLaunchReady,
    previewUrl,
    productionUrl,
    previewReady,
    productionReady,
    notes: [
      "This command is read-only and does not deploy, change domains, change credentials, or spend money.",
      "The stale GitHub status context remains provider-side: Vercel - mindreply points to upgradeToPro=build-rate-limit.",
      "The canonical preview project currently expected by this branch is mind-reply.",
    ],
    probes,
  };

  const report = [
    "# MindReply Launch Readiness Report",
    "",
    `Generated: ${summary.generatedAt}`,
    `Status: ${status}`,
    `Preview URL: ${previewUrl}`,
    `Production URL: ${productionUrl}`,
    `Strict mode: ${requireLaunchReady ? "on" : "off"}`,
    "",
    `Preview readiness: ${previewReady ? "OK" : "NEEDS ATTENTION"}`,
    `Production readiness: ${productionReady ? "OK" : "NEEDS ATTENTION"}`,
    "",
    "Probe results:",
    ...probes.map(lineFor),
    "",
    "Safe next action:",
    "- Clear or disconnect the stale duplicate Vercel context, then attach/promote the custom domain on the canonical project after merge readiness is confirmed.",
    "",
    `JSON receipt: ${outputPath}`,
  ].join("\n");

  writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(report);

  if (requireLaunchReady && !productionReady) {
    process.exitCode = 1;
  }
}

void main();
