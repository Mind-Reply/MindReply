import { writeFileSync } from "node:fs";

const siteUrl = (process.env.MINDREPLY_LIVE_VERIFY_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com").replace(/\/$/, "");
const outputPath = process.env.MINDREPLY_LIVE_REVENUE_JSON || "mindreply-live-revenue-surface.json";
const expectedSha = process.env.MINDREPLY_EXPECTED_SHA || process.env.GITHUB_SHA || "";
const expectedDeploymentId = process.env.MINDREPLY_EXPECTED_DEPLOYMENT_ID || "";
const requireShaMatch = process.env.MINDREPLY_REQUIRE_LIVE_SHA_MATCH === "true";
const requireDeploymentMatch = process.env.MINDREPLY_REQUIRE_LIVE_DEPLOYMENT_MATCH === "true";

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function deploymentIdsFromHtml(text) {
  return [...new Set([...text.matchAll(/[?&]dpl=(dpl_[A-Za-z0-9]+)/g)].map((match) => match[1]))];
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
      deploymentIds: deploymentIdsFromHtml(text),
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
      deploymentIds: [],
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
const [home, contact, packagePage, version, health, packageRequest, robots, sitemap, geoLocale] = await Promise.all([
  request("/"),
  request("/contact"),
  request("/website-completion-package"),
  request("/api/version"),
  request("/api/health"),
  request("/api/package-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  }),
  request("/robots.txt"),
  request("/sitemap.xml"),
  request("/api/geo-locale"),
]);

const publicText = `${home.text}\n${contact.text}\n${packagePage.text}`;
const checks = [];
const liveSha = version.json?.deployment?.commitSha || "";
const renderedDeploymentIds = [...new Set([...home.deploymentIds, ...contact.deploymentIds, ...packagePage.deploymentIds])];

check(checks, "home-reachable", home.status === 200, `Homepage status ${home.status}.`);
check(checks, "contact-reachable", contact.status === 200, `Contact status ${contact.status}.`);
check(checks, "package-page-reachable", packagePage.status === 200, `Package page status ${packagePage.status}.`);
check(checks, "version-current", version.status === 200 && version.json?.status === "ok" && version.json?.deployment, `Version status ${version.status}; retired/stale production returns 410.`);
check(
  checks,
  "version-sha-current",
  !requireShaMatch || (expectedSha && liveSha === expectedSha),
  requireShaMatch
    ? `Live SHA ${liveSha || "missing"}; expected ${expectedSha || "missing"}.`
    : "Live SHA match not required for this run.",
);
check(
  checks,
  "rendered-deployment-current",
  !requireDeploymentMatch || (expectedDeploymentId && renderedDeploymentIds.includes(expectedDeploymentId)),
  requireDeploymentMatch
    ? `Rendered deployment ids ${renderedDeploymentIds.join(", ") || "missing"}; expected ${expectedDeploymentId || "missing"}.`
    : `Rendered deployment ids ${renderedDeploymentIds.join(", ") || "not detected"}.`,
);
check(checks, "health-reachable", health.status === 200 && health.json?.status === "ok", `Health status ${health.status}.`);
check(checks, "package-api-mounted", packageRequest.status === 400 && /email|required|request body/i.test(packageRequest.text), `Package request invalid-body probe status ${packageRequest.status}.`);

check(checks, "relief-promise", includes(home.text, "Reclaim 2+ hours daily within 24 hours"), "Homepage must keep the immediate relief promise.");
check(checks, "website-completion-package", includes(publicText, "Website Completion Package"), "Live public surface must sell the Website Completion Package.");
check(checks, "package-price", includes(publicText, "GBP 600"), "Live public surface must show the GBP 600 entry offer.");
check(checks, "public-mailbox", includes(publicText, "info@mind-reply.com"), "Live public surface must use the public MindReply mailbox.");
check(checks, "no-personal-gmail", !/gmail\.com/i.test(publicText), "Live public surface must not expose personal Gmail addresses.");
check(checks, "no-stale-executive-nervous-system", !includes(publicText, "Executive Nervous System"), "Live public surface must not serve the retired Executive Nervous System page.");
check(checks, "contact-assisted-close", includes(contact.text, "Package request") || includes(contact.text, "Submit package request"), "Contact page must expose assisted close, not only a passive email link.");

check(checks, "package-page-title", includes(packagePage.text, "Website Completion Package | MindReply") || includes(packagePage.text, "Website Completion Package"), "Package page must expose the paid offer title.");
check(checks, "package-invoice-first-route", includes(packagePage.text, "Invoice-first request path active"), "Package page must prove the invoice-first route is live.");
check(checks, "package-no-payment-link-required", includes(packagePage.text, "No payment link is required to begin"), "Package page must tell buyers they can start without a configured payment link.");
check(checks, "package-billing-fields", includes(packagePage.text, "billing name and billing email"), "Package page must name the invoice intake fields.");
check(checks, "package-scope-first", includes(packagePage.text, "Scope first, invoice/payment before delivery"), "Package page must keep the scope-first close guard.");
check(checks, "package-payment-path-receipt", includes(packagePage.text, "paymentPath") && includes(packagePage.text, "invoice-first unless a configured direct payment link is present"), "Package page must show the receipt paymentPath proof.");

check(checks, "footer-market-strip", includes(home.text, "Auto language and priority markets"), "Live footer must expose the quiet auto-language and market strip.");
check(checks, "market-priority-meta", includes(home.text, "target-market-priority") && includes(home.text, "UK > US > UAE"), "Live metadata must include the current target-market priority.");
check(checks, "geo-locale-market-profiles", geoLocale.status === 200 && Array.isArray(geoLocale.json?.marketProfiles) && geoLocale.json.marketProfiles.length >= 10, `Geo locale status ${geoLocale.status}; market profiles ${geoLocale.json?.marketProfiles?.length ?? "missing"}.`);
check(checks, "geo-locale-brazil", includes(geoLocale.text, "Brazil") && includes(geoLocale.text, "pt"), "Geo locale must include Brazil Portuguese targeting.");
check(checks, "robots-no-stale-public-routes", robots.status === 200 && !/allow:\s*\/agents|allow:\s*\/pack/i.test(robots.text), "Robots must not allow retired /agents or /pack surfaces.");
check(checks, "sitemap-no-stale-public-routes", sitemap.status === 200 && !sitemap.text.includes("<loc>https://www.mind-reply.com/agents</loc>") && !sitemap.text.includes("<loc>https://www.mind-reply.com/pack</loc>"), "Sitemap must not index retired /agents or /pack routes.");

const failed = checks.filter((item) => !item.pass && item.severity === "error");
const warnings = checks.filter((item) => !item.pass && item.severity !== "error");
const report = {
  generatedAt,
  siteUrl,
  expectedSha: expectedSha || null,
  liveSha: liveSha || null,
  expectedDeploymentId: expectedDeploymentId || null,
  renderedDeploymentIds,
  requireShaMatch,
  requireDeploymentMatch,
  status: failed.length === 0 ? "pass" : "fail",
  failed: failed.map((item) => item.id),
  warnings: warnings.map((item) => item.id),
  checks,
  surfaces: [home, contact, packagePage, version, health, packageRequest, robots, sitemap, geoLocale].map(({ path, url, ok, status, contentType, latencyMs, json, deploymentIds, error }) => ({
    path,
    url,
    ok,
    status,
    contentType,
    latencyMs,
    deploymentIds,
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
console.log(`Expected deployment: ${expectedDeploymentId || "not required"}`);
console.log(`Rendered deployments: ${renderedDeploymentIds.join(", ") || "not detected"}`);
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
