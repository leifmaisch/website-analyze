import { Suspense } from "react"

import { ScanPage } from "@/components/scan/scan-page"
import { createScanMetadata } from "@/lib/site-metadata"

export const metadata = createScanMetadata()

export default function Page() {
  return (
    <Suspense>
      <ScanPage />
    </Suspense>
  )
}
