"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe2 } from "lucide-react";

const supportEmail = "info@mind-reply.com";
const packageName = "Website Completion Package";
const packagePrice = "GBP 600";

const localeCopy = {
  en: {
    label: "English",
    market: "United States / United Kingdom / Singapore",
    promise: "Pressure into one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: `Ask MRagent first, then contact ${supportEmail}.`,
  },
  es: {
    label: "Español",
    market: "Spain / Latin America",
    promise: "La presión convertida en el siguiente paso claro.",
    packageLine: "Paquete de finalización web, GBP 600.",
    contact: `Primero usa MRagent; después escribe a ${supportEmail}.`,
  },
  fr: {
    label: "Français",
    market: "France / Belgium / Switzerland",
    promise: "La pression transformée en une prochaine action claire.",
    packageLine: "Forfait de finalisation du site, GBP 600.",
    contact: `Essayez MRagent, puis contactez ${supportEmail}.`,
  },
  de: {
    label: "Deutsch",
    market: "Germany / Austria / Switzerland",
    promise: "Druck wird zu einem klaren nächsten Schritt.",
    packageLine: "Website-Abschluss-Paket, GBP 600.",
    contact: `Erst MRagent nutzen, dann ${supportEmail} kontaktieren.`,
  },
  pt: {
    label: "Português",
    market: "Portugal / Brazil",
    promise: "Pressão transformada em um próximo passo claro.",
    packageLine: "Pacote de conclusão do site, GBP 600.",
    contact: `Use o MRagent primeiro; depois contacte ${supportEmail}.`,
  },
  ar: {
    label: "العربية",
    market: "UAE / Saudi Arabia",
    promise: "نحو خطوة واضحة عندما يزداد الضغط.",
    packageLine: "حزمة إكمال الموقع، GBP 600.",
    contact: `ابدأ بـ MRagent ثم تواصل عبر ${supportEmail}.`,
  },
  hi: {
    label: "हिन्दी",
    market: "India",
    promise: "दबाव को एक साफ अगले कदम में बदलिए.",
    packageLine: "वेबसाइट कम्प्लीशन पैकेज, GBP 600.",
    contact: `पहले MRagent आजमाएं, फिर ${supportEmail} पर लिखें.`,
  },
  ja: {
    label: "日本語",
    market: "Japan",
    promise: "重い状況を次の一手へ整えます。",
    packageLine: "Website Completion Package, GBP 600.",
    contact: `まずMRagent、その後 ${supportEmail} へ。`,
  },
  zh: {
    label: "中文",
    market: "China / Hong Kong / Taiwan",
    promise: "把压力整理成一个清晰的下一步。",
    packageLine: "网站完成套餐，GBP 600。",
    contact: `先使用 MRagent，再联系 ${supportEmail}。`,
  },
  uk: {
    label: "Українська",
    market: "Ukraine / Eastern Europe",
    promise: "Тиск перетворюється на один чіткий наступний крок.",
    packageLine: "Пакет завершення сайту, GBP 600.",
    contact: `Спершу MRagent, потім ${supportEmail}.`,
  },
} as const;

type LocaleCode = keyof typeof localeCopy;

const localeCodes = Object.keys(localeCopy) as LocaleCode[];
const rtlLocales = new Set<LocaleCode>(["ar"]);

function isLocale(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode);
}

function localeFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const queryLocale = params.get("lang") || "";
  return isLocale(queryLocale) ? queryLocale : null;
}

function applyDocumentLocale(nextLocale: LocaleCode) {
  document.documentElement.lang = nextLocale;
  document.documentElement.dir = rtlLocales.has(nextLocale) ? "rtl" : "ltr";
}

export default function LocaleAssist() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [country, setCountry] = useState("US");

  useEffect(() => {
    const queryLocale = localeFromQuery();
    if (queryLocale) {
      setLocale(queryLocale);
      window.localStorage.setItem("mindreply-locale", queryLocale);
      applyDocumentLocale(queryLocale);
      return;
    }

    const saved = window.localStorage.getItem("mindreply-locale");
    if (saved && isLocale(saved)) {
      setLocale(saved);
      applyDocumentLocale(saved);
      return;
    }

    fetch("/api/geo-locale", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { recommendedLocale?: string; country?: string } | null) => {
        const nextLocale = data?.recommendedLocale && isLocale(data.recommendedLocale) ? data.recommendedLocale : "en";
        setLocale(nextLocale);
        setCountry(data?.country || "US");
        applyDocumentLocale(nextLocale);
      })
      .catch(() => {
        const browserLocale = navigator.language.split("-")[0];
        const nextLocale = isLocale(browserLocale) ? browserLocale : "en";
        setLocale(nextLocale);
        applyDocumentLocale(nextLocale);
      });
  }, []);

  const activeCopy = useMemo(() => localeCopy[locale], [locale]);

  return (
    <section
      className="border-t border-white/10 bg-[#0d1729] px-4 py-4 text-[#f8f5f0] md:px-8"
      aria-label="Language and region assist"
      data-revenue-anchor={`${packageName} ${packagePrice} ${supportEmail}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-[#cdd8df] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
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
            className="max-w-44 rounded-md border border-white/10 bg-[#122033] px-2 py-1 text-xs font-semibold text-[#f8f5f0] outline-none transition focus:border-[#e2b757]"
            aria-label="Choose language"
          >
            {localeCodes.map((code) => (
              <option key={code} value={code}>
                {localeCopy[code].label}
              </option>
            ))}
          </select>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[#9fb0bd]">{activeCopy.market}</span>
        </div>
        <div className="max-w-3xl leading-5" aria-live="polite">
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
