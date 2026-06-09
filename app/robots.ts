import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/agent",
          "/website-completion-package",
          "/pricing",
          "/contact",
          "/capabilities",
          "/agents",
          "/pack",
          "/privacy",
          "/sitemap.xml",
          "/manifest.webmanifest",
          "/opengraph-image",
        ],
        disallow: ["/api/", "/mcp"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
