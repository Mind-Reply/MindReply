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
    nativeLabel: "Espa\u00f1ol",
    market: "Spain / LatAm",
    line: "La presi\u00f3n se convierte en un paso claro.",
    htmlLang: "es",
    ogLocale: "es_ES",
    googleLocale: "es",
    dir: "ltr",
  },
  fr: {
    code: "fr",
    label: "French",
    nativeLabel: "Fran\u00e7ais",
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
    nativeLabel: "Portugu\u00eas",
    market: "Brazil / Portugal",
    line: "A press\u00e3o vira um pr\u00f3ximo passo claro.",
    htmlLang: "pt",
    ogLocale: "pt_BR",
    googleLocale: "pt",
    dir: "ltr",
  },
  ar: {
    code: "ar",
    label: "Arabic",
    nativeLabel: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    market: "UAE / Saudi Arabia",
    line: "\u064a\u062a\u062d\u0648\u0651\u0644 \u0627\u0644\u0636\u063a\u0637 \u0625\u0644\u0649 \u062e\u0637\u0648\u0629 \u0648\u0627\u062d\u062f\u0629 \u0648\u0627\u0636\u062d\u0629.",
    htmlLang: "ar",
    ogLocale: "ar_AE",
    googleLocale: "ar",
    dir: "rtl",
  },
  hi: {
    code: "hi",
    label: "Hindi",
    nativeLabel: "\u0939\u093f\u0928\u094d\u0926\u0940",
    market: "India",
    line: "\u0926\u092c\u093e\u0935 \u090f\u0915 \u0938\u093e\u092b \u0905\u0917\u0932\u0947 \u0915\u0926\u092e \u092e\u0947\u0902 \u092c\u0926\u0932\u0924\u093e \u0939\u0948\u0964",
    htmlLang: "hi",
    ogLocale: "hi_IN",
    googleLocale: "hi",
    dir: "ltr",
  },
  ja: {
    code: "ja",
    label: "Japanese",
    nativeLabel: "\u65e5\u672c\u8a9e",
    market: "Japan",
    line: "\u91cd\u3044\u6587\u8108\u3092\u3001\u3072\u3068\u3064\u306e\u660e\u78ba\u306a\u6b21\u306e\u4e00\u624b\u3078\u3002",
    htmlLang: "ja",
    ogLocale: "ja_JP",
    googleLocale: "ja",
    dir: "ltr",
  },
  zh: {
    code: "zh",
    label: "Chinese",
    nativeLabel: "\u4e2d\u6587",
    market: "China / Hong Kong / Taiwan",
    line: "\u628a\u538b\u529b\u6574\u7406\u6210\u4e00\u4e2a\u6e05\u6670\u7684\u4e0b\u4e00\u6b65\u3002",
    htmlLang: "zh",
    ogLocale: "zh_CN",
    googleLocale: "zh-CN",
    dir: "ltr",
  },
  uk: {
    code: "uk",
    label: "Ukrainian",
    nativeLabel: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",
    market: "Ukraine",
    line: "\u0422\u0438\u0441\u043a \u043f\u0435\u0440\u0435\u0442\u0432\u043e\u0440\u044e\u0454\u0442\u044c\u0441\u044f \u043d\u0430 \u043e\u0434\u0438\u043d \u0447\u0456\u0442\u043a\u0438\u0439 \u043d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u0439 \u043a\u0440\u043e\u043a.",
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
