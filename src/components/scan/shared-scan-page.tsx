"use client"

import { SiteNavbar } from "@/components/site-navbar"
import { ScanResults } from "@/components/scan/scan-results"
import {
  Footer,
  FooterBar,
  FooterCopyright,
  FooterPanel,
  FooterServiceBy,
} from "@/components/ui/footer"
import { Section } from "@/components/ui/section"
import type { ScanResult } from "@/lib/scan-types"
import { serviceProvider, siteName } from "@/lib/site-metadata"

export function SharedScanPage({ result }: { result: ScanResult }) {
  return (
    <>
      <SiteNavbar />

      <main className="flex-1">
        <Section className="pb-8 md:pb-12">
          <div className="scroll-mt-24">
            <ScanResults result={result} />
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
