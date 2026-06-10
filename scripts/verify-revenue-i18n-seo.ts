import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function read(path: string) {
  const fullPath = join(process.cwd(), path);
  assert(existsSync(fullPath), `${path} must exist.`);
  return readFileSync(fullPath, "utf-8");
}

function includes(label: string, value: string, expected: string) {
  assert(value.includes(expected), `${label} must include: ${expected}`);
}

const home = read("app/page.tsx");
const layout = read("app/layout.tsx");
const footer = read("components/SiteFooter.tsx");
const localeAssist = read("components/LocaleAssist.tsx");
const googleTranslate = read("components/GoogleTranslateProvider.tsx");
const geoLocale = read("app/api/geo-locale/route.ts");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const globals = read("app/globals.css");
const contact = read("app/contact/page.tsx");
const packagePage = read("app/website-completion-package/page.tsx");
const products = read("app/products/page.tsx");
const checkout = read("app/checkout/page.tsx");
const capabilities = read("app/capabilities/page.tsx");
const agents = read("app/agents/page.tsx");
const legacyPack = read("app/pack/page.tsx");
const mragent = read("lib/mragent.ts");
const hourlyPrompt = read("docs/hourly_owner_goal_prompt.md");

for (const phrase of [
  "Reclaim 2+ hours daily when your page, inbox, or follow-up path is leaking decisions.",
  "Website Completion Package",
  "GBP 600",
  "Website buying-friction rescue",
  "20+ professional lexicons",
  "10 refinement tools",
  "Private by design",
  "No payment link is required to begin",
  "billing name and billing email",
]) {
  includes("homepage", home, phrase);
}

for (const phrase of [
  "Website Completion and Response Overload Rescue",
  "content-language",
  "target-market-priority",
  "UK > India > UAE > Saudi Arabia > US > Germany > Japan > Brazil > France > Spain",
  "Brazil Portuguese business communication support",
  "Arabic executive communication support",
  "Japanese business reply refinement",
  "Hindi founder communication support",
  "GoogleTranslateProvider",
]) {
  includes("layout metadata", layout, phrase);
}

for (const locale of ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"]) {
  includes("locale assist", localeAssist, `${locale}: {`);
}

for (const phrase of [
  "type LocaleCode = \"en\" | \"es\" | \"fr\" | \"de\" | \"pt\" | \"ar\" | \"hi\" | \"ja\" | \"zh\" | \"uk\"",
  "fetch(\"/api/geo-locale\"",
  "GeoLocaleResponse",
  "countryLocale",
  "BR: \"pt\"",
  "AE: \"ar\"",
  "IN: \"hi\"",
  "JP: \"ja\"",
  "UA: \"uk\"",
  "resolveManualLocale",
  "localeFromBrowser",
  "document.documentElement.lang",
  "document.documentElement.dir",
  "surfaceTranslations",
  "Language</span>",
  "data-detected-country={country}",
  "mindreply:locale-change",
  "data-locale-count={localeCodes.length}",
  "{marketCount} priority markets",
  "Contact form",
]) {
  includes("locale assist", localeAssist, phrase);
}
assert(!localeAssist.includes("Auto {country}"), "locale assist must not show raw Auto country label.");

for (const phrase of [
  "translate.google.com/translate_a/element.js",
  "googtrans",
  "googleTranslateElementInit",
  "mindreply-google-translate",
  "mindreply:locale-change",
  "zh-CN",
]) {
  includes("google translate provider", googleTranslate, phrase);
}

for (const phrase of [
  "BR: \"pt\"",
  "AE: \"ar\"",
  "SA: \"ar\"",
  "IN: \"hi\"",
  "JP: \"ja\"",
  "UA: \"uk\"",
  "United Kingdom",
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "United States",
  "Brazil",
  "marketProfiles",
  "providerGap",
  "priority: 1",
  "priority: 10",
]) {
  includes("geo locale", geoLocale, phrase);
}

for (const phrase of ["/products", "/checkout", "/website-completion-package", "languageParams", "alternates:", "hi", "uk"]) {
  includes("sitemap", sitemap, phrase);
}

