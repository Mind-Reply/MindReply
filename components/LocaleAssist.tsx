"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe2 } from "lucide-react";

const packageName = "Website Completion Package";
const packagePrice = "GBP 600";

type LocaleCode = "en" | "es" | "fr" | "de" | "pt" | "ar" | "hi" | "ja" | "zh" | "uk";

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
  marketProfiles?: Array<{ country: string; language: string; priority: number }>;
};

const localeCopy: Record<LocaleCode, LocaleCopy> = {
  en: {
    label: "English",
    market: "UK / US / Singapore",
    promise: "Pressure into one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Ask MRagent first, then use the contact form when a human handoff is needed.",
  },
  es: {
    label: "Espanol",
    market: "Spain / Latin America",
    promise: "La presion convertida en un siguiente paso claro.",
    packageLine: "Paquete de finalizacion web, GBP 600.",
    contact: "Use MRagent primero; despues use el formulario si necesita una entrega humana.",
  },
  fr: {
    label: "Francais",
    market: "France / Belgium / Switzerland",
    promise: "La pression transformee en une prochaine action claire.",
    packageLine: "Forfait de finalisation du site, GBP 600.",
    contact: "Essayez MRagent d'abord, puis utilisez le formulaire si un relais humain est necessaire.",
  },
  de: {
    label: "Deutsch",
    market: "Germany / Austria / Switzerland",
    promise: "Druck wird zu einem klaren nachsten Schritt.",
    packageLine: "Website-Abschluss-Paket, GBP 600.",
    contact: "Erst MRagent nutzen, danach das Kontaktformular fur die menschliche Ubergabe.",
  },
  pt: {
    label: "Portugues",
    market: "Brazil / Portugal",
    promise: "Pressao transformada em um proximo passo claro.",
    packageLine: "Pacote de conclusao do site, GBP 600.",
    contact: "Use o MRagent primeiro; depois use o formulario quando precisar de acompanhamento humano.",
  },
  ar: {
    label: "Arabic",
    market: "UAE / Saudi Arabia / Gulf",
    promise: "Pressure becomes one calm next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Start with MRagent, then use the contact form when human follow-up is needed.",
  },
  hi: {
    label: "Hindi",
    market: "India",
    promise: "Pressure becomes one clear next step.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Try MRagent first; then use the contact form when a human handoff is needed.",
  },
  ja: {
    label: "Japanese",
    market: "Japan",
    promise: "Heavy context becomes one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Start with MRagent; use the contact form when human review is needed.",
  },
  zh: {
    label: "Chinese",
    market: "China / Hong Kong / Taiwan",
    promise: "Pressure becomes one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Start with MRagent; use the contact form when a human handoff is needed.",
  },
  uk: {
    label: "Ukrainian",
    market: "Ukraine / Eastern Europe",
    promise: "Pressure becomes one clear next step.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Try MRagent first; then use the contact form when human follow-up is needed.",
  },
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
};

