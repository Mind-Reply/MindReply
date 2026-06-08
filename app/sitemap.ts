import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";

const routes = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  { path: "/agent", priority: 0.95, changeFrequency: "daily" as const },
  { path: "/privacy", priority: 0.5, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
