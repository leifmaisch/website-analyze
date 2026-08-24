import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr"

import { iconWeight } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { checkCategoryLabels, totalCheckCount } from "@/lib/scan-categories"
import type { CheckCategory } from "@/lib/scan-types"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

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

const sampleDomain = "example.com"
const sampleUrl = "https://example.com"
const sampleResponseMs = 194
const sampleStatusCode = 200
const sampleOverall = 88
const samplePassCount = 58
const sampleWarnCount = 8
const sampleFailCount = 0
const sampleIssueCount = sampleWarnCount + sampleFailCount

const sampleScores: Record<CheckCategory, number> = {
  performance: 93,
  seo: 83,
  security: 84,
  accessibility: 91,
  privacy: 100,
  content: 91,
  infrastructure: 100,
  mobile: 65,
}

const sampleCategoryIssues: Record<CheckCategory, number> = {
  performance: 0,
  seo: 2,
  security: 1,
  accessibility: 0,
  privacy: 0,
  content: 0,
  infrastructure: 0,
  mobile: 5,
}

const sampleTopIssues = [
  {
    label: "Strict-Transport-Security header",
    status: "warn" as const,
    detail: "Enable HSTS to protect HTTPS connections",
  },
  {
    label: "Touch target size",
    status: "warn" as const,
    detail: "3 interactive elements may be too small on mobile",
  },
  {
    label: "Mobile readable text",
    status: "warn" as const,
    detail: "Some text may be hard to read without zooming",
  },
  {
    label: "Theme color meta tag",
    status: "warn" as const,
    detail: "Add theme-color for browser chrome tinting",
  },
  {
    label: "Meta description length",
    status: "warn" as const,
    detail: "Description is shorter than recommended",
  },
  {
    label: "Response time under 2s",
    status: "pass" as const,
    detail: `${sampleResponseMs}ms`,
  },
]

const sampleTech = ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "Cloudflare", "Vercel"]
const sampleAnalytics = ["Google Analytics 4", "Cloudflare Web Analytics"]
const sampleFonts = "Inter, Rubik, Geist Mono +1"

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

function statusIcon(status: "pass" | "warn" | "fail", className?: string) {
  if (status === "pass") {
    return (
      <CheckCircleIcon
        weight={iconWeight}
        className={cn("size-4 shrink-0 text-primary", className)}
      />
    )
  }

  if (status === "warn") {
    return (
      <WarningCircleIcon
        weight={iconWeight}
        className={cn("size-4 shrink-0 text-amber-500", className)}
      />
    )
  }

  return (
    <XCircleIcon
      weight={iconWeight}
      className={cn("size-4 shrink-0 text-red-500", className)}
    />
  )
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      style={squircle}
      className={cn(
        "rounded-squircle-lg border border-border bg-muted/20 p-5 sm:p-6",
        className
      )}
    >
      {children}
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative size-24 shrink-0 sm:size-28">
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
        <span className={cn("text-stat-value text-2xl sm:text-3xl", scoreTone(score))}>
          {score}
        </span>
        <span className="text-caption">overall</span>
      </div>
    </div>
  )
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
        "flex items-center gap-2 rounded-squircle-md border px-3 py-2",
        tones[tone]
      )}
    >
      {statusIcon(tone)}
      <span className="text-body text-sm font-medium tabular-nums">{count}</span>
      <span className="text-caption hidden sm:inline">{label}</span>
    </div>
  )
}

function CheckRow({
  label,
  status,
  detail,
}: {
  label: string
  status: "pass" | "warn" | "fail"
  detail: string
}) {
  return (
    <li
      style={squircle}
      className="flex items-start gap-3 rounded-squircle-md border border-border bg-background/50 px-4 py-3"
    >
      {statusIcon(status)}
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium">{label}</p>
        <p className="text-description mt-0.5">{detail}</p>
      </div>
    </li>
  )
}

function PreviewPlaceholder({ label }: { label: string }) {
  return (
    <div className="group text-left">
      <div
        style={squircle}
        className="overflow-hidden rounded-squircle-md border border-border bg-background transition-colors group-hover:border-primary/30"
      >
        <div
          className="aspect-[9/16] w-full bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_12%,transparent),color-mix(in_srgb,var(--muted)_80%,transparent))] sm:aspect-[4/3]"
        />
      </div>
      <p className="text-caption mt-2">{label}</p>
    </div>
  )
}

