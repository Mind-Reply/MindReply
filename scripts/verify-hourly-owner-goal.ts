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
const blueprint = readRequired("docs/website_audit_action_blueprint.md");
const launchEvidence = readRequired("docs/launch_evidence_bundle.md");
const packageJson = readRequired("package.json");
const deployPreflight = readRequired("scripts/vercel-deploy-preflight.ts");
const deployPreflightVerifier = readRequired("scripts/verify-vercel-deploy-preflight.ts");
const home = readRequired("app/page.tsx");
const pack = readRequired("app/pack/page.tsx");
const canonicalPackage = readRequired("app/website-completion-package/page.tsx");
const pricing = readRequired("app/pricing/page.tsx");
const contact = readRequired("app/contact/page.tsx");
const products = readRequired("app/products/page.tsx");
const responseOverload = readRequired("app/response-overload/page.tsx");
const capabilities = readRequired("app/capabilities/page.tsx");
const trust = readRequired("app/trust/page.tsx");
const siteFooter = readRequired("components/SiteFooter.tsx");
const localeAssist = readRequired("components/LocaleAssist.tsx");
const packageApi = readRequired("app/api/package-request/route.ts");
const packageHelper = readRequired("lib/package-request.ts");
const packageForm = readRequired("components/PackageRequestForm.tsx");
const health = readRequired("app/api/health/route.ts");

const publicPages = [home, pack, canonicalPackage, pricing, contact, products, responseOverload, capabilities, trust, siteFooter, localeAssist, packageForm].join("\n");
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

for (const phrase of [
  "Ruthless Diagnosis",
  "What converts:",
  "What is still vague:",
  "What weakens trust:",
  "What weakens upgrade pressure:",
  "Rewrite immediately:",
  "Two-Layer Homepage Model",
  "Layer 1: immediate operational relief.",
  "Layer 2: premium authority.",
  "Required Public Blocks",
  "Hero:",
  "Trust block:",
  "How it works block:",
  "Pricing and paid path block:",
  "Upgrade block:",
  "Authority block:",
  "Required Sales Assets",
  "5 high-converting outbound DMs",
  "3 cold emails",
  "2 follow-ups",
  "1 call or booking message",
  "1 objection handling section",
  "First-Session Conversion Logic",
  "First user action:",
  "First output:",
  "Aha moment:",
  "Credit purchase trigger:",
  "Website Completion Package trigger:",
  "Growth trigger:",
  "Pro trigger:",
]) {
  assert(blueprint.includes(phrase), `Website audit blueprint must include: ${phrase}`);
}

for (const phrase of [
  "MindReply Launch Evidence Bundle",
  "Current Live URL",
  "Health Proof",
  "Intake Receipt Sample",
  "SEO Note",
  "Deployment Status",
  "Owner Report Rule",
  "https://www.mind-reply.com",
  "/api/version",
  "/website-completion-package",
  "/products",
  "/response-overload",
  "actionKind: website-completion",
  "rawContentRedacted: true",
  "inputHash: present; raw text absent",
  "Website Completion Package",
  "website buying-friction rescue",
  "privacy-safe receipt",
  "api-deployments-free-per-day",
  "npm run deploy:preflight",
  "prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3",
  "source-side proof",
  "live production proof",
  "delivery proof",
  "source advanced; production pending",
]) {
  assert(launchEvidence.includes(phrase), `Launch evidence bundle must include: ${phrase}`);
}

for (const phrase of [
  "deploy:preflight",
  "deploy:preflight:verify",
  "scripts/vercel-deploy-preflight.ts",
  "scripts/verify-vercel-deploy-preflight.ts",
]) {
  assert(packageJson.includes(phrase), `package.json must include deploy preflight command: ${phrase}`);
}

for (const phrase of [
  "MINDREPLY_VERCEL_PROJECT_NAME",
  "MINDREPLY_VERCEL_PROJECT_ID",
  "mindreply",
  "prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3",
  "Linked Vercel project name must be",
  "Linked Vercel project id must be",
]) {
  assert(deployPreflight.includes(phrase), `Deploy preflight must include: ${phrase}`);
}

for (const phrase of [
  "mindreply-launch-evidence",
  "Expected wrong Vercel project name to fail clearly.",
  "Expected wrong Vercel project id to fail clearly.",
  "Vercel deploy preflight verifier passed.",
]) {
  assert(deployPreflightVerifier.includes(phrase), `Deploy preflight verifier must include: ${phrase}`);
}

assert(home.includes("Reclaim 2+ hours daily within 24 hours"), "Homepage must preserve the immediate operational relief promise.");
assert(home.includes("Try MindReply Free"), "Homepage must use the clear Try MindReply Free CTA.");
assert(home.includes("Website Completion Package"), "Homepage must name the Website Completion Package.");
assert(home.includes("GBP 600"), "Homepage must show the GBP 600 paid package.");
assert(home.includes("NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL"), "Homepage must support the package payment URL variable.");
assert(home.includes("Checkout or request invoice"), "Homepage must preserve invoice fallback when no payment link is configured.");
assert(home.includes("invoice-first route works for B2B buyers"), "Homepage must explain the invoice-first fallback.");
assert(home.includes("info@mind-reply.com"), "Homepage must use the public MindReply mailbox.");
assert(!publicPages.includes("Try MRagent"), "Public CTA labels must use Try MindReply Free instead of Try MRagent.");
assert(products.includes("Try MindReply Free"), "/products must use the clear free CTA.");
assert(responseOverload.includes("Try MindReply Free"), "/response-overload must use the clear free CTA.");
assert(capabilities.includes("Try MindReply Free"), "/capabilities must use the clear free CTA.");
assert(siteFooter.includes("Try MindReply Free"), "Footer must use the clear free CTA.");
assert(localeAssist.includes("Try MindReply Free first"), "Locale assist copy must use the clear free CTA.");
assert(trust.includes("Trust and Data Handling | MindReply"), "/trust must expose a buyer-facing trust surface.");
assert(trust.includes("Raw private text is not public proof"), "/trust must make raw-text redaction inspectable.");
assert(trust.includes("Memory requires explicit approval"), "/trust must explain consent-gated memory.");
assert(trust.includes("No borrowed trust badges. No invented proof."), "/trust must avoid unsupported compliance or testimonial claims.");
assert(trust.includes("No customer count, revenue, staff, compliance badge, payment status, or integration status is stated without evidence."), "/trust must state claim discipline.");
assert(siteFooter.includes("Trust"), "Footer must link to the trust surface.");

assert(pack.includes('redirect("/website-completion-package")'), "/pack must redirect to the canonical Website Completion Package page.");
assert(pack.includes("index: false"), "/pack legacy redirect must stay non-indexed.");

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
