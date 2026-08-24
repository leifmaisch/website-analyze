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

export function formatChecksForDisplay(checks: ScanCheck[]): ScanCheck[] {
  return checks.map(formatCheckForDisplay)
}
