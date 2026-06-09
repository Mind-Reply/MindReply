"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe2 } from "lucide-react";

const supportEmail = "info@mind-reply.com";
const packageName = "Website Completion Package";
const packagePrice = "GBP 600";

const localeCopy = {
  en: {
    label: "English",
    promise: "Pressure into one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: `Ask MRagent first, then contact ${supportEmail}.`,
  },
  es: {
    label: "Español",
    promise: "La presión convertida en el siguiente paso claro.",
    packageLine: "Paquete de finalización web, GBP 600.",
    contact: `Primero usa MRagent; después escribe a ${supportEmail}.`,
  },
  fr: {
    label: "Français",
    promise: "La pression transformée en une prochaine action claire.",
    packageLine: "Forfait de finalisation du site, GBP 600.",
    contact: `Essayez MRagent, puis contactez ${supportEmail}.`,
  },
  de: {
    label: "Deutsch",
    promise: "Druck wird zu einem klaren nächsten Schritt.",
    packageLine: "Website-Abschluss-Paket, GBP 600.",
    contact: `Erst MRagent nutzen, dann ${supportEmail} kontaktieren.`,
  },
  it: {
    label: "Italiano",
    promise: "La pressione diventa una prossima azione chiara.",
    packageLine: "Pacchetto di completamento sito, GBP 600.",
    contact: `Prima usa MRagent, poi scrivi a ${supportEmail}.`,
  },
  pt: {
    label: "Português",
    promise: "Pressão transformada em um próximo passo claro.",
    packageLine: "Pacote de conclusão do site, GBP 600.",
    contact: `Use o MRagent primeiro; depois contacte ${supportEmail}.`,
  },
  ar: {
    label: "العربية",
    promise: "نحو خطوة واضحة عندما يزداد الضغط.",
    packageLine: "حزمة إكمال الموقع، GBP 600.",
    contact: `ابدأ بـ MRagent ثم تواصل عبر ${supportEmail}.`,
  },
  hi: {
    label: "हिन्दी",
    promise: "दबाव को एक साफ अगले कदम में बदलिए.",
    packageLine: "वेबसाइट कम्प्लीशन पैकेज, GBP 600.",
    contact: `पहले MRagent आजमाएं, फिर ${supportEmail} पर लिखें.`,
  },
  ja: {
    label: "日本語",
    promise: "重い状況を次の一手へ整えます。",
    packageLine: "Website Completion Package, GBP 600.",
    contact: `まずMRagent、その後 ${supportEmail} へ。`,
  },
  ko: {
    label: "한국어",
    promise: "압박을 하나의 명확한 다음 행동으로 정리합니다.",
    packageLine: "웹사이트 완성 패키지, GBP 600.",
    contact: `먼저 MRagent를 사용한 뒤 ${supportEmail}로 연락하세요.`,
  },
  zh: {
    label: "中文",
    promise: "把压力整理成一个清晰的下一步。",
    packageLine: "网站完成套餐，GBP 600。",
    contact: `先使用 MRagent，再联系 ${supportEmail}。`,
  },
} as const;

type LocaleCode = keyof typeof localeCopy;

const localeCodes = Object.keys(localeCopy) as LocaleCode[];

function isLocale(value: string): value is LocaleCode {
  return localeCodes.includes(value as LocaleCode);
}

function localeFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const queryLocale = params.get("lang") || "";
  return isLocale(queryLocale) ? queryLocale : null;
}

export default function LocaleAssist() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [country, setCountry] = useState("US");

  useEffect(() => {
    const queryLocale = localeFromQuery();
    if (queryLocale) {
      setLocale(queryLocale);
      window.localStorage.setItem("mindreply-locale", queryLocale);
      document.documentElement.lang = queryLocale;
      return;
    }

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
    <aside
      className="fixed bottom-3 right-3 z-40 max-w-[calc(100vw-1.5rem)] rounded-lg border border-[#122033]/10 bg-white/95 p-2.5 text-[#122033] shadow-lg shadow-[#122033]/10 backdrop-blur md:bottom-5 md:right-5"
      aria-label="Language and region assist"
      data-revenue-anchor={`${packageName} ${packagePrice} ${supportEmail}`}
    >
      <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#59687b]" htmlFor="mindreply-locale">
        <Globe2 aria-hidden className="h-3.5 w-3.5 text-[#2f6f72]" />
        <span className="hidden sm:inline">Auto {country}</span>
        <span className="sm:hidden">Lang</span>
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
            const url = new URL(window.location.href);
            url.searchParams.set("lang", nextLocale);
            window.history.replaceState(null, "", url);
          }}
          className="max-w-36 rounded-md border border-[#122033]/10 bg-[#f8f4ec] px-2 py-1 text-xs font-semibold text-[#122033] outline-none transition focus:border-[#2f6f72]"
          aria-label="Choose language"
        >
          {localeCodes.map((code) => (
            <option key={code} value={code}>
              {localeCopy[code].label}
            </option>
          ))}
        </select>
        <div className="hidden max-w-56 text-xs leading-5 text-[#59687b] lg:block" aria-live="polite">
          <p>{activeCopy.promise}</p>
          <p className="mt-0.5 font-semibold text-[#122033]">{activeCopy.packageLine}</p>
          <p className="mt-0.5">{activeCopy.contact}</p>
        </div>
      </div>
    </aside>
  );
}
