import { ogImageContentType, ogImageSize } from "@/lib/og-shared"
import { createOgImage } from "@/lib/og-image"
import { createScanOgImage } from "@/lib/og-scan-image"
import { getScanByShareId } from "@/lib/scans-store"

export const alt = "SiteAnalyze scan result"
export const size = ogImageSize
export const contentType = ogImageContentType
export const dynamic = "force-dynamic"

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    return createOgImage()
  }

  const result = await getScanByShareId(id)

  if (!result) {
    return createOgImage()
  }

  return createScanOgImage(result)
}
