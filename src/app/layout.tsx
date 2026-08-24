import type { Metadata } from "next"

import { leguanFontVariables } from "@/lib/fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: "SiteAnalyze | Website audits made simple",
  description:
    "Audit performance, SEO, accessibility, and security from one dashboard.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leguanFontVariables} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">{children}</body>
    </html>
  )
}
