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
          "/products",
          "/website-completion-package",
          "/checkout",
          "/pricing",
          "/contact",
          "/capabilities",
          "/privacy",
          "/sitemap.xml",
          "/manifest.webmanifest",
          "/opengraph-image",
        ],
        disallow: ["/api/", "/mcp", "/agents", "/pack"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
