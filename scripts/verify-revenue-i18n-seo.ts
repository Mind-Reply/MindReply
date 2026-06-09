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
const contact = read("app/contact/page.tsx");
const packagePage = read("app/website-completion-package/page.tsx");
const layout = read("app/layout.tsx");
const robots = read("app/robots.ts");
const sitemap = read("app/sitemap.ts");
const localeAssist = read("components/LocaleAssist.tsx");
const packageRequestForm = read("components/PackageRequestForm.tsx");
const geoLocale = read("app/api/geo-locale/route.ts");
const packageRequestApi = read("app/api/package-request/route.ts");
const packageRequestLib = read("lib/package-request.ts");
const websiteBlueprint = read("docs/website_audit_action_blueprint.md");
const ownerSecurity = read("docs/owner_decision_security.md");

includes("homepage", home, "Reclaim 2+ hours daily within 24 hours");
includes("homepage", home, "Website Completion Package");
includes("homepage", home, "GBP 600");
includes("homepage", home, "website buying-friction rescue");
includes("homepage", home, "Discipline-specific language");
includes("homepage", home, "Behavioral expression read");
includes("homepage", home, "Measurable communication structure");
includes("homepage", home, "Public contact uses info@mind-reply.com only.");

includes("contact page", contact, "info@mind-reply.com");
includes("contact page", contact, "Ask MRagent first");
includes("contact page", contact, "Website Completion Package, GBP 600");
assert(!/ANGELLLKR@GMAIL\.COM|gmail\.com/i.test(contact), "contact page must not expose personal Gmail.");

includes("package page", packagePage, "Website Completion Package");
includes("package page", packagePage, "GBP 600");
includes("package page", packagePage, "buying-friction rescue");
includes("package page", packagePage, "ranked action queue");
includes("package page", packagePage, "send-ready copy");

includes("package request form", packageRequestForm, "Submit GBP 600 package request");
includes("package request form", packageRequestForm, "Owner decision needed");
includes("package request form", packageRequestForm, "Payment path");
includes("package request form", packageRequestForm, "Reply window");
includes("package request form", packageRequestForm, "Risk:");

includes("package request API", packageRequestApi, "Expect the next close-ready route within one business day");
includes("package request API", packageRequestApi, "assistedClose");

includes("package request receipt", packageRequestLib, "assistedClose");
includes("package request receipt", packageRequestLib, "riskLevel: \"low\"");
includes("package request receipt", packageRequestLib, "confidence: \"medium\"");
includes("package request receipt", packageRequestLib, "playbookVersion: \"website-completion-2026-06\"");
includes("package request receipt", packageRequestLib, "fallbackEmail: \"info@mind-reply.com\"");
includes("package request receipt", packageRequestLib, "Owner decision needed: confirm scope");
includes("package request receipt", packageRequestLib, "Payment path: scope first, then invoice or payment link after acceptance.");

includes("layout metadata", layout, "Website Completion and Response Overload Rescue");
includes("layout metadata", layout, "GBP 600 website package");
includes("layout metadata", layout, "multilingual business communication support");
includes("layout metadata", layout, "hi: \"/?lang=hi\"");
includes("layout metadata", layout, "uk: \"/?lang=uk\"");
includes("layout metadata", layout, "alternateLocale");
includes("layout metadata", layout, "target-market");
includes("layout metadata", layout, "UK, US, DE, FR, ES, AE, SA, SG, IN, JP");

for (const path of ["/", "/agent", "/website-completion-package", "/pricing", "/contact", "/capabilities", "/privacy"]) {
  includes("robots", robots, path);
}
includes("robots", robots, "disallow: [\"/api/\", \"/mcp\"]");

includes("sitemap", sitemap, "languageParams");
includes("sitemap", sitemap, "hi");
includes("sitemap", sitemap, "/website-completion-package");
includes("sitemap", sitemap, "alternates:");
includes("sitemap", sitemap, "languages: localeAlternates");

for (const locale of ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"]) {
  includes("locale assist", localeAssist, `${locale}: {`);
}
assert(!/ko: \{|it: \{/.test(localeAssist), "locale assist should stay at the 10 priority languages.");
includes("locale assist", localeAssist, "Website Completion Package");
includes("locale assist", localeAssist, "GBP 600");
includes("locale assist", localeAssist, "info@mind-reply.com");
includes("locale assist", localeAssist, "aria-live=\"polite\"");
includes("locale assist", localeAssist, "data-revenue-anchor");
includes("locale assist", localeAssist, "Auto {country}");

includes("geo locale", geoLocale, "IN: \"hi\"");
includes("geo locale", geoLocale, "AE: \"ar\"");
includes("geo locale", geoLocale, "JP: \"ja\"");
includes("geo locale", geoLocale, "UA: \"uk\"");
includes("geo locale", geoLocale, "supportedLocales");
includes("geo locale", geoLocale, "priorityMarkets");
assert(!/KR: \"ko\"|IT: \"it\"/.test(geoLocale), "geo locale should not recommend removed languages.");

includes("website blueprint", websiteBlueprint, "Website Completion Package");
includes("website blueprint", websiteBlueprint, "Revenue-First Rule");
includes("website blueprint", websiteBlueprint, "Mobile And Visual Quality");
includes("website blueprint", websiteBlueprint, "SEO And Demand Lanes");
includes("website blueprint", websiteBlueprint, "Deployment Gate");

includes("owner security", ownerSecurity, "info@mind-reply.com");
includes("owner security", ownerSecurity, "Defensive Security Boundary");
includes("owner security", ownerSecurity, "Owner Decision Format");
assert(!/ANGELLLKR@GMAIL\.COM/i.test(ownerSecurity), "owner security doc must not expose the private Gmail directly.");

console.log("Revenue, 10-language i18n, SEO, assisted close, and security boundary verification passed.");
