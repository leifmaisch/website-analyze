import { totalCheckCount } from "@/lib/scan-categories"

export const apiScanPath = "/api/scan"

export function getApiScanUrl(baseUrl: string) {
  return new URL(apiScanPath, baseUrl).href
}

export const apiDocsDescription = `Run ${totalCheckCount} automated website checks programmatically. Get scores, audit checks, tech stack detection, screenshots, and a shareable report link.`

export const exampleRequestBody = {
  domain: "example.com",
} as const

export const exampleSuccessResponse = {
  url: "https://example.com/",
  domain: "example.com",
  scannedAt: "2026-09-12T18:30:00.000Z",
  responseTimeMs: 842,
  statusCode: 200,
  shareId: "V1StGXR8_Z5j",
  scores: {
    performance: 88,
    seo: 72,
    security: 91,
    accessibility: 65,
    privacy: 78,
    content: 84,
    infrastructure: 90,
    mobile: 76,
    overall: 80,
  },
  checks: [
    {
      id: "reachable",
      label: "Website reachable",
      status: "pass",
      detail: "Responded with HTTP 200 in 842ms",
    },
    {
      id: "viewport",
      label: "Mobile viewport",
      status: "warn",
      detail: "Missing viewport meta tag",
    },
  ],
  meta: {
    title: "Example Domain",
    description: "Example site used for documentation",
    h1Count: 1,
    imageCount: 0,
    imagesMissingAlt: 0,
    linkCount: 1,
    scriptCount: 0,
    stylesheetCount: 1,
    htmlSizeKb: 1.2,
    wordCount: 28,
    thirdPartyHosts: 0,
    hasViewport: false,
    hasCanonical: false,
    hasFavicon: true,
    hasOpenGraph: false,
    hasStructuredData: false,
    hasRobotsTxt: true,
    htmlLang: "en",
    contentEncoding: "gzip",
  },
  techStack: [
    {
      name: "Next.js",
      category: "framework",
      evidence: "x-powered-by header",
    },
  ],
  fonts: [
    {
      name: "Inter",
      source: "google-fonts",
    },
  ],
  analytics: [
    {
      name: "Plausible",
      kind: "web-analytics",
      evidence: "plausible.io/js/script.js",
    },
  ],
  screenshots: [
    {
      viewport: "desktop",
      width: 1280,
      height: 720,
      label: "Desktop",
      image: "data:image/png;base64,...",
    },
    {
      viewport: "mobile",
      width: 390,
      height: 844,
      label: "Mobile",
      image: "data:image/png;base64,...",
    },
  ],
} as const

export const exampleErrorResponses = [
  {
    status: 400,
    body: { error: "Enter a domain to scan" },
    when: "The request body is missing domain or it is blank.",
  },
  {
    status: 400,
    body: { error: "Enter a valid domain or URL" },
    when: "The domain cannot be parsed as a public HTTP or HTTPS URL.",
  },
  {
    status: 400,
    body: { error: "This domain cannot be scanned" },
    when: "The target is blocked (localhost, private IP ranges, etc.).",
  },
  {
    status: 503,
    body: { error: "DATABASE_URL is not set" },
    when: "The server cannot persist scan results.",
  },
] as const

export function buildCurlExample(apiUrl: string) {
  return `curl -X POST "${apiUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(exampleRequestBody)}'`
}

export function buildFetchExample(apiUrl: string) {
  return `const response = await fetch("${apiUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ domain: "example.com" }),
})

if (!response.ok) {
  const error = await response.json()
  throw new Error(error.error ?? "Scan failed")
}

const result = await response.json()
console.log(result.scores.overall, result.shareId)`
}

export function buildPythonExample(apiUrl: string) {
  return `import requests

response = requests.post(
    "${apiUrl}",
    json={"domain": "example.com"},
    timeout=120,
)
response.raise_for_status()

result = response.json()
print(result["scores"]["overall"], result["shareId"])`
}

export const responseFieldDocs = [
  { field: "url", type: "string", description: "Final URL after redirects." },
  { field: "domain", type: "string", description: "Hostname of the scanned site." },
  {
    field: "scannedAt",
    type: "string (ISO 8601)",
    description: "UTC timestamp when the scan finished.",
  },
  {
    field: "responseTimeMs",
    type: "number",
    description: "Time to fetch the homepage in milliseconds.",
  },
  { field: "statusCode", type: "number", description: "HTTP status of the homepage response." },
  {
    field: "shareId",
    type: "string",
    description: "Public ID for the saved report at /r/{shareId}.",
  },
  {
    field: "scores",
    type: "object",
    description: "Category scores from 0-100 plus overall.",
  },
  {
    field: "checks",
    type: "ScanCheck[]",
    description: `${totalCheckCount} automated checks with pass, warn, fail, or info status.`,
  },
  { field: "meta", type: "object", description: "Extracted page metadata and counts." },
  { field: "techStack", type: "TechItem[]", description: "Detected frameworks, CMS, CDN, and tools." },
  { field: "fonts", type: "FontItem[]", description: "Detected font families and sources." },
  { field: "analytics", type: "AnalyticsItem[]", description: "Detected analytics and marketing tags." },
  {
    field: "screenshots",
    type: "ScanScreenshot[]",
    description: "Desktop and mobile PNG screenshots as base64 data URLs.",
  },
] as const
