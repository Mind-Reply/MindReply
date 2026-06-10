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

function excludes(label: string, value: string, forbidden: RegExp | string) {
  const found = typeof forbidden === "string" ? value.includes(forbidden) : forbidden.test(value);
  assert(!found, `${label} must not include: ${forbidden.toString()}`);
}

const files = {
  home: read("app/page.tsx"),
  layout: read("app/layout.tsx"),
  footer: read("components/SiteFooter.tsx"),
  localeAssist: read("components/LocaleAssist.tsx"),
  googleTranslate: read("components/GoogleTranslateProvider.tsx"),
  geoLocale: read("app/api/geo-locale/route.ts"),
  sitemap: read("app/sitemap.ts"),
  robots: read("app/robots.ts"),
  globals: read("app/globals.css"),
  contact: read("app/contact/page.tsx"),
  packagePage: read("app/website-completion-package/page.tsx"),
  products: read("app/products/page.tsx"),
  checkout: read("app/checkout/page.tsx"),
  capabilities: read("app/capabilities/page.tsx"),
  agents: read("app/agents/page.tsx"),
  legacyPack: read("app/pack/page.tsx"),
  mragent: read("lib/mragent.ts"),
  hourlyPrompt: read("docs/hourly_owner_goal_prompt.md"),
};

for (const phrase of [
  "Website Completion Package",
  "GBP 600",
  "Website buying-friction rescue",
  "20+ professional lexicons",
  "10 refinement tools",
  "Private by design",
  "No payment link is required to begin",
  "billing name and billing email",
  "/checkout?package=website-completion",
]) {
  includes("homepage", files.home, phrase);
}

for (const phrase of [
  "Website Completion and Response Overload Rescue",
  "content-language",
  "target-market-priority",
  "Bulgaria business communication support",
  "Bulgarian website completion service",
  "Bulgarian professional reply support",
  "bg: \"/?lang=bg\"",
  "bg_BG",
  "UK > India > UAE > Saudi Arabia > US > Germany > Japan > Brazil > France > Spain > Bulgaria",
  "GoogleTranslateProvider",
]) {
  includes("layout metadata", files.layout, phrase);
}

const localeCodes = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk", "bg"];
for (const locale of localeCodes) {
  includes("locale assist", files.localeAssist, `${locale}: {`);
  includes("sitemap", files.sitemap, `lang=${locale}`);
}

for (const phrase of [
  "type LocaleCode",
  "fetch(\"/api/geo-locale\"",
  "GeoLocaleResponse",
  "countryLocale",
  "BG: \"bg\"",
  "Bulgarian",
  "Bulgaria / Eastern Europe",
  "resolveManualLocale",
  "localeFromBrowser",
  "document.documentElement.lang",
  "document.documentElement.dir",
  "mindreply:locale-change",
  "data-locale-count={localeCodes.length}",
  "{marketCount} priority markets",
  "Full-site translation uses Google Translate",
]) {
  includes("locale assist", files.localeAssist, phrase);
}
excludes("locale assist", files.localeAssist, "Auto country signal first");
excludes("locale assist", files.localeAssist, "Auto {country}");
excludes("locale assist", files.localeAssist, "{AUTO BG}");

for (const phrase of [
  "translate.google.com/translate_a/element.js",
  "googtrans",
  "googleTranslateElementInit",
  "mindreply-google-translate",
  "mindreply:locale-change",
  "zh-CN",
  "bg: \"bg\"",
]) {
  includes("google translate provider", files.googleTranslate, phrase);
}

for (const phrase of [
  "BG: \"bg\"",
  "supportedLocales",
  "Bulgaria",
  "locale: \"bg\"",
  "priority: 11",
  "marketProfiles",
  "providerGap",
]) {
  includes("geo locale", files.geoLocale, phrase);
}

for (const phrase of ["/products", "/checkout", "/website-completion-package", "languageParams", "alternates:", "hi", "uk", "bg"]) {
  includes("sitemap", files.sitemap, phrase);
}

for (const phrase of ["/products", "/checkout", "/website-completion-package", "disallow: [\"/api/\", \"/mcp\", \"/agents\", \"/pack\"]"]) {
  includes("robots", files.robots, phrase);
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
  includes("globals", files.globals, phrase);
}

for (const phrase of [
  "Products",
  "Checkout",
  "/checkout?package=website-completion",
  "Language and market fit",
  "Google Translate or the visitor's browser",
  "info@mind-reply.com",
  "Bulgaria",
]) {
  includes("site footer", files.footer, phrase);
}
excludes("footer", files.footer, "Auto country signal first");
excludes("footer", files.footer, "Auto {country}");
excludes("footer", files.footer, "{AUTO BG}");

for (const phrase of [
  "MRAGENT_PROVIDER_BASE_URL",
  "MRAGENT_PROVIDER_API_KEY",
  "supportedAgentLanguages",
  "Bulgarian",
  "Mirror the user's language",
  "Supported languages include English, Spanish, French, German, Portuguese, Arabic, Hindi, Japanese, Chinese, Ukrainian, and Bulgarian",
  "Vary rhythm and wording each time",
  "Use 2-3 short paragraphs, 45-85 words",
  "max_output_tokens: 145",
]) {
  includes("mragent", files.mragent, phrase);
}

for (const phrase of ["Contact form", "Ask MRagent first", "info@mind-reply.com", "/api/package-request"]) {
  includes("contact page", files.contact, phrase);
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
  includes("package page", files.packagePage, phrase);
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
  includes("products page", files.products, phrase);
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
  includes("checkout page", files.checkout, phrase);
}

for (const phrase of ["11 priority languages", "Bulgarian visitors", "Bulgarian support", "Google Translate fallback"]) {
  includes("capabilities", files.capabilities, phrase);
}

for (const phrase of [
  "Website Completion Package first",
  "Layer 1: immediate operational relief through MRagent",
  "Layer 2: premium authority",
  "no public page may claim 57 active staff",
  "Slack/email delivery receipt",
  "Defensive Security Boundary",
]) {
  includes("hourly owner prompt", files.hourlyPrompt, phrase);
}

includes("agents redirect", files.agents, "redirect(\"/capabilities\")");
includes("legacy pack redirect", files.legacyPack, "redirect(\"/website-completion-package\")");

const publicSurface = [
  files.home,
  files.layout,
  files.footer,
  files.localeAssist,
  files.contact,
  files.packagePage,
  files.products,
  files.checkout,
  files.capabilities,
].join("\n");

excludes("public surface", publicSurface, /ANGELLLKR@GMAIL\.COM|angelllkr@gmail\.com/i);
excludes("public surface", publicSurface, /57 active staff|Agent expansion board|worktree|command board/i);

for (const broken of ["\u00c3", "\u00e0\u00a4", "\u00e6\u2014", "\u00d0\u00a3"]) {
  excludes("locale assist", files.localeAssist, broken);
}

console.log(
  "Revenue, mobile, Google Translate fallback, Bulgarian i18n, priority-market SEO, product and checkout routes, invoice-first close path, short multilingual MRagent behavior, hourly owner contract, and public safety verification passed.",
);
