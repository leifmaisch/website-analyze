"use client"

import { useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { ScanError, ScanLoading, ScanResults } from "@/components/scan/scan-results"
import { SiteNavbar } from "@/components/site-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section"
import type { ScanResult } from "@/lib/scan-types"
import { totalCheckCount } from "@/lib/scan-categories"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

const exampleDomains = ["netcha.se", "reachase.com", "steam-friends.com"]

export function ScanPage() {
  const searchParams = useSearchParams()
  const initialDomain = searchParams.get("domain") ?? ""

  const [domain, setDomain] = useState(initialDomain)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!result) return
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [result])

  async function runScan(targetDomain: string) {
    const trimmed = targetDomain.trim()
    if (!trimmed) return

    setDomain(trimmed)
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed }),
      })

      const data = (await response.json()) as ScanResult & { error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to scan this website")
      }

      setResult(data)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to scan this website"
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await runScan(domain)
  }

  async function handleExampleClick(example: string) {
    await runScan(example)
  }

  return (
    <>
      <SiteNavbar />

      <main className="flex-1">
        <Section className="pb-8 md:pb-12">
          <SectionHeader>
            <SectionTitle>Free website scan</SectionTitle>
            <SectionDescription>
              Enter a domain for {totalCheckCount} checks, mobile responsive
              analysis, and desktop and mobile screenshots.
            </SectionDescription>
          </SectionHeader>

          <div
            style={squircle}
            className={cn(
              "mx-auto max-w-2xl rounded-squircle-xl border border-border bg-card p-6 sm:p-8",
              surfaceDepth("lg")
            )}
          >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="domain">Website domain</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="domain"
                    name="domain"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="example.com"
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    disabled={loading}
                    required
                    className="min-w-0 flex-1"
                  />
                  <Button
                    type="submit"
                    shape="squircle"
                    size="icon-lg"
                    disabled={loading || !domain.trim()}
                    aria-label={loading ? "Scanning website" : "Check website"}
                  >
                    <MagnifyingGlassIcon className="size-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-caption">Try:</span>
                  {exampleDomains.map((example) => (
                    <button
                      key={example}
                      type="button"
                      disabled={loading}
                      onClick={() => handleExampleClick(example)}
                      style={squircle}
                      className="rounded-full border border-border bg-muted/30 px-3 py-1 text-label transition-colors hover:bg-muted/60 disabled:opacity-50"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {loading ? <ScanLoading /> : null}

          {error ? (
            <div className="mx-auto mt-10 max-w-2xl">
              <ScanError message={error} />
            </div>
          ) : null}

          {result ? (
            <div ref={resultsRef} className="mt-12 scroll-mt-24">
              <ScanResults result={result} />
            </div>
          ) : null}
        </Section>
      </main>
    </>
  )
}
