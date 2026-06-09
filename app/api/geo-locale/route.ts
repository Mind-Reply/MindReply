import { NextRequest, NextResponse } from "next/server";

const countryLocale: Record<string, string> = {
  AE: "ar",
  AR: "es",
  AT: "de",
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
  IE: "en",
  IT: "it",
  JP: "ja",
  KR: "ko",
  MX: "es",
  NL: "en",
  PT: "pt",
  SA: "ar",
  US: "en",
};

const supportedLocales = ["en", "es", "fr", "de", "it", "pt", "ar", "ja", "ko", "zh"];

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
    source: countryLocale[countryCode] ? "country" : "browser",
  });
}
