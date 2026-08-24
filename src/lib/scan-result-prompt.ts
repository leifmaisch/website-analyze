import {
  checkCategoryLabels,
  getCheckCategory,
  totalCheckCount,
  type CheckCategory,
} from "@/lib/scan-categories"
import { analyticsKindLabels } from "@/lib/scan-analytics"
import { fontSourceLabels } from "@/lib/scan-detect"
import type { ScanCheck, ScanResult } from "@/lib/scan-types"

const categoryOrder: CheckCategory[] = [
  "performance",
  "seo",
  "security",
  "accessibility",
  "privacy",
  "content",
  "infrastructure",
  "mobile",
]

function statusLabel(status: ScanCheck["status"]) {
  if (status === "pass") return "PASS"
  if (status === "warn") return "WARN"
  return "FAIL"
}

function groupChecksByCategory(checks: ScanCheck[]) {
  const groups: Record<CheckCategory, ScanCheck[]> = {
    performance: [],
    seo: [],
    security: [],
    accessibility: [],
    privacy: [],
    content: [],
    infrastructure: [],
    mobile: [],
  }

  for (const check of checks) {
    groups[getCheckCategory(check.id)].push(check)
  }

  return groups
}

export function formatScanResultForLlm(result: ScanResult): string {
  const checkGroups = groupChecksByCategory(result.checks)
  const passCount = result.checks.filter((c) => c.status === "pass").length
  const warnCount = result.checks.filter((c) => c.status === "warn").length
  const failCount = result.checks.filter((c) => c.status === "fail").length
  const scannedAt = new Date(result.scannedAt).toISOString()

  const lines: string[] = [
    "# Website audit report",
    "",
    "Review this automated website scan and suggest prioritized fixes with clear implementation steps.",
    "",
    "## Scan target",
    `- URL: ${result.url}`,
    `- Domain: ${result.domain}`,
    `- Scanned at: ${scannedAt}`,
    `- Response time: ${result.responseTimeMs}ms`,
    `- HTTP status: ${result.statusCode}`,
    "",
    "## Scores (0-100)",
    `- Overall: ${result.scores.overall}`,
    ...categoryOrder.map(
      (category) =>
        `- ${checkCategoryLabels[category]}: ${result.scores[category]}`
    ),
    "",
    "## Check summary",
    `- Total checks: ${totalCheckCount}`,
    `- Passed: ${passCount}`,
    `- Warnings: ${warnCount}`,
    `- Failed: ${failCount}`,
    "",
    "## Page meta",
    `- Title: ${result.meta.title ?? "Not found"}`,
    `- Description: ${result.meta.description ?? "Not found"}`,
    `- Language: ${result.meta.htmlLang ?? "Not set"}`,
    `- HTML size: ${result.meta.htmlSizeKb}KB`,
    `- Word count: ${result.meta.wordCount}`,
    `- Scripts / stylesheets: ${result.meta.scriptCount} / ${result.meta.stylesheetCount}`,
    `- Images / links: ${result.meta.imageCount} / ${result.meta.linkCount}`,
    `- Third-party hosts: ${result.meta.thirdPartyHosts}`,
    `- Open Graph: ${result.meta.hasOpenGraph ? "yes" : "no"}`,
    `- Structured data: ${result.meta.hasStructuredData ? "yes" : "no"}`,
    "",
    "## Checks by category",
  ]

  for (const category of categoryOrder) {
    const checks = checkGroups[category]
    if (checks.length === 0) continue

    lines.push("", `### ${checkCategoryLabels[category]} (score ${result.scores[category]})`)

    for (const check of checks) {
      const detail = check.detail ? ` — ${check.detail}` : ""
      lines.push(`- [${statusLabel(check.status)}] ${check.label}${detail}`)
    }
  }

  lines.push("", "## Tech stack")

  if (result.techStack.length > 0) {
    for (const item of result.techStack) {
      lines.push(`- ${item.name}`)
    }
  } else {
    lines.push("- None detected")
  }

  lines.push("", "## Analytics and tracking")

  if (result.analytics.length > 0) {
    for (const item of result.analytics) {
      const kind = analyticsKindLabels[item.kind]
      const ids = item.ids?.length ? ` (${item.ids.join(", ")})` : ""
      lines.push(`- ${item.name} [${kind}]${ids}`)
    }
  } else {
    lines.push("- None detected")
  }

  lines.push("", "## Fonts")

  if (result.fonts.length > 0) {
    for (const font of result.fonts) {
      lines.push(`- ${font.name} (${fontSourceLabels[font.source]})`)
    }
  } else {
    lines.push("- System defaults or none detected")
  }

  lines.push(
    "",
    "## Request",
    "Prioritize the most impactful fixes, list quick wins, and note any critical security or SEO risks."
  )

  return lines.join("\n")
}
