import type { ScanCheck } from "@/lib/scan-types"
import type { DnsInfo, RedirectHop, SslInfo } from "@/lib/scan-infra"

export type HtmlAnalysis = {
  title?: string
  description?: string
  h1Count: number
  imageCount: number
  imagesMissingAlt: number
  imagesWithoutLazy: number
  modernImageCount: number
  linkCount: number
  scriptCount: number
  stylesheetCount: number
  renderBlockingScripts: number
  htmlSizeKb: number
  hasViewport: boolean
  hasCanonical: boolean
  hasFavicon: boolean
  hasOpenGraph: boolean
  hasStructuredData: boolean
  blocksIndexing: boolean
  htmlLang?: string
  titleLength: number
  descriptionLength: number
  hreflangCount: number
  hasTwitterCards: boolean
  headingHierarchyValid: boolean
  headingIssues: string[]
  wordCount: number
  hasSkipLink: boolean
  hasMainLandmark: boolean
  hasNavLandmark: boolean
  unlabeledInputs: number
  unnamedInteractives: number
  mixedContentUrls: string[]
  externalScriptCount: number
  scriptsWithoutSri: number
  preconnectCount: number
  dnsPrefetchCount: number
  thirdPartyHosts: string[]
  hasPrivacyPolicyLink: boolean
  hasCookieBannerSignals: boolean
  hasPlaceholderText: boolean
  copyrightYear?: number
  hasAppleTouchIcon: boolean
  hasThemeColor: boolean
  hasManifestLink: boolean
  internalLinks: string[]
  imageUrls: string[]
  insecureAssetCount: number
}

type BuildChecksInput = {
  responseOk: boolean
  statusCode: number
  responseTimeMs: number
  finalUrl: string
  isHttps: boolean
  contentEncoding?: string
  cacheControl?: string
  headers: Headers
  html: HtmlAnalysis
  hasRobotsTxt: boolean
  hasSitemap: boolean
  hasManifest: boolean
  hasSecurityTxt: boolean
  redirectChain: RedirectHop[]
  ssl: SslInfo
  dns: DnsInfo
  brokenInternalLinks: number
  brokenImages: number
  probedInternal: number
  probedImages: number
}

function getTagContent(html: string, tag: string): string | undefined {
  const match = html.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")
  )
  return match?.[1]?.replace(/\s+/g, " ").trim()
}

function getMetaContent(html: string, name: string): string | undefined {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`,
      "i"
    ),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return match[1].trim()
  }

  return undefined
}

function countMatches(html: string, pattern: RegExp): number {
  return [...html.matchAll(pattern)].length
}

function extractUrls(html: string, pattern: RegExp): string[] {
  return [...html.matchAll(pattern)]
    .map((match) => match[1])
    .filter((value): value is string => Boolean(value))
}

function getHtmlLang(html: string): string | undefined {
  return html.match(/<html[^>]*\blang=["']([^"']+)["']/i)?.[1]?.trim()
}

function hasLinkRel(html: string, rel: string): boolean {
  return new RegExp(
    `<link[^>]+rel=["'][^"']*\\b${rel}\\b[^"']*["']`,
    "i"
  ).test(html)
}

function analyzeHeadingHierarchy(html: string): {
  valid: boolean
  issues: string[]
} {
  const levels = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) =>
    Number(match[1])
  )

  if (levels.length === 0) {
    return { valid: false, issues: ["No headings found"] }
  }

  const issues: string[] = []
  if (levels[0] !== 1) {
    issues.push("First heading is not H1")
  }

  for (let index = 1; index < levels.length; index++) {
    const jump = levels[index]! - levels[index - 1]!
    if (jump > 1) {
      issues.push(`Skipped heading level H${levels[index - 1]} to H${levels[index]}`)
    }
  }

  return { valid: issues.length === 0, issues }
}

function countWords(html: string): number {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  return text ? text.split(" ").length : 0
}

function extractCopyrightYear(html: string): number | undefined {
  const match = html.match(/©\s*(20\d{2})|copyright\s*(20\d{2})/i)
  return match ? Number(match[1] ?? match[2]) : undefined
}

function getHostname(url: string): string | undefined {
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}

