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
  "United States",
  "United Arab Emirates",
  "Saudi Arabia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "Spain",
  "India",
];

const marketProfiles = [
  {
    country: "United Kingdom",
    locale: "en",
    angle: "B2B services density, client-facing teams, and strong website completion demand.",
  },
  {
    country: "United States",
    locale: "en",
    angle: "largest buyer pool for founder replies, sales follow-up, and website buying-friction rescue.",
  },
  {
    country: "United Arab Emirates",
    locale: "ar",
    angle: "premium executive communication demand and high urgency around sensitive business replies.",
  },
  {
    country: "Saudi Arabia",
    locale: "ar",
    angle: "Arabic business communication demand with fewer specialist decision-support providers.",
  },
  {
    country: "Germany",
    locale: "de",
    angle: "high willingness to pay for precise, risk-aware professional replies.",
  },
  {
    country: "France",
    locale: "fr",
    angle: "strong professional-services demand where local tone and restraint matter.",
  },
  {
    country: "Japan",
    locale: "ja",
    angle: "high value for hierarchy, restraint, and exact business reply tone.",
  },
  {
    country: "Brazil",
    locale: "pt",
    angle: "large Portuguese market with growing demand and fewer localized B2B providers.",
  },
  {
    country: "Spain",
    locale: "es",
    angle: "Spanish-language gateway for sales objection and agency follow-up use cases.",
  },
  {
    country: "India",
    locale: "hi",
    angle: "high-volume founder and operator market using English plus local-language context.",
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
  const recommendedLocale = countryLocale[countryCode] || browserLocale;

  return NextResponse.json({
    country: countryCode,
    recommendedLocale,
    browserLocale,
    supportedLocales,
    priorityMarkets,
    marketProfiles,
    source: countryLocale[countryCode] ? "country" : "browser",
  });
}
