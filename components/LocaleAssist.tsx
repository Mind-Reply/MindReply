"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe2 } from "lucide-react";

type LocaleCode = "en" | "es" | "fr" | "de" | "pt" | "ar" | "hi" | "ja" | "zh" | "uk" | "bg";

type LocaleCopy = {
  label: string;
  market: string;
  promise: string;
  packageLine: string;
  contact: string;
};

type GeoLocaleResponse = {
  country?: string;
  recommendedLocale?: string;
  priorityMarkets?: string[];
  marketProfiles?: Array<{ country: string; locale: string; priority?: number }>;
};

const localeCopy: Record<LocaleCode, LocaleCopy> = {
  en: {
    label: "English",
    market: "UK / US / Singapore",
    promise: "Pressure into one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Ask MRagent first. Use the contact form when a human handoff is needed.",
  },
  es: {
    label: "Espanol",
    market: "Spain / Latin America",
    promise: "La presion se convierte en un siguiente paso claro.",
    packageLine: "Paquete de Finalizacion Web, GBP 600.",
    contact: "Use MRagent primero. Use el formulario si necesita una entrega humana.",
  },
  fr: {
    label: "Francais",
    market: "France / Belgium / Switzerland",
    promise: "La pression devient une prochaine action claire.",
    packageLine: "Forfait de Finalisation du Site, GBP 600.",
    contact: "Essayez MRagent d'abord. Utilisez le formulaire si un relais humain est necessaire.",
  },
  de: {
    label: "Deutsch",
    market: "Germany / Austria / Switzerland",
    promise: "Druck wird zu einem klaren nachsten Schritt.",
    packageLine: "Website-Abschluss-Paket, GBP 600.",
    contact: "Nutzen Sie zuerst MRagent. Danach das Kontaktformular fur die menschliche Ubergabe.",
  },
  pt: {
    label: "Portugues",
    market: "Brazil / Portugal",
    promise: "A pressao vira um proximo passo claro.",
    packageLine: "Pacote de Conclusao do Site, GBP 600.",
    contact: "Use o MRagent primeiro. Depois use o formulario quando precisar de acompanhamento humano.",
  },
  ar: {
    label: "Arabic",
    market: "UAE / Saudi Arabia / Gulf",
    promise: "Pressure becomes one clear and calm next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Start with MRagent. Use the contact form when human follow-up is needed.",
  },
  hi: {
    label: "Hindi",
    market: "India",
    promise: "Pressure becomes one clear next step.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Try MRagent first. Use the contact form when human help is needed.",
  },
  ja: {
    label: "Japanese",
    market: "Japan",
    promise: "Heavy context becomes one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Try MRagent first. Use the contact form when a human handoff is needed.",
  },
  zh: {
    label: "Chinese",
    market: "China / Hong Kong / Taiwan",
    promise: "Pressure becomes one clear next step.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Use MRagent first. Use the contact form when human follow-up is needed.",
  },
  uk: {
    label: "Ukrainian",
    market: "Ukraine / Eastern Europe",
    promise: "Pressure becomes one clear next step.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Try MRagent first. Use the contact form for human support.",
  },
  bg: {
    label: "Bulgarian",
    market: "Bulgaria / Eastern Europe",
    promise: "Pressure becomes one clear next step.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Try MRagent first. Use the contact form when human support is needed.",
  },
};

const surfaceTranslations = localeCopy;
const localeCodes = Object.keys(surfaceTranslations) as LocaleCode[];
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

  const activeCopy = useMemo(() => surfaceTranslations[locale], [locale]);

  return (
    <section
      className="locale-assist-shell border-t border-white/10 bg-[#0d1729] px-4 py-2 text-[#f8f5f0] md:px-8"
      aria-label="Language"
      data-locale-count={localeCodes.length}
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
                {surfaceTranslations[code].label}
              </option>
            ))}
          </select>
          <span className="locale-chip market-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{activeCopy.market}</span>
          <span className="locale-chip priority-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{marketCount} priority markets</span>
        </div>
        <div className="locale-assist-copy max-w-3xl leading-5" aria-live="polite">
          <span>{activeCopy.promise}</span>
          <span className="mx-2 text-[#e2b757]">/</span>
          <span className="font-semibold text-[#f8f5f0]">{activeCopy.packageLine}</span>
          <span className="mx-2 text-[#e2b757]">/</span>
          <span>{activeCopy.contact} Contact form remains the human handoff.</span>
          <span className="mx-2 text-[#e2b757]">/</span>
          <span>Full-site translation uses Google Translate when a non-English language is selected.</span>
        </div>
      </div>
    </section>
  );
}
