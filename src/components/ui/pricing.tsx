import { CheckIcon, XIcon } from "@phosphor-icons/react"

import { iconWeight } from "@/components/shared"
import { squircle } from "@/lib/squircle"
import { surfaceDepth } from "@/lib/surface-depth"
import { cn } from "@/lib/utils"
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section"

type PricingFeatureItem = {
  text: string
  included?: boolean
}

type PricingCardProps = React.ComponentProps<"article"> & {
  featured?: boolean
}

function PricingCard({
  featured = false,
  className,
  children,
  ...props
}: PricingCardProps) {
  return (
    <article
      data-slot="pricing-card"
      data-featured={featured || undefined}
      style={squircle}
      className={cn(
        "relative flex flex-col rounded-squircle-lg border p-5 sm:p-8",
        surfaceDepth(featured ? "lg" : "md"),
        featured
          ? "border-primary/35 bg-primary/5"
          : "border-border bg-muted/30",
        className
      )}
      {...props}
    >
      {featured ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-squircle-lg bg-[radial-gradient(90%_80%_at_50%_0%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_65%)]"
        />
      ) : null}
      <div className="relative flex h-full flex-col">{children}</div>
    </article>
  )
}

function PricingHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function PricingName({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="pricing-name"
      className={cn("text-title", className)}
      {...props}
    />
  )
}

function PricingDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="pricing-description"
      className={cn("text-description", className)}
      {...props}
    />
  )
}

function PricingAmount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-amount"
      className={cn("mt-6 flex items-end gap-1", className)}
      {...props}
    />
  )
}

function PricingPrice({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pricing-price"
      className={cn("text-heading text-3xl sm:text-4xl", className)}
      {...props}
    />
  )
}

function PricingPeriod({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pricing-period"
      className={cn("pb-1 text-description", className)}
      {...props}
    />
  )
}

function PricingFeatures({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pricing-features"
      className={cn("mt-6 flex flex-col gap-3 text-sm", className)}
      {...props}
    />
  )
}

type PricingFeatureProps = React.ComponentProps<"li"> & {
  included?: boolean
}

function PricingFeature({
  included = true,
  className,
  children,
  ...props
}: PricingFeatureProps) {
  return (
    <li
      data-slot="pricing-feature"
      data-included={included || undefined}
      className={cn(
        "flex items-start gap-2.5",
        included ? "text-foreground" : "text-muted-foreground/60",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center",
          included ? "text-primary" : "text-muted-foreground/40"
        )}
        aria-hidden
      >
        {included ? (
          <CheckIcon weight={iconWeight} className="size-4" />
        ) : (
          <XIcon weight={iconWeight} className="size-4" />
        )}
      </span>
      <span>{children}</span>
    </li>
  )
}

function PricingAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-action"
      className={cn("mt-8", className)}
      {...props}
    />
  )
}

type PricingProps = Omit<React.ComponentProps<typeof Section>, "children"> & {
  title?: string
  description?: string
  scribble?: boolean
  children: React.ReactNode
}

function PricingScribbleOverlay() {
  const scribbleLoop =
    "M 44 50 Q 48 44 54 48 Q 60 52 56 58 Q 52 64 46 60 Q 40 56 42 50 Q 44 46 50 46 Q 56 46 58 52 Q 60 58 54 62 Q 48 66 44 60 Q 40 54 44 50 M 46 54 Q 50 50 54 54 Q 56 60 50 62 Q 44 64 42 58 Q 44 54 46 54 M 48 56 Q 52 52 56 56 Q 54 62 48 62 Q 44 58 48 56"

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      <svg
        className="absolute inset-0 size-full text-foreground/22"
        viewBox="0 0 800 360"
        fill="none"
        preserveAspectRatio="none"
      >
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="nonScalingStroke"
        >
          <g transform="translate(95 155) scale(5.2)">
            <path strokeWidth="1.4" d={scribbleLoop} />
            <path strokeWidth="1.1" d={scribbleLoop} transform="translate(3 2) rotate(8)" />
            <path strokeWidth="1.3" d={scribbleLoop} transform="translate(-2 4) rotate(-12)" />
          </g>
          <g transform="translate(355 140) scale(5.8)">
            <path strokeWidth="1.5" d={scribbleLoop} />
            <path strokeWidth="1.2" d={scribbleLoop} transform="translate(4 1) rotate(15)" />
            <path strokeWidth="1.4" d={scribbleLoop} transform="translate(-3 3) rotate(-8)" />
            <path strokeWidth="1.1" d={scribbleLoop} transform="translate(2 5) rotate(22)" />
          </g>
          <g transform="translate(610 165) scale(5.4)">
            <path strokeWidth="1.4" d={scribbleLoop} />
            <path strokeWidth="1.2" d={scribbleLoop} transform="translate(-4 2) rotate(-18)" />
            <path strokeWidth="1.3" d={scribbleLoop} transform="translate(3 4) rotate(10)" />
          </g>
        </g>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative rotate-[3deg]">
          <div
            className="absolute -top-2 left-6 h-5 w-14 rotate-[-12deg] rounded-sm bg-white/25 shadow-sm"
            style={squircle}
          />
          <div
            className="absolute -top-2 right-10 h-5 w-14 rotate-[9deg] rounded-sm bg-white/20 shadow-sm"
            style={squircle}
          />
          <div
            style={squircle}
            className="relative max-w-xs border border-amber-900/15 bg-[#f4e4a3] px-7 py-6 shadow-lg shadow-black/25 sm:max-w-sm sm:px-9 sm:py-8"
          >
            <p
              className="text-center font-handwriting text-[1.65rem] leading-snug text-[#3a2a18] sm:text-[2rem]"
            >
              Currently free,
              <br />
              so have fun!
            </p>
            <svg
              className="mx-auto mt-3 w-[88%] text-[#3a2a18]/55"
              viewBox="0 0 200 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M 6 14 Q 22 8 38 14 Q 54 20 70 12 Q 86 4 102 12 Q 118 20 134 10 Q 150 0 166 10 Q 182 20 194 12"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                vectorEffect="nonScalingStroke"
              />
            </svg>
          </div>
          <svg
            className="absolute -bottom-10 left-1/2 h-12 w-16 -translate-x-1/2 text-[#3a2a18]/45"
            viewBox="0 0 64 48"
            fill="none"
            aria-hidden
          >
            <path
              d="M 32 4 Q 28 18 30 28 Q 32 38 32 42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="nonScalingStroke"
            />
            <path
              d="M 24 36 L 32 44 L 40 34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="nonScalingStroke"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

function Pricing({
  title,
  description,
  scribble = false,
  className,
  children,
  ...props
}: PricingProps) {
  return (
    <Section data-slot="pricing" className={className} {...props}>
      {title ? (
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
          {description ? (
            <SectionDescription>{description}</SectionDescription>
          ) : null}
        </SectionHeader>
      ) : null}
      <div className="relative">
        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
            scribble && "opacity-35 select-none"
          )}
        >
          {children}
        </div>
        {scribble ? <PricingScribbleOverlay /> : null}
      </div>
    </Section>
  )
}

export {
  Pricing,
  PricingAction,
  PricingAmount,
  PricingCard,
  PricingDescription,
  PricingFeature,
  PricingFeatures,
  PricingHeader,
  PricingName,
  PricingPeriod,
  PricingPrice,
  type PricingFeatureItem,
}
