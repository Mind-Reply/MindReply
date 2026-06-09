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

const localeCopy: Record<LocaleCode, LocaleCopy> = {
  en: {
    label: "English",
    market: "United Kingdom / United States / Singapore",
    promise: "Pressure into one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Ask MRagent first, then use the contact form when a human handoff is needed.",
  },
  es: {
    label: "Español",
    market: "Spain / Latin America",
    promise: "La presión convertida en el siguiente paso claro.",
    packageLine: "Paquete de finalización web, GBP 600.",
    contact: "Use MRagent primero; después use el formulario si necesita una entrega humana.",
  },
  fr: {
    label: "Français",
    market: "France / Belgium / Switzerland",
    promise: "La pression transformée en une prochaine action claire.",
    packageLine: "Forfait de finalisation du site, GBP 600.",
    contact: "Essayez MRagent d'abord, puis utilisez le formulaire si un relais humain est nécessaire.",
  },
  de: {
    label: "Deutsch",
    market: "Germany / Austria / Switzerland",
    promise: "Druck wird zu einem klaren nächsten Schritt.",
    packageLine: "Website-Abschluss-Paket, GBP 600.",
    contact: "Erst MRagent nutzen, danach das Kontaktformular für die menschliche Übergabe.",
  },
  pt: {
    label: "Português",
    market: "Brazil / Portugal",
    promise: "Pressão transformada em um próximo passo claro.",
    packageLine: "Pacote de conclusão do site, GBP 600.",
    contact: "Use o MRagent primeiro; depois use o formulário quando precisar de acompanhamento humano.",
  },
  ar: {
    label: "العربية",
    market: "UAE / Saudi Arabia / Gulf",
    promise: "نحو خطوة واضحة عندما يزداد الضغط.",
    packageLine: "حزمة إكمال الموقع، GBP 600.",
    contact: "ابدأ بـ MRagent، ثم استخدم نموذج التواصل عند الحاجة إلى متابعة بشرية.",
  },
  hi: {
    label: "हिन्दी",
    market: "India",
    promise: "दबाव को एक साफ अगले कदम में बदलिए.",
    packageLine: "वेबसाइट कम्प्लीशन पैकेज, GBP 600.",
    contact: "पहले MRagent आजमाएं; फिर मानव हैंडऑफ चाहिए तो संपर्क फ़ॉर्म इस्तेमाल करें.",
  },
  ja: {
    label: "日本語",
    market: "Japan",
    promise: "重い状況を次の一手へ整えます。",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "まずMRagent、その後に人の確認が必要な場合は問い合わせフォームへ。",
  },
  zh: {
    label: "中文",
    market: "China / Hong Kong / Taiwan",
    promise: "把压力整理成一个清晰的下一步。",
    packageLine: "网站完成套餐，GBP 600。",
    contact: "先使用 MRagent；如需人工交接，再使用联系表单。",
  },
  uk: {
    label: "Українська",
    market: "Ukraine / Eastern Europe",
    promise: "Тиск перетворюється на один чіткий наступний крок.",
    packageLine: "Пакет завершення сайту, GBP 600.",
    contact: "Спершу MRagent, потім форма контакту, якщо потрібна людська передача.",
  },
};

const localeCodes = Object.keys(localeCopy) as LocaleCode[];
const rtlLocales = new Set<LocaleCode>(["ar"]);

