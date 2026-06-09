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
const geoLocale = read("app/api/geo-locale/route.ts");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const globals = read("app/globals.css");
const contact = read("app/contact/page.tsx");
const packagePage = read("app/website-completion-package/page.tsx");
const capabilities = read("app/capabilities/page.tsx");
const agents = read("app/agents/page.tsx");
const legacyPack = read("app/pack/page.tsx");

for (const phrase of [
  "Reclaim 2+ hours daily within 24 hours",
  "Website Completion Package",
  "GBP 600",
  "website buying-friction rescue",
  "Discipline-specific language",
  "Behavioral expression read",
  "Professional lexicon calibration",
]) {
  includes("homepage", home, phrase);
}

for (const phrase of [
  "Website Completion and Response Overload Rescue",
  "content-language",
  "target-market-priority",
  "UK > US > UAE > Saudi Arabia > Germany > France > Japan > Brazil > Spain > India",
  "Brazil Portuguese business communication support",
  "Arabic executive communication support",
  "Japanese business reply refinement",
]) {
  includes("layout metadata", layout, phrase);
}

for (const locale of ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"]) {
  includes("locale assist", localeAssist, `${locale}: {`);
}

for (const phrase of [
  "fetch(\"/api/geo-locale\"",
  "document.documentElement.lang",
  "document.documentElement.dir",
  "surfaceTranslations",
  "Auto {country}",
  "marketCount",
  "10 priority markets",
  "Recupere más de 2 horas diarias en 24 horas.",
  "استعد أكثر من ساعتين يومياً خلال 24 ساعة.",
  "24 घंटे में रोज़ 2+ घंटे वापस पाएं.",
  "24時間以内に毎日2時間以上を取り戻します。",
]) {
  includes("locale assist", localeAssist, phrase);
}

for (const phrase of [
  "BR: \"pt\"",
  "AE: \"ar\"",
  "SA: \"ar\"",
  "IN: \"hi\"",
  "JP: \"ja\"",
  "UA: \"uk\"",
  "United Kingdom",
  "United States",
  "United Arab Emirates",
  "Saudi Arabia",
  "Brazil",
  "marketProfiles",
]) {
  includes("geo locale", geoLocale, phrase);
}

for (const phrase of ["/website-completion-package", "languageParams", "alternates:", "hi", "uk"]) {
  includes("sitemap", sitemap, phrase);
}

includes("robots", robots, "disallow: [\"/api/\", \"/mcp\", \"/agents\", \"/pack\"]");
includes("globals", globals, "overflow-x: hidden");
includes("globals", globals, ".min-h-\\[43rem\\]");
includes("globals", globals, "overflow-wrap: anywhere");

for (const phrase of [
  "Contact form",
  "/contact?intent=website-completion",
  "Try MRagent",
  "Auto language and priority markets",
  "Country signal first, browser language second",
  "UK",
  "UAE",
  "Saudi Arabia",
  "Brazil",
]) {
  includes("site footer", footer, phrase);
}
assert(!/mailto:/i.test(footer), "footer should route to contact form, not direct mailto.");

includes("contact page", contact, "Ask MRagent first");
includes("contact page", contact, "info@mind-reply.com");
includes("package page", packagePage, "Website Completion Package");
includes("package page", packagePage, "GBP 600");
includes("capabilities", capabilities, "Service readiness");
includes("agents redirect", agents, "redirect(\"/capabilities\")");
includes("legacy pack redirect", legacyPack, "redirect(\"/website-completion-package\")");

const publicSurface = [home, layout, footer, localeAssist, contact, packagePage, capabilities].join("\n");
assert(!/ANGELLLKR@GMAIL\.COM|angelllkr@gmail\.com/i.test(publicSurface), "public surface must not expose personal Gmail.");
assert(!/57 active staff|Agent expansion board|worktree|command board/i.test(publicSurface), "public surface must not expose internal agent/worktree language.");

for (const broken of ["Ã", "à¤", "æ—", "Ð£"]) {
  assert(!localeAssist.includes(broken), `locale assist appears to contain mojibake marker ${broken}`);
}

console.log("Revenue, mobile, market SEO, 10-language auto locale, footer handoff, and public safety verification passed.");
