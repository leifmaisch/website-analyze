"use client"

import {
  CheckCircleIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react"

import { iconWeight } from "@/components/shared"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { StatCard } from "@/components/ui/stat-card"
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

function statusIcon(status: ScanCheck["status"]) {
  if (status === "pass") {
    return (
      <CheckCircleIcon
        weight={iconWeight}
        className="size-4 shrink-0 text-primary"
      />
    )
  }

  if (status === "warn") {
    return (
      <WarningCircleIcon
        weight={iconWeight}
        className="size-4 shrink-0 text-amber-500"
      />
    )
  }

  return (
    <XCircleIcon weight={iconWeight} className="size-4 shrink-0 text-red-500" />
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <Progress value={value}>
      <ProgressLabel>{label}</ProgressLabel>
      <ProgressValue />
    </Progress>
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
        "rounded-squircle-xl border border-border bg-card p-6 sm:p-8",
        surfaceDepth("lg"),
        className
      )}
    >
      {children}
    </div>
  )
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

function groupTechByCategory(result: ScanResult) {
  const groups = new Map<TechCategory, ScanResult["techStack"]>()

  for (const item of result.techStack) {
    const existing = groups.get(item.category) ?? []
    existing.push(item)
    groups.set(item.category, existing)
  }

  return groups
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

function CheckList({ checks }: { checks: ScanCheck[] }) {
  if (checks.length === 0) {
    return <p className="text-description">No checks in this category.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
      {checks.map((check) => (
        <li
          key={check.id}
          style={squircle}
          className="flex items-start gap-3 rounded-squircle-md border border-border bg-muted/20 px-4 py-3"
        >
          {statusIcon(check.status)}
          <div className="min-w-0">
            <p className="text-body font-medium">{check.label}</p>
            {check.detail ? (
              <p className="text-description mt-0.5">{check.detail}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ScanResults({ result }: { result: ScanResult }) {
  const techGroups = groupTechByCategory(result)
  const analyticsGroups = groupAnalyticsByKind(result)
  const checkGroups = groupChecksByCategory(result.checks)
  const passCount = result.checks.filter((check) => check.status === "pass").length
  const warnCount = result.checks.filter((check) => check.status === "warn").length
  const failCount = result.checks.filter((check) => check.status === "fail").length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall score"
          value={`${result.scores.overall}`}
          change={`${result.checks.length} checks run`}
        />
        <StatCard
          label="Passed"
          value={`${passCount}`}
          positive={failCount === 0}
          footer={
            <div className="text-caption text-numeric grid grid-cols-2 gap-2 font-mono">
              <span className="truncate text-amber-500 tabular-nums">
                {warnCount} warn
              </span>
              <span
                className={cn(
                  "truncate text-right tabular-nums",
                  failCount > 0 ? "text-red-400" : "text-white/45"
                )}
              >
                {failCount} fail
              </span>
            </div>
          }
        />
        <StatCard
          label="Performance"
          value={`${result.scores.performance}`}
          change={`${result.responseTimeMs}ms response`}
          positive={result.scores.performance >= 70}
        />
        <StatCard
          label="Security"
          value={`${result.scores.security}`}
          change={`HTTP ${result.statusCode}`}
          positive={result.scores.security >= 70}
        />
      </div>

      <Tabs defaultValue="overview">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-max min-w-full">
            <TabsTrigger value="overview" className="shrink-0 px-3 sm:flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="checks" className="shrink-0 px-3 sm:flex-1">
              Checks
            </TabsTrigger>
            <TabsTrigger value="tech" className="shrink-0 px-3 sm:flex-1">
              Tech stack
            </TabsTrigger>
            <TabsTrigger value="analytics" className="shrink-0 px-3 sm:flex-1">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="fonts" className="shrink-0 px-3 sm:flex-1">
              Fonts
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="overview" className="mt-6 flex flex-col gap-6">
          <Panel>
            <div className="mb-6 flex flex-col gap-2">
              <h2 className="text-heading text-xl sm:text-2xl">Score breakdown</h2>
              <p className="text-description">
                Scanned {result.url} at{" "}
                {new Date(result.scannedAt).toLocaleString()}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryOrder.map((category) => (
                <ScoreBar
                  key={category}
                  label={checkCategoryLabels[category]}
                  value={result.scores[category]}
                />
              ))}
            </div>
          </Panel>

          <Panel className="bg-muted/30">
            <h2 className="text-heading text-xl sm:text-2xl">Page summary</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-label">Title</dt>
                <dd className="mt-1 text-body">
                  {result.meta.title ?? "Not found"}
                </dd>
              </div>
              <div>
                <dt className="text-label">Description</dt>
                <dd className="mt-1 text-body">
                  {result.meta.description ?? "Not found"}
                </dd>
              </div>
              <div>
                <dt className="text-label">Language</dt>
                <dd className="mt-1 text-body">
                  {result.meta.htmlLang ?? "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-label">HTML size</dt>
                <dd className="mt-1 text-body">{result.meta.htmlSizeKb}KB</dd>
              </div>
              <div>
                <dt className="text-label">Word count</dt>
                <dd className="mt-1 text-body">{result.meta.wordCount}</dd>
              </div>
              <div>
                <dt className="text-label">Compression</dt>
                <dd className="mt-1 text-body">
                  {result.meta.contentEncoding ?? "None detected"}
                </dd>
              </div>
              <div>
                <dt className="text-label">Scripts / stylesheets</dt>
                <dd className="mt-1 text-body">
                  {result.meta.scriptCount} scripts, {result.meta.stylesheetCount}{" "}
                  stylesheets
                </dd>
              </div>
              <div>
                <dt className="text-label">Assets found</dt>
                <dd className="mt-1 text-body">
                  {result.meta.imageCount} images, {result.meta.linkCount} links
                </dd>
              </div>
              <div>
                <dt className="text-label">Third-party hosts</dt>
                <dd className="mt-1 text-body">{result.meta.thirdPartyHosts}</dd>
              </div>
              <div>
                <dt className="text-label">robots.txt</dt>
                <dd className="mt-1 text-body">
                  {result.meta.hasRobotsTxt ? "Found" : "Not found"}
                </dd>
              </div>
              <div>
                <dt className="text-label">Images missing alt</dt>
                <dd className="mt-1 text-body">{result.meta.imagesMissingAlt}</dd>
              </div>
              <div>
                <dt className="text-label">Open Graph / schema</dt>
                <dd className="mt-1 text-body">
                  {result.meta.hasOpenGraph ? "Open Graph" : "No Open Graph"}
                  {", "}
                  {result.meta.hasStructuredData ? "JSON-LD" : "no JSON-LD"}
                </dd>
              </div>
            </dl>
          </Panel>
        </TabsContent>

        <TabsContent value="checks" className="mt-6 flex flex-col gap-6">
          {categoryOrder.map((category) => (
            <Panel key={category}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-heading text-xl sm:text-2xl">
                  {checkCategoryLabels[category]}
                </h2>
                <span className="text-caption">
                  Score {result.scores[category]} · {checkGroups[category].length}{" "}
                  checks
                </span>
              </div>
              <div className="mt-6">
                <CheckList checks={checkGroups[category]} />
              </div>
            </Panel>
          ))}
        </TabsContent>

        <TabsContent value="tech" className="mt-6">
          <Panel>
            <h2 className="text-heading text-xl sm:text-2xl">Tech stack</h2>
            <p className="text-description mt-1">
              Detected from HTML signatures, scripts, and response headers.
            </p>
            {result.techStack.length > 0 ? (
              <div className="mt-6 flex flex-col gap-6">
                {techCategoryOrder
                  .filter((category) => techGroups.has(category))
                  .map((category) => {
                    const items = techGroups.get(category)!
                    return (
                  <div key={category}>
                    <h3 className="text-label mb-3">
                      {techCategoryLabels[category]}
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <li
                          key={`${category}-${item.name}`}
                          style={squircle}
                          className="rounded-squircle-md border border-border bg-muted/20 px-3 py-1.5 text-sm"
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
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Panel>
            <h2 className="text-heading text-xl sm:text-2xl">Analytics & tracking</h2>
            <p className="text-description mt-1">
              Tracking scripts, tag managers, ad pixels, and marketing tools detected
              on the page.
            </p>
            {result.analytics.length > 0 ? (
              <div className="mt-6 flex flex-col gap-6">
                {analyticsKindOrder
                  .filter((kind) => analyticsGroups.has(kind))
                  .map((kind) => {
                    const items = analyticsGroups.get(kind)!
                    return (
                      <div key={kind}>
                        <h3 className="text-label mb-3">
                          {analyticsKindLabels[kind]}
                        </h3>
                        <ul className="flex flex-col gap-3">
                          {items.map((item) => (
                            <li
                              key={item.name}
                              style={squircle}
                              className="rounded-squircle-md border border-border bg-muted/20 px-4 py-3"
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
        </TabsContent>

        <TabsContent value="fonts" className="mt-6">
          <Panel>
            <h2 className="text-heading text-xl sm:text-2xl">Fonts</h2>
            <p className="text-description mt-1">
              Font families referenced in stylesheets, font providers, and inline
              CSS.
            </p>
            {result.fonts.length > 0 ? (
              <ul className="mt-6 flex flex-col gap-3">
                {result.fonts.map((font) => (
                  <li
                    key={`${font.source}-${font.name}`}
                    style={squircle}
                    className="flex items-center justify-between gap-4 rounded-squircle-md border border-border bg-muted/20 px-4 py-3"
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
