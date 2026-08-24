"use client"

import { useMemo, useState } from "react"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react"

import { iconWeight } from "@/components/shared"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CheckCategory, ScanCheck, ScanResult } from "@/lib/scan-types"
import { checkCategoryLabels, getCheckCategory } from "@/lib/scan-categories"
import {
  analyticsKindLabels,
  analyticsKindOrder,
  type AnalyticsKind,
} from "@/lib/scan-analytics"
import {
  fontSourceLabels,
  techCategoryLabels,
  techCategoryOrder,
  type TechCategory,
} from "@/lib/scan-detect"
import { formatScanResultForLlm } from "@/lib/scan-result-prompt"
import { formatScanTimestamp } from "@/lib/format-scan-timestamp"
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

const statusPriority: Record<ScanCheck["status"], number> = {
  fail: 0,
  warn: 1,
  pass: 2,
}

type CheckFilter = "all" | "issues" | "pass"

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

function statusIcon(status: ScanCheck["status"], className?: string) {
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

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-label">{label}</span>
        <span className={cn("text-caption text-numeric font-mono tabular-nums", scoreTone(value))}>
          {value}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-squircle-sm bg-muted/80">
        <div
          className={cn("h-full rounded-squircle-sm transition-[width]", scoreBarTone(value))}
          style={{ width: `${value}%` }}
        />
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

function FilterPill({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count?: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={squircle}
      className={cn(
        "rounded-squircle-md border px-3 py-2.5 text-sm transition-colors min-h-11",
        active
          ? "border-primary/40 bg-primary text-primary-foreground"
          : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      {count !== undefined ? (
        <span className="text-caption ml-1.5 tabular-nums opacity-80">{count}</span>
      ) : null}
    </button>
  )
}

function CopyLlmPromptButton({ result }: { result: ScanResult }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatScanResultForLlm(result))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      {copied ? "Copied" : "Copy LLM prompt"}
    </Button>
  )
}

function ShareResultsButton({ shareId }: { shareId: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      const url = `${window.location.origin}/r/${shareId}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      {copied ? "Link copied" : "Copy share link"}
    </Button>
  )
}

function CheckRow({ check }: { check: ScanCheck }) {
  return (
    <li
      style={squircle}
      className="flex items-start gap-3 rounded-squircle-md border border-border bg-background/50 px-4 py-3"
    >
      {statusIcon(check.status)}
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium">{check.label}</p>
        {check.detail ? (
          <p className="text-description mt-0.5">{check.detail}</p>
        ) : null}
      </div>
    </li>
  )
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

function groupTechByCategory(result: ScanResult) {
  const groups = new Map<TechCategory, ScanResult["techStack"]>()

  for (const item of result.techStack) {
    const existing = groups.get(item.category) ?? []
    existing.push(item)
    groups.set(item.category, existing)
  }

  return groups
}

function groupAnalyticsByKind(result: ScanResult) {
  const groups = new Map<AnalyticsKind, ScanResult["analytics"]>()

  for (const item of result.analytics) {
    const existing = groups.get(item.kind) ?? []
    existing.push(item)
    groups.set(item.kind, existing)
  }

  return groups
}

function filterChecks(checks: ScanCheck[], filter: CheckFilter) {
  if (filter === "issues") {
    return checks.filter((check) => check.status !== "pass")
  }

  if (filter === "pass") {
    return checks.filter((check) => check.status === "pass")
  }

  return checks
}

function categoryIssueCount(checks: ScanCheck[]) {
  return checks.filter((check) => check.status !== "pass").length
}

export function ScanResults({ result }: { result: ScanResult }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [checkFilter, setCheckFilter] = useState<CheckFilter>("issues")
  const [openCategory, setOpenCategory] = useState<CheckCategory | null>(null)

  const checkGroups = useMemo(
    () => groupChecksByCategory(result.checks),
    [result.checks]
  )
  const techGroups = useMemo(() => groupTechByCategory(result), [result])
  const analyticsGroups = useMemo(() => groupAnalyticsByKind(result), [result])

  const passCount = result.checks.filter((check) => check.status === "pass").length
  const warnCount = result.checks.filter((check) => check.status === "warn").length
  const failCount = result.checks.filter((check) => check.status === "fail").length
  const issueCount = warnCount + failCount

  const topIssues = useMemo(
    () =>
      [...result.checks]
        .filter((check) => check.status !== "pass")
        .sort((a, b) => statusPriority[a.status] - statusPriority[b.status])
        .slice(0, 6),
    [result.checks]
  )

  const filteredChecks = filterChecks(result.checks, checkFilter)
  const scannedAt = formatScanTimestamp(result.scannedAt)

  function goToChecks(category?: CheckCategory) {
    setActiveTab("checks")
    setCheckFilter(category ? "all" : "issues")
    setOpenCategory(category ?? null)
  }

  return (
    <div
      id="scan-results"
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
              {result.domain}
            </h2>
            <div className="text-description mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
                <GlobeIcon weight={iconWeight} className="size-3.5 shrink-0" />
                <span className="truncate">{result.url}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon weight={iconWeight} className="size-3.5 shrink-0" />
                {result.responseTimeMs}ms
              </span>
              <span>HTTP {result.statusCode}</span>
              <span className="hidden sm:inline" suppressHydrationWarning>
                {scannedAt}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.shareId ? (
                <ShareResultsButton shareId={result.shareId} />
              ) : null}
              <CopyLlmPromptButton result={result} />
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-5 lg:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label="passed" count={passCount} tone="pass" />
              <StatusPill label="warnings" count={warnCount} tone="warn" />
              <StatusPill label="failed" count={failCount} tone="fail" />
            </div>
            <div className="flex justify-center sm:justify-start">
              <ScoreRing score={result.scores.overall} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea className="w-full">
            <TabsList className="flex w-full min-w-0">
              <TabsTrigger value="overview" className="min-w-0 flex-1 px-2 text-xs sm:px-3 sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="checks" className="min-w-0 flex-1 px-2 text-xs sm:px-3 sm:text-sm">
                Checks
                {issueCount > 0 ? (
                  <span className="text-caption ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-amber-500 tabular-nums">
                    {issueCount}
                  </span>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="preview" className="min-w-0 flex-1 px-2 text-xs sm:px-3 sm:text-sm">
                Preview
              </TabsTrigger>
              <TabsTrigger value="stack" className="min-w-0 flex-1 px-2 text-xs sm:px-3 sm:text-sm">
                Stack
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="overview" className="mt-6 flex flex-col gap-6">
            {topIssues.length > 0 ? (
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-heading text-lg">Needs attention</h3>
                    <p className="text-description mt-1">
                      {issueCount} issue{issueCount === 1 ? "" : "s"} found across{" "}
                      {result.checks.length} checks
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToChecks()}
                    className="text-label inline-flex items-center gap-1 text-primary transition-opacity hover:opacity-80"
                  >
                    View all
                    <ArrowRightIcon weight={iconWeight} className="size-3.5" />
                  </button>
                </div>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {topIssues.map((check) => (
                    <CheckRow key={check.id} check={check} />
                  ))}
                </ul>
              </Panel>
            ) : (
              <Panel className="border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon
                    weight={iconWeight}
                    className="size-5 shrink-0 text-primary"
                  />
                  <div>
                    <h3 className="text-heading text-lg">All checks passed</h3>
                    <p className="text-description mt-1">
                      No warnings or failures detected on this scan.
                    </p>
                  </div>
                </div>
              </Panel>
            )}

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <Panel>
                <h3 className="text-heading text-lg">Category scores</h3>
                <p className="text-description mt-1">
                  Tap a category to jump to its checks.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {categoryOrder.map((category) => {
                    const issues = categoryIssueCount(checkGroups[category])
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => goToChecks(category)}
                        style={squircle}
                        className="rounded-squircle-md border border-border bg-background/50 p-4 text-left transition-colors hover:border-primary/30 hover:bg-background/80"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-label">
                            {checkCategoryLabels[category]}
                          </span>
                          <span
                            className={cn(
                              "text-caption text-numeric font-mono tabular-nums",
                              scoreTone(result.scores[category])
                            )}
                          >
                            {result.scores[category]}
                          </span>
                        </div>
                        <div className="mt-3 h-1 overflow-hidden rounded-squircle-sm bg-muted/80">
                          <div
                            className={cn(
                              "h-full rounded-squircle-sm",
                              scoreBarTone(result.scores[category])
                            )}
                            style={{ width: `${result.scores[category]}%` }}
                          />
                        </div>
                        <p className="text-caption mt-2">
                          {issues > 0
                            ? `${issues} issue${issues === 1 ? "" : "s"}`
                            : "All clear"}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </Panel>

              <div className="flex flex-col gap-4">
                <Panel>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-heading text-lg">Preview</h3>
                    {result.screenshots.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className="text-label text-primary transition-opacity hover:opacity-80"
                      >
                        Full size
                      </button>
                    ) : null}
                  </div>
                  {result.screenshots.length > 0 ? (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {result.screenshots.map((screenshot) => (
                        <button
                          key={screenshot.viewport}
                          type="button"
                          onClick={() => setActiveTab("preview")}
                          className="group text-left"
                        >
                          <div
                            style={squircle}
                            className="overflow-hidden rounded-squircle-md border border-border bg-background transition-colors group-hover:border-primary/30"
                          >
                            <img
                              src={screenshot.image}
                              alt={`${screenshot.label} preview`}
                              className="aspect-[9/16] w-full object-cover object-top sm:aspect-[4/3]"
                            />
                          </div>
                          <p className="text-caption mt-2">{screenshot.label}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-description mt-3">
                      Screenshots unavailable for this site.
                    </p>
                  )}
                </Panel>

                <Panel>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-heading text-lg">Detected stack</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("stack")}
                      className="text-label text-primary transition-opacity hover:opacity-80"
                    >
                      Details
                    </button>
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    <div>
                      <p className="text-caption mb-2">Technologies</p>
                      {result.techStack.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {result.techStack.slice(0, 6).map((item) => (
                            <li
                              key={item.name}
                              style={squircle}
                              className="rounded-squircle-md border border-border bg-background/80 px-2.5 py-1 text-sm"
                            >
                              {item.name}
                            </li>
                          ))}
                          {result.techStack.length > 6 ? (
                            <li className="text-caption self-center">
                              +{result.techStack.length - 6} more
                            </li>
                          ) : null}
                        </ul>
                      ) : (
                        <p className="text-description">None detected</p>
                      )}
                    </div>
                    <div>
                      <p className="text-caption mb-2">Analytics</p>
                      {result.analytics.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {result.analytics.slice(0, 4).map((item) => (
                            <li
                              key={item.name}
                              style={squircle}
                              className="rounded-squircle-md border border-border bg-background/80 px-2.5 py-1 text-sm"
                            >
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-description">None detected</p>
                      )}
                    </div>
                    <div>
                      <p className="text-caption mb-2">Fonts</p>
                      {result.fonts.length > 0 ? (
                        <p className="text-body truncate">
                          {result.fonts
                            .slice(0, 3)
                            .map((font) => font.name)
                            .join(", ")}
                          {result.fonts.length > 3
                            ? ` +${result.fonts.length - 3}`
                            : ""}
                        </p>
                      ) : (
                        <p className="text-description">System defaults</p>
                      )}
                    </div>
                  </div>
                </Panel>
              </div>
            </div>

            <details style={squircle} className="rounded-squircle-lg border border-border bg-muted/10">
              <summary className="text-label cursor-pointer list-none px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
                Page details
              </summary>
              <dl className="grid gap-4 border-t border-border px-5 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
                <div>
                  <dt className="text-caption">Title</dt>
                  <dd className="text-body mt-1">{result.meta.title ?? "Not found"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-caption">Description</dt>
                  <dd className="text-body mt-1">
                    {result.meta.description ?? "Not found"}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption">Language</dt>
                  <dd className="text-body mt-1">{result.meta.htmlLang ?? "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-caption">HTML size</dt>
                  <dd className="text-body mt-1">{result.meta.htmlSizeKb}KB</dd>
                </div>
                <div>
                  <dt className="text-caption">Word count</dt>
                  <dd className="text-body mt-1">{result.meta.wordCount}</dd>
                </div>
                <div>
                  <dt className="text-caption">Scripts / stylesheets</dt>
                  <dd className="text-body mt-1">
                    {result.meta.scriptCount} / {result.meta.stylesheetCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption">Images / links</dt>
                  <dd className="text-body mt-1">
                    {result.meta.imageCount} / {result.meta.linkCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption">Third-party hosts</dt>
                  <dd className="text-body mt-1">{result.meta.thirdPartyHosts}</dd>
                </div>
                <div>
                  <dt className="text-caption">Open Graph / schema</dt>
                  <dd className="text-body mt-1">
                    {result.meta.hasOpenGraph ? "Open Graph" : "No Open Graph"},{" "}
                    {result.meta.hasStructuredData ? "JSON-LD" : "no JSON-LD"}
                  </dd>
                </div>
              </dl>
            </details>
          </TabsContent>

          <TabsContent value="checks" className="mt-6 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <FilterPill
                active={checkFilter === "issues"}
                label="Issues"
                count={issueCount}
                onClick={() => setCheckFilter("issues")}
              />
              <FilterPill
                active={checkFilter === "all"}
                label="All"
                count={result.checks.length}
                onClick={() => setCheckFilter("all")}
              />
              <FilterPill
                active={checkFilter === "pass"}
                label="Passed"
                count={passCount}
                onClick={() => setCheckFilter("pass")}
              />
            </div>

            {filteredChecks.length === 0 ? (
              <Panel>
                <p className="text-description">No checks match this filter.</p>
              </Panel>
            ) : (
              categoryOrder.map((category) => {
                const categoryChecks = filterChecks(checkGroups[category], checkFilter)
                if (categoryChecks.length === 0) return null

                const isOpen =
                  openCategory === category ||
                  (openCategory === null &&
                    categoryIssueCount(checkGroups[category]) > 0 &&
                    checkFilter !== "pass")

                return (
                  <details
                    key={category}
                    open={isOpen}
                    style={squircle}
                    className="rounded-squircle-lg border border-border bg-muted/20"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
                      <div className="min-w-0">
                        <h3 className="text-heading text-base sm:text-lg">
                          {checkCategoryLabels[category]}
                        </h3>
                        <p className="text-caption mt-0.5">
                          {categoryChecks.length} shown · score{" "}
                          {result.scores[category]}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-caption text-numeric shrink-0 font-mono tabular-nums",
                          scoreTone(result.scores[category])
                        )}
                      >
                        {result.scores[category]}
                      </span>
                    </summary>
                    <ul className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:px-6">
                      {categoryChecks.map((check) => (
                        <CheckRow key={check.id} check={check} />
                      ))}
                    </ul>
                  </details>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Panel>
              <h3 className="text-heading text-lg">Viewport previews</h3>
              <p className="text-description mt-1">
                Desktop and mobile captures used for responsive checks.
              </p>
              {result.screenshots.length > 0 ? (
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  {result.screenshots.map((screenshot) => (
                    <div key={screenshot.viewport} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-label">{screenshot.label}</h4>
                        <span className="text-caption">
                          {screenshot.width} x {screenshot.height}
                        </span>
                      </div>
                      <div
                        style={squircle}
                        className="overflow-hidden rounded-squircle-lg border border-border bg-background"
                      >
                        <img
                          src={screenshot.image}
                          alt={`${screenshot.label} screenshot of ${result.domain}`}
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-description mt-4">
                  Screenshots could not be captured for this site. Responsive checks
                  may be limited.
                </p>
              )}
            </Panel>
          </TabsContent>

          <TabsContent value="stack" className="mt-6 flex flex-col gap-6">
            <Panel>
              <h3 className="text-heading text-lg">Tech stack</h3>
              <p className="text-description mt-1">
                Detected from HTML signatures, scripts, and response headers.
              </p>
              {result.techStack.length > 0 ? (
                <div className="mt-5 flex flex-col gap-5">
                  {techCategoryOrder
                    .filter((category) => techGroups.has(category))
                    .map((category) => {
                      const items = techGroups.get(category)!
                      return (
                        <div key={category}>
                          <h4 className="text-label mb-3">
                            {techCategoryLabels[category]}
                          </h4>
                          <ul className="flex flex-wrap gap-2">
                            {items.map((item) => (
                              <li
                                key={`${category}-${item.name}`}
                                style={squircle}
                                className="rounded-squircle-md border border-border bg-background/80 px-3 py-1.5 text-sm"
                                title={item.evidence}
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className="text-description mt-4">
                  No recognizable technologies detected on this page.
                </p>
              )}
            </Panel>

            <Panel>
              <h3 className="text-heading text-lg">Analytics and tracking</h3>
              <p className="text-description mt-1">
                Tag managers, analytics, ad pixels, and marketing tools.
              </p>
              {result.analytics.length > 0 ? (
                <div className="mt-5 flex flex-col gap-5">
                  {analyticsKindOrder
                    .filter((kind) => analyticsGroups.has(kind))
                    .map((kind) => {
                      const items = analyticsGroups.get(kind)!
                      return (
                        <div key={kind}>
                          <h4 className="text-label mb-3">
                            {analyticsKindLabels[kind]}
                          </h4>
                          <ul className="flex flex-col gap-3">
                            {items.map((item) => (
                              <li
                                key={item.name}
                                style={squircle}
                                className="rounded-squircle-md border border-border bg-background/80 px-4 py-3"
                              >
                                <p className="text-body font-medium">{item.name}</p>
                                {item.ids && item.ids.length > 0 ? (
                                  <p className="text-description mt-1">
                                    {item.ids.join(", ")}
                                  </p>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <p className="text-description mt-4">
                  No analytics or tracking tools detected on this page.
                </p>
              )}
            </Panel>

            <Panel>
              <h3 className="text-heading text-lg">Fonts</h3>
              <p className="text-description mt-1">
                Font families from stylesheets, providers, and inline CSS.
              </p>
              {result.fonts.length > 0 ? (
                <ul className="mt-5 flex flex-col gap-3">
                  {result.fonts.map((font) => (
                    <li
                      key={`${font.source}-${font.name}`}
                      style={squircle}
                      className="flex items-center justify-between gap-4 rounded-squircle-md border border-border bg-background/80 px-4 py-3"
                    >
                      <span className="text-body font-medium">{font.name}</span>
                      <span className="text-caption shrink-0">
                        {fontSourceLabels[font.source]}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-description mt-4">
                  No custom fonts detected. The site may rely on system defaults.
                </p>
              )}
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export function ScanError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Scan failed</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export function ScanLoading() {
  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <Progress value={null}>
        <ProgressLabel>Running checks</ProgressLabel>
      </Progress>
      <p className="text-description mt-3 text-center">
        Fetching the page, capturing screenshots, and analyzing content.
      </p>
    </div>
  )
}