for (const phrase of ["/products", "/checkout", "/website-completion-package", "disallow: [\"/api/\", \"/mcp\", \"/agents\", \"/pack\"]"]) {
  includes("robots", robots, phrase);
}

for (const phrase of [
  "overflow-x: hidden",
  ".min-h-\\[43rem\\]",
  "overflow-wrap: anywhere",
  ".locale-assist-shell",
  ".locale-assist-copy",
  ".locale-assist-controls select",
  ".locale-chip",
  ".priority-chip",
  ".market-chip",
  "grid-template-columns: minmax(0, 1fr) auto",
  "#mindreply-google-translate",
  ".goog-te-banner-frame",
]) {
  includes("globals", globals, phrase);
}

for (const phrase of [
  "Products",
  "Checkout",
  "/checkout?package=website-completion",
  "Language and market fit",
  "Google Translate or the visitor's browser",
  "info@mind-reply.com",
  "Contact form",
  "Try MRagent",
  "UK",
  "India",
  "UAE",
  "Saudi Arabia",
  "Brazil",
]) {
  includes("site footer", footer, phrase);
}
assert(!footer.includes("Auto country signal first"), "footer must not use noisy auto-language wording.");
assert(!footer.includes("Auto {country}"), "footer must not expose raw Auto country label.");

for (const phrase of [
  "MRAGENT_PROVIDER_BASE_URL",
  "MRAGENT_PROVIDER_API_KEY",
  "under 90 words",
  "2-4 short paragraphs",
  "Every answer must feel slightly different",
  "max_output_tokens: 150",
]) {
  includes("mragent", mragent, phrase);
}

for (const phrase of ["Contact form", "Ask MRagent first", "info@mind-reply.com", "/api/package-request"]) {
  includes("contact page", contact, phrase);
}

for (const phrase of [
  "Website Completion Package",
  "Website Completion Package | MindReply",
  "GBP 600",
  "Invoice-first request path active",
  "No payment link is required to begin",
  "billing name and billing email",
  "Scope first, invoice/payment before delivery",
  "paymentPath",
  "invoice-first unless a configured direct payment link is present",
]) {
  includes("package page", packagePage, phrase);
}

for (const phrase of [
  "Products | MindReply",
  "MRagent",
  "Website Completion Package",
  "GBP 600 fixed",
  "Checkout or invoice",
  "See more",
  "Growth",
  "Pro",
  "Fixed price",
  "Invoice option always visible",
]) {
  includes("products page", products, phrase);
}

for (const phrase of [
  "Checkout | MindReply",
  "Website Completion Package, GBP 600",
  "Fixed-price checkout",
  "Pay GBP 600",
  "Request invoice",
  "Invoice option",
  "Fixed scope first",
  "Public pages must not expose personal Gmail",
]) {
  includes("checkout page", checkout, phrase);
}

for (const phrase of [
  "Website Completion Package first",
  "Layer 1: immediate operational relief through MRagent",
  "Layer 2: premium authority",
  "no public page may claim 57 active staff",
  "Slack/email delivery receipt",
  "Defensive Security Boundary",
]) {
  includes("hourly owner prompt", hourlyPrompt, phrase);
}

includes("capabilities", capabilities, "Service readiness");
includes("agents redirect", agents, "redirect(\"/capabilities\")");
includes("legacy pack redirect", legacyPack, "redirect(\"/website-completion-package\")");

const publicSurface = [home, layout, footer, localeAssist, contact, packagePage, products, checkout, capabilities].join("\n");
assert(!/ANGELLLKR@GMAIL\.COM|angelllkr@gmail\.com/i.test(publicSurface), "public surface must not expose personal Gmail.");
assert(!/57 active staff|Agent expansion board|worktree|command board/i.test(publicSurface), "public surface must not expose internal agent/worktree language.");

for (const broken of ["\u00c3", "\u00e0\u00a4", "\u00e6\u2014", "\u00d0\u00a3"]) {
  assert(!localeAssist.includes(broken), `locale assist appears to contain mojibake marker ${broken}`);
}

console.log("Revenue, mobile, Google Translate fallback, priority-market SEO, product and checkout routes, invoice-first close path, MRagent behavior, hourly owner contract, and public safety verification passed.");
