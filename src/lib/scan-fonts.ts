import "server-only"

import type { FontItem, FontSource } from "@/lib/scan-detect"

const userAgent = "SiteAnalyze/1.0 (+https://siteanalyze.local)"

const genericFonts = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong",
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
  "-apple-system",
  "blinkmacsystemfont",
  "segoe ui",
  "helvetica neue",
  "helvetica",
  "arial",
  "noto sans",
  "liberation sans",
  "sans",
  "times new roman",
  "times",
  "courier new",
  "courier",
  "roboto",
  "menlo",
  "monaco",
  "consolas",
  "liberation mono",
  "sfmono-regular",
  "sf mono",
  "apple color emoji",
  "segoe ui emoji",
  "segoe ui symbol",
  "noto color emoji",
])

function normalizeFontName(name: string): string {
  return name
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\+/g, " ")
    .replace(/[)"]+$/g, "")
    .trim()
}

function isGenericFont(name: string): boolean {
  const normalized = normalizeFontName(name).toLowerCase()
  if (!normalized || normalized.startsWith("var(")) return true
  if (genericFonts.has(normalized)) return true
  if (/^(?:ui-|system)/i.test(normalized)) return true
  if (normalized.endsWith(" fallback")) return true
  if (/^[a-f0-9]{8,}$/i.test(normalized)) return true
  if (/^\d+$/.test(normalized)) return true
  if (/[)"]$/.test(normalized)) return true
  if (/emoji$/i.test(normalized)) return true
  return false
}

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

function formatNextFontSlug(slug: string): string {
  return slug
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function parseFontFamilies(value: string): string[] {
  const families: string[] = []
  const parts = value.split(",")

  for (const part of parts) {
    const name = normalizeFontName(part)
    if (!isGenericFont(name)) {
      families.push(name)
    }
  }

  return families
}

function extractFontsFromCss(css: string, source: FontSource): FontItem[] {
  const fonts: FontItem[] = []

  const facePattern = /@font-face\s*\{[^}]*font-family\s*:\s*([^;}{]+)/gi
  for (const match of css.matchAll(facePattern)) {
    for (const name of parseFontFamilies(match[1] ?? "")) {
      fonts.push({ name, source })
    }
  }

  const familyPattern = /font-family\s*:\s*([^;}{]+)/gi
  for (const match of css.matchAll(familyPattern)) {
    for (const name of parseFontFamilies(match[1] ?? "")) {
      fonts.push({ name, source })
    }
  }

  const variablePattern =
    /--font-(?!weight|size|line-height|stretch|feature|optical)[\w-]*\s*:\s*([^;}{]+)/gi
  for (const match of css.matchAll(variablePattern)) {
    for (const name of parseFontFamilies(match[1] ?? "")) {
      fonts.push({ name, source })
    }
  }

  return fonts
}

function extractInlineStyles(html: string): string {
  const blocks: string[] = []
  const pattern = /<style[^>]*>([\s\S]*?)<\/style>/gi

  for (const match of html.matchAll(pattern)) {
    if (match[1]) blocks.push(match[1])
  }

  return blocks.join("\n")
}

function extractNextFontClasses(html: string): FontItem[] {
  const fonts: FontItem[] = []
  const pattern = /\b([a-z][a-z0-9_]*?)_[a-f0-9]+-module__/gi

  for (const match of html.matchAll(pattern)) {
    const slug = match[1]
    if (!slug || slug.length < 2) continue
    const name = formatNextFontSlug(slug)
    if (!isGenericFont(name)) {
      fonts.push({ name, source: "self-hosted" })
    }
  }

  return fonts
}

function extractGoogleFonts(html: string): FontItem[] {
  const fonts: FontItem[] = []
  const urls = [
    ...html.matchAll(/https?:\/\/fonts\.googleapis\.com\/[^"'\s)]+/gi),
    ...html.matchAll(/https?:\/\/fonts\.gstatic\.com\/[^"'\s)]+/gi),
  ]

  for (const match of urls) {
    const url = match[0] ?? ""
    const familyPattern = /family=([^&"')]+)/gi
    for (const familyMatch of url.matchAll(familyPattern)) {
      const families = decodeURIComponent(familyMatch[1] ?? "").split("|")
      for (const family of families) {
        const name = normalizeFontName(family.split(":")[0] ?? family)
        if (!isGenericFont(name)) {
          fonts.push({ name, source: "google-fonts" })
        }
      }
    }
  }

  const familyPattern = /family=([^&"']+)/gi
  for (const match of html.matchAll(familyPattern)) {
    const families = decodeURIComponent(match[1] ?? "").split("|")
    for (const family of families) {
      const name = normalizeFontName(family.split(":")[0] ?? family)
      if (!isGenericFont(name)) {
        fonts.push({ name, source: "google-fonts" })
      }
    }
  }

  return fonts
}

function extractAdobeFonts(html: string): FontItem[] {
  const fonts: FontItem[] = []

  if (/use\.typekit\.net\/[a-z0-9]+\.css/i.test(html) || /fonts\.adobe\.com/.test(html)) {
    fonts.push({ name: "Adobe Fonts kit", source: "adobe-fonts" })
  }

  return fonts
}

function extractBunnyFonts(html: string): FontItem[] {
  const fonts: FontItem[] = []
  const pattern = /fonts\.bunny\.net\/css\?family=([^&"']+)/gi

  for (const match of html.matchAll(pattern)) {
    const families = decodeURIComponent(match[1] ?? "").split("|")
    for (const family of families) {
      const name = normalizeFontName(family.split(":")[0] ?? family)
      if (!isGenericFont(name)) {
        fonts.push({ name, source: "bunny-fonts" })
      }
    }
  }

  return fonts
}

function extractFontFaceFamilies(html: string): FontItem[] {
  return extractFontsFromCss(html, "inline")
}

function extractStylesheetUrls(html: string, pageUrl: string): string[] {
  const urls = new Set<string>()
  const patterns = [
    /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi,
  ]

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const href = match[1]
      if (!href) continue
      try {
        urls.add(new URL(href, pageUrl).toString())
      } catch {
        continue
      }
    }
  }

  const chunkPattern = /:HL\[["'](\/_next\/static\/[^"']+\.css)["']/g
  for (const match of html.matchAll(chunkPattern)) {
    try {
      urls.add(new URL(match[1] ?? "", pageUrl).toString())
    } catch {
      continue
    }
  }

  return [...urls]
}

async function fetchStylesheet(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return ""
    return await response.text()
  } catch {
    return ""
  }
}

async function fetchStylesheets(urls: string[], limit = 4): Promise<string> {
  const cssBlocks = await Promise.all(
    urls.slice(0, limit).map((url) => fetchStylesheet(url))
  )
  return cssBlocks.filter(Boolean).join("\n")
}

export async function detectFonts(html: string, pageUrl: string): Promise<FontItem[]> {
  const inlineCss = extractInlineStyles(html)
  const stylesheetUrls = extractStylesheetUrls(html, pageUrl)
  const externalCss = await fetchStylesheets(stylesheetUrls)

  const fonts = [
    ...extractGoogleFonts(html),
    ...extractAdobeFonts(html),
    ...extractBunnyFonts(html),
    ...extractNextFontClasses(html),
    ...extractFontFaceFamilies(inlineCss),
    ...extractFontsFromCss(externalCss, "self-hosted"),
    ...extractFontsFromCss(inlineCss, "inline"),
  ]

  return uniqueBy(fonts, (font) => `${font.source}:${font.name.toLowerCase()}`)
}
