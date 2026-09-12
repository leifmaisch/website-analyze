import Link from "next/link"

import { ApiCodeBlock } from "@/components/api-docs/api-code-block"
import { ApiExamples } from "@/components/api-docs/api-examples"
import { SiteNavbar } from "@/components/site-navbar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Footer,
  FooterBar,
  FooterCopyright,
  FooterPanel,
  FooterServiceBy,
} from "@/components/ui/footer"
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section"
import {
  apiDocsDescription,
  exampleErrorResponses,
  exampleRequestBody,
  exampleSuccessResponse,
  getApiScanUrl,
  responseFieldDocs,
} from "@/lib/api-docs-content"
import { totalCheckCount } from "@/lib/scan-categories"
import { serviceProvider, siteName } from "@/lib/site-metadata"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"

type ApiDocsPageProps = {
  apiBaseUrl: string
}

function DocsCard({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      style={squircle}
      className={cn(
        "rounded-squircle-xl border border-border bg-card p-6 sm:p-8",
        surfaceDepth("lg"),
        className
      )}
    >
      <h2 className="mb-4 text-heading text-xl sm:text-2xl">{title}</h2>
      {children}
    </section>
  )
}

function MethodBadge({ method }: { method: "POST" }) {
  return (
    <span className="inline-flex min-h-7 items-center rounded-full bg-primary/10 px-2.5 text-label font-medium text-primary">
      {method}
    </span>
  )
}

export function ApiDocsPage({ apiBaseUrl }: ApiDocsPageProps) {
  const apiUrl = getApiScanUrl(apiBaseUrl)
  const exampleResponseJson = JSON.stringify(exampleSuccessResponse, null, 2)

  return (
    <>
      <SiteNavbar />

      <main id="main-content" className="flex-1">
        <Section className="pb-8 md:pb-12">
          <SectionHeader>
            <SectionTitle>API documentation</SectionTitle>
            <SectionDescription>{apiDocsDescription}</SectionDescription>
          </SectionHeader>

          <div
            style={squircle}
            className={cn(
              "mx-auto mb-10 max-w-3xl rounded-squircle-xl border border-border bg-card p-6 sm:p-8",
              surfaceDepth("lg")
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-2">
                <p className="text-label text-muted-foreground">Scan endpoint</p>
                <div className="flex flex-wrap items-center gap-2">
                  <MethodBadge method="POST" />
                  <code className="break-all font-mono text-body">{apiUrl}</code>
                </div>
              </div>
              <Button render={<Link href="/scan" />}>Try in the app</Button>
            </div>
          </div>

          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            <DocsCard title="Overview">
              <div className="space-y-4 text-description">
                <p>
                  The Webcheck API runs the same scan engine as the web app. Send a
                  domain, receive a full audit payload, and get a shareable report
                  link you can open at{" "}
                  <code className="font-mono text-body">/r/{"{shareId}"}</code>.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>No API key required today.</li>
                  <li>
                    Requests are synchronous and may take up to about a minute while
                    Playwright captures screenshots.
                  </li>
                  <li>
                    Use a client timeout of at least 120 seconds for reliable
                    integrations.
                  </li>
                  <li>
                    Private networks, localhost, and credential URLs are blocked.
                  </li>
                </ul>
              </div>
            </DocsCard>

            <DocsCard title="Request">
              <div className="space-y-4">
                <p className="text-description">
                  Send JSON with a <code className="font-mono">domain</code> field.
                  Domains without a protocol are scanned over HTTPS.
                </p>
                <ApiCodeBlock
                  code={JSON.stringify(exampleRequestBody, null, 2)}
                  language="JSON body"
                />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[28rem] text-left text-body">
                    <thead>
                      <tr className="border-b border-border text-label text-muted-foreground">
                        <th className="py-2 pr-4 font-medium">Field</th>
                        <th className="py-2 pr-4 font-medium">Type</th>
                        <th className="py-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/60">
                        <td className="py-3 pr-4 font-mono">domain</td>
                        <td className="py-3 pr-4">string</td>
                        <td className="py-3 text-description">
                          Required. Example: <code className="font-mono">example.com</code>{" "}
                          or <code className="font-mono">https://example.com</code>.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </DocsCard>

            <DocsCard title="Successful response">
              <div className="space-y-4">
                <p className="text-description">
                  Returns <code className="font-mono">200 OK</code> with a{" "}
                  <code className="font-mono">ScanResult</code> object containing{" "}
                  {totalCheckCount} checks, category scores, screenshots, and
                  detections.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-left text-body">
                    <thead>
                      <tr className="border-b border-border text-label text-muted-foreground">
                        <th className="py-2 pr-4 font-medium">Field</th>
                        <th className="py-2 pr-4 font-medium">Type</th>
                        <th className="py-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responseFieldDocs.map((row) => (
                        <tr key={row.field} className="border-b border-border/60 align-top">
                          <td className="py-3 pr-4 font-mono">{row.field}</td>
                          <td className="py-3 pr-4 text-description">{row.type}</td>
                          <td className="py-3 text-description">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ApiCodeBlock
                  code={exampleResponseJson}
                  language="200 OK · truncated example"
                />
                <p className="text-caption text-muted-foreground">
                  The live response includes all {totalCheckCount} checks. Screenshot
                  values are base64-encoded PNG data URLs and can be large.
                </p>
              </div>
            </DocsCard>

            <DocsCard title="Errors">
              <div className="space-y-4">
                <p className="text-description">
                  Failed requests return JSON with an <code className="font-mono">error</code>{" "}
                  string.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-left text-body">
                    <thead>
                      <tr className="border-b border-border text-label text-muted-foreground">
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 pr-4 font-medium">Example body</th>
                        <th className="py-2 font-medium">When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exampleErrorResponses.map((row) => (
                        <tr key={row.status + row.body.error} className="border-b border-border/60 align-top">
                          <td className="py-3 pr-4 font-mono">{row.status}</td>
                          <td className="py-3 pr-4 font-mono text-caption">
                            {JSON.stringify(row.body)}
                          </td>
                          <td className="py-3 text-description">{row.when}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DocsCard>

            <DocsCard title="Examples">
              <div className="space-y-4">
                <p className="text-description">
                  Replace the URL if you self-host Webcheck. Set a generous timeout
                  because scans include browser capture.
                </p>
                <ApiExamples apiUrl={apiUrl} />
              </div>
            </DocsCard>

            <DocsCard title="Share links">
              <div className="space-y-4 text-description">
                <p>
                  Every successful scan is saved and returns a{" "}
                  <code className="font-mono">shareId</code>. Build a public report URL
                  like:
                </p>
                <ApiCodeBlock
                  code={`${apiBaseUrl}/r/{shareId}`}
                  language="Report URL"
                />
                <Alert>
                  <AlertTitle>Fair use</AlertTitle>
                  <AlertDescription>
                    The API is open for external use. Avoid high-volume automated
                    scanning without coordinating with us first, especially against
                    third-party sites you do not own.
                  </AlertDescription>
                </Alert>
              </div>
            </DocsCard>
          </div>
        </Section>
      </main>

      <Footer>
        <FooterPanel>
          <FooterBar>
            <FooterCopyright name={siteName} />
            <FooterServiceBy
              name={serviceProvider.name}
              href={serviceProvider.url}
            />
          </FooterBar>
        </FooterPanel>
      </Footer>
    </>
  )
}
