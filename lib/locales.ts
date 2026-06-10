export const supportedLocales = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"] as const;

export type LocaleCode = (typeof supportedLocales)[number];

export const defaultLocale: LocaleCode = "en";

export type LocaleMeta = {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  market: string;
  line: string;
  htmlLang: string;
  ogLocale: string;
  googleLocale: string;
  dir: "ltr" | "rtl";
};

export const localeMeta: Record<LocaleCode, LocaleMeta> = {
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    market: "UK / US",
    line: "Pressure into one clear next move.",
    htmlLang: "en",
    ogLocale: "en_GB",
    googleLocale: "en",
    dir: "ltr",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    market: "Spain / LatAm",
    line: "La presión se convierte en un paso claro.",
    htmlLang: "es",
    ogLocale: "es_ES",
    googleLocale: "es",
    dir: "ltr",
  },
  fr: {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    market: "France",
    line: "La pression devient une action claire.",
    htmlLang: "fr",
    ogLocale: "fr_FR",
    googleLocale: "fr",
    dir: "ltr",
  },
  de: {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    market: "Germany",
    line: "Druck wird zu einem klaren Schritt.",
    htmlLang: "de",
    ogLocale: "de_DE",
    googleLocale: "de",
    dir: "ltr",
  },
  pt: {
    code: "pt",
    label: "Portuguese",
    nativeLabel: "Português",
    market: "Brazil / Portugal",
    line: "A pressão vira um próximo passo claro.",
    htmlLang: "pt",
    ogLocale: "pt_BR",
    googleLocale: "pt",
    dir: "ltr",
  },
  ar: {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    market: "UAE / Saudi Arabia",
    line: "يتحوّل الضغط إلى خطوة واحدة واضحة.",
    htmlLang: "ar",
    ogLocale: "ar_AE",
    googleLocale: "ar",
    dir: "rtl",
  },
  hi: {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    market: "India",
    line: "दबाव एक साफ अगले कदम में बदलता है।",
    htmlLang: "hi",
    ogLocale: "hi_IN",
    googleLocale: "hi",
    dir: "ltr",
  },
  ja: {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    market: "Japan",
    line: "重い文脈を、ひとつの明確な次の一手へ。",
    htmlLang: "ja",
    ogLocale: "ja_JP",
    googleLocale: "ja",
    dir: "ltr",
  },
  zh: {
    code: "zh",
    label: "Chinese",
    nativeLabel: "中文",
    market: "China / Hong Kong / Taiwan",
    line: "把压力整理成一个清晰的下一步。",
    htmlLang: "zh",
    ogLocale: "zh_CN",
    googleLocale: "zh-CN",
    dir: "ltr",
  },
  uk: {
    code: "uk",
    label: "Ukrainian",
    nativeLabel: "Українська",
    market: "Ukraine",
    line: "Тиск перетворюється на один чіткий наступний крок.",
    htmlLang: "uk",
    ogLocale: "uk_UA",
    googleLocale: "uk",
    dir: "ltr",
  },
};

export const countryLocale: Record<string, LocaleCode> = {
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

export function isLocale(value: unknown): value is LocaleCode {
  return typeof value === "string" && supportedLocales.includes(value.toLowerCase().split("-")[0] as LocaleCode);
}

export function normalizeLocale(value: unknown): LocaleCode {
  if (typeof value !== "string") return defaultLocale;
  const locale = value.toLowerCase().split(",")[0]?.trim().split("-")[0];
  return isLocale(locale) ? locale : defaultLocale;
}

export function localeFromPath(pathname: string): LocaleCode | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isLocale(segment) ? segment : null;
}

export function stripLocaleFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && isLocale(parts[0])) parts.shift();
  return `/${parts.join("/")}`.replace(/\/$/, "") || "/";
}

export function localizedPath(pathname: string, locale: LocaleCode) {
  const cleanPath = stripLocaleFromPath(pathname);
  if (locale === defaultLocale) return cleanPath;
  return cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
}

export function localeAlternates(siteUrl: string, pathname: string) {
  const cleanPath = stripLocaleFromPath(pathname);
  return {
    "x-default": `${siteUrl}${cleanPath}`,
    ...Object.fromEntries(supportedLocales.map((locale) => [locale, `${siteUrl}${localizedPath(cleanPath, locale)}`])),
  };
}
