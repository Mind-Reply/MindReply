import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";

const languageParams = ["es", "fr", "de", "it", "pt", "ar", "hi", "ja", "ko", "zh"];

const routes = [
  { path: "/", priority: 1, changeFrequency: "daily" as const, localized: true },
  { path: "/agent", priority: 0.95, changeFrequency: "daily" as const, localized: true },
  { path: "/website-completion-package", priority: 0.92, changeFrequency: "daily" as const, localized: true },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const, localized: true },
  { path: "/agents", priority: 0.88, changeFrequency: "daily" as const, localized: false },
  { path: "/capabilities", priority: 0.75, changeFrequency: "weekly" as const, localized: true },
  { path: "/pack", priority: 0.65, changeFrequency: "weekly" as const, localized: false },
  { path: "/contact", priority: 0.55, changeFrequency: "monthly" as const, localized: true },
  { path: "/privacy", priority: 0.5, changeFrequency: "monthly" as const, localized: false },
];

function localeAlternates(path: string) {
  return {
    en: `${siteUrl}${path}`,
    ...Object.fromEntries(languageParams.map((locale) => [locale, `${siteUrl}${path}?lang=${locale}`])),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: route.localized
      ? {
          languages: localeAlternates(route.path),
        }
      : undefined,
  }));
}
