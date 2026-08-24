import { leguanFontVariables } from "@/lib/fonts"
import { createSiteMetadata } from "@/lib/site-metadata"

import "./globals.css"

export const metadata = createSiteMetadata()

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leguanFontVariables} dark h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-background">
        {children}
      </body>
    </html>
  )
}
