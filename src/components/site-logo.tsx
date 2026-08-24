import { GlobeIcon } from "@phosphor-icons/react/dist/ssr"

export function SiteLogo() {
  return (
    <span className="flex size-8 items-center justify-center rounded-squircle-md bg-primary text-primary-foreground">
      <GlobeIcon className="size-4" weight="bold" />
    </span>
  )
}
