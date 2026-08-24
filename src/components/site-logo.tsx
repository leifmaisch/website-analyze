import Image from "next/image"

export function SiteLogo() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center">
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className="size-9 max-w-none"
      />
    </span>
  )
}
