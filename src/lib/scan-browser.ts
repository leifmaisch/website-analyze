import "server-only"

import { spawn } from "node:child_process"
import path from "node:path"

import type { ScanCheck } from "@/lib/scan-types"

export type ScanScreenshot = {
  viewport: "desktop" | "mobile"
  width: number
  height: number
  label: string
  image: string
}

export type ResponsiveMetrics = {
  captured: boolean
  mobileHorizontalOverflow: number
  desktopHorizontalOverflow: number
  smallTouchTargets: number
  smallTextElements: number
  overflowingImages: number
}

export type BrowserCaptureResult = {
  screenshots: ScanScreenshot[]
  responsive: ResponsiveMetrics
}

const emptyResponsive: ResponsiveMetrics = {
  captured: false,
  mobileHorizontalOverflow: 0,
  desktopHorizontalOverflow: 0,
  smallTouchTargets: 0,
  smallTextElements: 0,
  overflowingImages: 0,
}

const captureScriptPath = path.join(
  process.cwd(),
  "scripts",
  "browser-capture.mjs"
)

function runBrowserCapture(url: string): Promise<BrowserCaptureResult> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [captureScriptPath, url], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""
    let settled = false

    const finish = (result: BrowserCaptureResult) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      child.kill()
      resolve(result)
    }

    const timer = setTimeout(() => {
      finish({ screenshots: [], responsive: emptyResponsive })
    }, 45000)

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString()
    })

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString()
    })

    child.on("error", (error) => {
      console.error("browser capture spawn failed:", error)
      finish({ screenshots: [], responsive: emptyResponsive })
    })

    child.on("close", (code) => {
      if (code !== 0 || !stdout.trim()) {
        if (stderr.trim()) {
          console.error("browser capture failed:", stderr.trim())
        }
      }
      try {
        const parsed = JSON.parse(stdout) as BrowserCaptureResult
        finish({
          screenshots: parsed.screenshots ?? [],
          responsive: parsed.responsive ?? emptyResponsive,
        })
      } catch {
        finish({ screenshots: [], responsive: emptyResponsive })
      }
    })
  })
}

export async function captureBrowserInsights(
  url: string
): Promise<BrowserCaptureResult> {
  return runBrowserCapture(url)
}

export function buildResponsiveChecks(responsive: ResponsiveMetrics): ScanCheck[] {
  if (!responsive.captured) {
    return [
      {
        id: "no-horizontal-scroll",
        label: "No horizontal scroll on mobile",
        status: "warn",
        detail: "Could not render the page for a mobile viewport check",
      },
      {
        id: "touch-target-size",
        label: "Touch targets are large enough",
        status: "warn",
        detail: "Could not measure interactive elements on mobile",
      },
      {
        id: "mobile-readable-text",
        label: "Readable text size on mobile",
        status: "warn",
        detail: "Could not measure text sizes on mobile",
      },
      {
        id: "responsive-images",
        label: "Images fit mobile viewport",
        status: "warn",
        detail: "Could not verify image overflow on mobile",
      },
    ]
  }

  return [
    {
      id: "no-horizontal-scroll",
      label: "No horizontal scroll on mobile",
      status:
        responsive.mobileHorizontalOverflow === 0
          ? "pass"
          : responsive.mobileHorizontalOverflow <= 8
            ? "warn"
            : "fail",
      detail:
        responsive.mobileHorizontalOverflow === 0
          ? "No horizontal overflow detected at 390px width"
          : `${responsive.mobileHorizontalOverflow}px horizontal overflow detected`,
    },
    {
      id: "touch-target-size",
      label: "Touch targets are large enough",
      status:
        responsive.smallTouchTargets === 0
          ? "pass"
          : responsive.smallTouchTargets <= 4
            ? "warn"
            : "fail",
      detail:
        responsive.smallTouchTargets === 0
          ? "Interactive elements meet 44px touch target guidance"
          : `${responsive.smallTouchTargets} elements smaller than 44px`,
    },
    {
      id: "mobile-readable-text",
      label: "Readable text size on mobile",
      status:
        responsive.smallTextElements === 0
          ? "pass"
          : responsive.smallTextElements <= 6
            ? "warn"
            : "fail",
      detail:
        responsive.smallTextElements === 0
          ? "No text below 12px detected on mobile"
          : `${responsive.smallTextElements} text elements below 12px`,
    },
    {
      id: "responsive-images",
      label: "Images fit mobile viewport",
      status:
        responsive.overflowingImages === 0
          ? "pass"
          : responsive.overflowingImages <= 2
            ? "warn"
            : "fail",
      detail:
        responsive.overflowingImages === 0
          ? "No images wider than the mobile viewport"
          : `${responsive.overflowingImages} images overflow the mobile viewport`,
    },
  ]
}
