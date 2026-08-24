import "server-only"

import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

import { db } from "@/db"
import { scans } from "@/db/schema"
import type { ScanResult } from "@/lib/scan-types"

function withoutShareId(result: ScanResult): ScanResult {
  const { shareId: _shareId, ...rest } = result
  return rest
}

export async function saveScanResult(result: ScanResult): Promise<string> {
  const id = nanoid(12)
  const payload = withoutShareId(result)

  await db.insert(scans).values({
    id,
    domain: payload.domain,
    result: payload,
  })

  return id
}

export async function getScanByShareId(shareId: string): Promise<ScanResult | null> {
  const record = await db.query.scans.findFirst({
    where: eq(scans.id, shareId),
  })

  if (!record) {
    return null
  }

  return {
    ...record.result,
    shareId: record.id,
  }
}
