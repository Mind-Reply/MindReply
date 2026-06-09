import { writeFileSync } from "node:fs";

const siteUrl = (process.env.MINDREPLY_LIVE_VERIFY_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com").replace(/\/$/, "");
const outputPath = process.env.MINDREPLY_LIVE_REVENUE_JSON || "mindreply-live-revenue-surface.json";
const expectedSha = process.env.MINDREPLY_EXPECTED_SHA || process.env.GITHUB_SHA || "";
const requireShaMatch = process.env.MINDREPLY_REQUIRE_LIVE_SHA_MATCH === "true";

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request(path, init = {}) {
  const started = Date.now();
  const url = `${siteUrl}${path}`;
  try {
    const response = await fetch(url, { redirect: "follow", ...init });
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text().catch(() => "");
    return {
      path,
      url,
      ok: response.ok,
      status: response.status,
      contentType,
      text,
      json: /json/i.test(contentType) ? parseJson(text) : null,
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    return {
      path,
      url,
      ok: false,
      status: "error",
      contentType: "",
      text: "",
      json: null,
      latencyMs: Date.now() - started,
      error: error instanceof Error ? error.message : "request failed",
    };
  }
}

function check(checks, id, pass, detail, severity = "error") {
  checks.push({ id, pass: Boolean(pass), severity, detail });
}

function includes(text, phrase) {
  return text.toLowerCase().includes(phrase.toLowerCase());
}

const generatedAt = new Date().toISOString();
const [home, contact, version, health, packageRequest] = await Promise.all([
  request("/"),
  request("/contact"),
  request("/api/version"),
  request("/api/health"),
  request("/api/package-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  }),
]);

const publicText = `${home.text}\n${contact.text}`;
const checks = [];
const liveSha = version.json?.deployment?.commitSha || "";

check(checks, "home-reachable", home.status === 200, `Homepage status ${home.status}.`);
check(checks, "contact-reachable", contact.status === 200, `Contact status ${contact.status}.`);
check(checks, "version-current", version.status === 200 && version.json?.status === "ok" && version.json?.deployment, `Version status ${version.status}; retired/stale production returns 410.`);
check(
  checks,
  "version-sha-current",
  !requireShaMatch || (expectedSha && liveSha === expectedSha),
  requireShaMatch
    ? `Live SHA ${liveSha || "missing"}; expected ${expectedSha || "missing"}.`
    : "Live SHA match not required for this run.",
);
check(checks, "health-reachable", health.status === 200 && health.json?.status === "ok", `Health status ${health.status}.`);
check(checks, "package-api-mounted", packageRequest.status === 400 && /email|required|request body/i.test(packageRequest.text), `Package request invalid-body probe status ${packageRequest.status}.`);

check(checks, "relief-promise", includes(home.text, "Reclaim 2+ hours daily within 24 hours"), "Homepage must keep the immediate relief promise.");
check(checks, "website-completion-package", includes(publicText, "Website Completion Package"), "Live public surface must sell the Website Completion Package.");
check(checks, "package-price", includes(publicText, "GBP 600"), "Live public surface must show the GBP 600 entry offer.");
check(checks, "public-mailbox", includes(publicText, "info@mind-reply.com"), "Live public surface must use the public MindReply mailbox.");
check(checks, "no-personal-gmail", !/gmail\.com/i.test(publicText), "Live public surface must not expose personal Gmail addresses.");
check(checks, "contact-assisted-close", includes(contact.text, "Package request") || includes(contact.text, "Submit package request"), "Contact page must expose assisted close, not only a passive email link.");

const failed = checks.filter((item) => !item.pass && item.severity === "error");
const warnings = checks.filter((item) => !item.pass && item.severity !== "error");
const report = {
  generatedAt,
  siteUrl,
  expectedSha: expectedSha || null,
  liveSha: liveSha || null,
  requireShaMatch,
  status: failed.length === 0 ? "pass" : "fail",
  failed: failed.map((item) => item.id),
  warnings: warnings.map((item) => item.id),
  checks,
  surfaces: [home, contact, version, health, packageRequest].map(({ path, url, ok, status, contentType, latencyMs, json, error }) => ({
    path,
    url,
    ok,
    status,
    contentType,
    latencyMs,
    json,
    error,
  })),
};

writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf-8");

console.log("# MindReply Live Revenue Surface Verification");
console.log("");
console.log(`Generated: ${generatedAt}`);
console.log(`Site: ${siteUrl}`);
console.log(`Expected SHA: ${expectedSha || "not required"}`);
console.log(`Live SHA: ${liveSha || "missing"}`);
console.log(`Status: ${report.status}`);
console.log("");
console.log("| Check | Result | Detail |");
console.log("| --- | --- | --- |");
for (const item of checks) {
  console.log(`| ${item.id} | ${item.pass ? "pass" : "fail"} | ${String(item.detail).replace(/\|/g, "/")} |`);
}

if (failed.length > 0) {
  console.error(`Live revenue surface failed: ${failed.map((item) => item.id).join(", ")}`);
  process.exit(1);
}
