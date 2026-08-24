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

export function scoreColor(score: number) {
  if (score >= 80) return ogColors.primary
  if (score >= 60) return ogColors.amber
  return ogColors.red
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

export function OgBackground() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 420,
          background:
            "radial-gradient(circle at 24% 0%, rgba(110, 231, 183, 0.18), transparent 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 480,
          height: 480,
          background:
            "radial-gradient(circle at 100% 100%, rgba(110, 231, 183, 0.08), transparent 68%)",
        }}
      />
    </>
  )
}

export function OgBrandMark({ size = 72 }: { size?: number }) {
  const iconSize = Math.round(size * 0.5)

  return (
    <div
      style={{
        display: "flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Math.round(size * 0.25),
        backgroundColor: ogColors.primary,
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={ogColors.primaryForeground}
          strokeWidth="2"
        />
        <path
          d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9"
          stroke={ogColors.primaryForeground}
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
