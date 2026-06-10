import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";

const languageParams = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ar",
  "hi",
  "ja",
  "zh",
  "uk",
  "bg",
] as const;

const routes = [
  { path: "/", priority: 1, changeFrequency: "daily" as const, localized: true },
  { path: "/agent", priority: 0.95, changeFrequency: "daily" as const, localized: true },
  { path: "/response-overload", priority: 0.945, changeFrequency: "daily" as const, localized: true },
  { path: "/products", priority: 0.94, changeFrequency: "daily" as const, localized: true },
  { path: "/website-completion-package", priority: 0.92, changeFrequency: "daily" as const, localized: true },
  { path: "/checkout", priority: 0.9, changeFrequency: "weekly" as const, localized: true },
  { path: "/pricing", priority: 0.88, changeFrequency: "weekly" as const, localized: true },
  { path: "/capabilities", priority: 0.75, changeFrequency: "weekly" as const, localized: true },
  { path: "/contact", priority: 0.55, changeFrequency: "monthly" as const, localized: true },
  { path: "/privacy", priority: 0.5, changeFrequency: "monthly" as const, localized: false },
];

function localeAlternates(path: string) {
  return Object.fromEntries(languageParams.map((locale) => [locale, `${siteUrl}${path}?lang=${locale}`]));
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
