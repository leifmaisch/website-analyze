import { ImageResponse } from "next/og"

import {
  loadOgAssets,
  OgBackground,
  OgBrandMark,
  ogColors,
  ogImageSize,
  truncateText,
} from "@/lib/og-shared"
import { totalCheckCount } from "@/lib/scan-categories"
import { siteName, siteTagline } from "@/lib/site-metadata"

const tags = [
  `${totalCheckCount} checks`,
  "Tech stack",
  "Analytics",
  "Fonts",
]

export const ogImageAlt = `${siteName} | ${siteTagline}`

export { ogImageContentType, ogImageSize } from "@/lib/og-shared"

export async function createOgImage() {
  const { fonts, backgroundSrc, logoSrc } = await loadOgAssets()

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
          backgroundColor: ogColors.background,
          padding: "72px 80px",
          fontFamily: "Rubik",
        }}
      >
        <OgBackground src={backgroundSrc} />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <OgBrandMark src={logoSrc} />
          <span
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: ogColors.foreground,
              letterSpacing: "-0.02em",
            }}
          >
            {siteName}
          </span>
        </div>

        <p
          style={{
            position: "relative",
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.15,
            color: ogColors.foreground,
            letterSpacing: "-0.03em",
            maxWidth: 760,
          }}
        >
          {siteTagline}
        </p>

        <p
          style={{
            position: "relative",
            marginTop: 24,
            fontSize: 26,
            lineHeight: 1.45,
            color: ogColors.muted,
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
                border: `1px solid ${ogColors.border}`,
                backgroundColor: ogColors.card,
                color: ogColors.muted,
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
      fonts,
    }
  )
}
