import type { MetadataRoute } from "next";
import { defaultLocale, localeAlternates, supportedLocales } from "@/lib/locales";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";
const languageParams = ["es", "fr", "de", "pt", "ar", "hi", "ja", "zh", "uk"] as const;

function sitemapPath(path: string, locale: string) {
  if (locale === defaultLocale) return path;
  return `${path}?lang=${locale}`;
}

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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap((route) => {
    const alternates = route.localized ? { languages: localeAlternates(siteUrl, route.path) } : undefined;
    const locales = route.localized ? supportedLocales.filter((locale) => locale === defaultLocale || languageParams.includes(locale as (typeof languageParams)[number])) : [defaultLocale];

    return locales.map((locale) => ({
      url: `${siteUrl}${sitemapPath(route.path, locale)}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: locale === "en" ? route.priority : Math.max(route.priority - 0.03, 0.45),
      alternates: alternates,
    }));
  });
}
