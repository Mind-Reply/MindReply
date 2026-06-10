"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe2, Languages } from "lucide-react";

type LocaleCode = "en" | "es" | "fr" | "de" | "pt" | "ar" | "hi" | "ja" | "zh" | "uk";

type GeoLocaleResponse = {
  country?: string;
  recommendedLocale?: string;
  browserLocale?: string;
  priorityMarkets?: string[];
  marketProfiles?: Array<{ country: string; locale: string; priority: number }>;
};

const supportedLocales: LocaleCode[] = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"];

const localeLabels: Record<LocaleCode, { label: string; market: string; line: string; google: string }> = {
  en: { label: "English", market: "UK / US", line: "Pressure into one clear next move.", google: "en" },
  es: { label: "Espanol", market: "Spain / LatAm", line: "La presion se convierte en un paso claro.", google: "es" },
  fr: { label: "Francais", market: "France", line: "La pression devient une action claire.", google: "fr" },
  de: { label: "Deutsch", market: "Germany", line: "Druck wird zu einem klaren Schritt.", google: "de" },
  pt: { label: "Portugues", market: "Brazil", line: "A pressao vira um proximo passo claro.", google: "pt" },
  ar: { label: "Arabic", market: "UAE / Saudi Arabia", line: "Pressure becomes one clear next move.", google: "ar" },
  hi: { label: "Hindi", market: "India", line: "Pressure becomes one clear next move.", google: "hi" },
  ja: { label: "Japanese", market: "Japan", line: "Pressure becomes one clear next move.", google: "ja" },
  zh: { label: "Chinese", market: "China", line: "Pressure becomes one clear next move.", google: "zh-CN" },
  uk: { label: "Ukrainian", market: "Ukraine", line: "Pressure becomes one clear next move.", google: "uk" },
};

const countryLocale: Record<string, LocaleCode> = {
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

const rtlLocales = new Set<LocaleCode>(["ar"]);

function isLocale(value: string): value is LocaleCode {
  return supportedLocales.includes(value as LocaleCode);
}

function localeFromQuery() {
  const queryLocale = new URLSearchParams(window.location.search).get("lang") || "";
  return isLocale(queryLocale) ? queryLocale : null;
}

function localeFromBrowser() {
  const browserLocale = navigator.language.split("-")[0];
  return isLocale(browserLocale) ? browserLocale : "en";
}

function manualLocale() {
  const queryLocale = localeFromQuery();
  if (queryLocale) return queryLocale;

  const saved = window.localStorage.getItem("mindreply-locale") || "";
  return isLocale(saved) ? saved : null;
}

function applyDocumentLocale(nextLocale: LocaleCode) {
  document.documentElement.lang = nextLocale;
  document.documentElement.dir = rtlLocales.has(nextLocale) ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent("mindreply:locale-change", { detail: { locale: nextLocale } }));
}

function persistLocale(nextLocale: LocaleCode) {
  window.localStorage.setItem("mindreply-locale", nextLocale);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", nextLocale);
  window.history.replaceState(null, "", url);
}

export default function LocaleAssistV2() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [country, setCountry] = useState("detecting");
  const [marketCount, setMarketCount] = useState(10);
  const [pageHref, setPageHref] = useState("");

  useEffect(() => {
    const preferred = manualLocale() || localeFromBrowser();
    setLocale(preferred);
    setPageHref(window.location.href);
    applyDocumentLocale(preferred);

    fetch("/api/geo-locale", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: GeoLocaleResponse | null) => {
        const detectedCountry = data?.country || "US";
        const recommended = data?.recommendedLocale && isLocale(data.recommendedLocale)
          ? data.recommendedLocale
          : countryLocale[detectedCountry] || preferred;
        const nextLocale = manualLocale() || recommended;

        setCountry(detectedCountry);
        setMarketCount(data?.marketProfiles?.length || data?.priorityMarkets?.length || 10);
        setLocale(nextLocale);
        applyDocumentLocale(nextLocale);
      })
      .catch(() => {
        setCountry("browser");
      });
  }, []);

  const active = useMemo(() => localeLabels[locale], [locale]);
  const translateHref = pageHref
    ? `https://translate.google.com/translate?sl=auto&tl=${active.google}&u=${encodeURIComponent(pageHref)}`
    : "https://translate.google.com";

  return (
    <section
      className="locale-assist-shell border-t border-white/10 bg-[#0d1729] px-4 py-2 text-[#f8f5f0] md:px-8"
      aria-label="Language and translation assist"
      data-revenue-anchor="Website Completion Package GBP 600"
      data-locale-count={supportedLocales.length}
      data-translate-provider="google-translate"
    >
      <div className="locale-assist-inner mx-auto flex max-w-7xl flex-col gap-2 text-[11px] text-[#cdd8df] md:flex-row md:items-center md:justify-between">
        <div className="locale-assist-controls flex flex-wrap items-center gap-2">
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
              persistLocale(nextLocale);
              applyDocumentLocale(nextLocale);
            }}
            className="max-w-44 rounded-md border border-white/10 bg-[#122033] px-2 py-1 text-[11px] font-semibold text-[#f8f5f0] outline-none transition focus:border-[#e2b757]"
            aria-label="Choose language"
          >
            {supportedLocales.map((code) => (
              <option key={code} value={code}>
                {localeLabels[code].label}
              </option>
            ))}
          </select>
          <span className="locale-chip market-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{active.market}</span>
          <span className="locale-chip priority-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">Detected {country}</span>
          <span className="locale-chip priority-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{marketCount} markets</span>
        </div>
        <div className="locale-assist-copy flex max-w-3xl flex-wrap items-center gap-x-2 gap-y-1 leading-5" aria-live="polite">
          <Languages aria-hidden className="h-3.5 w-3.5 text-[#91d2c8]" />
          <span>{active.line}</span>
          <span className="text-[#e2b757]">/</span>
          <span className="font-semibold text-[#f8f5f0]">Website Completion Package, GBP 600.</span>
          <span className="text-[#e2b757]">/</span>
          <a href={translateHref} target="_blank" rel="noreferrer" className="font-semibold text-[#91d2c8] transition hover:text-[#e2b757]">
            Translate page
          </a>
        </div>
      </div>
    </section>
  );
}
