import "server-only"

import tls from "tls"

const userAgent = "SiteAnalyze/1.0 (+https://siteanalyze.local)"

export type RedirectHop = {
  url: string
  status: number
}

export type SslInfo = {
  validTo?: Date
  daysUntilExpiry?: number
  issuer?: string
}

export type DnsInfo = {
  a: string[]
  aaaa: string[]
  mx: string[]
  txt: string[]
}

export async function getRedirectChain(
  startUrl: string,
  maxHops = 10
): Promise<RedirectHop[]> {
  const chain: RedirectHop[] = []
  let current = startUrl

  for (let hop = 0; hop < maxHops; hop++) {
    const response = await fetch(current, {
      redirect: "manual",
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(10000),
    })

    chain.push({ url: current, status: response.status })

    if (response.status < 300 || response.status >= 400) {
      break
    }

    const location = response.headers.get("location")
    if (!location) break

    current = new URL(location, current).toString()
  }

  return chain
}

export function checkSslCertificate(hostname: string): Promise<SslInfo> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
      },
      () => {
        const cert = socket.getPeerCertificate()
        socket.end()

        if (!cert || !cert.valid_to) {
          resolve({})
          return
        }

        const validTo = new Date(cert.valid_to)
        const daysUntilExpiry = Math.ceil(
          (validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )

        resolve({
          validTo,
          daysUntilExpiry,
          issuer:
            typeof cert.issuer === "object"
              ? Array.isArray(cert.issuer.O)
                ? cert.issuer.O[0]
                : cert.issuer.O
              : undefined,
        })
      }
    )

    socket.setTimeout(8000, () => {
      socket.destroy()
      resolve({})
    })

    socket.on("error", () => resolve({}))
  })
}

export async function lookupDns(hostname: string): Promise<DnsInfo> {
  const dns = await import("dns/promises")

  const [a, aaaa, mx, txt] = await Promise.all([
    dns.resolve4(hostname).catch(() => [] as string[]),
    dns.resolve6(hostname).catch(() => [] as string[]),
    dns.resolveMx(hostname).catch(() => [] as { exchange: string; priority: number }[]),
    dns.resolveTxt(hostname).catch(() => [] as string[][]),
  ])

  return {
    a,
    aaaa,
    mx: mx.map((record) => record.exchange),
    txt: txt.map((parts) => parts.join("")),
  }
}

export async function probeUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(6000),
      redirect: "follow",
    })
    return response.ok
  } catch {
    return false
  }
}

export async function probeUrls(
  urls: string[],
  limit = 5
): Promise<{ url: string; ok: boolean }[]> {
  const sample = urls.slice(0, limit)
  const results = await Promise.all(
    sample.map(async (url) => ({ url, ok: await probeUrl(url) }))
  )
  return results
}

export async function fetchExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(8000),
    })
    return response.ok
  } catch {
    return false
  }
}
