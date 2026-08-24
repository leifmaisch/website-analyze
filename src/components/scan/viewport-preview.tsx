import { Iphone } from "@/components/ui/iphone"
import { Safari } from "@/components/ui/safari"
import { cn } from "@/lib/utils"

type ViewportScreenshot = {
  viewport: "desktop" | "mobile"
  width: number
  height: number
  label: string
  image: string
}

type ViewportPreviewSize = "sm" | "lg"

type ViewportPreviewProps = {
  desktop?: Pick<ViewportScreenshot, "image" | "label" | "width" | "height"> | null
  mobile?: Pick<ViewportScreenshot, "image" | "label" | "width" | "height"> | null
  url?: string
  size?: ViewportPreviewSize
  onClick?: () => void
  className?: string
}

const sizeStyles = {
  sm: {
    root: "min-h-44 sm:min-h-52",
    phone: "w-[30%] min-w-[6.5rem] max-w-[9rem] -bottom-4 -right-1 sm:-bottom-6 sm:-right-2",
    safariMode: "simple" as const,
  },
  lg: {
    root: "min-h-64 sm:min-h-80",
    phone: "w-[32%] min-w-[8rem] max-w-[12rem] -bottom-6 -right-2 sm:-bottom-8 sm:-right-4",
    safariMode: "default" as const,
  },
}

export function ViewportPreview({
  desktop,
  mobile,
  url,
  size = "sm",
  onClick,
  className,
}: ViewportPreviewProps) {
  const styles = sizeStyles[size]
  const interactive = Boolean(onClick)

  return (
    <div
      className={cn(
        "relative w-full",
        styles.root,
        interactive && "group cursor-pointer",
        className
      )}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <Safari
        url={url}
        imageSrc={desktop?.image}
        mode={styles.safariMode}
        className="w-full"
      />

      <div
        className={cn(
          "absolute z-10 drop-shadow-xl",
          styles.phone,
          interactive && "transition-transform group-hover:-translate-y-0.5"
        )}
      >
        <Iphone src={mobile?.image} className="w-full" />
      </div>
    </div>
  )
}

export function ViewportPreviewFromScreenshots({
  screenshots,
  url,
  size = "sm",
  onClick,
  className,
}: {
  screenshots: ViewportScreenshot[]
  url?: string
  size?: ViewportPreviewSize
  onClick?: () => void
  className?: string
}) {
  const desktop = screenshots.find((screenshot) => screenshot.viewport === "desktop")
  const mobile = screenshots.find((screenshot) => screenshot.viewport === "mobile")

  return (
    <ViewportPreview
      desktop={desktop}
      mobile={mobile}
      url={url}
      size={size}
      onClick={onClick}
      className={className}
    />
  )
}

export function ViewportPreviewDetails({
  screenshots,
  url,
  className,
}: {
  screenshots: ViewportScreenshot[]
  url?: string
  className?: string
}) {
  const desktop = screenshots.find((screenshot) => screenshot.viewport === "desktop")
  const mobile = screenshots.find((screenshot) => screenshot.viewport === "mobile")

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-label">
          {desktop || mobile
            ? "Desktop and mobile captures"
            : "Desktop and mobile preview"}
        </p>
        <div className="text-caption flex flex-wrap gap-3">
          {desktop ? (
            <span>
              Desktop {desktop.width} x {desktop.height}
            </span>
          ) : null}
          {mobile ? (
            <span>
              Mobile {mobile.width} x {mobile.height}
            </span>
          ) : null}
        </div>
      </div>
      <ViewportPreview desktop={desktop} mobile={mobile} url={url} size="lg" />
    </div>
  )
}
