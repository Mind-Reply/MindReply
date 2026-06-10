"use client";

import { useEffect } from "react";

type LocaleCode = "en" | "es" | "fr" | "de" | "pt" | "ar" | "hi" | "ja" | "zh" | "uk";

type TranslateResponse = {
  configured?: boolean;
  target?: string;
  translations?: string[];
};

const supportedLocales: LocaleCode[] = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"];
const originalText = new WeakMap<Text, string>();

function isLocale(value: string): value is LocaleCode {
  return supportedLocales.includes(value as LocaleCode);
}

function currentLocale() {
  const pathLocale = window.location.pathname.split("/").filter(Boolean)[0] || "";
  if (isLocale(pathLocale)) return pathLocale;

  const query = new URLSearchParams(window.location.search).get("lang") || "";
  if (isLocale(query)) return query;

  const saved = window.localStorage.getItem("mindreply-locale") || "";
  if (isLocale(saved)) return saved;

  const htmlLocale = document.documentElement.lang || "";
  if (isLocale(htmlLocale)) return htmlLocale;

  const browserLocale = navigator.language.split("-")[0] || "";
  return isLocale(browserLocale) ? browserLocale : "en";
}

function shouldSkipElement(element: Element | null) {
  if (!element) return true;
  if (element.closest("script,style,noscript,svg,input,textarea,select,code,pre,[hidden],[aria-hidden='true'],[data-no-translate]")) return true;
  const htmlElement = element as HTMLElement;
  return htmlElement.offsetParent === null && !["BODY", "HTML"].includes(htmlElement.tagName);
}

function collectTextNodes() {
  const roots = Array.from(document.querySelectorAll("body"));
  const nodes: Text[] = [];

  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = node.textContent?.replace(/\s+/g, " ").trim() || "";
        if (text.length < 3 || text.length > 280) return NodeFilter.FILTER_REJECT;
        if (/^[\d\W_]+$/.test(text)) return NodeFilter.FILTER_REJECT;
        if (shouldSkipElement(node.parentElement)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let current = walker.nextNode();
    while (current) {
      nodes.push(current as Text);
      current = walker.nextNode();
    }
  }

  return nodes;
}

function restoreOriginal(nodes: Text[]) {
  for (const node of nodes) {
    const original = originalText.get(node);
    if (original !== undefined) node.textContent = original;
  }
}

async function translateVisibleText(locale: LocaleCode) {
  const nodes = collectTextNodes();

  for (const node of nodes) {
    if (!originalText.has(node)) originalText.set(node, node.textContent || "");
  }

  restoreOriginal(nodes);
  if (locale === "en") return;

  const originals = nodes.map((node) => originalText.get(node) || "");
  const unique = Array.from(new Set(originals.map((text) => text.trim()).filter(Boolean)));
  if (unique.length === 0) return;

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: locale, texts: unique }),
  });

  if (!response.ok) return;
  const data = (await response.json()) as TranslateResponse;
  const translations = data.translations || [];
  const translated = new Map(unique.map((text, index) => [text, translations[index] || text]));

  for (const node of nodes) {
    const original = (originalText.get(node) || "").trim();
    node.textContent = translated.get(original) || originalText.get(node) || node.textContent;
  }
}

export default function GoogleTranslateProvider() {
  useEffect(() => {
    const apply = (locale: LocaleCode) => {
      window.requestAnimationFrame(() => {
        void translateVisibleText(locale);
      });
    };

    apply(currentLocale());

    const onLocaleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ locale?: string }>).detail;
      const nextLocale = detail?.locale || currentLocale();
      if (isLocale(nextLocale)) apply(nextLocale);
    };

    window.addEventListener("mindreply:locale-change", onLocaleChange);
    return () => window.removeEventListener("mindreply:locale-change", onLocaleChange);
  }, []);

  return null;
}
