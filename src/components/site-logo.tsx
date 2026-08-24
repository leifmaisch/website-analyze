import Image from "next/image"

import { siteName } from "@/lib/site-metadata"

export function SiteLogo() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center">
      <Image
        src="/logo.png"
        alt={`${siteName} logo`}
        width={32}
        height={32}
        className="size-8 max-w-none"
      />
    </span>
  )
}
