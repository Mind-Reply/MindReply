"use client";

import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";

type LocaleCode = "en" | "es" | "fr" | "de" | "pt" | "ar" | "hi" | "ja" | "zh" | "uk" | "bg";

type LocaleCopy = {
  label: string;
  market: string;
  note: string;
};

type GeoLocaleResponse = {
  country?: string;
  recommendedLocale?: string;
  priorityMarkets?: string[];
  marketProfiles?: Array<{ country: string; locale: string }>;
};

const localeCopy: Record<LocaleCode, LocaleCopy> = {
  en: { label: "English", market: "UK / US / global", note: "Pressure becomes one clear next step." },
  es: { label: "Espanol", market: "Spain / LATAM", note: "Sales replies and website handoffs stay precise." },
  fr: { label: "Francais", market: "France / Belgium", note: "Client follow-up stays measured and clear." },
  de: { label: "Deutsch", market: "Germany / Austria", note: "Risk-aware professional replies stay composed." },
  pt: { label: "Portugues", market: "Brazil / Portugal", note: "Website and client pressure turns into action." },
  ar: { label: "Arabic", market: "Gulf markets", note: "Executive communication keeps trust and restraint." },
  hi: { label: "Hindi", market: "India", note: "Founder and operator overload gets a usable route." },
  ja: { label: "Japanese", market: "Japan", note: "Hierarchy-sensitive replies stay careful and useful." },
  zh: { label: "Chinese", market: "China / Hong Kong / Taiwan", note: "Business communication stays direct and calm." },
  uk: { label: "Ukrainian", market: "Ukraine", note: "High-pressure follow-up stays structured." },
  bg: { label: "Bulgarian", market: "Bulgaria / Eastern Europe", note: "Bulgarian website and reply support is available." },
};

const localeCodes = Object.keys(localeCopy) as LocaleCode[];
const rtlLocales = new Set<LocaleCode>(["ar"]);

const countryLocale: Record<string, LocaleCode> = {
  US: "en",
  GB: "en",
  SG: "en",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  FR: "fr",
  BE: "fr",
  CH: "fr",
  DE: "de",
  AT: "de",
  BR: "pt",
  PT: "pt",
  AE: "ar",
  SA: "ar",
  KW: "ar",
  QA: "ar",
  OM: "ar",
  IN: "hi",
  JP: "ja",
  CN: "zh",
  HK: "zh",
  TW: "zh",
  UA: "uk",
  BG: "bg",
};

function isLocale(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode);
}

function localeFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const queryLocale = params.get("lang") || "";
  return isLocale(queryLocale) ? queryLocale : null;
}

function localeFromBrowser() {
  const browserLocale = navigator.language.split("-")[0];
  return isLocale(browserLocale) ? browserLocale : "en";
}

function publishLocale(nextLocale: LocaleCode) {
  document.documentElement.lang = nextLocale;
  document.documentElement.dir = rtlLocales.has(nextLocale) ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent("mindreply:locale-change", { detail: { locale: nextLocale } }));
}

function resolveManualLocale() {
  const queryLocale = localeFromQuery();
  if (queryLocale) return queryLocale;

  const saved = window.localStorage.getItem("mindreply-locale");
  if (saved && isLocale(saved)) return saved;

  return null;
}

export default function LocaleAssist() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [marketCount, setMarketCount] = useState(11);

  useEffect(() => {
    const manualLocale = resolveManualLocale();
    const initialLocale = manualLocale || localeFromBrowser();
    setLocale(initialLocale);
    publishLocale(initialLocale);

    fetch("/api/geo-locale", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: GeoLocaleResponse | null) => {
        const detectedCountry = data?.country || "US";
        const geoLocale = data?.recommendedLocale && isLocale(data.recommendedLocale)
          ? data.recommendedLocale
          : countryLocale[detectedCountry] || initialLocale;
        const nextLocale = manualLocale || geoLocale;

        setMarketCount(data?.marketProfiles?.length || data?.priorityMarkets?.length || 11);
        setLocale(nextLocale);
        publishLocale(nextLocale);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    publishLocale(locale);
  }, [locale]);

  return (
    <section
      className="locale-assist-shell border-t border-white/10 bg-[#0d1729] px-4 py-2 text-[#f8f5f0] md:px-8"
      aria-label="Language"
      data-locale-count={localeCodes.length}
    >
      <div className="locale-assist-inner mx-auto flex max-w-7xl flex-col gap-2 text-[11px] text-[#cdd8df] md:flex-row md:items-center md:justify-between">
        <div className="locale-assist-copy flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="priority-chip font-semibold uppercase tracking-[0.14em] text-[#91d2c8]">{marketCount} priority markets</span>
          <span className="market-chip">{localeCopy[locale].market}</span>
          <span className="locale-chip">{localeCopy[locale].note}</span>
          <span>Full-site translation uses Google Translate when a non-English language is selected.</span>
        </div>
        <div className="locale-assist-controls flex items-center gap-2">
          <label className="flex items-center gap-2 font-semibold uppercase tracking-[0.14em] text-[#91d2c8]" htmlFor="mindreply-locale">
            <Globe2 aria-hidden className="h-3.5 w-3.5" />
            <span>Language</span>
          </label>
          <select
            id="mindreply-locale"
            value={locale}
            onChange={(event) => {
              const nextLocale = event.target.value;
              if (!isLocale(nextLocale)) return;
              setLocale(nextLocale);
              window.localStorage.setItem("mindreply-locale", nextLocale);
              publishLocale(nextLocale);
              const url = new URL(window.location.href);
              url.searchParams.set("lang", nextLocale);
              window.history.replaceState(null, "", url);
            }}
            className="max-w-44 rounded-md border border-white/10 bg-[#122033] px-2 py-1 text-[11px] font-semibold text-[#f8f5f0] outline-none transition focus:border-[#e2b757]"
            aria-label="Choose language"
          >
            {localeCodes.map((code) => (
              <option key={code} value={code}>
                {localeCopy[code].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
