import type { Metadata } from "next"

import { totalCheckCount } from "@/lib/scan-categories"

export const siteName = "Webcheck"

export const siteTagline = "Website audits made simple"

export const serviceProvider = {
  name: "Netchase",
  url: "https://netcha.se",
}

export const siteDescription = `Run ${totalCheckCount} automated checks for performance, SEO, security, accessibility, and mobile. Detect tech stack, analytics, and fonts in one scan.`

export const siteKeywords = [
  "website audit",
  "webcheck",
  "SEO checker",
  "performance scan",
  "security audit",
  "accessibility testing",
  "tech stack detection",
  "website health check",
  "free website scan",
]

export function getSiteUserAgent() {
  const siteUrl = getSiteUrl()
  return siteUrl ? `${siteName}/1.0 (+${siteUrl})` : `${siteName}/1.0`
}

export function getSiteUrl() {
  return (
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  )
}

function absoluteSiteUrl(path: string) {
  const siteUrl = getSiteUrl()
  if (!siteUrl) return path
  return new URL(path, siteUrl).href
}

const defaultOgImageAlt = `${siteName} | ${siteTagline}`

function createDefaultSocialImages() {
  return {
    openGraph: [
      {
        url: absoluteSiteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: defaultOgImageAlt,
        type: "image/png",
      },
    ],
    twitter: [absoluteSiteUrl("/opengraph-image")],
  }
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
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
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
  const images = createDefaultSocialImages()

  return {
    title: "Free website scan",
    description,
    openGraph: {
      title: "Free website scan",
      description,
      url: "/scan",
      images: images.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: "Free website scan",
      description,
      images: images.twitter,
    },
    alternates: getSiteUrl() ? { canonical: "/scan" } : undefined,
  }
}

export function createSharedScanMetadata(
  result: { domain: string; scores: { overall: number } },
  shareId: string
): Metadata {
  const siteUrl = getSiteUrl()
  const title = `${result.domain} audit`
  const description = `Overall score ${result.scores.overall} for ${result.domain}. Full website audit with ${totalCheckCount} checks.`
  const imageAlt = `${result.domain} audit · score ${result.scores.overall}`
  const sharePath = `/r/${shareId}`
  const ogImagePath = `/r/${shareId}/opengraph-image`
  const ogImageUrl = absoluteSiteUrl(ogImagePath)

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title,
    description,
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      url: sharePath,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: siteUrl ? { canonical: sharePath } : undefined,
  }
}
