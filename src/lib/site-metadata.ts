import type { Metadata } from "next"

import { totalCheckCount } from "@/lib/scan-categories"

export const siteName = "SiteAnalyze"

export const siteTagline = "Website audits made simple"

export const serviceProvider = {
  name: "Netchase",
  url: "https://netcha.se",
}

export const siteDescription = `Run ${totalCheckCount} automated checks across performance, SEO, security, accessibility, privacy, content, infrastructure, and mobile. Detect tech stack, analytics, and fonts in one scan.`

export const siteKeywords = [
  "website audit",
  "site analyzer",
  "SEO checker",
  "performance scan",
  "security audit",
  "accessibility testing",
  "tech stack detection",
  "website health check",
  "free website scan",
]

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  )
}

export function createSiteMetadata(): Metadata {
  const siteUrl = getSiteUrl()

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: `${siteName} | ${siteTagline}`,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    applicationName: siteName,
    keywords: siteKeywords,
    authors: [
      { name: siteName },
      { name: serviceProvider.name, url: serviceProvider.url },
    ],
    creator: siteName,
    publisher: serviceProvider.name,
    alternates: siteUrl ? { canonical: "/" } : undefined,
    openGraph: {
      title: `${siteName} | ${siteTagline}`,
      description: siteDescription,
      siteName,
      locale: "en_US",
      type: "website",
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | ${siteTagline}`,
      description: siteDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export function createScanMetadata(): Metadata {
  const description = `Enter a domain for ${totalCheckCount} checks, desktop and mobile screenshots, tech stack detection, and a full audit report.`

  return {
    title: "Free website scan",
    description,
    openGraph: {
      title: "Free website scan",
      description,
      url: "/scan",
    },
    twitter: {
      title: "Free website scan",
      description,
    },
    alternates: getSiteUrl() ? { canonical: "/scan" } : undefined,
  }
}
