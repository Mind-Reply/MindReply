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
  translateRoute: read("app/api/translate/route.ts"),
  geoLocale: read("app/api/geo-locale/route.ts"),
  sitemap: read("app/sitemap.ts"),
  robots: read("app/robots.ts"),
  globals: read("app/globals.css"),
  contact: read("app/contact/page.tsx"),
  packagePage: read("app/website-completion-package/page.tsx"),
  responseOverload: read("app/response-overload/page.tsx"),
  products: read("app/products/page.tsx"),
  checkout: read("app/checkout/page.tsx"),
  capabilities: read("app/capabilities/page.tsx"),
  trust: read("app/trust/page.tsx"),
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
  "Data handling proof",
  "First-session conversion logic",
  "Credit trigger",
  "Package trigger",
  "Growth trigger",
  "Pro trigger",
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
  "visitor-matched multilingual support",
  "Visitor IP country > browser language > manual language selector",
  "IP aware business communication support",
  "GoogleTranslateProvider",
]) {
  includes("layout metadata", files.layout, phrase);
}
for (const forbidden of ["Bulgaria", "Bulgarian", "bg_BG", "bg: \"/?lang=bg\"", "target-market-priority\": \"UK >"]) {
  excludes("layout metadata", files.layout, forbidden);
}

const localeCodes = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"];
for (const locale of localeCodes) {
  includes("locale assist", files.localeAssist, `${locale}: {`);
}
for (const locale of localeCodes.filter((locale) => locale !== "en")) {
  includes("sitemap language params", files.sitemap, `\"${locale}\"`);
}

for (const phrase of [
  "type LocaleCode",
  "fetch(\"/api/geo-locale\"",
  "GeoLocaleResponse",
  "countryLocale",
  "resolveManualLocale",
  "localeFromBrowser",
  "document.documentElement.lang",
  "document.documentElement.dir",
  "mindreply:locale-change",
  "data-locale-count={localeCodes.length}",
  "IP/browser matched",
  "Country signal matched",
  "Browser language matched",
  "Full-site translation uses Google Translate",
]) {
  includes("locale assist", files.localeAssist, phrase);
}
for (const forbidden of ["BG: \"bg\"", "Bulgarian", "Bulgaria / Eastern Europe", "11 priority", "11 supported", "priority markets"]) {
  excludes("locale assist", files.localeAssist, forbidden);
}
excludes("locale assist", files.localeAssist, "Auto country signal first");
excludes("locale assist", files.localeAssist, "Auto {country}");
excludes("locale assist", files.localeAssist, "{AUTO BG}");

for (const phrase of [
  "supportedLocales",
  "collectTextNodes",
  "document.querySelectorAll(\"body\")",
  "mindreply:locale-change",
  "translateVisibleText",
  "fetch(\"/api/translate\"",
  "target: locale",
]) {
  includes("google translate provider", files.googleTranslate, phrase);
}
excludes("google translate provider", files.googleTranslate, /"bg"|bg:\s*"bg"|bg:\s*"Bulgarian"/);

for (const phrase of [
  "GOOGLE_TRANSLATE_API_KEY",
  "GOOGLE_CLOUD_TRANSLATE_API_KEY",
  "translation.googleapis.com/language/translate/v2",
  "google-cloud-translate",
  "passthrough",
  "zh-CN",
]) {
  includes("google translate route", files.translateRoute, phrase);
}
excludes("google translate route", files.translateRoute, /"bg"|bg:\s*"bg"/);

for (const phrase of [
  "supportedLocales",
  "marketProfiles",
  "providerGap",
  "country: mappedLocale ? countryCode : \"GLOBAL\"",
  "source: mappedLocale ? \"country\" : \"browser\"",
]) {
  includes("geo locale", files.geoLocale, phrase);
}
for (const forbidden of ["BG: \"bg\"", "Bulgaria", "locale: \"bg\"", "priority: 11", "\"bg\""]) {
  excludes("geo locale", files.geoLocale, forbidden);
}

for (const phrase of ["/products", "/checkout", "/response-overload", "/website-completion-package", "/trust", "languageParams", "alternates:", "hi", "uk", "?lang=${locale}"]) {
  includes("sitemap", files.sitemap, phrase);
}
excludes("sitemap", files.sitemap, "\"bg\"");

