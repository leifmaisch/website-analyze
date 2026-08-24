import Image from "next/image"

export function SiteLogo() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center">
      <Image
        src="/logo.png"
        alt=""
        width={32}
        height={32}
        className="size-8 max-w-none"
      />
    </span>
  )
}
