import { NextRequest, NextResponse } from "next/server";

const countryLocale: Record<string, string> = {
  AE: "ar",
  AR: "es",
  AT: "de",
  AU: "en",
  BE: "fr",
  BR: "pt",
  CA: "en",
  CH: "de",
  CL: "es",
  CN: "zh",
  CO: "es",
  DE: "de",
  ES: "es",
  FR: "fr",
  GB: "en",
  HK: "zh",
  IE: "en",
  IN: "hi",
  JP: "ja",
  KW: "ar",
  MX: "es",
  MY: "en",
  NZ: "en",
  OM: "ar",
  PT: "pt",
  QA: "ar",
  SA: "ar",
  SG: "en",
  TW: "zh",
  UA: "uk",
  UK: "en",
  US: "en",
};

const supportedLocales = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"];

const priorityMarkets = [
  "United Kingdom",
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "United States",
  "Germany",
  "Japan",
  "Brazil",
  "France",
  "Spain",
];

const marketProfiles = [
  {
    country: "United Kingdom",
    locale: "en",
    priority: 1,
    demand: "professional-services density, founder-led agencies, and immediate website completion demand",
    providerGap: "SMB and boutique operators remain underserved by affordable, high-trust completion support",
  },
  {
    country: "India",
    locale: "hi",
    priority: 2,
    demand: "high workplace adoption and heavy founder/operator message volume",
    providerGap: "large market using English plus local-language context, with room for sharper B2B response support",
  },
  {
    country: "United Arab Emirates",
    locale: "ar",
    priority: 3,
    demand: "premium executive communication and sensitive business response pressure",
    providerGap: "fewer Arabic-first specialist decision-support providers for private-client and operator workflows",
  },
  {
    country: "Saudi Arabia",
    locale: "ar",
    priority: 4,
    demand: "Arabic business communication demand and fast-growing digital services market",
    providerGap: "localized reply, trust, and website-completion support remains less crowded than English markets",
  },
  {
    country: "United States",
    locale: "en",
    priority: 5,
    demand: "largest buyer pool for founder replies, sales follow-up, and website buying-friction rescue",
    providerGap: "crowded category, so positioning must lead with fixed outcome and proof artifact",
  },
  {
    country: "Germany",
    locale: "de",
    priority: 6,
    demand: "high willingness to pay for precise, risk-aware professional replies",
    providerGap: "specialist tone and evidence discipline matter more than generic output volume",
  },
  {
    country: "Japan",
    locale: "ja",
    priority: 7,
    demand: "high value for hierarchy, restraint, and exact business reply tone",
    providerGap: "localized executive communication support is harder to imitate cheaply",
  },
  {
    country: "Brazil",
    locale: "pt",
    priority: 8,
    demand: "large Portuguese market with growing B2B services demand",
    providerGap: "fewer localized website-completion and response-overload providers than English markets",
  },
  {
    country: "France",
    locale: "fr",
    priority: 9,
    demand: "strong professional-services demand where local tone and restraint matter",
    providerGap: "localized trust-first refinement can stand apart from generic writing tools",
  },
  {
    country: "Spain",
    locale: "es",
    priority: 10,
    demand: "Spanish-language gateway for sales objection and agency follow-up use cases",
    providerGap: "clear entry into Spanish-speaking markets without overbuilding every route first",
  },
];

function normalizeLocale(value: string | null) {
  if (!value) return "en";
  const locale = value.split(",")[0]?.trim().toLowerCase().split("-")[0] || "en";
  return supportedLocales.includes(locale) ? locale : "en";
}

export function GET(req: NextRequest) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    "US";
  const countryCode = country.toUpperCase();
  const browserLocale = normalizeLocale(req.headers.get("accept-language"));
  const mappedLocale = countryLocale[countryCode] || null;
  const recommendedLocale = mappedLocale || browserLocale;

  return NextResponse.json({
    country: mappedLocale ? countryCode : "GLOBAL",
    recommendedLocale,
    browserLocale,
    supportedLocales,
    priorityMarkets,
    marketProfiles,
    source: mappedLocale ? "country" : "browser",
  });
}
