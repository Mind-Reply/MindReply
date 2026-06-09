"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe2 } from "lucide-react";

const packageName = "Website Completion Package";
const packagePrice = "GBP 600";

type LocaleCopy = {
  label: string;
  market: string;
  promise: string;
  packageLine: string;
  contact: string;
};

const localeCopy = {
  en: {
    label: "English",
    market: "United States / United Kingdom / Singapore",
    promise: "Pressure into one clear next move.",
    packageLine: "Website Completion Package, GBP 600.",
    contact: "Ask MRagent first, then use the contact form when a human handoff is needed.",
  },
  es: {
    label: "Español",
    market: "Spain / Latin America",
    promise: "La presión convertida en el siguiente paso claro.",
    packageLine: "Paquete de finalización web, GBP 600.",
    contact: "Use MRagent primero; después use el formulario de contacto si necesita una entrega humana.",
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
    market: "Portugal / Brazil",
    promise: "Pressão transformada em um próximo passo claro.",
    packageLine: "Pacote de conclusão do site, GBP 600.",
    contact: "Use o MRagent primeiro; depois use o formulário quando precisar de acompanhamento humano.",
  },
  ar: {
    label: "العربية",
    market: "UAE / Saudi Arabia",
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
} as const satisfies Record<string, LocaleCopy>;

type LocaleCode = keyof typeof localeCopy;

const localeCodes = Object.keys(localeCopy) as LocaleCode[];
const rtlLocales = new Set<LocaleCode>(["ar"]);

const surfaceTranslations: Partial<Record<LocaleCode, Record<string, string>>> = {
  en: {},
  es: {
    "High-demand lane: website buying-friction rescue": "Carril de alta demanda: rescate de fricción de compra en sitios web",
    "Reclaim 2+ hours daily within 24 hours.": "Recupere más de 2 horas diarias en 24 horas.",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "La brecha de mayor demanda está en el último tramo: el comprador casi está listo, pero la página, la respuesta o el seguimiento no cierran con claridad.",
    "Try the Mind Read": "Pruebe la lectura MindReply",
    "Paid entry offer": "Oferta pagada de entrada",
    "Website Completion Package": "Paquete de finalización web",
    "Package total": "Total del paquete",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "Pregunte primero a MRagent. Contacte con MindReply cuando la respuesta necesite entrega humana.",
    "Try MRagent": "Probar MRagent",
    "Pressure in. One clear move out.": "Presión dentro. Un movimiento claro fuera.",
  },
  fr: {
    "High-demand lane: website buying-friction rescue": "Priorité forte demande : résoudre les frictions d'achat du site",
    "Reclaim 2+ hours daily within 24 hours.": "Récupérez plus de 2 heures par jour en 24 heures.",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "Le manque le plus coûteux est le dernier mètre : l'acheteur est presque prêt, mais la page, la réponse ou le suivi ne conclut pas nettement.",
    "Try the Mind Read": "Essayer la lecture MindReply",
    "Paid entry offer": "Offre payante d'entrée",
    "Website Completion Package": "Forfait de finalisation du site",
    "Package total": "Total du forfait",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "Demandez d'abord à MRagent. Contactez MindReply quand la réponse nécessite un relais humain.",
    "Try MRagent": "Essayer MRagent",
    "Pressure in. One clear move out.": "Pression reçue. Une action claire rendue.",
  },
  de: {
    "High-demand lane: website buying-friction rescue": "Hoch nachgefragter Bereich: Kaufreibung auf Websites lösen",
    "Reclaim 2+ hours daily within 24 hours.": "Gewinnen Sie innerhalb von 24 Stunden täglich über 2 Stunden zurück.",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "Die größte Lücke liegt im letzten Schritt: Käufer sind fast bereit, aber Seite, Antwort oder Follow-up schließen nicht sauber ab.",
    "Try the Mind Read": "MindReply-Lesung testen",
    "Paid entry offer": "Bezahlter Einstieg",
    "Website Completion Package": "Website-Abschluss-Paket",
    "Package total": "Paketpreis",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "Fragen Sie zuerst MRagent. Kontaktieren Sie MindReply, wenn eine menschliche Übergabe nötig ist.",
    "Try MRagent": "MRagent testen",
    "Pressure in. One clear move out.": "Druck hinein. Ein klarer Schritt heraus.",
  },
  pt: {
    "High-demand lane: website buying-friction rescue": "Faixa de alta procura: resgate de fricção de compra no site",
    "Reclaim 2+ hours daily within 24 hours.": "Recupere mais de 2 horas por dia em 24 horas.",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "A lacuna de maior procura está no último passo: o comprador quase está pronto, mas a página, a resposta ou o seguimento não fecham com clareza.",
    "Try the Mind Read": "Experimentar a leitura MindReply",
    "Paid entry offer": "Oferta paga de entrada",
    "Website Completion Package": "Pacote de conclusão do site",
    "Package total": "Total do pacote",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "Pergunte primeiro ao MRagent. Contacte a MindReply quando a resposta precisar de entrega humana.",
    "Try MRagent": "Experimentar MRagent",
    "Pressure in. One clear move out.": "Pressão entra. Um movimento claro sai.",
  },
  ar: {
    "High-demand lane: website buying-friction rescue": "مسار عالي الطلب: إزالة احتكاك الشراء من الموقع",
    "Reclaim 2+ hours daily within 24 hours.": "استعد أكثر من ساعتين يومياً خلال 24 ساعة.",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "أكبر فجوة في الطلب هي الخطوة الأخيرة: المشتري شبه جاهز، لكن الصفحة أو الرد أو المتابعة لا تغلق بوضوح.",
    "Try the Mind Read": "جرّب قراءة MindReply",
    "Paid entry offer": "عرض دخول مدفوع",
    "Website Completion Package": "حزمة إكمال الموقع",
    "Package total": "إجمالي الحزمة",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "اسأل MRagent أولاً. تواصل مع MindReply عندما تحتاج الإجابة إلى متابعة بشرية.",
    "Try MRagent": "جرّب MRagent",
    "Pressure in. One clear move out.": "ضغط يدخل. خطوة واضحة تخرج.",
  },
  hi: {
    "High-demand lane: website buying-friction rescue": "सबसे मांग वाला क्षेत्र: वेबसाइट खरीद-फ्रिक्शन बचाव",
    "Reclaim 2+ hours daily within 24 hours.": "24 घंटे में रोज़ 2+ घंटे वापस पाएं.",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "सबसे बड़ी मांग आख़िरी हिस्से में है: खरीदार लगभग तैयार है, लेकिन पेज, जवाब या फॉलो-अप साफ़ तरीके से बंद नहीं करता.",
    "Try the Mind Read": "MindReply रीड आज़माएं",
    "Paid entry offer": "पेड एंट्री ऑफर",
    "Website Completion Package": "वेबसाइट कम्प्लीशन पैकेज",
    "Package total": "पैकेज कुल",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "पहले MRagent से पूछें. जब जवाब को मानव हैंडऑफ चाहिए तो MindReply से संपर्क करें.",
    "Try MRagent": "MRagent आज़माएं",
    "Pressure in. One clear move out.": "दबाव अंदर. एक साफ़ कदम बाहर.",
  },
  ja: {
    "High-demand lane: website buying-friction rescue": "高需要領域：購入摩擦のあるサイトを整える",
    "Reclaim 2+ hours daily within 24 hours.": "24時間以内に毎日2時間以上を取り戻します。",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "最も需要が高い隙間は最後の一歩です。買い手はほぼ準備できているのに、ページ、返信、フォローがきれいに決まりません。",
    "Try the Mind Read": "MindReplyの読みを試す",
    "Paid entry offer": "有料エントリー提供",
    "Website Completion Package": "Website Completion Package",
    "Package total": "パッケージ合計",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "まずMRagentに聞き、人の引き継ぎが必要な場合はMindReplyへ連絡してください。",
    "Try MRagent": "MRagentを試す",
    "Pressure in. One clear move out.": "圧力を受け、一つの明確な動きへ。",
  },
  zh: {
    "High-demand lane: website buying-friction rescue": "高需求方向：修复网站购买摩擦",
    "Reclaim 2+ hours daily within 24 hours.": "24小时内每天取回2小时以上。",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "最高需求缺口在最后一段：买家几乎准备好，但页面、回复或跟进没有干净地完成成交动作。",
    "Try the Mind Read": "试用 MindReply 解读",
    "Paid entry offer": "付费入门方案",
    "Website Completion Package": "网站完成套餐",
    "Package total": "套餐总价",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "先询问 MRagent；如答案需要人工交接，再联系 MindReply。",
    "Try MRagent": "试用 MRagent",
    "Pressure in. One clear move out.": "压力进入。清晰动作输出。",
  },
  uk: {
    "High-demand lane: website buying-friction rescue": "Напрям високого попиту: усунення купівельного тертя на сайті",
    "Reclaim 2+ hours daily within 24 hours.": "Поверніть понад 2 години щодня протягом 24 годин.",
    "The highest-demand gap is the last mile: buyers are almost ready, but the page, reply, or follow-up does not close cleanly.": "Найбільший попит у фінальному кроці: покупець майже готовий, але сторінка, відповідь або follow-up не закривають дію чисто.",
    "Try the Mind Read": "Спробувати читання MindReply",
    "Paid entry offer": "Платний стартовий пакет",
    "Website Completion Package": "Пакет завершення сайту",
    "Package total": "Загальна ціна пакета",
    "Ask MRagent first. Contact MindReply when the answer needs a human handoff.": "Спершу запитайте MRagent. Звертайтесь до MindReply, коли потрібна людська передача.",
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

  useEffect(() => {
    applyDocumentLocale(locale);
    applySurfaceLocale(locale);
  }, [locale]);

  const activeCopy = useMemo(() => localeCopy[locale], [locale]);

  return (
    <section
      className="border-t border-white/10 bg-[#0d1729] px-4 py-3 text-[#f8f5f0] md:px-8"
      aria-label="Language and region assist"
      data-revenue-anchor={`${packageName} ${packagePrice}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-[#cdd8df] md:flex-row md:items-center md:justify-between">
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