const surfaceTranslations: Partial<Record<LocaleCode, Record<string, string>>> = {
  es: {
    "High-demand lane: website buying-friction rescue": "Alta demanda: rescate de friccion de compra web",
    "Reclaim 2+ hours daily within 24 hours.": "Recupere mas de 2 horas diarias en 24 horas.",
    "Try the Mind Read": "Probar la lectura MindReply",
    "Website Completion Package": "Paquete de finalizacion web",
    "Package total": "Total del paquete",
    "Try MRagent": "Probar MRagent",
    "Contact form": "Formulario de contacto",
    "Pressure in. One clear move out.": "Presion dentro. Un movimiento claro fuera.",
  },
  fr: {
    "High-demand lane: website buying-friction rescue": "Forte demande : reduire les frictions d'achat du site",
    "Reclaim 2+ hours daily within 24 hours.": "Recuperez plus de 2 heures par jour en 24 heures.",
    "Try the Mind Read": "Essayer la lecture MindReply",
    "Website Completion Package": "Forfait de finalisation du site",
    "Package total": "Total du forfait",
    "Try MRagent": "Essayer MRagent",
    "Contact form": "Formulaire de contact",
    "Pressure in. One clear move out.": "Pression recue. Une action claire rendue.",
  },
  de: {
    "High-demand lane: website buying-friction rescue": "Hohe Nachfrage: Kaufreibung auf Websites losen",
    "Reclaim 2+ hours daily within 24 hours.": "Gewinnen Sie innerhalb von 24 Stunden taglich uber 2 Stunden zuruck.",
    "Try the Mind Read": "MindReply-Lesung testen",
    "Website Completion Package": "Website-Abschluss-Paket",
    "Package total": "Paketpreis",
    "Try MRagent": "MRagent testen",
    "Contact form": "Kontaktformular",
    "Pressure in. One clear move out.": "Druck hinein. Ein klarer Schritt heraus.",
  },
  pt: {
    "High-demand lane: website buying-friction rescue": "Alta procura: resgate de friccao de compra no site",
    "Reclaim 2+ hours daily within 24 hours.": "Recupere mais de 2 horas por dia em 24 horas.",
    "Try the Mind Read": "Experimentar a leitura MindReply",
    "Website Completion Package": "Pacote de conclusao do site",
    "Package total": "Total do pacote",
    "Try MRagent": "Experimentar MRagent",
    "Contact form": "Formulario de contacto",
    "Pressure in. One clear move out.": "Pressao entra. Um movimento claro sai.",
  },
  ar: {
    "High-demand lane: website buying-friction rescue": "Gulf priority: website buying-friction rescue",
    "Reclaim 2+ hours daily within 24 hours.": "Recover 2+ hours daily within 24 hours.",
    "Try the Mind Read": "Try the MindReply read",
    "Website Completion Package": "Website Completion Package",
    "Package total": "Package total",
    "Try MRagent": "Try MRagent",
    "Contact form": "Contact form",
    "Pressure in. One clear move out.": "Pressure in. One clear move out.",
  },
  hi: {
    "High-demand lane: website buying-friction rescue": "India priority: website buying-friction rescue",
    "Reclaim 2+ hours daily within 24 hours.": "Recover 2+ hours daily within 24 hours.",
    "Try the Mind Read": "Try the MindReply read",
    "Website Completion Package": "Website Completion Package",
    "Package total": "Package total",
    "Try MRagent": "Try MRagent",
    "Contact form": "Contact form",
    "Pressure in. One clear move out.": "Pressure in. One clear move out.",
  },
  ja: {
    "High-demand lane: website buying-friction rescue": "Japan priority: website buying-friction rescue",
    "Reclaim 2+ hours daily within 24 hours.": "Recover 2+ hours daily within 24 hours.",
    "Try the Mind Read": "Try the MindReply read",
    "Website Completion Package": "Website Completion Package",
    "Package total": "Package total",
    "Try MRagent": "Try MRagent",
    "Contact form": "Contact form",
    "Pressure in. One clear move out.": "Pressure in. One clear move out.",
  },
  zh: {
    "High-demand lane: website buying-friction rescue": "China priority: website buying-friction rescue",
    "Reclaim 2+ hours daily within 24 hours.": "Recover 2+ hours daily within 24 hours.",
    "Try the Mind Read": "Try the MindReply read",
    "Website Completion Package": "Website Completion Package",
    "Package total": "Package total",
    "Try MRagent": "Try MRagent",
    "Contact form": "Contact form",
    "Pressure in. One clear move out.": "Pressure in. One clear move out.",
  },
  uk: {
    "High-demand lane: website buying-friction rescue": "Ukraine priority: website buying-friction rescue",
    "Reclaim 2+ hours daily within 24 hours.": "Recover 2+ hours daily within 24 hours.",
    "Try the Mind Read": "Try the MindReply read",
    "Website Completion Package": "Website Completion Package",
    "Package total": "Package total",
    "Try MRagent": "Try MRagent",
    "Contact form": "Contact form",
    "Pressure in. One clear move out.": "Pressure in. One clear move out.",
  },
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

function applyDocumentLocale(nextLocale: LocaleCode) {
  document.documentElement.lang = nextLocale;
  document.documentElement.dir = rtlLocales.has(nextLocale) ? "rtl" : "ltr";
}

function applySurfaceLocale(nextLocale: LocaleCode) {
  const translations = surfaceTranslations[nextLocale] || {};
  const candidates = document.querySelectorAll<HTMLElement>(
    "main h1, main h2, main h3, main p, main a, main span, main button, footer p, footer a, footer div, footer span",
  );

  candidates.forEach((element) => {
    if (element.children.length > 0) return;
    const original = element.dataset.mrLocaleOriginal || element.textContent?.trim() || "";
    if (!original) return;
    element.dataset.mrLocaleOriginal = original;
    element.textContent = translations[original] || original;
  });
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
  const [country, setCountry] = useState("detecting");
  const [marketCount, setMarketCount] = useState(10);

  useEffect(() => {
    const manualLocale = resolveManualLocale();
    const initialLocale = manualLocale || localeFromBrowser();
    setLocale(initialLocale);
    applyDocumentLocale(initialLocale);

    fetch("/api/geo-locale", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: GeoLocaleResponse | null) => {
        const detectedCountry = data?.country || "US";
        const geoLocale = data?.recommendedLocale && isLocale(data.recommendedLocale)
          ? data.recommendedLocale
          : countryLocale[detectedCountry] || initialLocale;
        const nextLocale = manualLocale || geoLocale;

        setCountry(detectedCountry);
        setMarketCount(data?.marketProfiles?.length || data?.priorityMarkets?.length || 10);
        setLocale(nextLocale);
        applyDocumentLocale(nextLocale);
      })
      .catch(() => {
        setCountry("browser");
      });
  }, []);

  useEffect(() => {
    applyDocumentLocale(locale);
    applySurfaceLocale(locale);
  }, [locale]);

  const activeCopy = useMemo(() => localeCopy[locale], [locale]);

  return (
    <section
      className="locale-assist-shell border-t border-white/10 bg-[#0d1729] px-4 py-2 text-[#f8f5f0] md:px-8"
      aria-label="Language and region assist"
      data-revenue-anchor={`${packageName} ${packagePrice}`}
      data-locale-count={localeCodes.length}
    >
      <div className="locale-assist-inner mx-auto flex max-w-7xl flex-col gap-2 text-[11px] text-[#cdd8df] md:flex-row md:items-center md:justify-between">
        <div className="locale-assist-controls flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 font-semibold uppercase tracking-[0.14em] text-[#91d2c8]" htmlFor="mindreply-locale">
            <Globe2 aria-hidden className="h-3.5 w-3.5" />
            <span>Auto {country}</span>
          </label>
          <select
            id="mindreply-locale"
            value={locale}
            onChange={(event) => {
              const nextLocale = event.target.value;
              if (!isLocale(nextLocale)) return;
              setLocale(nextLocale);
              window.localStorage.setItem("mindreply-locale", nextLocale);
              applyDocumentLocale(nextLocale);
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
          <span className="locale-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{activeCopy.market}</span>
          <span className="locale-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{marketCount} priority markets</span>
        </div>
        <div className="locale-assist-copy max-w-3xl leading-5" aria-live="polite">
          <span>{activeCopy.promise}</span>
          <span className="mx-2 text-[#e2b757]">/</span>
          <span className="font-semibold text-[#f8f5f0]">{activeCopy.packageLine}</span>
          <span className="mx-2 text-[#e2b757]">/</span>
          <span>{activeCopy.contact}</span>
        </div>
      </div>
    </section>
  );
}
