import { ImageResponse } from "next/og"

import {
  checkCategoryLabels,
  type CheckCategory,
  totalCheckCount,
} from "@/lib/scan-categories"
import {
  loadOgFonts,
  OgBackground,
  OgBrandMark,
  ogColors,
  ogImageSize,
  scoreColor,
  truncateText,
} from "@/lib/og-shared"
import type { ScanResult } from "@/lib/scan-types"

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

function countChecks(result: ScanResult) {
  const passCount = result.checks.filter((check) => check.status === "pass").length
  const warnCount = result.checks.filter((check) => check.status === "warn").length
  const failCount = result.checks.filter((check) => check.status === "fail").length

  return { passCount, warnCount, failCount }
}

function StatusPill({
  label,
  count,
  tone,
}: {
  label: string
  count: number
  tone: "pass" | "warn" | "fail"
}) {
  const tones = {
    pass: {
      border: "rgba(110, 231, 183, 0.3)",
      background: "rgba(110, 231, 183, 0.1)",
      color: ogColors.primary,
    },
    warn: {
      border: "rgba(245, 158, 11, 0.3)",
      background: "rgba(245, 158, 11, 0.1)",
      color: ogColors.amber,
    },
    fail: {
      border: "rgba(248, 113, 113, 0.3)",
      background: "rgba(248, 113, 113, 0.1)",
      color: ogColors.red,
    },
  }

  const style = tones[tone]

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 18px",
        borderRadius: 14,
        border: `1px solid ${style.border}`,
        backgroundColor: style.background,
        color: style.color,
        fontSize: 20,
      }}
    >
      <span style={{ fontWeight: 600 }}>{count}</span>
      <span style={{ color: ogColors.muted }}>{label}</span>
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const radius = 78
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const tone = scoreColor(score)

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: 200,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="14"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 56, fontWeight: 600, color: tone }}>{score}</span>
        <span style={{ fontSize: 18, color: ogColors.muted }}>overall</span>
      </div>
    </div>
  )
}

function CategoryScore({
  label,
  score,
}: {
  label: string
  score: number
}) {
  const tone = scoreColor(score)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "16px 18px",
        borderRadius: 16,
        border: `1px solid ${ogColors.border}`,
        backgroundColor: ogColors.card,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 16, color: ogColors.muted }}>{label}</span>
        <span style={{ fontSize: 20, fontWeight: 600, color: tone }}>{score}</span>
      </div>
      <div
        style={{
          display: "flex",
          height: 6,
          borderRadius: 999,
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: 6,
            borderRadius: 999,
            backgroundColor: tone,
          }}
        />
      </div>
    </div>
  )
}

export function createScanOgImageAlt(result: ScanResult) {
  return `${result.domain} audit · score ${result.scores.overall}`
}

export async function createScanOgImage(result: ScanResult) {
  const fonts = await loadOgFonts()
  const { passCount, warnCount, failCount } = countChecks(result)
  const overall = result.scores.overall

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          backgroundColor: ogColors.background,
          padding: "48px 56px",
          fontFamily: "Rubik",
        }}
      >
        <OgBackground />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <OgBrandMark size={52} />
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: ogColors.foreground,
              }}
            >
              SiteAnalyze
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 999,
              border: `1px solid ${ogColors.border}`,
              backgroundColor: ogColors.card,
              color: ogColors.muted,
              fontSize: 18,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                backgroundColor: ogColors.primary,
              }}
            />
            Scan complete
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: 58,
                fontWeight: 600,
                color: ogColors.foreground,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {truncateText(result.domain, 42)}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 22,
                color: ogColors.muted,
              }}
            >
              {truncateText(result.url, 64)}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 24,
              }}
            >
              <StatusPill label="passed" count={passCount} tone="pass" />
              <StatusPill label="warnings" count={warnCount} tone="warn" />
              <StatusPill label="failed" count={failCount} tone="fail" />
            </div>
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 18,
                fontSize: 20,
                color: ogColors.muted,
              }}
            >
              <span>{result.responseTimeMs}ms</span>
              <span>HTTP {result.statusCode}</span>
              <span>{totalCheckCount} checks</span>
            </div>
          </div>

          <ScoreRing score={overall} />
        </div>

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
          }}
        >
          {categoryOrder.map((category) => (
            <CategoryScore
              key={category}
              label={checkCategoryLabels[category]}
              score={result.scores[category]}
            />
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
