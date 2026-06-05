import type { MetadataRoute } from "next";
import { absoluteUrl, publicRoutes, revenueToolRoutes, solutionPages } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    ...publicRoutes,
    ...revenueToolRoutes,
    ...solutionPages.map((page) => `/solutions/${page.slug}`),
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route.startsWith("/solutions") || route === "/memberships" ? 0.9 : 0.7,
  }));
}
