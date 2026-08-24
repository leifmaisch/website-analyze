import { NextResponse } from "next/server"

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
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to scan this website"

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