function StaticTab({
  active,
  children,
}: {
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <span
      style={squircle}
      className={cn(
        "inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-squircle-sm px-2 py-1.5 text-xs font-medium sm:px-3 sm:text-sm",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

export function ResultGraphic() {
  return (
    <div
      style={squircle}
      className={cn(
        "overflow-hidden rounded-squircle-xl border border-border bg-card",
        surfaceDepth("lg")
      )}
    >
      <div className="border-b border-border bg-muted/20 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full bg-primary" />
              <span className="text-label">Scan complete</span>
            </div>
            <h2 className="text-heading mt-2 truncate text-xl sm:text-2xl">
              {sampleDomain}
            </h2>
            <div className="text-description mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
                <GlobeIcon weight={iconWeight} className="size-3.5 shrink-0" />
                <span className="truncate">{sampleUrl}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon weight={iconWeight} className="size-3.5 shrink-0" />
                {sampleResponseMs}ms
              </span>
              <span>HTTP {sampleStatusCode}</span>
              <span className="hidden sm:inline">Just now</span>
            </div>
            <div className="mt-3">
              <Button type="button" variant="outline" size="sm" disabled>
                Copy LLM prompt
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-5 lg:w-auto">
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

      <div className="p-4 sm:p-6 lg:p-8">
        <div
          style={squircle}
          className={cn(
            "flex w-full min-w-0 items-center gap-1 rounded-squircle-md border border-border/60 bg-muted p-1",
            surfaceDepth("md")
          )}
        >
          <StaticTab active>Overview</StaticTab>
          <StaticTab>
            Checks
            <span className="text-caption ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-amber-500 tabular-nums">
              {sampleIssueCount}
            </span>
          </StaticTab>
          <StaticTab>Preview</StaticTab>
          <StaticTab>Stack</StaticTab>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-heading text-lg">Needs attention</h3>
                <p className="text-description mt-1">
                  {sampleIssueCount} issues found across {totalCheckCount} checks
                </p>
              </div>
              <span className="text-label inline-flex items-center gap-1 text-primary">
                View all
                <ArrowRightIcon weight={iconWeight} className="size-3.5" />
              </span>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {sampleTopIssues.map((check) => (
                <CheckRow
                  key={check.label}
                  label={check.label}
                  status={check.status}
                  detail={check.detail}
                />
              ))}
            </ul>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Panel>
              <h3 className="text-heading text-lg">Category scores</h3>
              <p className="text-description mt-1">Tap a category to jump to its checks.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {categoryOrder.map((category) => {
                  const issues = sampleCategoryIssues[category]
                  const score = sampleScores[category]
                  return (
                    <div
                      key={category}
                      style={squircle}
                      className="rounded-squircle-md border border-border bg-background/50 p-4 text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-label">{checkCategoryLabels[category]}</span>
                        <span
                          className={cn(
                            "text-caption text-numeric font-mono tabular-nums",
                            scoreTone(score)
                          )}
                        >
                          {score}
                        </span>
                      </div>
                      <div className="mt-3 h-1 overflow-hidden rounded-squircle-sm bg-muted/80">
                        <div
                          className={cn("h-full rounded-squircle-sm", scoreBarTone(score))}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <p className="text-caption mt-2">
                        {issues > 0
                          ? `${issues} issue${issues === 1 ? "" : "s"}`
                          : "All clear"}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Panel>

            <div className="flex flex-col gap-4">
              <Panel>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-heading text-lg">Preview</h3>
                  <span className="text-label text-primary">Full size</span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <PreviewPlaceholder label="Desktop" />
                  <PreviewPlaceholder label="Mobile" />
                </div>
              </Panel>

              <Panel>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-heading text-lg">Detected stack</h3>
                  <span className="text-label text-primary">Details</span>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <p className="text-caption mb-2">Technologies</p>
                    <ul className="flex flex-wrap gap-2">
                      {sampleTech.map((item) => (
                        <li
                          key={item}
                          style={squircle}
                          className="rounded-squircle-md border border-border bg-background/80 px-2.5 py-1 text-sm"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-caption mb-2">Analytics</p>
                    <ul className="flex flex-wrap gap-2">
                      {sampleAnalytics.map((item) => (
                        <li
                          key={item}
                          style={squircle}
                          className="rounded-squircle-md border border-border bg-background/80 px-2.5 py-1 text-sm"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-caption mb-2">Fonts</p>
                    <p className="text-body truncate">{sampleFonts}</p>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
