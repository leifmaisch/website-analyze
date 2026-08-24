import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/site-metadata"

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl() ?? "https://scan.netcha.se"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
