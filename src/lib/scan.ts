import "server-only"

import { analyzeHtml, buildChecks } from "@/lib/scan-analysis"
import {
  scoreCategoryIds,
  type CheckCategory,
} from "@/lib/scan-categories"
import {
  detectTechStack,
} from "@/lib/scan-detect"
import { detectAnalytics } from "@/lib/scan-analytics"
import {
  buildResponsiveChecks,
  captureBrowserInsights,
} from "@/lib/scan-browser"
import { detectFonts } from "@/lib/scan-fonts"
import { formatChecksForDisplay } from "@/lib/scan-check-display"
import { getSiteUserAgent } from "@/lib/site-metadata"
import {
  checkSslCertificate,
  fetchExists,
  getRedirectChain,
  lookupDns,
  probeUrls,
} from "@/lib/scan-infra"

import type { CheckStatus, ScanCheck, ScanMeta, ScanResult, ScanScores } from "@/lib/scan-types"

export type {
  CheckCategory,
  CheckStatus,
  ScanCheck,
  ScanMeta,
  ScanResult,
  ScanScores,
} from "@/lib/scan-types"
export { getCheckCategory, checkCategoryLabels } from "@/lib/scan-categories"

const blockedHostPatterns = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^0\.0\.0\.0$/,
  /^\[::1\]$/,
  /^169\.254\./,
  /\.local$/i,
  /^metadata\.google\.internal$/i,
]

export function normalizeScanUrl(input: string): URL {
  const trimmed = input.trim()
  if (!trimmed) {
    throw new Error("Enter a domain to scan")
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    throw new Error("Enter a valid domain or URL")
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported")
  }

  if (!url.hostname) {
    throw new Error("Enter a valid domain")
  }

  if (blockedHostPatterns.some((pattern) => pattern.test(url.hostname))) {
    throw new Error("This domain cannot be scanned")
  }

  if (url.username || url.password) {
    throw new Error("URLs with credentials are not supported")
  }

  return url
}

function checkStatusScore(status: CheckStatus): number {
  if (status === "pass" || status === "info") return 100
  if (status === "warn") return 65
  return 30
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function averageScores(scores: number[]): number {
  if (scores.length === 0) return 0
  return clampScore(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}

function performanceScore(responseTimeMs: number): number {
  if (responseTimeMs < 500) return 95
  if (responseTimeMs < 1000) return 85
  if (responseTimeMs < 2000) return 70
  if (responseTimeMs < 3000) return 55
  if (responseTimeMs < 5000) return 40
  return 25
}

function scoreCategory(
  checks: ScanCheck[],
  category: CheckCategory,
  responseTimeMs: number,
  responseOk: boolean
): number {
  const ids = scoreCategoryIds[category]
  const categoryChecks = checks.filter((check) => ids.includes(check.id))
  let score = averageScores(
    categoryChecks.map((check) => checkStatusScore(check.status))
  )

  if (category === "performance") {
    score = clampScore((score + performanceScore(responseTimeMs)) / 2)
    if (!responseOk) score = clampScore(score - 20)
  }

  return score
}

export async function scanWebsite(input: string): Promise<ScanResult> {
  const url = normalizeScanUrl(input)
  const startedAt = Date.now()

  const [redirectChain, response] = await Promise.all([
    getRedirectChain(url.toString()),
    fetch(url.toString(), {
      redirect: "follow",
      headers: {
        "User-Agent": getSiteUserAgent(),
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    }),
  ])

  const responseTimeMs = Date.now() - startedAt
  const htmlText = await response.text()
  const finalUrl = response.url
  const origin = new URL(finalUrl).origin
  const hostname = new URL(finalUrl).hostname
  const isHttps = finalUrl.startsWith("https://")

  const html = analyzeHtml(htmlText, finalUrl, isHttps)

  const [
    hasRobotsTxt,
    hasSitemap,
    hasManifest,
    hasSecurityTxt,
    ssl,
    dns,
    internalProbe,
    imageProbe,
  ] = await Promise.all([
    fetchExists(`${origin}/robots.txt`),
    fetchExists(`${origin}/sitemap.xml`),
    fetchExists(`${origin}/manifest.json`),
    fetchExists(`${origin}/.well-known/security.txt`),
    isHttps ? checkSslCertificate(hostname) : Promise.resolve({}),
    lookupDns(hostname),
    probeUrls(html.internalLinks, 5),
    probeUrls(html.imageUrls, 5),
  ])

  const brokenInternalLinks = internalProbe.filter((item) => !item.ok).length
  const brokenImages = imageProbe.filter((item) => !item.ok).length

  const [fonts, browserCapture] = await Promise.all([
    detectFonts(htmlText, finalUrl),
    captureBrowserInsights(finalUrl),
  ])

  const baseChecks = buildChecks({
    responseOk: response.ok,
    statusCode: response.status,
    responseTimeMs,
    finalUrl,
    isHttps,
    contentEncoding: response.headers.get("content-encoding") ?? undefined,
    cacheControl: response.headers.get("cache-control") ?? undefined,
    headers: response.headers,
    html,
    hasRobotsTxt,
    hasSitemap,
    hasManifest,
    hasSecurityTxt,
    redirectChain,
    ssl,
    dns,
    brokenInternalLinks,
    brokenImages,
    probedInternal: internalProbe.length,
    probedImages: imageProbe.length,
  })

  const checks = formatChecksForDisplay([
    ...baseChecks,
    ...buildResponsiveChecks(browserCapture.responsive),
  ])

  const scores: ScanScores = {
    performance: scoreCategory(checks, "performance", responseTimeMs, response.ok),
    seo: scoreCategory(checks, "seo", responseTimeMs, response.ok),
    security: scoreCategory(checks, "security", responseTimeMs, response.ok),
    accessibility: scoreCategory(checks, "accessibility", responseTimeMs, response.ok),
    privacy: scoreCategory(checks, "privacy", responseTimeMs, response.ok),
    content: scoreCategory(checks, "content", responseTimeMs, response.ok),
    infrastructure: scoreCategory(checks, "infrastructure", responseTimeMs, response.ok),
    mobile: scoreCategory(checks, "mobile", responseTimeMs, response.ok),
    overall: 0,
  }

  scores.overall = clampScore(
    averageScores([
      scores.performance,
      scores.seo,
      scores.security,
      scores.accessibility,
      scores.privacy,
      scores.content,
      scores.infrastructure,
      scores.mobile,
    ])
  )

  return {
    url: finalUrl,
    domain: hostname,
    scannedAt: new Date().toISOString(),
    responseTimeMs,
    statusCode: response.status,
    scores,
    checks,
    techStack: detectTechStack(htmlText, response.headers),
    fonts,
    analytics: detectAnalytics(htmlText),
    screenshots: browserCapture.screenshots,
    meta: {
      title: html.title,
      description: html.description,
      h1Count: html.h1Count,
      imageCount: html.imageCount,
      imagesMissingAlt: html.imagesMissingAlt,
      linkCount: html.linkCount,
      scriptCount: html.scriptCount,
      stylesheetCount: html.stylesheetCount,
      htmlSizeKb: html.htmlSizeKb,
      wordCount: html.wordCount,
      thirdPartyHosts: html.thirdPartyHosts.length,
      hasViewport: html.hasViewport,
      hasCanonical: html.hasCanonical,
      hasFavicon: html.hasFavicon,
      hasOpenGraph: html.hasOpenGraph,
      hasStructuredData: html.hasStructuredData,
      hasRobotsTxt,
      htmlLang: html.htmlLang,
      contentEncoding: response.headers.get("content-encoding") ?? undefined,
    },
  }
}
