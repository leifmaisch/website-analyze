import { NextResponse } from "next/server"

import { saveScanResult } from "@/lib/scans-store"
import { scanWebsite } from "@/lib/scan"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { domain?: string }
    const domain = body.domain?.trim()

    if (!domain) {
      return NextResponse.json(
        { error: "Enter a domain to scan" },
        { status: 400 }
      )
    }

    const result = await scanWebsite(domain)
    const shareId = await saveScanResult(result)

    return NextResponse.json({ ...result, shareId })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to scan this website"

    const status =
      error instanceof Error && error.message === "DATABASE_URL is not set"
        ? 503
        : 400

    return NextResponse.json({ error: message }, { status })
  }
}
