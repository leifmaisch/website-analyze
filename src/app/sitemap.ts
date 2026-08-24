import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/site-metadata"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl() ?? "https://scan.netcha.se"

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/scan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]
}
