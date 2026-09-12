import { ApiDocsPage } from "@/components/api-docs/api-docs-page"
import { createApiDocsMetadata, getSiteUrl } from "@/lib/site-metadata"

export const metadata = createApiDocsMetadata()

export default function Page() {
  const apiBaseUrl = getSiteUrl() ?? "https://scan.netcha.se"

  return <ApiDocsPage apiBaseUrl={apiBaseUrl} />
}
