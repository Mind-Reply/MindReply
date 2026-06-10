import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, localeMeta, normalizeLocale, supportedLocales, type LocaleCode } from "@/lib/locales";

const supportedLocaleSet = new Set<LocaleCode>(supportedLocales);

type RequestBody = {
  target?: string;
  text?: string;
  texts?: string[];
};

type GoogleTranslationResponse = {
  data?: {
    translations?: Array<{ translatedText?: string }>;
  };
  error?: { message?: string };
};

function normalizeTarget(value: string | undefined) {
  const target = normalizeLocale(value);
  return supportedLocaleSet.has(target) ? target : defaultLocale;
}

function normalizeTexts(body: RequestBody) {
  const incoming = Array.isArray(body.texts) ? body.texts : typeof body.text === "string" ? [body.text] : [];
  return incoming
    .map((value) => String(value || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 80)
    .map((value) => value.slice(0, 280));
}

function passthrough(target: LocaleCode, texts: string[], configured: boolean, reason?: string) {
  return NextResponse.json({
    configured,
    provider: configured ? "google-cloud-translate" : "passthrough",
    target,
    translated: false,
    reason,
    translations: texts,
  });
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const target = normalizeTarget(body.target);
  const texts = normalizeTexts(body);
  const configured = Boolean(process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY);

  if (texts.length === 0) return NextResponse.json({ configured: false, target, translated: false, translations: [] });
  if (target === defaultLocale) return passthrough(target, texts, configured, "Default language selected.");

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY || "";
  if (!apiKey) return passthrough(target, texts, false, "GOOGLE_TRANSLATE_API_KEY is not configured.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        q: texts,
        target: localeMeta[target].googleLocale,
        source: defaultLocale,
        format: "text",
      }),
    });

    const data = (await response.json().catch(() => ({}))) as GoogleTranslationResponse;
    if (!response.ok) {
      return passthrough(target, texts, true, data.error?.message || `Google Translate returned ${response.status}.`);
    }

    const translations = data.data?.translations?.map((item, index) => item.translatedText || texts[index]) || texts;
    return NextResponse.json({
      configured: true,
      provider: "google-cloud-translate",
      target,
      translated: true,
      translations,
    });
  } catch (error) {
    return passthrough(target, texts, true, error instanceof Error ? error.message : "Google Translate request failed.");
  } finally {
    clearTimeout(timer);
  }
}
