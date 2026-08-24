export type CheckCategory =
  | "performance"
  | "seo"
  | "security"
  | "accessibility"
  | "privacy"
  | "content"
  | "infrastructure"
  | "mobile"

export const checkCategoryLabels: Record<CheckCategory, string> = {
  performance: "Performance",
  seo: "SEO",
  security: "Security",
  accessibility: "Accessibility",
  privacy: "Privacy",
  content: "Content",
  infrastructure: "Infrastructure",
  mobile: "Mobile",
}

export const performanceCheckIds = [
  "reachable",
  "response-time",
  "compression",
  "page-size",
  "cache-policy",
  "render-blocking",
  "resource-count",
  "lazy-images",
  "modern-image-formats",
  "preconnect-hints",
]

export const seoCheckIds = [
  "title",
  "title-length",
  "description",
  "description-length",
  "h1",
  "viewport",
  "canonical",
  "image-alt",
  "html-lang",
  "favicon",
  "robots-meta",
  "open-graph",
  "structured-data",
  "robots-txt",
  "sitemap",
  "hreflang",
  "twitter-cards",
  "heading-hierarchy",
  "thin-content",
  "internal-links",
]

export const securityCheckIds = [
  "https",
  "hsts",
  "csp",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "server-disclosure",
  "ssl-expiry",
  "mixed-content",
  "cookie-flags",
  "sri-scripts",
  "security-txt",
]

export const accessibilityCheckIds = [
  "skip-link",
  "aria-landmarks",
  "form-labels",
  "interactive-names",
]

export const privacyCheckIds = [
  "third-party-domains",
  "privacy-policy-link",
  "cookie-banner",
]

export const contentCheckIds = [
  "readability",
  "broken-images",
  "outdated-copyright",
  "placeholder-text",
]

export const infrastructureCheckIds = [
  "dns-records",
  "ipv6-support",
  "mx-records",
  "redirect-chain",
  "www-consistency",
]

export const mobileCheckIds = [
  "apple-touch-icon",
  "web-manifest",
  "theme-color",
]

const categoryMap = new Map<string, CheckCategory>()

for (const id of performanceCheckIds) categoryMap.set(id, "performance")
for (const id of seoCheckIds) categoryMap.set(id, "seo")
for (const id of securityCheckIds) categoryMap.set(id, "security")
for (const id of accessibilityCheckIds) categoryMap.set(id, "accessibility")
for (const id of privacyCheckIds) categoryMap.set(id, "privacy")
for (const id of contentCheckIds) categoryMap.set(id, "content")
for (const id of infrastructureCheckIds) categoryMap.set(id, "infrastructure")
for (const id of mobileCheckIds) categoryMap.set(id, "mobile")

export function getCheckCategory(id: string): CheckCategory {
  return categoryMap.get(id) ?? "seo"
}

export const scoreCategoryIds: Record<CheckCategory, string[]> = {
  performance: performanceCheckIds,
  seo: seoCheckIds,
  security: securityCheckIds,
  accessibility: accessibilityCheckIds,
  privacy: privacyCheckIds,
  content: contentCheckIds,
  infrastructure: infrastructureCheckIds,
  mobile: mobileCheckIds,
}

export const totalCheckCount = Object.values(scoreCategoryIds).reduce(
  (total, ids) => total + ids.length,
  0
)
