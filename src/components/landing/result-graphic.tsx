import {
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr"

import { StatCard } from "@/components/ui/stat-card"
import { checkCategoryLabels, totalCheckCount } from "@/lib/scan-categories"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

const sampleScores = [
  { id: "performance" as const, value: 93 },
  { id: "seo" as const, value: 83 },
  { id: "security" as const, value: 84 },
  { id: "accessibility" as const, value: 91 },
  { id: "privacy" as const, value: 100 },
  { id: "content" as const, value: 91 },
  { id: "infrastructure" as const, value: 100 },
  { id: "mobile" as const, value: 65 },
]

const sampleChecks = [
  { label: "Response time under 2s", status: "pass" as const, detail: "194ms" },
  { label: "Served over HTTPS", status: "pass" as const, detail: "Secure connection" },
  { label: "Strict-Transport-Security header", status: "warn" as const, detail: "Enable HSTS" },
]

const sampleTech = ["Next.js", "Tailwind CSS", "shadcn/ui", "Cloudflare"]
const sampleAnalytics = ["Google Analytics 4", "Cloudflare Web Analytics"]

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-label">{label}</span>
        <span className="text-caption text-numeric font-mono tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-squircle-sm bg-muted/80">
        <div
          className="h-full rounded-squircle-sm bg-primary transition-[width]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function CheckRow({
  label,
  status,
  detail,
}: {
  label: string
  status: "pass" | "warn"
  detail: string
}) {
  return (
    <div
      style={squircle}
      className="flex items-start gap-3 rounded-squircle-md border border-border bg-muted/20 px-4 py-3"
    >
      {status === "pass" ? (
        <CheckCircleIcon className="size-4 shrink-0 text-primary" />
      ) : (
        <WarningCircleIcon className="size-4 shrink-0 text-amber-500" />
      )}
      <div className="min-w-0">
        <p className="text-body text-sm font-medium">{label}</p>
        <p className="text-description mt-0.5 text-xs">{detail}</p>
      </div>
    </div>
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
      <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/20 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="text-label">Scan complete</span>
        </div>
        <span className="text-caption truncate">netcha.se</span>
      </div>

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Overall score" value="88" change={`${totalCheckCount} checks run`} />
          <StatCard
            label="Passed"
            value="44"
            footer={
              <div className="text-caption text-numeric grid grid-cols-2 gap-2 font-mono">
                <span className="truncate text-amber-500 tabular-nums">18 warn</span>
                <span className="truncate text-right text-white/45 tabular-nums">0 fail</span>
              </div>
            }
          />
          <StatCard label="Performance" value="93" change="194ms response" />
          <StatCard label="Security" value="84" change="HTTP 200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div
            style={squircle}
            className="rounded-squircle-lg border border-border bg-muted/20 p-5 sm:p-6"
          >
            <h3 className="text-heading text-lg">Score breakdown</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {sampleScores.map((score) => (
                <ScoreBar
                  key={score.id}
                  label={checkCategoryLabels[score.id]}
                  value={score.value}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              style={squircle}
              className="rounded-squircle-lg border border-border bg-muted/20 p-5 sm:p-6"
            >
              <h3 className="text-heading text-lg">Tech stack</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {sampleTech.map((item) => (
                  <li
                    key={item}
                    style={squircle}
                    className="rounded-squircle-md border border-border bg-background/80 px-3 py-1.5 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={squircle}
              className="rounded-squircle-lg border border-border bg-muted/20 p-5 sm:p-6"
            >
              <h3 className="text-heading text-lg">Analytics</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {sampleAnalytics.map((item) => (
                  <li
                    key={item}
                    style={squircle}
                    className="rounded-squircle-md border border-border bg-background/80 px-3 py-2 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          style={squircle}
          className="rounded-squircle-lg border border-border bg-muted/20 p-5 sm:p-6"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {["Overview", "Checks", "Tech stack", "Analytics", "Fonts"].map((tab, index) => (
              <span
                key={tab}
                style={squircle}
                className={cn(
                  "rounded-squircle-md px-3 py-1.5 text-sm",
                  index === 1
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background/60 text-muted-foreground"
                )}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {sampleChecks.map((check) => (
              <CheckRow
                key={check.label}
                label={check.label}
                status={check.status}
                detail={check.detail}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
