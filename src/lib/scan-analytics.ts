export type AnalyticsKind =
  | "web-analytics"
  | "tag-manager"
  | "advertising"
  | "heatmap"
  | "session-recording"
  | "marketing"
  | "chat"
  | "product-analytics"

export type AnalyticsItem = {
  name: string
  kind: AnalyticsKind
  ids?: string[]
  evidence?: string
}

type AnalyticsRule = {
  name: string
  kind: AnalyticsKind
  detect: RegExp
  idPatterns?: RegExp[]
  evidence?: string
}

const analyticsRules: AnalyticsRule[] = [
  {
    name: "Google Tag Manager",
    kind: "tag-manager",
    detect: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/,
    idPatterns: [/GTM-[A-Z0-9]+/g],
  },
  {
    name: "Google Analytics 4",
    kind: "web-analytics",
    detect: /googletagmanager\.com\/gtag\/js|gtag\s*\(|G-[A-Z0-9]{6,}/,
    idPatterns: [/G-[A-Z0-9]{6,}/g],
  },
  {
    name: "Google Analytics (Universal)",
    kind: "web-analytics",
    detect: /google-analytics\.com\/analytics\.js|UA-\d+-\d+/,
    idPatterns: [/UA-\d+-\d+/g],
  },
  {
    name: "Google Ads",
    kind: "advertising",
    detect: /googleadservices\.com|gtag\/js\?id=AW-|AW-\d+/,
    idPatterns: [/AW-\d+/g],
  },
  {
    name: "Meta Pixel",
    kind: "advertising",
    detect: /connect\.facebook\.net\/.*\/fbevents\.js|fbq\s*\(/,
    idPatterns: [/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g],
  },
  {
    name: "LinkedIn Insight Tag",
    kind: "advertising",
    detect: /snap\.licdn\.com\/li\.lms-analytics|_linkedin_partner_id/,
    idPatterns: [/partner_id['":\s]+(\d+)/g],
  },
  {
    name: "Twitter/X Pixel",
    kind: "advertising",
    detect: /static\.ads-twitter\.com\/uwt\.js|twq\s*\(/,
  },
  {
    name: "TikTok Pixel",
    kind: "advertising",
    detect: /analytics\.tiktok\.com|ttq\.load/,
    idPatterns: [/ttq\.load\s*\(\s*['"]([A-Z0-9]+)['"]/g],
  },
  {
    name: "Pinterest Tag",
    kind: "advertising",
    detect: /pintrk\s*\(|s\.pinimg\.com\/ct\/core\.js/,
  },
  {
    name: "Snapchat Pixel",
    kind: "advertising",
    detect: /sc-static\.net\/scevent\.min\.js|snaptr\s*\(/,
  },
  {
    name: "Reddit Pixel",
    kind: "advertising",
    detect: /redditstatic\.com\/ads\/pixel\.js|rdt\s*\(/,
  },
  {
    name: "Plausible",
    kind: "web-analytics",
    detect: /plausible\.io\/js|plausible\.io\/api/,
    idPatterns: [/data-domain=["']([^"']+)["']/g],
  },
  {
    name: "One Dollar Stats",
    kind: "web-analytics",
    detect:
      /onedollarstats\.com|assets\.onedollarstats\.com\/(?:stonks|tracker)\.js|collector\.onedollarstats\.com\/events|"onedollarstats"|from\s+["']onedollarstats["']/,
    idPatterns: [
      /data-site-id=["']([^"']+)["']/g,
      /data-hostname=["']([^"']+)["']/g,
    ],
  },
  {
    name: "Fathom",
    kind: "web-analytics",
    detect: /cdn\.usefathom\.com/,
    idPatterns: [/cdn\.usefathom\.com\/script\.js\?site=([A-Z0-9]+)/gi],
  },
  {
    name: "Simple Analytics",
    kind: "web-analytics",
    detect: /scripts\.simpleanalyticscdn\.com|simpleanalyticscdn\.com/,
  },
  {
    name: "Umami",
    kind: "web-analytics",
    detect: /umami\.js|data-website-id=/,
    idPatterns: [/data-website-id=["']([^"']+)["']/g],
  },
  {
    name: "GoatCounter",
    kind: "web-analytics",
    detect: /goatcounter\.com\/count/,
    idPatterns: [/goatcounter\.com\/count\?.*?\bs=([^&"']+)/g],
  },
  {
    name: "Matomo",
    kind: "web-analytics",
    detect: /matomo\.js|piwik\.js|_paq\.push/,
  },
  {
    name: "Clicky",
    kind: "web-analytics",
    detect: /static\.getclicky\.com|clicky\.com\/js/,
    idPatterns: [/clicky_site_ids\.push\((\d+)\)/g],
  },
  {
    name: "PostHog",
    kind: "product-analytics",
    detect: /posthog\.init|posthog-js|app\.posthog\.com/,
    idPatterns: [/posthog\.init\s*\(\s*['"]([^'"]+)['"]/g],
  },
  {
    name: "Mixpanel",
    kind: "product-analytics",
    detect: /mixpanel\.init|cdn\.mxpnl\.com/,
    idPatterns: [/mixpanel\.init\s*\(\s*['"]([^'"]+)['"]/g],
  },
  {
    name: "Amplitude",
    kind: "product-analytics",
    detect: /amplitude\.getInstance|cdn\.amplitude\.com/,
    idPatterns: [/amplitude\.getInstance\(\)\.init\s*\(\s*['"]([^'"]+)['"]/g],
  },
  {
    name: "Heap",
    kind: "product-analytics",
    detect: /heap\.load|heapanalytics\.com/,
    idPatterns: [/heap\.load\s*\(\s*['"](\d+)['"]/g],
  },
  {
    name: "Segment",
    kind: "tag-manager",
    detect: /cdn\.segment\.com\/analytics\.js|analytics\.load\s*\(/,
    idPatterns: [/analytics\.load\s*\(\s*['"]([^'"]+)['"]/g],
  },
  {
    name: "Microsoft Clarity",
    kind: "heatmap",
    detect: /clarity\.ms\/tag|window\.clarity/,
    idPatterns: [/clarity\.ms\/tag\/([a-z0-9]+)/gi],
  },
  {
    name: "Hotjar",
    kind: "heatmap",
    detect: /static\.hotjar\.com|hjSettings/,
    idPatterns: [/hjid['":\s]+(\d+)/g, /hjsv['":\s]+(\d+)/g],
  },
  {
    name: "Crazy Egg",
    kind: "heatmap",
    detect: /script\.crazyegg\.com/,
  },
  {
    name: "FullStory",
    kind: "session-recording",
    detect: /fullstory\.com\/s\/fs\.js|window\._fs_/,
    idPatterns: [/FS\.identify|_fs_org['":\s]+['"]([^'"]+)['"]/g],
  },
  {
    name: "LogRocket",
    kind: "session-recording",
    detect: /cdn\.logrocket\.io|LogRocket\.init/,
    idPatterns: [/LogRocket\.init\s*\(\s*['"]([^'"]+)['"]/g],
  },
  {
    name: "Lucky Orange",
    kind: "session-recording",
    detect: /luckyorange\.com|lo\.src/,
  },
  {
    name: "Mouseflow",
    kind: "session-recording",
    detect: /mouseflow\.com|mf\.src/,
  },
  {
    name: "HubSpot",
    kind: "marketing",
    detect: /js\.hs-scripts\.com|hsforms\.net|hubspot\.com/,
    idPatterns: [/js\.hs-scripts\.com\/(\d+)\.js/g],
  },
  {
    name: "Mailchimp",
    kind: "marketing",
    detect: /chimpstatic\.com|list-manage\.com/,
  },
  {
    name: "Klaviyo",
    kind: "marketing",
    detect: /static\.klaviyo\.com|klaviyo\.init/,
  },
  {
    name: "Intercom",
    kind: "chat",
    detect: /widget\.intercom\.io|intercomSettings/,
    idPatterns: [/app_id['":\s]+['"]([a-z0-9]+)['"]/gi],
  },
  {
    name: "Crisp",
    kind: "chat",
    detect: /client\.crisp\.chat|CRISP_WEBSITE_ID/,
    idPatterns: [/CRISP_WEBSITE_ID=['"]([^'"]+)['"]/g],
  },
  {
    name: "Drift",
    kind: "chat",
    detect: /js\.driftt\.com|drift\.load/,
  },
  {
    name: "Tawk.to",
    kind: "chat",
    detect: /embed\.tawk\.to/,
  },
  {
    name: "Vercel Analytics",
    kind: "web-analytics",
    detect: /va\.vercel-scripts\.com|_vercel\.insights/,
  },
  {
    name: "Cloudflare Web Analytics",
    kind: "web-analytics",
    detect: /static\.cloudflareinsights\.com|cloudflareinsights\.com\/beacon/,
  },
  {
    name: "Adobe Analytics",
    kind: "web-analytics",
    detect: /omniture\.com|AppMeasurement\.js|s_code\.js|adobe\.com\/analytics/,
  },
  {
    name: "Pendo",
    kind: "product-analytics",
    detect: /cdn\.pendo\.io|pendo\.initialize/,
  },
]

export const analyticsKindLabels: Record<AnalyticsKind, string> = {
  "web-analytics": "Web analytics",
  "tag-manager": "Tag managers",
  advertising: "Advertising pixels",
  heatmap: "Heatmaps",
  "session-recording": "Session recording",
  marketing: "Marketing automation",
  chat: "Chat widgets",
  "product-analytics": "Product analytics",
}

export const analyticsKindOrder: AnalyticsKind[] = [
  "web-analytics",
  "tag-manager",
  "product-analytics",
  "advertising",
  "heatmap",
  "session-recording",
  "marketing",
  "chat",
]

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function extractIds(html: string, patterns: RegExp[]): string[] {
  const ids: string[] = []

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const value = match[1] ?? match[0]
      if (value) ids.push(value)
    }
  }

  return uniqueStrings(ids)
}

function uniqueByName(items: AnalyticsItem[]): AnalyticsItem[] {
  const seen = new Set<string>()
  const result: AnalyticsItem[] = []

  for (const item of items) {
    const key = item.name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }

  return result
}

export function detectAnalytics(html: string): AnalyticsItem[] {
  const detected: AnalyticsItem[] = []

  for (const rule of analyticsRules) {
    if (!rule.detect.test(html)) continue

    const ids = rule.idPatterns ? extractIds(html, rule.idPatterns) : undefined

    detected.push({
      name: rule.name,
      kind: rule.kind,
      ids: ids && ids.length > 0 ? ids : undefined,
      evidence: rule.evidence ?? rule.detect.source.slice(0, 60),
    })
  }

  return uniqueByName(detected)
}
