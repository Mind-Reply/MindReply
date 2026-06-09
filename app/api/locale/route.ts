import { NextRequest, NextResponse } from "next/server";

type LocaleKey = "en" | "es" | "fr" | "de" | "it" | "pt" | "nl" | "pl" | "uk" | "ar";

const supported: LocaleKey[] = ["en", "es", "fr", "de", "it", "pt", "nl", "pl", "uk", "ar"];

const countryLanguage: Record<string, LocaleKey> = {
  AR: "es",
  AT: "de",
  BE: "nl",
  BR: "pt",
  CA: "en",
  CH: "de",
  CL: "es",
  CO: "es",
  DE: "de",
  ES: "es",
  FR: "fr",
  GB: "en",
  IE: "en",
  IT: "it",
  MX: "es",
  NL: "nl",
  PE: "es",
  PL: "pl",
  PT: "pt",
  SA: "ar",
  UA: "uk",
  AE: "ar",
  US: "en",
};

function firstSupportedFromAcceptLanguage(header: string | null): LocaleKey | null {
  if (!header) return null;

  for (const entry of header.split(",")) {
    const code = entry.trim().slice(0, 2).toLowerCase() as LocaleKey;
    if (supported.includes(code)) return code;
  }

  return null;
}

export function GET(request: NextRequest) {
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country") ||
    "local";
  const normalizedCountry = country.toUpperCase();
  const countryLocale = countryLanguage[normalizedCountry];
  const acceptedLocale = firstSupportedFromAcceptLanguage(request.headers.get("accept-language"));
  const locale = countryLocale || acceptedLocale || "en";

  return NextResponse.json(
    {
      locale,
      country: normalizedCountry,
      source: countryLocale ? "country-header" : acceptedLocale ? "accept-language" : "default",
      supported,
    },
    {
      headers: { "cache-control": "private, max-age=0, must-revalidate" },
    },
  );
}
