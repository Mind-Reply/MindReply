"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe2 } from "lucide-react";

const localeCopy = {
  en: {
    label: "English",
    line: "Pressure into one clear next move.",
  },
  es: {
    label: "Español",
    line: "La presion convertida en el siguiente paso claro.",
  },
  fr: {
    label: "Français",
    line: "La pression transformee en une prochaine action claire.",
  },
  de: {
    label: "Deutsch",
    line: "Druck wird zu einem klaren naechsten Schritt.",
  },
  it: {
    label: "Italiano",
    line: "La pressione diventa una prossima azione chiara.",
  },
  pt: {
    label: "Português",
    line: "Pressao transformada em um proximo passo claro.",
  },
  ar: {
    label: "العربية",
    line: "نحو خطوة واضحة عندما يزداد الضغط.",
  },
  ja: {
    label: "日本語",
    line: "重い状況を次の一手へ整えます。",
  },
  ko: {
    label: "한국어",
    line: "압박을 하나의 명확한 다음 행동으로 정리합니다.",
  },
  zh: {
    label: "中文",
    line: "把压力整理成一个清晰的下一步。",
  },
} as const;

type LocaleCode = keyof typeof localeCopy;

const localeCodes = Object.keys(localeCopy) as LocaleCode[];

function isLocale(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode);
}

export default function LocaleAssist() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [country, setCountry] = useState("US");

  useEffect(() => {
    const saved = window.localStorage.getItem("mindreply-locale");
    if (saved && isLocale(saved)) {
      setLocale(saved);
      document.documentElement.lang = saved;
      return;
    }

    fetch("/api/geo-locale", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { recommendedLocale?: string; country?: string } | null) => {
        const nextLocale = data?.recommendedLocale && isLocale(data.recommendedLocale) ? data.recommendedLocale : "en";
        setLocale(nextLocale);
        setCountry(data?.country || "US");
        document.documentElement.lang = nextLocale;
      })
      .catch(() => {
        const browserLocale = navigator.language.split("-")[0];
        const nextLocale = isLocale(browserLocale) ? browserLocale : "en";
        setLocale(nextLocale);
        document.documentElement.lang = nextLocale;
      });
  }, []);

  const activeCopy = useMemo(() => localeCopy[locale], [locale]);

  return (
    <aside className="fixed bottom-3 right-3 z-40 max-w-[calc(100vw-1.5rem)] rounded-lg border border-[#122033]/10 bg-white/95 p-2 text-[#122033] shadow-lg shadow-[#122033]/10 backdrop-blur md:bottom-5 md:right-5">
      <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#59687b]" htmlFor="mindreply-locale">
        <Globe2 aria-hidden className="h-3.5 w-3.5 text-[#2f6f72]" />
        <span className="hidden sm:inline">Auto {country}</span>
      </label>
      <div className="mt-1 flex items-center gap-2">
        <select
          id="mindreply-locale"
          value={locale}
          onChange={(event) => {
            const nextLocale = event.target.value;
            if (!isLocale(nextLocale)) return;
            setLocale(nextLocale);
            window.localStorage.setItem("mindreply-locale", nextLocale);
            document.documentElement.lang = nextLocale;
          }}
          className="max-w-28 rounded-md border border-[#122033]/10 bg-[#f8f4ec] px-2 py-1 text-xs font-semibold text-[#122033] outline-none transition focus:border-[#2f6f72]"
          aria-label="Choose language"
        >
          {localeCodes.map((code) => (
            <option key={code} value={code}>
              {localeCopy[code].label}
            </option>
          ))}
        </select>
        <p className="hidden max-w-44 text-xs leading-5 text-[#59687b] lg:block">{activeCopy.line}</p>
      </div>
    </aside>
  );
}
