import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SharedScanPage } from "@/components/scan/shared-scan-page"
import { getScanByShareId } from "@/lib/scans-store"
import { createSharedScanMetadata } from "@/lib/site-metadata"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: PageProps<"/r/[id]">): Promise<Metadata> {
  const { id } = await params
  const result = await getScanByShareId(id)

  if (!result) {
    return { title: "Scan not found" }
  }

  return createSharedScanMetadata(result, id)
}

export default async function Page({ params }: PageProps<"/r/[id]">) {
  const { id } = await params
  const result = await getScanByShareId(id)

  if (!result) {
    notFound()
  }

  return <SharedScanPage result={result} />
}
