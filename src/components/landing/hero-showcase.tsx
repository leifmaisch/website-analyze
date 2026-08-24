import { ChartLineUpIcon, GaugeIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr"

export function HeroShowcaseContent() {
  return (
    <div className="flex h-full min-h-[200px] flex-col justify-between p-6 sm:min-h-[280px] sm:p-8 md:min-h-[300px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-label">
          <span className="size-2 rounded-full bg-primary" />
          Live scan
        </div>
        <span className="text-caption">example.com</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-squircle-md border border-border bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-label">
            <GaugeIcon className="size-4 text-primary" />
            Performance
          </div>
          <p className="text-stat-value">94</p>
        </div>
        <div className="rounded-squircle-md border border-border bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-label">
            <MagnifyingGlassIcon className="size-4 text-primary" />
            SEO
          </div>
          <p className="text-stat-value">88</p>
        </div>
        <div className="rounded-squircle-md border border-border bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-label">
            <ChartLineUpIcon className="size-4 text-primary" />
            Uptime
          </div>
          <p className="text-stat-value">99.9%</p>
        </div>
      </div>
    </div>
  )
}
