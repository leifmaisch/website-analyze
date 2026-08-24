import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const ogImageSize = { width: 1200, height: 630 }
export const ogImageContentType = "image/png"

export const ogColors = {
  background: "#141414",
  foreground: "#fafafa",
  muted: "#a3a3a3",
  primary: "#6ee7b7",
  primaryForeground: "#141414",
  border: "rgba(255, 255, 255, 0.12)",
  card: "rgba(255, 255, 255, 0.04)",
  amber: "#f59e0b",
  red: "#f87171",
}

export const ogFonts = [{ name: "Rubik", weight: 600 as const, style: "normal" as const }]

export async function loadRubikSemiBold() {
  const fontPath = join(process.cwd(), "public/fonts/rubik-semibold.woff")
  return readFile(fontPath)
}

export async function loadOgFonts() {
  const rubikSemiBold = await loadRubikSemiBold()
  return [
    {
      name: "Rubik",
      data: rubikSemiBold,
      style: "normal" as const,
      weight: 600 as const,
    },
  ]
}

export async function loadOgBackgroundSrc() {
  const buffer = await readFile(join(process.cwd(), "public/og-bg.png"))
  return `data:image/png;base64,${buffer.toString("base64")}`
}

export async function loadOgLogoSrc() {
  const buffer = await readFile(join(process.cwd(), "public/logo.png"))
  return `data:image/png;base64,${buffer.toString("base64")}`
}

export async function loadOgAssets() {
  const [fonts, backgroundSrc, logoSrc] = await Promise.all([
    loadOgFonts(),
    loadOgBackgroundSrc(),
    loadOgLogoSrc(),
  ])
  return { fonts, backgroundSrc, logoSrc }
}

export function scoreColor(score: number) {
  if (score >= 80) return ogColors.primary
  if (score >= 60) return ogColors.amber
  return ogColors.red
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

export function OgBackground({ src }: { src: string }) {
  return (
    <img
      src={src}
      width={ogImageSize.width}
      height={ogImageSize.height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: ogImageSize.width,
        height: ogImageSize.height,
      }}
    />
  )
}

export function OgBrandMark({ src, size = 72 }: { src: string; size?: number }) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}
