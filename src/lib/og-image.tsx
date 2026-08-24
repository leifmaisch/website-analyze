import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { totalCheckCount } from "@/lib/scan-categories"

export const ogImageSize = { width: 1200, height: 630 }
export const ogImageContentType = "image/png"
export const ogImageAlt = "SiteAnalyze | Website audits made simple"

const background = "#141414"
const foreground = "#fafafa"
const muted = "#a3a3a3"
const primary = "#6ee7b7"
const primaryForeground = "#141414"
const border = "rgba(255, 255, 255, 0.12)"

const tags = [
  `${totalCheckCount} checks`,
  "Tech stack",
  "Analytics",
  "Fonts",
]

async function loadRubikSemiBold() {
  const fontPath = join(process.cwd(), "src/assets/fonts/rubik-semibold.woff")

  return readFile(fontPath)
}

export async function createOgImage() {
  const rubikSemiBold = await loadRubikSemiBold()

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: background,
          padding: "72px 80px",
          fontFamily: "Rubik",
        }}
      >
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

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 72,
              height: 72,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 18,
              backgroundColor: primary,
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke={primaryForeground}
                strokeWidth="2"
              />
              <path
                d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9"
                stroke={primaryForeground}
                strokeWidth="2"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: foreground,
              letterSpacing: "-0.02em",
            }}
          >
            SiteAnalyze
          </span>
        </div>

        <p
          style={{
            position: "relative",
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.15,
            color: foreground,
            letterSpacing: "-0.03em",
            maxWidth: 760,
          }}
        >
          Website audits made simple
        </p>

        <p
          style={{
            position: "relative",
            marginTop: 24,
            fontSize: 26,
            lineHeight: 1.45,
            color: muted,
            maxWidth: 720,
          }}
        >
          Performance, SEO, security, accessibility, and more in one report.
        </p>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 40,
          }}
        >
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                borderRadius: 999,
                border: `1px solid ${border}`,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                color: muted,
                fontSize: 20,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        {
          name: "Rubik",
          data: rubikSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}
