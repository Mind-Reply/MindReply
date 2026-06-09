import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function readRequired(relativePath: string) {
  const filePath = path.join(root, relativePath);
  if (!existsSync(filePath)) throw new Error(`Missing required file: ${relativePath}`);
  return readFileSync(filePath, "utf8");
}

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const prompt = readRequired("docs/hourly_owner_goal_prompt.md");
const home = readRequired("app/page.tsx");
const pack = readRequired("app/pack/page.tsx");
const canonicalPackage = readRequired("app/website-completion-package/page.tsx");
const pricing = readRequired("app/pricing/page.tsx");
const contact = readRequired("app/contact/page.tsx");
const packageApi = readRequired("app/api/package-request/route.ts");
const packageHelper = readRequired("lib/package-request.ts");
const packageForm = readRequired("components/PackageRequestForm.tsx");
const health = readRequired("app/api/health/route.ts");

const publicPages = [home, pack, canonicalPackage, pricing, contact, packageForm].join("\n");
const operatingContract = prompt.toLowerCase();

for (const phrase of [
  "stop builder thinking",
  "revenue system thinking",
  "Website Completion Package",
  "GBP 600",
  "authority",
  "trust proof",
  "assisted close",
  "package request API",
  "fallback email",
  "defensive security boundary",
]) {
  assert((prompt + publicPages).toLowerCase().includes(phrase.toLowerCase()), `Missing revenue-first phrase: ${phrase}`);
}

assert(home.includes("Reclaim 2+ hours daily within 24 hours"), "Homepage must preserve the immediate operational relief promise.");
assert(home.includes("Website Completion Package"), "Homepage must name the Website Completion Package.");
assert(home.includes("GBP 600"), "Homepage must show the GBP 600 paid package.");
assert(home.includes("NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL"), "Homepage must support the package payment URL variable.");
assert(home.includes("Request invoice"), "Homepage must preserve invoice fallback when no payment link is configured.");
assert(home.includes("info@mind-reply.com"), "Homepage must use the public MindReply mailbox.");

assert(pack.includes("Website Completion Package"), "/pack must sell the Website Completion Package.");
assert(pack.includes("Revenue truth"), "/pack must keep revenue claims evidence-bound.");
assert(pack.includes("GBP 600"), "/pack must show the GBP 600 total.");
assert(pack.includes("NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL"), "/pack must support the package payment URL variable.");
assert(pack.includes("Request invoice"), "/pack must preserve invoice fallback.");

assert(canonicalPackage.includes("Website Completion Package"), "/website-completion-package must sell the Website Completion Package.");
assert(canonicalPackage.includes("GBP 600"), "/website-completion-package must show the GBP 600 total.");
assert(canonicalPackage.includes("NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL"), "/website-completion-package must support the package payment URL variable.");
assert(canonicalPackage.includes("Request invoice"), "/website-completion-package must preserve invoice fallback.");

assert(pricing.includes("Completion"), "/pricing must make the one-off completion package visible.");
assert(pricing.indexOf("Completion") < pricing.indexOf("Signal"), "/pricing must place the paid package before recurring plans.");
assert(pricing.includes("GBP 600 once"), "/pricing must show the one-off GBP 600 package.");
assert(pricing.includes("NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL"), "/pricing must support the package payment URL variable.");

assert(contact.includes("Ask MRagent first"), "/contact must preserve MRagent-first support.");
assert(contact.includes("Security owner route"), "/contact must include owner/security routing language.");
assert(contact.includes("info@mind-reply.com"), "/contact must use the public MindReply mailbox.");
assert(contact.includes("PackageRequestForm"), "/contact must use the package request form instead of a passive mailto-only path.");
assert(contact.includes("mailtoHref"), "/contact must keep fallback email available.");

assert(packageForm.includes("/api/package-request"), "Package request form must submit to the API route.");
assert(packageForm.includes("inputHash"), "Package request form must display the privacy-safe input hash.");
assert(packageForm.includes("rawContentRedacted"), "Package request form must display raw content redaction status.");
assert(packageForm.includes("Fallback email"), "Package request form must keep fallback email visible when delivery is blocked.");
assert(packageForm.includes("consent"), "Package request form must require consent before review.");
assert(packageForm.includes("Website Completion Package"), "Package request form must keep the paid package visible.");

assert(packageApi.includes("deliverPackageRequest"), "/api/package-request must call the delivery helper.");
assert(packageApi.includes("makePackageReceipt"), "/api/package-request must return a receipt.");
assert(packageApi.includes("parsePackageRequest"), "/api/package-request must validate input.");
assert(packageApi.includes("fallback-required"), "/api/package-request must expose fallback-required status when delivery is blocked.");

assert(packageHelper.includes("MINDREPLY_PACKAGE_REQUEST_TO"), "Package request helper must support a private package recipient env var.");
assert(packageHelper.includes("MINDREPLY_PACKAGE_REQUEST_FROM"), "Package request helper must support a private package sender env var.");
assert(packageHelper.includes("MINDREPLY_PACKAGE_REQUEST_DRY_RUN"), "Package request helper must support dry-run delivery.");
assert(packageHelper.includes("RESEND_API_KEY"), "Package request helper must use the existing Resend provider path.");
assert(packageHelper.includes("Website Completion Package"), "Package request helper must keep the paid package name in the receipt/email path.");
assert(packageHelper.includes("GBP 600"), "Package request helper must keep the paid package value in the receipt/email path.");
assert(packageHelper.includes("rawContentRedacted: true"), "Package request helper must preserve rawContentRedacted in the receipt contract.");
assert(packageHelper.includes("inputHash"), "Package request helper must produce a privacy-safe input hash.");

assert(health.includes("/api/package-request"), "Health route must expose the package request URL.");
assert(health.includes("packageRequestRecipientConfigured"), "Health route must report package request recipient readiness.");
assert(health.includes("packageRequestProviderConfigured"), "Health route must report package request provider readiness.");

assert(!/gmail\.com/i.test(publicPages), "Public pages must not expose personal Gmail addresses.");
assert(!/57 active staff/i.test(publicPages), "Public pages must not claim 57 active staff.");
assert(operatingContract.includes("reports are owner-only and redacted"), "Prompt must keep reports owner-only and redacted.");

console.log("Revenue-first owner goal verified.");
