import { squircle } from "@/lib/squircle"
import { surfaceDepth, surfaceDepthFrame } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"
import { Section } from "@/components/ui/section"

type HeroProps = React.ComponentProps<typeof Section>

function Hero({ className, ...props }: HeroProps) {
  return (
    <Section
      data-slot="hero"
      className={cn(
        "flex min-h-0 flex-col justify-center py-8 sm:py-10 md:min-h-[calc(100svh-5.25rem)] md:py-12",
        className
      )}
      {...props}
    />
  )
}

function HeroFrame({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-frame"
      style={{ ...squircle, ...style }}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-squircle-xl border border-border/60 bg-muted/50 p-1",
        surfaceDepthFrame,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function HeroIntro({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-intro"
      className={cn(
        "flex flex-col items-center gap-4 px-4 py-8 text-center sm:gap-5 sm:px-10 sm:py-10 md:py-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function HeroLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="hero-label"
      style={squircle}
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-label",
        className
      )}
      {...props}
    />
  )
}

function HeroTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="hero-title"
      className={cn(
        "max-w-3xl text-balance text-heading-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
        className
      )}
      {...props}
    />
  )
}

function HeroDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="hero-description"
      className={cn(
        "mx-auto w-full max-w-xl text-pretty text-description sm:text-lg",
        className
      )}
      {...props}
    />
  )
}

function HeroActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-actions"
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 [&_[data-slot=button]]:w-full [&_[data-slot=button]]:sm:w-auto",
        className
      )}
      {...props}
    />
  )
}

function HeroChips({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-chips"
      className={cn("flex flex-wrap justify-center gap-2", className)}
      {...props}
    />
  )
}

function HeroChip({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="hero-chip"
      style={squircle}
      className={cn(
        "rounded-full border border-border bg-background px-3 py-1 text-label",
        className
      )}
      {...props}
    />
  )
}

function HeroShowcase({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hero-showcase"
      style={squircle}
      className={cn(
        "relative mx-1 mb-1 overflow-hidden rounded-squircle-inner border border-primary/35 bg-primary/5",
        surfaceDepth("md"),
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_100%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_65%)]"
      />
      {children ? <div className="relative z-10 w-full">{children}</div> : null}
    </div>
  )
}

export {
  Hero,
  HeroActions,
  HeroChip,
  HeroChips,
  HeroDescription,
  HeroFrame,
  HeroIntro,
  HeroLabel,
  HeroShowcase,
  HeroTitle,
}