for (const phrase of ["/products", "/checkout", "/website-completion-package", "/trust", "disallow: [\"/api/\", \"/mcp\", \"/agents\", \"/pack\"]"]) {
  includes("robots", files.robots, phrase);
}

for (const phrase of [
  "overflow-x: hidden",
  ".min-h-\\[43rem\\]",
  "overflow-wrap: anywhere",
  ".locale-assist-shell",
  "#mindreply-google-translate",
  ".goog-te-banner-frame",
]) {
  includes("globals", files.globals, phrase);
}

for (const phrase of [
  "Products",
  "Checkout",
  "Trust",
  "/checkout?package=website-completion",
  "Language and market fit",
  "Full-site translation uses Google Translate",
  "Google Translate or the visitor's browser",
  "Visitor IP and browser language",
  "info@mind-reply.com",
]) {
  includes("site footer", files.footer, phrase);
}
excludes("footer", files.footer, "Bulgaria");
excludes("footer", files.footer, "Auto country signal first");
excludes("footer", files.footer, "Auto {country}");
excludes("footer", files.footer, "{AUTO BG}");

for (const phrase of [
  "MRAGENT_PROVIDER_BASE_URL",
  "MRAGENT_PROVIDER_API_KEY",
  "supportedAgentLanguages",
  "Mirror the user's supported language",
  "Supported languages include English, Spanish, French, German, Portuguese, Arabic, Hindi, Japanese, Chinese, and Ukrainian",
  "Vary rhythm and wording each time",
  "Use 2-3 short paragraphs, 45-85 words",
  "max_output_tokens: 145",
]) {
  includes("mragent", files.mragent, phrase);
}
excludes("mragent", files.mragent, "Bulgarian");

for (const phrase of ["Assisted close", "Ask MRagent first", "info@mind-reply.com", "PackageRequestForm"]) {
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
  "Buyer proof checklist",
  "The package must feel inspectable before payment",
  "clear price, clear route, clear output, and a clean privacy boundary",
  "The buyer can inspect the GBP 600 price before sending private context",
  "Assisted-close assets",
  "DM 1",
  "DM 5",
  "Cold email set",
  "Three emails for buyers who need proof before a call.",
  "Two follow-ups",
  "Objection handling",
  "We do not need a redesign.",
  "Why pay before seeing the work?",
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
  "Response Overload Rescue | MindReply",
  "response-overload",
  "Turn the message pile into one clear next move",
  "Start with one free MRagent read",
  "Use credits when several messages need quick pressure reads",
  "GBP 600 Website Completion Package",
  "Growth or Pro",
  "Raw private text is not used as public proof",
]) {
  includes("response overload page", files.responseOverload, phrase);
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

for (const phrase of ["Visitor-matched language", "IP-country route", "browser-language fallback", "Google Translate fallback", "Visitor IP, browser language, and manual selection"]) {
  includes("capabilities", files.capabilities, phrase);
}
for (const forbidden of ["11 priority languages", "Bulgarian support", "Bulgarian is included"]) {
  excludes("capabilities", files.capabilities, forbidden);
}

for (const phrase of [
  "Trust and Data Handling | MindReply",
  "Raw private text is not public proof",
  "Receipts are narrow on purpose",
  "Memory requires explicit approval",
  "Human handoff uses the public route",
  "No borrowed trust badges. No invented proof.",
  "No customer count, revenue, staff, compliance badge, payment status, or integration status is stated without evidence.",
  "info@mind-reply.com",
  "Website Completion Package",
  "Try MindReply Free",
]) {
  includes("trust page", files.trust, phrase);
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
  files.trust,
].join("\n");

excludes("public surface", publicSurface, /ANGELLLKR@GMAIL\.COM|angelllkr@gmail\.com/i);
excludes("public surface", publicSurface, /57 active staff|Agent expansion board|worktree|command board/i);

for (const broken of ["\u00c3", "\u00e0\u00a4", "\u00e6\u2014", "\u00d0\u00a3"]) {
  excludes("locale assist", files.localeAssist, broken);
}

console.log(
  "Revenue, mobile, visitor-matched multilingual SEO, Google Translate route, product and checkout routes, invoice-first close path, short multilingual MRagent behavior, hourly owner contract, and public safety verification passed.",
);
