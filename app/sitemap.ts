import type { MetadataRoute } from "next";
import { defaultLocale, localeAlternates, localizedPath, type LocaleCode } from "@/lib/locales";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";
const sitemapLocales: readonly LocaleCode[] = ["en", "es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"];

const routes = [
  { path: "/", priority: 1, changeFrequency: "daily" as const, localized: true },
  { path: "/agent", priority: 0.95, changeFrequency: "daily" as const, localized: true },
  { path: "/response-overload", priority: 0.945, changeFrequency: "daily" as const, localized: true },
  { path: "/products", priority: 0.94, changeFrequency: "daily" as const, localized: true },
  { path: "/website-completion-package", priority: 0.92, changeFrequency: "daily" as const, localized: true },
  { path: "/checkout", priority: 0.9, changeFrequency: "weekly" as const, localized: true },
  { path: "/pricing", priority: 0.88, changeFrequency: "weekly" as const, localized: true },
  { path: "/trust", priority: 0.82, changeFrequency: "weekly" as const, localized: true },
  { path: "/capabilities", priority: 0.75, changeFrequency: "weekly" as const, localized: true },
  { path: "/contact", priority: 0.55, changeFrequency: "monthly" as const, localized: true },
  { path: "/privacy", priority: 0.5, changeFrequency: "monthly" as const, localized: true },
];

function languageParams(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return Object.fromEntries(sitemapLocales.map((locale) => [locale, `${siteUrl}${path}?lang=${locale}`]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap((route) => {
    const alternates = route.localized
      ? { languages: { ...localeAlternates(siteUrl, route.path), ...languageParams(route.path) } }
      : undefined;
    const locales: readonly LocaleCode[] = route.localized ? sitemapLocales : [defaultLocale];

    return locales.map((locale) => ({
      url: `${siteUrl}${localizedPath(route.path, locale)}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: locale === defaultLocale ? route.priority : Math.max(route.priority - 0.03, 0.45),
      alternates: alternates,
    }));
  });
}
