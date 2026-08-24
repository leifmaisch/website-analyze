import type { Metadata } from "next"
import { Suspense } from "react"

import { ScanPage } from "@/components/scan/scan-page"

export const metadata: Metadata = {
  title: "Free scan | SiteAnalyze",
  description: "Enter a domain and get a free website health check.",
}

export default function Page() {
  return (
    <Suspense>
      <ScanPage />
    </Suspense>
  )
}
