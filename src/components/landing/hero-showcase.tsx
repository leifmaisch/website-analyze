import {
  ChartLineUpIcon,
  GaugeIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr"

import { totalCheckCount } from "@/lib/scan-categories"

export function HeroShowcaseContent() {
  return (
    <div className="flex h-full min-h-[200px] flex-col justify-between p-6 sm:min-h-[280px] sm:p-8 md:min-h-[300px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-label">
          <span className="size-2 rounded-full bg-primary" />
          Live scan
        </div>
        <span className="text-caption">{totalCheckCount} checks</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-squircle-md border border-border bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-label">
            <ChartLineUpIcon className="size-4 text-primary" />
            Overall
          </div>
          <p className="text-stat-value">88</p>
        </div>
        <div className="rounded-squircle-md border border-border bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-label">
            <GaugeIcon className="size-4 text-primary" />
            Performance
          </div>
          <p className="text-stat-value">93</p>
        </div>
        <div className="rounded-squircle-md border border-border bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-label">
            <MagnifyingGlassIcon className="size-4 text-primary" />
            SEO
          </div>
          <p className="text-stat-value">83</p>
        </div>
        <div className="rounded-squircle-md border border-border bg-background/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-label">
            <ShieldCheckIcon className="size-4 text-primary" />
            Security
          </div>
          <p className="text-stat-value">84</p>
        </div>
      </div>
    </div>
  )
}
