"use client";

import { useEffect } from "react";

type LocaleCode = "en" | "es" | "fr" | "de" | "pt" | "ar" | "hi" | "ja" | "zh" | "uk";

type GoogleWindow = Window & {
  googleTranslateElementInit?: () => void;
  google?: {
    translate?: {
      TranslateElement?: new (options: Record<string, unknown>, elementId: string) => unknown;
    };
  };
};

const supportedLocales: LocaleCode[] = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"];
const googleLocaleMap: Record<LocaleCode, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  pt: "pt",
  ar: "ar",
  hi: "hi",
  ja: "ja",
  zh: "zh-CN",
  uk: "uk",
};

function isLocale(value: string): value is LocaleCode {
  return supportedLocales.includes(value as LocaleCode);
}

function currentLocale() {
  const query = new URLSearchParams(window.location.search).get("lang") || "";
  if (isLocale(query)) return query;

  const saved = window.localStorage.getItem("mindreply-locale") || "";
  if (isLocale(saved)) return saved;

  const htmlLocale = document.documentElement.lang || "";
  if (isLocale(htmlLocale)) return htmlLocale;

  const browserLocale = navigator.language.split("-")[0] || "";
  return isLocale(browserLocale) ? browserLocale : "en";
}

function setTranslateCookie(target: LocaleCode) {
  const googleLocale = googleLocaleMap[target];
  const value = target === "en" ? "/en/en" : `/en/${googleLocale}`;
  const maxAge = 60 * 60 * 24 * 30;

  document.cookie = `googtrans=${value};path=/;max-age=${maxAge};SameSite=Lax`;

  const host = window.location.hostname;
  if (host.includes("mind-reply.com")) {
    document.cookie = `googtrans=${value};path=/;domain=.mind-reply.com;max-age=${maxAge};SameSite=Lax`;
  }
}

function loadGoogleTranslate() {
  if (document.getElementById("mindreply-google-translate-script")) return;

  const script = document.createElement("script");
  script.id = "mindreply-google-translate-script";
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

function initGoogleTranslate() {
  const w = window as GoogleWindow;
  w.googleTranslateElementInit = () => {
    const TranslateElement = w.google?.translate?.TranslateElement;
    if (!TranslateElement || !document.getElementById("mindreply-google-translate")) return;

    new TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: Object.values(googleLocaleMap).join(","),
        autoDisplay: false,
      },
      "mindreply-google-translate",
    );
  };
}

function applyLocale(locale: LocaleCode) {
  setTranslateCookie(locale);
  if (locale !== "en") loadGoogleTranslate();
}

export default function GoogleTranslateProvider() {
  useEffect(() => {
    initGoogleTranslate();
    applyLocale(currentLocale());

    const onLocaleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ locale?: string }>).detail;
      const nextLocale = detail?.locale || currentLocale();
      if (isLocale(nextLocale)) applyLocale(nextLocale);
    };

    window.addEventListener("mindreply:locale-change", onLocaleChange);
    return () => window.removeEventListener("mindreply:locale-change", onLocaleChange);
  }, []);

  return <div id="mindreply-google-translate" aria-hidden="true" />;
}
