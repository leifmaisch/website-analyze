import {
  CheckCircleIcon,
  ClockIcon,
  GlobeIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr"

import { iconWeight } from "@/components/shared"
import { checkCategoryLabels } from "@/lib/scan-categories"
import type { CheckCategory } from "@/lib/scan-types"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

const sampleDomain = "example.com"
const sampleUrl = "https://example.com"
const sampleResponseMs = 194
const sampleOverall = 88
const samplePassCount = 58
const sampleWarnCount = 8
const sampleFailCount = 0

const heroCategories: CheckCategory[] = [
  "performance",
  "seo",
  "security",
  "accessibility",
  "privacy",
  "content",
  "infrastructure",
  "mobile",
]

const heroScores: Record<CheckCategory, number> = {
  performance: 93,
  seo: 83,
  security: 84,
  accessibility: 91,
  privacy: 100,
  content: 91,
  infrastructure: 100,
  mobile: 65,
}

const heroTech = ["Next.js", "React", "Tailwind CSS", "shadcn/ui"]

function scoreTone(score: number) {
  if (score >= 80) return "text-primary"
  if (score >= 60) return "text-amber-500"
  return "text-red-400"
}

function scoreBarTone(score: number) {
  if (score >= 80) return "bg-primary"
  if (score >= 60) return "bg-amber-500"
  return "bg-red-400"
}

function statusIcon(status: "pass" | "warn" | "fail") {
  if (status === "pass") {
    return <CheckCircleIcon weight={iconWeight} className="size-3.5 shrink-0 text-primary" />
  }

  if (status === "warn") {
    return <WarningCircleIcon weight={iconWeight} className="size-3.5 shrink-0 text-amber-500" />
  }

  return <XCircleIcon weight={iconWeight} className="size-3.5 shrink-0 text-red-500" />
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
    pass: "border-primary/30 bg-primary/10 text-primary",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    fail: "border-red-500/30 bg-red-500/10 text-red-400",
  }

  return (
    <div
      style={squircle}
      className={cn(
        "flex items-center gap-1.5 rounded-squircle-sm border px-2.5 py-1.5",
        tones[tone]
      )}
    >
      {statusIcon(tone)}
      <span className="text-body text-xs font-medium tabular-nums">{count}</span>
      <span className="text-caption capitalize sm:hidden">{tone}</span>
      <span className="text-caption hidden text-xs sm:inline">{label}</span>
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative size-16 shrink-0 sm:size-[4.5rem]">
      <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted/60"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={scoreTone(score)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-stat-value text-lg sm:text-xl", scoreTone(score))}>
          {score}
        </span>
      </div>
    </div>
  )
}

export function HeroGraphic() {
  return (
    <div className="p-3 sm:p-5 md:p-6">
      <div
        style={squircle}
        className={cn(
          "w-full overflow-hidden rounded-squircle-lg border border-border/70 bg-card/90 backdrop-blur-sm",
          surfaceDepth("md")
        )}
      >
        <div className="border-b border-border/60 bg-muted/25 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full bg-primary" />
                <span className="text-label">Scan complete</span>
              </div>
              <p className="text-heading mt-1.5 truncate text-base sm:text-lg">
                {sampleDomain}
              </p>
              <div className="text-description mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:text-sm">
                <span className="inline-flex min-w-0 max-w-full items-center gap-1">
                  <GlobeIcon weight={iconWeight} className="size-3 shrink-0" />
                  <span className="truncate">{sampleUrl}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon weight={iconWeight} className="size-3 shrink-0" />
                  {sampleResponseMs}ms
                </span>
                <span>HTTP 200</span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill label="passed" count={samplePassCount} tone="pass" />
                <StatusPill label="warnings" count={sampleWarnCount} tone="warn" />
                <StatusPill label="failed" count={sampleFailCount} tone="fail" />
              </div>
              <div className="flex justify-center sm:justify-start">
                <ScoreRing score={sampleOverall} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 px-4 py-3 sm:space-y-4 sm:px-5 sm:py-4">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
            {heroCategories.map((category) => {
              const score = heroScores[category]
              return (
                <div
                  key={category}
                  style={squircle}
                  className="rounded-squircle-sm border border-border/60 bg-background/60 px-2.5 py-2 sm:px-3 sm:py-2.5"
                >
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    <span className="text-caption text-[11px] leading-tight sm:text-xs">
                      {checkCategoryLabels[category]}
                    </span>
                    <span
                      className={cn(
                        "text-caption text-numeric shrink-0 font-mono tabular-nums",
                        scoreTone(score)
                      )}
                    >
                      {score}
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-squircle-sm bg-muted/80">
                    <div
                      className={cn("h-full rounded-squircle-sm", scoreBarTone(score))}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {heroTech.map((item) => (
              <span
                key={item}
                style={squircle}
                className="rounded-squircle-sm border border-border/60 bg-background/70 px-2 py-0.5 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