export function analyzeHtml(html: string, pageUrl: string, isHttps: boolean): HtmlAnalysis {
  const pageHost = getHostname(pageUrl) ?? ""
  const title = getTagContent(html, "title")
  const description =
    getMetaContent(html, "description") ??
    getMetaContent(html, "og:description")

  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0] ?? "")
  const imagesMissingAlt = imageTags.filter(
    (tag) => !/\balt=/.test(tag) || /\balt=["']\s*["']/.test(tag)
  ).length
  const imagesWithoutLazy = imageTags.filter((tag) => !/\bloading=["']lazy["']/.test(tag)).length
  const modernImageCount = imageTags.filter((tag) =>
    /\bsrc=["'][^"']*\.(webp|avif)(\?|["'])/i.test(tag)
  ).length

  const scriptTags = [...html.matchAll(/<script\b[^>]*>/gi)].map((match) => match[0] ?? "")
  const externalScripts = scriptTags.filter((tag) => /\bsrc=["']https?:\/\//i.test(tag))
  const scriptsWithoutSri = externalScripts.filter((tag) => !/\bintegrity=/.test(tag)).length

  const hrefs = extractUrls(html, /\bhref=["']([^"']+)["']/gi)
  const srcs = extractUrls(html, /\bsrc=["']([^"']+)["']/gi)
  const mixedContentUrls = [...hrefs, ...srcs].filter((url) =>
    url.startsWith("http://")
  )

  const internalLinks = hrefs
    .map((href) => {
      try {
        return new URL(href, pageUrl).toString()
      } catch {
        return null
      }
    })
    .filter((href): href is string => {
      if (!href) return false
      const host = getHostname(href)
      return host === pageHost
    })

  const thirdPartyHosts = [...new Set(
    [...hrefs, ...srcs]
      .map((url) => {
        try {
          return new URL(url, pageUrl).hostname
        } catch {
          return null
        }
      })
      .filter((host): host is string => Boolean(host && host !== pageHost))
  )]

  const heading = analyzeHeadingHierarchy(html)
  const wordCount = countWords(html)
  const copyrightYear = extractCopyrightYear(html)

  return {
    title,
    description,
    h1Count: countMatches(html, /<h1\b[^>]*>/gi),
    imageCount: imageTags.length,
    imagesMissingAlt,
    imagesWithoutLazy,
    modernImageCount,
    linkCount: countMatches(html, /<a\b[^>]*href=/gi),
    scriptCount: scriptTags.length,
    stylesheetCount: countMatches(html, /<link\b[^>]*rel=["']stylesheet["']/gi),
    renderBlockingScripts: scriptTags.filter(
      (tag) => !/\b(?:async|defer)\b/.test(tag) && /\bsrc=/.test(tag)
    ).length,
    htmlSizeKb: Math.round((new TextEncoder().encode(html).length / 1024) * 10) / 10,
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasCanonical: /<link[^>]+rel=["']canonical["']/i.test(html),
    hasFavicon: hasLinkRel(html, "icon") || hasLinkRel(html, "shortcut icon"),
    hasOpenGraph: Boolean(
      getMetaContent(html, "og:title") && getMetaContent(html, "og:image")
    ),
    hasStructuredData: /<script[^>]+type=["']application\/ld\+json["']/i.test(html),
    blocksIndexing: /noindex/i.test(getMetaContent(html, "robots") ?? ""),
    htmlLang: getHtmlLang(html),
    titleLength: title?.length ?? 0,
    descriptionLength: description?.length ?? 0,
    hreflangCount: countMatches(html, /<link[^>]+rel=["']alternate["'][^>]+hreflang=/gi),
    hasTwitterCards: Boolean(
      getMetaContent(html, "twitter:card") || getMetaContent(html, "twitter:title")
    ),
    headingHierarchyValid: heading.valid,
    headingIssues: heading.issues,
    wordCount,
    hasSkipLink: /<a[^>]+href=["']#(?:main|content|skip)/i.test(html),
    hasMainLandmark: /<main\b/i.test(html) || /role=["']main["']/i.test(html),
    hasNavLandmark: /<nav\b/i.test(html) || /role=["']navigation["']/i.test(html),
    unlabeledInputs: countMatches(
      html,
      /<input\b(?![^>]*\b(?:id=|aria-label=|aria-labelledby=))[^>]*>/gi
    ),
    unnamedInteractives: countMatches(
      html,
      /<(?:button|a)\b(?![^>]*\b(?:aria-label=|aria-labelledby=))[^>]*>\s*<\/(?:button|a)>/gi
    ),
    mixedContentUrls,
    externalScriptCount: externalScripts.length,
    scriptsWithoutSri,
    preconnectCount: countMatches(html, /<link[^>]+rel=["']preconnect["']/gi),
    dnsPrefetchCount: countMatches(html, /<link[^>]+rel=["']dns-prefetch["']/gi),
    thirdPartyHosts,
    hasPrivacyPolicyLink: /privacy/i.test(html),
    hasCookieBannerSignals: /cookie|gdpr|consent/i.test(html),
    hasPlaceholderText: /lorem ipsum|placeholder content|coming soon/i.test(html),
    copyrightYear,
    hasAppleTouchIcon: hasLinkRel(html, "apple-touch-icon"),
    hasThemeColor: /<meta[^>]+name=["']theme-color["']/i.test(html),
    hasManifestLink: hasLinkRel(html, "manifest"),
    internalLinks,
    imageUrls: srcs
      .map((src) => {
        try {
          return new URL(src, pageUrl).toString()
        } catch {
          return null
        }
      })
      .filter((src): src is string => Boolean(src && /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(src))),
    insecureAssetCount: isHttps ? mixedContentUrls.length : 0,
  }
}

export function buildChecks(input: BuildChecksInput): ScanCheck[] {
  const {
    responseOk,
    statusCode,
    responseTimeMs,
    finalUrl,
    isHttps,
    contentEncoding,
    cacheControl,
    headers,
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
    probedInternal,
    probedImages,
  } = input

  const hasCompression = Boolean(
    contentEncoding && /(gzip|br|deflate)/i.test(contentEncoding)
  )

  const setCookies = headers.getSetCookie?.() ?? []
  const cookieFlagsSecure = setCookies.every((cookie) => /;\s*secure/i.test(cookie))
  const cookieFlagsHttpOnly = setCookies.every((cookie) => /;\s*httponly/i.test(cookie))
  const cookieFlagsSameSite = setCookies.every((cookie) => /;\s*samesite=/i.test(cookie))

  const finalHost = getHostname(finalUrl) ?? ""
  const apexHost = finalHost.replace(/^www\./, "")
  const wwwHost = `www.${apexHost}`
  const hasWwwDns = dns.a.some((ip) => ip) && dns.a.length > 0

  const currentYear = new Date().getFullYear()

  return [
    {
      id: "reachable",
      label: "Site is reachable",
      status: responseOk ? "pass" : statusCode < 500 ? "warn" : "fail",
      detail: `HTTP ${statusCode}`,
    },
    {
      id: "response-time",
      label: "Response time under 2s",
      status: responseTimeMs < 2000 ? "pass" : responseTimeMs < 4000 ? "warn" : "fail",
      detail: `${responseTimeMs}ms`,
    },
    {
      id: "compression",
      label: "Response compression enabled",
      status: hasCompression ? "pass" : "warn",
      detail: hasCompression
        ? `Encoded with ${contentEncoding}`
        : "Enable gzip or Brotli compression",
    },
    {
      id: "page-size",
      label: "HTML document size under 500KB",
      status: html.htmlSizeKb < 200 ? "pass" : html.htmlSizeKb < 500 ? "warn" : "fail",
      detail: `${html.htmlSizeKb}KB transferred`,
    },
    {
      id: "cache-policy",
      label: "Cache-Control header present",
      status: cacheControl ? "pass" : "warn",
      detail: cacheControl?.slice(0, 80) ?? "Add caching headers for static assets",
    },
    {
      id: "render-blocking",
      label: "Minimal render-blocking scripts",
      status:
        html.renderBlockingScripts === 0
          ? "pass"
          : html.renderBlockingScripts <= 3
            ? "warn"
            : "fail",
      detail: `${html.renderBlockingScripts} blocking external scripts`,
    },
    {
      id: "resource-count",
      label: "Reasonable number of page resources",
      status:
        html.scriptCount + html.stylesheetCount < 25
          ? "pass"
          : html.scriptCount + html.stylesheetCount < 45
            ? "warn"
            : "fail",
      detail: `${html.scriptCount} scripts, ${html.stylesheetCount} stylesheets, ${html.imageCount} images`,
    },
    {
      id: "lazy-images",
      label: "Below-fold images use lazy loading",
      status:
        html.imageCount === 0
          ? "pass"
          : html.imagesWithoutLazy <= Math.ceil(html.imageCount / 2)
            ? "pass"
            : "warn",
      detail:
        html.imageCount === 0
          ? "No images detected"
          : `${html.imageCount - html.imagesWithoutLazy} of ${html.imageCount} images use loading="lazy"`,
    },
    {
      id: "modern-image-formats",
      label: "Modern image formats in use",
      status:
        html.imageCount === 0
          ? "pass"
          : html.modernImageCount > 0
            ? "pass"
            : "info",
      detail:
        html.imageCount === 0
          ? "No images detected"
          : `${html.modernImageCount} images use WebP or AVIF`,
    },
    {
      id: "preconnect-hints",
      label: "Resource hints for critical origins",
      status:
        html.preconnectCount + html.dnsPrefetchCount > 0 ? "pass" : "info",
      detail: `${html.preconnectCount} preconnect, ${html.dnsPrefetchCount} dns-prefetch`,
    },
    {
      id: "https",
      label: "Served over HTTPS",
      status: isHttps ? "pass" : "fail",
      detail: isHttps ? "Secure connection" : "Site should use HTTPS",
    },
    {
      id: "ssl-expiry",
      label: "SSL certificate is valid",
      status:
        ssl.daysUntilExpiry === undefined
          ? "warn"
          : ssl.daysUntilExpiry > 30
            ? "pass"
            : ssl.daysUntilExpiry > 0
              ? "warn"
              : "fail",
      detail:
        ssl.daysUntilExpiry === undefined
          ? "Could not verify certificate"
          : ssl.daysUntilExpiry > 0
            ? `Expires in ${ssl.daysUntilExpiry} days`
            : "Certificate has expired",
    },
    {
      id: "mixed-content",
      label: "No mixed HTTP content on HTTPS pages",
      status:
        !isHttps
          ? "warn"
          : html.insecureAssetCount === 0
            ? "pass"
            : "fail",
      detail:
        !isHttps
          ? "Page is not served over HTTPS"
          : html.insecureAssetCount === 0
            ? "No insecure asset URLs found"
            : `${html.insecureAssetCount} HTTP asset references detected`,
    },
    {
      id: "hsts",
      label: "Strict-Transport-Security header",
      status: headers.has("strict-transport-security") ? "pass" : isHttps ? "warn" : "fail",
      detail: headers.has("strict-transport-security")
        ? "HSTS enabled"
        : "Enable HSTS for stronger HTTPS enforcement",
    },
    {
      id: "csp",
      label: "Content-Security-Policy header",
      status: headers.has("content-security-policy") ? "pass" : "warn",
      detail: headers.has("content-security-policy")
        ? "CSP header present"
        : "Add a CSP to reduce XSS risk",
    },
    {
      id: "x-frame-options",
      label: "X-Frame-Options header",
      status: headers.has("x-frame-options") ? "pass" : "warn",
      detail: headers.has("x-frame-options")
        ? "Clickjacking protection enabled"
        : "Add X-Frame-Options or frame-ancestors in CSP",
    },
    {
      id: "x-content-type-options",
      label: "X-Content-Type-Options header",
      status: headers.has("x-content-type-options") ? "pass" : "warn",
      detail: headers.has("x-content-type-options")
        ? "nosniff enabled"
        : "Set X-Content-Type-Options: nosniff",
    },
    {
      id: "referrer-policy",
      label: "Referrer-Policy header",
      status: headers.has("referrer-policy") ? "pass" : "warn",
      detail: headers.has("referrer-policy")
        ? "Referrer policy configured"
        : "Set Referrer-Policy to control leaked referrer data",
    },
    {
      id: "permissions-policy",
      label: "Permissions-Policy header",
      status:
        headers.has("permissions-policy") || headers.has("feature-policy")
          ? "pass"
          : "warn",
      detail:
        headers.has("permissions-policy") || headers.has("feature-policy")
          ? "Permissions policy configured"
          : "Restrict browser features with Permissions-Policy",
    },
    {
      id: "server-disclosure",
      label: "Server technology not exposed",
      status:
        headers.has("x-powered-by") || headers.has("server") ? "info" : "pass",
      detail:
        headers.has("x-powered-by") || headers.has("server")
          ? "Server or X-Powered-By header is visible"
          : "No obvious server fingerprint headers",
    },
    {
      id: "cookie-flags",
      label: "Secure cookie flags configured",
      status:
        setCookies.length === 0
          ? "pass"
          : cookieFlagsSecure && cookieFlagsHttpOnly && cookieFlagsSameSite
            ? "pass"
            : "warn",
      detail:
        setCookies.length === 0
          ? "No Set-Cookie headers on this response"
          : `Secure: ${cookieFlagsSecure ? "yes" : "no"}, HttpOnly: ${cookieFlagsHttpOnly ? "yes" : "no"}, SameSite: ${cookieFlagsSameSite ? "yes" : "no"}`,
    },
    {
      id: "sri-scripts",
      label: "Subresource Integrity on external scripts",
      status:
        html.externalScriptCount === 0
          ? "pass"
          : html.scriptsWithoutSri === 0
            ? "pass"
            : "warn",
      detail:
        html.externalScriptCount === 0
          ? "No external scripts detected"
          : `${html.externalScriptCount - html.scriptsWithoutSri} of ${html.externalScriptCount} external scripts use SRI`,
    },
    {
      id: "security-txt",
      label: "security.txt published",
      status: hasSecurityTxt ? "pass" : "warn",
      detail: hasSecurityTxt
        ? "security.txt responds successfully"
        : "Publish /.well-known/security.txt for responsible disclosure",
    },
    {
      id: "title",
      label: "Page title present",
      status: html.title ? "pass" : "fail",
      detail: html.title?.slice(0, 80) ?? "Add a descriptive title tag",
    },
    {
      id: "title-length",
      label: "Title length optimized for search",
      status:
        html.titleLength >= 30 && html.titleLength <= 60
          ? "pass"
          : html.titleLength > 0
            ? "warn"
            : "fail",
      detail: html.titleLength
        ? `${html.titleLength} characters (aim for 30 to 60)`
        : "No title to measure",
    },
    {
      id: "description",
      label: "Meta description present",
      status: html.description ? "pass" : "warn",
      detail:
        html.description?.slice(0, 100) ??
        "Add a meta description for search snippets",
    },
    {
      id: "description-length",
      label: "Meta description length optimized",
      status:
        html.descriptionLength >= 120 && html.descriptionLength <= 160
          ? "pass"
          : html.descriptionLength > 0
            ? "warn"
            : "fail",
      detail: html.descriptionLength
        ? `${html.descriptionLength} characters (aim for 120 to 160)`
        : "No description to measure",
    },
    {
      id: "h1",
      label: "Single primary heading",
      status: html.h1Count === 1 ? "pass" : html.h1Count === 0 ? "fail" : "warn",
      detail:
        html.h1Count === 1
          ? "One H1 found"
          : html.h1Count === 0
            ? "No H1 heading found"
            : `${html.h1Count} H1 headings found`,
    },
    {
      id: "viewport",
      label: "Mobile viewport configured",
      status: html.hasViewport ? "pass" : "fail",
      detail: html.hasViewport
        ? "Viewport meta tag found"
        : "Add a viewport meta tag",
    },
    {
      id: "canonical",
      label: "Canonical URL defined",
      status: html.hasCanonical ? "pass" : "warn",
      detail: html.hasCanonical
        ? "Canonical link found"
        : "Consider adding a canonical URL",
    },
    {
      id: "image-alt",
      label: "Images include alt text",
      status:
        html.imageCount === 0
          ? "pass"
          : html.imagesMissingAlt === 0
            ? "pass"
            : html.imagesMissingAlt <= 2
              ? "warn"
              : "fail",
      detail:
        html.imageCount === 0
          ? "No images detected"
          : `${html.imagesMissingAlt} of ${html.imageCount} images missing alt text`,
    },
    {
      id: "html-lang",
      label: "HTML language attribute set",
      status: html.htmlLang ? "pass" : "warn",
      detail: html.htmlLang
        ? `Language set to ${html.htmlLang}`
        : "Add lang attribute on the html element",
    },
    {
      id: "favicon",
      label: "Favicon configured",
      status: html.hasFavicon ? "pass" : "warn",
      detail: html.hasFavicon
        ? "Favicon link tag found"
        : "Add a favicon for browser tabs and bookmarks",
    },
    {
      id: "robots-meta",
      label: "Page is indexable",
      status: html.blocksIndexing ? "fail" : "pass",
      detail: html.blocksIndexing
        ? "robots meta tag blocks indexing"
        : "No noindex directive detected",
    },
    {
      id: "open-graph",
      label: "Open Graph tags for social sharing",
      status: html.hasOpenGraph ? "pass" : "warn",
      detail: html.hasOpenGraph
        ? "og:title and og:image found"
        : "Add Open Graph tags for richer link previews",
    },
    {
      id: "structured-data",
      label: "Structured data markup",
      status: html.hasStructuredData ? "pass" : "warn",
      detail: html.hasStructuredData
        ? "JSON-LD schema detected"
        : "Consider adding JSON-LD structured data",
    },
    {
      id: "robots-txt",
      label: "robots.txt file available",
      status: hasRobotsTxt ? "pass" : "warn",
      detail: hasRobotsTxt
        ? "robots.txt responds successfully"
        : "Publish a robots.txt at the site root",
    },
    {
      id: "sitemap",
      label: "XML sitemap available",
      status: hasSitemap ? "pass" : "warn",
      detail: hasSitemap
        ? "sitemap.xml responds successfully"
        : "Add a sitemap.xml to help crawlers discover pages",
    },
    {
      id: "hreflang",
      label: "hreflang tags for multilingual pages",
      status: html.hreflangCount > 0 ? "pass" : "info",
      detail:
        html.hreflangCount > 0
          ? `${html.hreflangCount} hreflang alternate links found`
          : "Add hreflang if the site serves multiple languages",
    },
    {
      id: "twitter-cards",
      label: "Twitter/X card tags present",
      status: html.hasTwitterCards ? "pass" : "warn",
      detail: html.hasTwitterCards
        ? "Twitter card metadata found"
        : "Add twitter:card and twitter:title tags",
    },
    {
      id: "heading-hierarchy",
      label: "Logical heading hierarchy",
      status: html.headingHierarchyValid ? "pass" : "warn",
      detail:
        html.headingIssues.length > 0
          ? html.headingIssues.join(", ")
          : "Heading levels progress logically",
    },
    {
      id: "thin-content",
      label: "Sufficient page content",
      status: html.wordCount >= 300 ? "pass" : html.wordCount >= 150 ? "warn" : "fail",
      detail: `${html.wordCount} words detected on page`,
    },
    {
      id: "internal-links",
      label: "Internal links respond successfully",
      status:
        probedInternal === 0
          ? "warn"
          : brokenInternalLinks === 0
            ? "pass"
            : brokenInternalLinks <= 1
              ? "warn"
              : "fail",
      detail:
        probedInternal === 0
          ? "No internal links sampled"
          : `${probedInternal - brokenInternalLinks} of ${probedInternal} sampled internal links responded OK`,
    },
    {
      id: "skip-link",
      label: "Skip to content link available",
      status: html.hasSkipLink ? "pass" : "warn",
      detail: html.hasSkipLink
        ? "Skip navigation link detected"
        : "Add a skip link for keyboard users",
    },
    {
      id: "aria-landmarks",
      label: "ARIA landmarks present",
      status: html.hasMainLandmark && html.hasNavLandmark ? "pass" : "warn",
      detail: `Main: ${html.hasMainLandmark ? "yes" : "no"}, Nav: ${html.hasNavLandmark ? "yes" : "no"}`,
    },
    {
      id: "form-labels",
      label: "Form inputs have labels",
      status: html.unlabeledInputs === 0 ? "pass" : "warn",
      detail:
        html.unlabeledInputs === 0
          ? "No unlabeled inputs detected"
          : `${html.unlabeledInputs} inputs may be missing labels`,
    },
    {
      id: "interactive-names",
      label: "Interactive elements have accessible names",
      status: html.unnamedInteractives === 0 ? "pass" : "warn",
      detail:
        html.unnamedInteractives === 0
          ? "No empty buttons or links detected"
          : `${html.unnamedInteractives} empty interactive elements found`,
    },
    {
      id: "third-party-domains",
      label: "Third-party domain exposure",
      status:
        html.thirdPartyHosts.length <= 8
          ? "pass"
          : html.thirdPartyHosts.length <= 15
            ? "warn"
            : "fail",
      detail: `${html.thirdPartyHosts.length} third-party hosts referenced`,
    },
    {
      id: "privacy-policy-link",
      label: "Privacy policy link detected",
      status: html.hasPrivacyPolicyLink ? "pass" : "warn",
      detail: html.hasPrivacyPolicyLink
        ? "Privacy-related link found in page content"
        : "Add a visible privacy policy link",
    },
    {
      id: "cookie-banner",
      label: "Cookie consent signals present",
      status: html.hasCookieBannerSignals ? "pass" : "warn",
      detail: html.hasCookieBannerSignals
        ? "Cookie or consent language detected"
        : "Consider a cookie consent banner if tracking is used",
    },
    {
      id: "readability",
      label: "Readable content length",
      status: html.wordCount >= 200 ? "pass" : html.wordCount >= 80 ? "warn" : "fail",
      detail: `${html.wordCount} words available for readability`,
    },
    {
      id: "broken-images",
      label: "Sampled images load successfully",
      status:
        probedImages === 0
          ? "info"
          : brokenImages === 0
            ? "pass"
            : "fail",
      detail:
        probedImages === 0
          ? "No image URLs sampled"
          : `${probedImages - brokenImages} of ${probedImages} sampled images responded OK`,
    },
    {
      id: "outdated-copyright",
      label: "Copyright year is current",
      status:
        !html.copyrightYear
          ? "warn"
          : html.copyrightYear >= currentYear - 1
            ? "pass"
            : "warn",
      detail: html.copyrightYear
        ? `Copyright year ${html.copyrightYear} detected`
        : "No copyright year found in page content",
    },
    {
      id: "placeholder-text",
      label: "No placeholder filler content",
      status: html.hasPlaceholderText ? "warn" : "pass",
      detail: html.hasPlaceholderText
        ? "Placeholder or lorem ipsum text detected"
        : "No obvious placeholder copy found",
    },
    {
      id: "dns-records",
      label: "DNS A records resolve",
      status: dns.a.length > 0 ? "pass" : "fail",
      detail: dns.a.length > 0 ? `${dns.a.length} A records found` : "No A records found",
    },
    {
      id: "ipv6-support",
      label: "IPv6 AAAA records available",
      status: dns.aaaa.length > 0 ? "pass" : "warn",
      detail:
        dns.aaaa.length > 0
          ? `${dns.aaaa.length} AAAA records found`
          : "No IPv6 DNS records detected",
    },
    {
      id: "mx-records",
      label: "MX records configured for email",
      status: dns.mx.length > 0 ? "pass" : "info",
      detail:
        dns.mx.length > 0
          ? `${dns.mx.length} MX records found`
          : "No MX records found for this domain",
    },
    {
      id: "redirect-chain",
      label: "Short redirect chain",
      status:
        redirectChain.length <= 2
          ? "pass"
          : redirectChain.length <= 4
            ? "warn"
            : "fail",
      detail:
        redirectChain.length <= 1
          ? "No redirects before final URL"
          : `${redirectChain.length - 1} redirect${redirectChain.length === 2 ? "" : "s"} before final URL`,
    },
    {
      id: "www-consistency",
      label: "WWW DNS configuration",
      status: hasWwwDns ? "pass" : "warn",
      detail: hasWwwDns
        ? `A records resolve for ${apexHost}`
        : "Could not verify apex DNS records",
    },
    {
      id: "apple-touch-icon",
      label: "Apple touch icon configured",
      status: html.hasAppleTouchIcon ? "pass" : "warn",
      detail: html.hasAppleTouchIcon
        ? "apple-touch-icon link found"
        : "Add an apple-touch-icon for iOS home screens",
    },
    {
      id: "web-manifest",
      label: "Web app manifest available",
      status: hasManifest || html.hasManifestLink ? "pass" : "warn",
      detail:
        hasManifest || html.hasManifestLink
          ? "Manifest link or manifest.json found"
          : "Add a manifest for installable PWA support",
    },
    {
      id: "theme-color",
      label: "Theme color defined",
      status: html.hasThemeColor ? "pass" : "warn",
      detail: html.hasThemeColor
        ? "theme-color meta tag found"
        : "Add a theme-color meta tag for mobile browsers",
    },
  ]
}
