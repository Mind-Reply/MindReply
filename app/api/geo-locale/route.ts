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
  MX: "es",
  MY: "en",
  NZ: "en",
  PT: "pt",
  SA: "ar",
  SG: "en",
  TW: "zh",
  UA: "uk",
  US: "en",
};

const supportedLocales = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"];

const priorityMarkets = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "United Arab Emirates",
  "Saudi Arabia",
  "Singapore",
  "India",
  "Japan",
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
    source: countryLocale[countryCode] ? "country" : "browser",
  });
}