const surfaceTranslations: Partial<Record<LocaleCode, Record<string, string>>> = {
  es: {
    "High-demand lane: website buying-friction rescue": "Carril de alta demanda: rescate de fricción de compra en sitios web",
    "Reclaim 2+ hours daily within 24 hours.": "Recupere más de 2 horas diarias en 24 horas.",
    "Try the Mind Read": "Probar la lectura MindReply",
    "Website Completion Package": "Paquete de finalización web",
    "Package total": "Total del paquete",
    "Try MRagent": "Probar MRagent",
    "Pressure in. One clear move out.": "Presión dentro. Un movimiento claro fuera.",
  },
  fr: {
    "High-demand lane: website buying-friction rescue": "Priorité forte demande : réduire les frictions d'achat du site",
    "Reclaim 2+ hours daily within 24 hours.": "Récupérez plus de 2 heures par jour en 24 heures.",
    "Try the Mind Read": "Essayer la lecture MindReply",
    "Website Completion Package": "Forfait de finalisation du site",
    "Package total": "Total du forfait",
    "Try MRagent": "Essayer MRagent",
    "Pressure in. One clear move out.": "Pression reçue. Une action claire rendue.",
  },
  de: {
    "High-demand lane: website buying-friction rescue": "Hoch nachgefragter Bereich: Kaufreibung auf Websites lösen",
    "Reclaim 2+ hours daily within 24 hours.": "Gewinnen Sie innerhalb von 24 Stunden täglich über 2 Stunden zurück.",
    "Try the Mind Read": "MindReply-Lesung testen",
    "Website Completion Package": "Website-Abschluss-Paket",
    "Package total": "Paketpreis",
    "Try MRagent": "MRagent testen",
    "Pressure in. One clear move out.": "Druck hinein. Ein klarer Schritt heraus.",
  },
  pt: {
    "High-demand lane: website buying-friction rescue": "Faixa de alta procura: resgate de fricção de compra no site",
    "Reclaim 2+ hours daily within 24 hours.": "Recupere mais de 2 horas por dia em 24 horas.",
    "Try the Mind Read": "Experimentar a leitura MindReply",
    "Website Completion Package": "Pacote de conclusão do site",
    "Package total": "Total do pacote",
    "Try MRagent": "Experimentar MRagent",
    "Pressure in. One clear move out.": "Pressão entra. Um movimento claro sai.",
  },
  ar: {
    "High-demand lane: website buying-friction rescue": "مسار عالي الطلب: إزالة احتكاك الشراء من الموقع",
    "Reclaim 2+ hours daily within 24 hours.": "استعد أكثر من ساعتين يومياً خلال 24 ساعة.",
    "Try the Mind Read": "جرّب قراءة MindReply",
    "Website Completion Package": "حزمة إكمال الموقع",
    "Package total": "إجمالي الحزمة",
    "Try MRagent": "جرّب MRagent",
    "Pressure in. One clear move out.": "ضغط يدخل. خطوة واضحة تخرج.",
  },
  hi: {
    "High-demand lane: website buying-friction rescue": "सबसे मांग वाला क्षेत्र: वेबसाइट खरीद-फ्रिक्शन बचाव",
    "Reclaim 2+ hours daily within 24 hours.": "24 घंटे में रोज़ 2+ घंटे वापस पाएं.",
    "Try the Mind Read": "MindReply रीड आज़माएं",
    "Website Completion Package": "वेबसाइट कम्प्लीशन पैकेज",
    "Package total": "पैकेज कुल",
    "Try MRagent": "MRagent आज़माएं",
    "Pressure in. One clear move out.": "दबाव अंदर. एक साफ़ कदम बाहर.",
  },
  ja: {
    "High-demand lane: website buying-friction rescue": "高需要領域：購入摩擦のあるサイトを整える",
    "Reclaim 2+ hours daily within 24 hours.": "24時間以内に毎日2時間以上を取り戻します。",
    "Try the Mind Read": "MindReplyの読みを試す",
    "Website Completion Package": "Website Completion Package",
    "Package total": "パッケージ合計",
    "Try MRagent": "MRagentを試す",
    "Pressure in. One clear move out.": "圧力を受け、一つの明確な動きへ。",
  },
  zh: {
    "High-demand lane: website buying-friction rescue": "高需求方向：修复网站购买摩擦",
    "Reclaim 2+ hours daily within 24 hours.": "24小时内每天取回2小时以上。",
    "Try the Mind Read": "试用 MindReply 解读",
    "Website Completion Package": "网站完成套餐",
    "Package total": "套餐总价",
    "Try MRagent": "试用 MRagent",
    "Pressure in. One clear move out.": "压力进入。清晰动作输出。",
  },
  uk: {
    "High-demand lane: website buying-friction rescue": "Напрям високого попиту: усунення купівельного тертя на сайті",
    "Reclaim 2+ hours daily within 24 hours.": "Поверніть понад 2 години щодня протягом 24 годин.",
    "Try the Mind Read": "Спробувати читання MindReply",
    "Website Completion Package": "Пакет завершення сайту",
    "Package total": "Загальна ціна пакета",
    "Try MRagent": "Спробувати MRagent",
    "Pressure in. One clear move out.": "Тиск всередину. Один чіткий рух назовні.",
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

function applyDocumentLocale(nextLocale: LocaleCode) {
  document.documentElement.lang = nextLocale;
  document.documentElement.dir = rtlLocales.has(nextLocale) ? "rtl" : "ltr";
}

function applySurfaceLocale(nextLocale: LocaleCode) {
  const translations = surfaceTranslations[nextLocale] || {};
  const candidates = document.querySelectorAll<HTMLElement>(
    "main h1, main h2, main h3, main p, main a, main span, footer p, footer a, footer div",
  );

  candidates.forEach((element) => {
    if (element.children.length > 0) return;
    const original = element.dataset.mrLocaleOriginal || element.textContent?.trim() || "";
    if (!original) return;
    element.dataset.mrLocaleOriginal = original;
    element.textContent = translations[original] || original;
  });
}

export default function LocaleAssist() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [country, setCountry] = useState("US");
  const [marketCount, setMarketCount] = useState(10);

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
      .then((data: { recommendedLocale?: string; country?: string; priorityMarkets?: string[] } | null) => {
        const nextLocale = data?.recommendedLocale && isLocale(data.recommendedLocale) ? data.recommendedLocale : "en";
        setLocale(nextLocale);
        setCountry(data?.country || "US");
        setMarketCount(data?.priorityMarkets?.length || 10);
        applyDocumentLocale(nextLocale);
      })
      .catch(() => {
        const browserLocale = navigator.language.split("-")[0];
        const nextLocale = isLocale(browserLocale) ? browserLocale : "en";
        setLocale(nextLocale);
        applyDocumentLocale(nextLocale);
      });
  }, []);

  useEffect(() => {
    applyDocumentLocale(locale);
    applySurfaceLocale(locale);
  }, [locale]);

  const activeCopy = useMemo(() => localeCopy[locale], [locale]);

  return (
    <section
      className="border-t border-white/10 bg-[#0d1729] px-4 py-2 text-[#f8f5f0] md:px-8"
      aria-label="Language and region assist"
      data-revenue-anchor={`${packageName} ${packagePrice}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-[11px] text-[#cdd8df] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
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
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{activeCopy.market}</span>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{marketCount} priority markets</span>
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
