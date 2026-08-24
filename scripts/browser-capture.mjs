import { chromium } from "playwright"

const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Webcheck/1.0"

const viewports = {
  desktop: { width: 1280, height: 800, label: "Desktop" },
  mobile: { width: 390, height: 844, label: "Mobile" },
}

async function measureViewport(page) {
  return page.evaluate(() => {
    const root = document.documentElement
    const horizontalOverflow = Math.max(0, root.scrollWidth - root.clientWidth)

    const interactiveSelector =
      'a, button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"]'
    let smallTouchTargets = 0

    for (const element of document.querySelectorAll(interactiveSelector)) {
      const rect = element.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) continue
      if (rect.width < 44 || rect.height < 44) {
        smallTouchTargets++
      }
    }

    let smallTextElements = 0
    const textSelector = "p, span, li, a, button, label, td, th, h1, h2, h3, h4, h5, h6"

    for (const element of document.querySelectorAll(textSelector)) {
      const style = window.getComputedStyle(element)
      const fontSize = Number.parseFloat(style.fontSize)
      const text = element.textContent?.trim() ?? ""
      if (!text || fontSize <= 0) continue
      if (fontSize < 12) {
        smallTextElements++
      }
    }

    let overflowingImages = 0
    for (const image of document.querySelectorAll("img")) {
      const rect = image.getBoundingClientRect()
      if (rect.width > window.innerWidth + 1) {
        overflowingImages++
      }
    }

    return {
      horizontalOverflow,
      smallTouchTargets,
      smallTextElements,
      overflowingImages,
    }
  })
}

async function main() {
  const url = process.argv[2]

  if (!url) {
    process.stdout.write(JSON.stringify({ error: "Missing URL" }))
    process.exit(1)
  }

  const emptyResponsive = {
    captured: false,
    mobileHorizontalOverflow: 0,
    desktopHorizontalOverflow: 0,
    smallTouchTargets: 0,
    smallTextElements: 0,
    overflowingImages: 0,
  }

  let browser

  try {
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ userAgent })
    const page = await context.newPage()
    page.setDefaultTimeout(20000)

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20000 })
    } catch {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 })
    }

    const screenshots = []
    const responsive = { ...emptyResponsive, captured: true }

    for (const [viewport, size] of Object.entries(viewports)) {
      await page.setViewportSize({ width: size.width, height: size.height })
      await new Promise((resolve) => setTimeout(resolve, 400))

      const measured = await measureViewport(page)

      if (viewport === "mobile") {
        responsive.mobileHorizontalOverflow = measured.horizontalOverflow
        responsive.smallTouchTargets = measured.smallTouchTargets
        responsive.smallTextElements = measured.smallTextElements
        responsive.overflowingImages = measured.overflowingImages
      } else {
        responsive.desktopHorizontalOverflow = measured.horizontalOverflow
      }

      const buffer = await page.screenshot({
        type: "jpeg",
        quality: 72,
        fullPage: false,
      })

      screenshots.push({
        viewport,
        width: size.width,
        height: size.height,
        label: size.label,
        image: `data:image/jpeg;base64,${buffer.toString("base64")}`,
      })
    }

    process.stdout.write(JSON.stringify({ screenshots, responsive }))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Capture failed"
    process.stdout.write(
      JSON.stringify({
        screenshots: [],
        responsive: emptyResponsive,
        error: message,
      })
    )
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

main()
