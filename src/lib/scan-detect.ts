import {
  compositeTechRules,
  techRules,
  type TechRuleCategory,
} from "@/lib/scan-tech-rules"

export type TechCategory = TechRuleCategory

export type TechItem = {
  name: string
  category: TechCategory
  evidence?: string
}

export type FontSource =
  | "google-fonts"
  | "adobe-fonts"
  | "bunny-fonts"
  | "self-hosted"
  | "system"
  | "inline"
  | "cdn"

export type FontItem = {
  name: string
  source: FontSource
}

type HeaderMap = Record<string, string>

export const techCategoryOrder: TechCategory[] = [
  "framework",
  "ui",
  "css",
  "library",
  "cms",
  "platform",
  "analytics",
  "auth",
  "cdn",
  "hosting",
  "server",
  "other",
]

function uniqueBy<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>()
  const result: T[] = []

  for (const item of items) {
    const key = keyFn(item)
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }

  return result
}

function extractScriptSources(html: string): string {
  const sources: string[] = []
  const pattern = /<script[^>]+src=["']([^"']+)["']/gi

  for (const match of html.matchAll(pattern)) {
    if (match[1]) sources.push(match[1])
  }

  return sources.join("\n")
}

function extractStylesheetSources(html: string): string {
  const sources: string[] = []
  const pattern = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi

  for (const match of html.matchAll(pattern)) {
    if (match[1]) sources.push(match[1])
  }

  const altPattern = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi
  for (const match of html.matchAll(altPattern)) {
    if (match[1]) sources.push(match[1])
  }

  return sources.join("\n")
}

function extractInlineScripts(html: string): string {
  const blocks: string[] = []
  const pattern = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi

  for (const match of html.matchAll(pattern)) {
    if (match[1] && !match[0]?.includes("src=")) {
      blocks.push(match[1].slice(0, 50000))
    }
  }

  return blocks.join("\n")
}

function extractGenerator(html: string): string | undefined {
  const match = html.match(
    /<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i
  )
  return match?.[1]?.trim()
}

function getHeaderEvidence(
  headers: HeaderMap,
  rule: { key: string; pattern: RegExp }
): string | undefined {
  const value = headers[rule.key.toLowerCase()]
  if (!value || !rule.pattern.test(value)) return undefined
  return `${rule.key}: ${value.slice(0, 80)}`
}

function matchPatterns(
  patterns: RegExp[],
  sources: { label: string; text: string }[]
): string | undefined {
  for (const source of sources) {
    for (const pattern of patterns) {
      if (pattern.test(source.text)) {
        return `${source.label} (${pattern.source.slice(0, 50)})`
      }
    }
  }
  return undefined
}

function detectComposite(
  searchCorpus: string,
  existing: Set<string>
): TechItem[] {
  const detected: TechItem[] = []

  for (const rule of compositeTechRules) {
    const key = `${rule.category}:${rule.name.toLowerCase()}`
    if (existing.has(key)) continue

    const matched = rule.signals.filter((signal) => signal.pattern.test(searchCorpus))
    if (matched.length < rule.minMatches) continue

    detected.push({
      name: rule.name,
      category: rule.category,
      evidence: matched.map((signal) => signal.label).join(", "),
    })
    existing.add(key)
  }

  return detected
}

export function detectTechStack(html: string, headers: Headers): TechItem[] {
  const headerMap: HeaderMap = {}
  headers.forEach((value, key) => {
    headerMap[key.toLowerCase()] = value
  })

  const scriptSources = extractScriptSources(html)
  const stylesheetSources = extractStylesheetSources(html)
  const inlineScripts = extractInlineScripts(html)
  const searchCorpus = [html, scriptSources, stylesheetSources, inlineScripts].join("\n")

  const sources = [
    { label: "HTML", text: html },
    { label: "script src", text: scriptSources },
    { label: "stylesheet href", text: stylesheetSources },
    { label: "inline script", text: inlineScripts },
  ]

  const detected: TechItem[] = []
  const seen = new Set<string>()
  const generator = extractGenerator(html)

  if (generator) {
    detected.push({
      name: generator,
      category: "platform",
      evidence: "meta generator tag",
    })
    seen.add(`platform:${generator.toLowerCase()}`)
  }

  for (const rule of techRules) {
    let evidence: string | undefined

    if (rule.patterns) {
      evidence = matchPatterns(rule.patterns, sources)
    }

    if (!evidence && rule.scriptPatterns) {
      evidence = matchPatterns(rule.scriptPatterns, [
        { label: "script src", text: scriptSources },
        { label: "inline script", text: inlineScripts },
        { label: "HTML", text: html },
      ])
    }

    if (!evidence && rule.linkPatterns) {
      evidence = matchPatterns(rule.linkPatterns, [
        { label: "stylesheet href", text: stylesheetSources },
        { label: "HTML", text: html },
      ])
    }

    if (rule.headers) {
      for (const headerRule of rule.headers) {
        const headerEvidence = getHeaderEvidence(headerMap, headerRule)
        if (headerEvidence) {
          evidence = headerEvidence
          break
        }
      }
    }

    if (evidence) {
      const key = `${rule.category}:${rule.name.toLowerCase()}`
      if (!seen.has(key)) {
        detected.push({
          name: rule.name,
          category: rule.category,
          evidence,
        })
        seen.add(key)
      }
    }
  }

  detected.push(...detectComposite(searchCorpus, seen))

  return uniqueBy(detected, (item) => `${item.category}:${item.name.toLowerCase()}`)
}

export const techCategoryLabels: Record<TechCategory, string> = {
  framework: "Framework",
  ui: "UI components",
  css: "CSS & styling",
  cms: "CMS",
  hosting: "Hosting",
  analytics: "Analytics",
  auth: "Authentication",
  cdn: "CDN",
  library: "Library",
  platform: "Platform",
  server: "Server",
  other: "Other",
}

export const fontSourceLabels: Record<FontSource, string> = {
  "google-fonts": "Google Fonts",
  "adobe-fonts": "Adobe Fonts",
  "bunny-fonts": "Bunny Fonts",
  "self-hosted": "Self-hosted",
  system: "System",
  inline: "Inline CSS",
  cdn: "CDN",
}
