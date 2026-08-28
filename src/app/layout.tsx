import { leguanFontVariables } from "@/lib/fonts"
import { createSiteMetadata } from "@/lib/site-metadata"
import type { Viewport } from "next"
import Script from "next/script"

import { StructuredData } from "@/components/structured-data"

import "./globals.css"

export const metadata = createSiteMetadata()

export const viewport: Viewport = {
  themeColor: "#252525",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leguanFontVariables} dark h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-squircle-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          Skip to main content
        </a>
        <StructuredData />
        {children}
        <Script
          defer
          src="https://cdn.dumbledor.com/script.js"
          data-website-id="b68a2457-ef98-4726-a47c-2618cace1717"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
