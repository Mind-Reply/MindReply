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
  marketProfiles?: Array<{ country: string; locale: string; priority: number }>;
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
    label: "Español",
    market: "España / Latinoamérica",
    promise: "La presión se convierte en un siguiente paso claro.",
    packageLine: "Paquete de Finalización Web, GBP 600.",
    contact: "Use MRagent primero; después use el formulario si necesita una entrega humana.",
  },
  fr: {
    label: "Français",
    market: "France / Belgique / Suisse",
    promise: "La pression devient une prochaine action claire.",
    packageLine: "Forfait de Finalisation du Site, GBP 600.",
    contact: "Essayez MRagent d'abord, puis utilisez le formulaire si un relais humain est nécessaire.",
  },
  de: {
    label: "Deutsch",
    market: "Deutschland / Österreich / Schweiz",
    promise: "Druck wird zu einem klaren nächsten Schritt.",
    packageLine: "Website-Abschluss-Paket, GBP 600.",
    contact: "Nutzen Sie zuerst MRagent; danach das Kontaktformular für die menschliche Übergabe.",
  },
  pt: {
    label: "Português",
    market: "Brasil / Portugal",
    promise: "A pressão vira um próximo passo claro.",
    packageLine: "Pacote de Conclusão do Site, GBP 600.",
    contact: "Use o MRagent primeiro; depois use o formulário quando precisar de acompanhamento humano.",
  },
  ar: {
    label: "العربية",
    market: "الإمارات / السعودية / الخليج",
    promise: "يتحوّل الضغط إلى خطوة واحدة واضحة وهادئة.",
    packageLine: "حزمة إكمال الموقع، 600 جنيه إسترليني.",
    contact: "ابدأ مع MRagent، ثم استخدم نموذج التواصل عند الحاجة إلى متابعة بشرية.",
  },
  hi: {
    label: "हिन्दी",
    market: "भारत",
    promise: "दबाव एक साफ अगले कदम में बदल जाता है।",
    packageLine: "वेबसाइट कम्प्लीशन पैकेज, GBP 600.",
    contact: "पहले MRagent आज़माएँ; मानवीय सहायता चाहिए तो संपर्क फ़ॉर्म इस्तेमाल करें।",
  },
  ja: {
    label: "日本語",
    market: "日本",
    promise: "重い文脈を、ひとつの明確な次の一手へ。",
    packageLine: "Website Completion Package、GBP 600。",
    contact: "まずMRagentをお試しください。人による確認が必要な場合はお問い合わせフォームへ。",
  },
  zh: {
    label: "中文",
    market: "中国 / 香港 / 台湾",
    promise: "把压力整理成一个清晰的下一步。",
    packageLine: "网站完成套餐，GBP 600。",
    contact: "先使用MRagent；需要人工跟进时，再使用联系表单。",
  },
  uk: {
    label: "Українська",
    market: "Україна / Східна Європа",
    promise: "Тиск перетворюється на один чіткий наступний крок.",
    packageLine: "Пакет завершення сайту, GBP 600.",
    contact: "Спершу спробуйте MRagent; для людського супроводу скористайтеся формою контакту.",
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
    "High-demand lane: website buying-friction rescue": "Alta demanda: rescate de fricción de compra web",
    "Reclaim 2+ hours daily within 24 hours.": "Recupere más de 2 horas diarias en 24 horas.",
    "Try the Mind Read": "Probar la lectura MindReply",
    "Website Completion Package": "Paquete de Finalización Web",
    "Package total": "Total del paquete",
    "Try MRagent": "Probar MRagent",
    "Contact form": "Formulario de contacto",
    "Pressure in. One clear move out.": "Presión dentro. Un movimiento claro fuera.",
    "Paid entry offer": "Oferta de entrada pagada",
    "Authority layer": "Capa de autoridad",
    "Trust proof": "Prueba de confianza",
  },
  fr: {
    "High-demand lane: website buying-friction rescue": "Forte demande : réduction des frictions d'achat du site",
    "Reclaim 2+ hours daily within 24 hours.": "Récupérez plus de 2 heures par jour en 24 heures.",
    "Try the Mind Read": "Essayer la lecture MindReply",
    "Website Completion Package": "Forfait de Finalisation du Site",
    "Package total": "Total du forfait",
    "Try MRagent": "Essayer MRagent",
    "Contact form": "Formulaire de contact",
    "Pressure in. One clear move out.": "Pression reçue. Une action claire rendue.",
    "Paid entry offer": "Offre d'entrée payante",
    "Authority layer": "Couche d'autorité",
    "Trust proof": "Preuve de confiance",
  },
  de: {
    "High-demand lane: website buying-friction rescue": "Hohe Nachfrage: Kaufreibung auf Websites lösen",
    "Reclaim 2+ hours daily within 24 hours.": "Gewinnen Sie innerhalb von 24 Stunden täglich über 2 Stunden zurück.",
    "Try the Mind Read": "MindReply-Lesung testen",
    "Website Completion Package": "Website-Abschluss-Paket",
    "Package total": "Paketpreis",
    "Try MRagent": "MRagent testen",
    "Contact form": "Kontaktformular",
    "Pressure in. One clear move out.": "Druck hinein. Ein klarer Schritt heraus.",
    "Paid entry offer": "Bezahltes Einstiegspaket",
    "Authority layer": "Autoritätsebene",
    "Trust proof": "Vertrauensnachweis",
  },
  pt: {
    "High-demand lane: website buying-friction rescue": "Alta procura: resgate de fricção de compra no site",
    "Reclaim 2+ hours daily within 24 hours.": "Recupere mais de 2 horas por dia em 24 horas.",
    "Try the Mind Read": "Experimentar a leitura MindReply",
    "Website Completion Package": "Pacote de Conclusão do Site",
    "Package total": "Total do pacote",
    "Try MRagent": "Experimentar MRagent",
    "Contact form": "Formulário de contacto",
    "Pressure in. One clear move out.": "Pressão entra. Um movimento claro sai.",
    "Paid entry offer": "Oferta paga de entrada",
    "Authority layer": "Camada de autoridade",
    "Trust proof": "Prova de confiança",
  },
  ar: {
    "High-demand lane: website buying-friction rescue": "مسار عالي الطلب: إزالة احتكاك الشراء من الموقع",
    "Reclaim 2+ hours daily within 24 hours.": "استعد أكثر من ساعتين يومياً خلال 24 ساعة.",
    "Try the Mind Read": "جرّب قراءة MindReply",
    "Website Completion Package": "حزمة إكمال الموقع",
    "Package total": "إجمالي الحزمة",
    "Try MRagent": "جرّب MRagent",
    "Contact form": "نموذج التواصل",
    "Pressure in. One clear move out.": "يدخل الضغط. تخرج خطوة واضحة.",
    "Paid entry offer": "عرض دخول مدفوع",
    "Authority layer": "طبقة الثقة المهنية",
    "Trust proof": "إثبات الثقة",
  },
  hi: {
    "High-demand lane: website buying-friction rescue": "उच्च मांग: वेबसाइट खरीद-घर्षण बचाव",
    "Reclaim 2+ hours daily within 24 hours.": "24 घंटे में रोज़ 2+ घंटे वापस पाएँ।",
    "Try the Mind Read": "MindReply रीड आज़माएँ",
    "Website Completion Package": "वेबसाइट कम्प्लीशन पैकेज",
    "Package total": "पैकेज कुल",
    "Try MRagent": "MRagent आज़माएँ",
    "Contact form": "संपर्क फ़ॉर्म",
    "Pressure in. One clear move out.": "दबाव अंदर। एक साफ कदम बाहर।",
    "Paid entry offer": "भुगतान वाला शुरुआती प्रस्ताव",
    "Authority layer": "विश्वसनीयता परत",
    "Trust proof": "भरोसे का प्रमाण",
  },
  ja: {
    "High-demand lane: website buying-friction rescue": "高需要領域：購入摩擦を減らすサイト整理",
    "Reclaim 2+ hours daily within 24 hours.": "24時間以内に、毎日2時間以上を取り戻す。",
    "Try the Mind Read": "MindReplyの読み取りを試す",
    "Website Completion Package": "Website Completion Package",
    "Package total": "パッケージ合計",
    "Try MRagent": "MRagentを試す",
    "Contact form": "お問い合わせフォーム",
    "Pressure in. One clear move out.": "圧力を入れ、明確な一手を返す。",
    "Paid entry offer": "有料導入オファー",
    "Authority layer": "信頼の層",
    "Trust proof": "信頼の証拠",
  },
  zh: {
    "High-demand lane: website buying-friction rescue": "高需求方向：网站购买摩擦修复",
    "Reclaim 2+ hours daily within 24 hours.": "在24小时内每天节省2小时以上。",
    "Try the Mind Read": "试用MindReply解读",
    "Website Completion Package": "网站完成套餐",
    "Package total": "套餐总价",
    "Try MRagent": "试用MRagent",
    "Contact form": "联系表单",
    "Pressure in. One clear move out.": "压力进入。清晰下一步输出。",
    "Paid entry offer": "付费入门方案",
    "Authority layer": "权威层",
    "Trust proof": "信任证明",
  },
  uk: {
    "High-demand lane: website buying-friction rescue": "Високий попит: усунення тертя купівлі на сайті",
    "Reclaim 2+ hours daily within 24 hours.": "Поверніть понад 2 години щодня за 24 години.",
    "Try the Mind Read": "Спробувати читання MindReply",
    "Website Completion Package": "Пакет завершення сайту",
    "Package total": "Загальна вартість пакета",
    "Try MRagent": "Спробувати MRagent",
    "Contact form": "Форма контакту",
    "Pressure in. One clear move out.": "Тиск усередину. Один чіткий крок назовні.",
    "Paid entry offer": "Платна стартова пропозиція",
    "Authority layer": "Шар довіри",
    "Trust proof": "Доказ довіри",
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
          <span className="locale-chip market-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{activeCopy.market}</span>
          <span className="locale-chip priority-chip rounded-full border border-white/10 px-2.5 py-1 text-[#9fb0bd]">{marketCount} priority markets</span>
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
