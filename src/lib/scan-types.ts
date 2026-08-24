import type { AnalyticsItem } from "@/lib/scan-analytics"
import type { ScanScreenshot } from "@/lib/scan-browser"
import type { FontItem, TechItem } from "@/lib/scan-detect"
import type { CheckCategory } from "@/lib/scan-categories"

export type { CheckCategory } from "@/lib/scan-categories"

export type CheckStatus = "pass" | "warn" | "fail"

export type ScanCheck = {
  id: string
  label: string
  status: CheckStatus
  detail?: string
}

export type ScanScores = {
  performance: number
  seo: number
  security: number
  accessibility: number
  privacy: number
  content: number
  infrastructure: number
  mobile: number
  overall: number
}

export type ScanMeta = {
  title?: string
  description?: string
  h1Count: number
  imageCount: number
  imagesMissingAlt: number
  linkCount: number
  scriptCount: number
  stylesheetCount: number
  htmlSizeKb: number
  wordCount: number
  thirdPartyHosts: number
  hasViewport: boolean
  hasCanonical: boolean
  hasFavicon: boolean
  hasOpenGraph: boolean
  hasStructuredData: boolean
  hasRobotsTxt: boolean
  htmlLang?: string
  contentEncoding?: string
}

export type ScanResult = {
  url: string
  domain: string
  scannedAt: string
  responseTimeMs: number
  statusCode: number
  scores: ScanScores
  checks: ScanCheck[]
  meta: ScanMeta
  techStack: TechItem[]
  fonts: FontItem[]
  analytics: AnalyticsItem[]
  screenshots: ScanScreenshot[]
  shareId?: string
}
