"use client"

import { useState } from "react"
import { CopyIcon, CheckIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"

type ApiCodeBlockProps = {
  code: string
  language?: string
  className?: string
}

export function ApiCodeBlock({ code, language, className }: ApiCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      style={squircle}
      className={cn(
        "relative overflow-hidden rounded-squircle-lg border border-border bg-muted/20",
        surfaceDepth("lg"),
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2">
        <span className="text-label text-muted-foreground">
          {language ?? "Example"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  )
}
