import type { ScanCheck } from "@/lib/scan-types"

const issueLabels: Record<string, string> = {
  reachable: "Site unreachable",
  "response-time": "Slow server response",
  compression: "Response not compressed",
  "page-size": "Large HTML document",
  "cache-policy": "No cache headers",
  "render-blocking": "Render-blocking scripts",
  "resource-count": "Heavy page resources",
  "lazy-images": "Images missing lazy loading",
  "modern-image-formats": "No modern image formats",
  "preconnect-hints": "Missing resource hints",
  https: "Not served over HTTPS",
  "ssl-expiry": "SSL certificate issue",
  "mixed-content": "Mixed HTTP content",
  hsts: "Missing HSTS header",
  csp: "Missing CSP header",
  "x-frame-options": "Missing X-Frame-Options",
  "x-content-type-options": "Missing X-Content-Type-Options",
  "referrer-policy": "Missing Referrer-Policy",
  "permissions-policy": "Missing Permissions-Policy",
  "server-disclosure": "Server technology exposed",
  "cookie-flags": "Insecure cookie configuration",
  "sri-scripts": "External scripts without SRI",
  "security-txt": "No security.txt",
  title: "Missing page title",
  "title-length": "Title length not optimized",
  description: "Missing meta description",
  "description-length": "Meta description length not optimized",
  h1: "Heading structure issue",
  viewport: "Missing viewport meta tag",
  canonical: "Missing canonical URL",
  "image-alt": "Images missing alt text",
  "html-lang": "Missing HTML lang attribute",
  favicon: "Missing favicon",
  "robots-meta": "Page blocked from indexing",
  "open-graph": "Missing Open Graph tags",
  "structured-data": "No structured data",
  "robots-txt": "Missing robots.txt",
  sitemap: "Missing XML sitemap",
  hreflang: "Missing hreflang tags",
  "twitter-cards": "Missing Twitter card tags",
  "heading-hierarchy": "Broken heading hierarchy",
  "thin-content": "Thin page content",
  "internal-links": "Broken internal links",
  "skip-link": "Missing skip link",
  "aria-landmarks": "Missing ARIA landmarks",
  "form-labels": "Form inputs missing labels",
  "interactive-names": "Interactive elements missing names",
  "third-party-domains": "High third-party exposure",
  "privacy-policy-link": "No privacy policy link",
  "cookie-banner": "No cookie consent signals",
  readability: "Low readable content",
  "broken-images": "Broken images detected",
  "outdated-copyright": "Outdated copyright year",
  "placeholder-text": "Placeholder content detected",
  "dns-records": "DNS not resolving",
  "ipv6-support": "No IPv6 DNS records",
  "mx-records": "No MX records",
  "redirect-chain": "Long redirect chain",
  "www-consistency": "WWW DNS misconfiguration",
  "apple-touch-icon": "Missing Apple touch icon",
  "web-manifest": "Missing web app manifest",
  "theme-color": "Missing theme color",
  "no-horizontal-scroll": "Horizontal scroll on mobile",
  "touch-target-size": "Small touch targets on mobile",
  "mobile-readable-text": "Small text on mobile",
  "responsive-images": "Images overflow mobile viewport",
}

const checkFixHints: Record<string, string> = {
  reachable:
    "Fix server or application errors until the site responds with HTTP 200. Check hosting status, DNS, SSL, and server logs.",
  "response-time":
    "Improve server response time with caching, a CDN, database query optimization, and faster hosting or compute.",
  "page-size":
    "Reduce HTML payload by removing unused markup, splitting large pages, and deferring non-critical content.",
  "render-blocking":
    "Defer or async-load non-critical scripts, inline critical CSS, and move scripts to the end of the body.",
  "resource-count":
    "Reduce scripts, stylesheets, and images by bundling assets, removing unused libraries, and lazy-loading media.",
  https:
    "Serve the site over HTTPS. Install a valid SSL certificate and redirect all HTTP traffic to HTTPS.",
  "ssl-expiry":
    "Renew the SSL certificate before it expires and configure automatic renewal with your certificate provider.",
  "mixed-content":
    "Update all asset URLs to HTTPS. Replace http:// links in HTML, CSS, and JavaScript with secure equivalents.",
  hsts:
    "Add a Strict-Transport-Security header on HTTPS responses to force browsers to use secure connections.",
  title: "Add a unique, descriptive <title> tag in the document head.",
  "title-length":
    "Write a page title between 30 and 60 characters that clearly describes the page content.",
  description:
    "Add a meta description tag that summarizes the page for search results.",
  "description-length":
    "Write a meta description between 120 and 160 characters with a clear summary and call to action.",
  h1: "Add exactly one H1 heading that describes the main topic of the page.",
  viewport:
    'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for proper mobile rendering.',
  "image-alt":
    'Add descriptive alt text to every meaningful image using the alt attribute.',
  "robots-meta":
    "Remove noindex or none directives from robots meta tags if this page should appear in search results.",
  "thin-content":
    "Expand the page with useful, original content. Aim for at least 300 words of meaningful copy.",
  "internal-links":
    "Fix or remove broken internal links and update URLs that return 404 or 5xx responses.",
  "third-party-domains":
    "Reduce third-party scripts and embeds. Remove unused trackers, widgets, and external dependencies.",
  readability:
    "Add more readable body copy with clear headings, short paragraphs, and at least 200 words of content.",
  "broken-images":
    "Fix image URLs that return errors. Verify paths, hosting, and CDN configuration for each broken asset.",
  "dns-records":
    "Configure valid A records for the domain at your DNS provider so the site resolves correctly.",
  "redirect-chain":
    "Reduce redirect hops by pointing links directly to the final URL and cleaning up legacy redirect rules.",
  "no-horizontal-scroll":
    "Fix mobile overflow by using responsive layouts, max-width: 100%, and avoiding fixed-width elements.",
  "touch-target-size":
    "Increase buttons and links to at least 44x44px on mobile with adequate padding and spacing.",
  "mobile-readable-text":
    "Use a base font size of at least 16px on mobile and avoid text smaller than 12px.",
  "responsive-images":
    "Make images responsive with max-width: 100%, width/height attributes, and appropriately sized sources.",
}

export function getCheckFixHint(check: ScanCheck): string | undefined {
  if (check.status !== "fail") {
    return undefined
  }

  return checkFixHints[check.id] ?? check.detail
}

export function formatCheckForDisplay(check: ScanCheck): ScanCheck {
  if (check.status === "pass") {
    return check
  }

  const label = issueLabels[check.id]
  if (!label) {
    return check
  }

  return { ...check, label }
}

export function isInformationalCheck(check: ScanCheck): boolean {
  return check.status === "info"
}

export function formatChecksForDisplay(checks: ScanCheck[]): ScanCheck[] {
  return checks.map(formatCheckForDisplay)
}
