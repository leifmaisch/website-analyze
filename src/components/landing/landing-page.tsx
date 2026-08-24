"use client"

import Link from "next/link"
import {
  CodeIcon,
  DeviceMobileIcon,
  EyeIcon,
  GlobeIcon,
  LightningIcon,
  ListChecksIcon,
  LockKeyIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import {
  Cta,
  CtaActions,
  CtaDescription,
  CtaEyebrow,
  CtaTitle,
} from "@/components/ui/cta"
import { FeatureCard, FeatureCtaCard, Features } from "@/components/ui/features"
import {
  Footer,
  FooterBar,
  FooterBrand,
  FooterColumn,
  FooterColumns,
  FooterCopyright,
  FooterDivider,
  FooterLegal,
  FooterLink,
  FooterMain,
  FooterPanel,
} from "@/components/ui/footer"
import {
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
} from "@/components/ui/hero"
import {
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
} from "@/components/ui/pricing"
import { TestimonialCard, Testimonials } from "@/components/ui/testimonials"
import { HeroShowcaseContent } from "@/components/landing/hero-showcase"
import { ResultGraphic } from "@/components/landing/result-graphic"
import { SiteLogo } from "@/components/site-logo"
import { SiteNavbar } from "@/components/site-navbar"
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "@/components/ui/section"
import { totalCheckCount } from "@/lib/scan-categories"

export function LandingPage() {
  return (
    <>
      <SiteNavbar />

      <main>
        <Hero>
          <HeroFrame>
            <HeroIntro>
              <HeroLabel>Website intelligence</HeroLabel>
              <HeroTitle>Understand every site in minutes</HeroTitle>
              <HeroDescription>
                Run {totalCheckCount} automated checks across performance, SEO,
                security, accessibility, privacy, content, infrastructure, and
                mobile. Detect tech stack, analytics, and fonts in one scan.
              </HeroDescription>
              <HeroActions>
                <Button size="lg" render={<Link href="/scan" />}>
                  Analyze a site
                </Button>
                <Button size="lg" variant="outline" render={<Link href="#features" />}>
                  See how it works
                </Button>
              </HeroActions>
              <HeroChips>
                <HeroChip>{totalCheckCount} checks</HeroChip>
                <HeroChip>Tech stack</HeroChip>
                <HeroChip>Analytics</HeroChip>
                <HeroChip>Font detection</HeroChip>
              </HeroChips>
            </HeroIntro>
            <HeroShowcase>
              <HeroShowcaseContent />
            </HeroShowcase>
          </HeroFrame>
        </Hero>

        <Section>
          <SectionHeader>
            <SectionTitle>Results you can act on</SectionTitle>
            <SectionDescription>
              Every scan delivers scores, category breakdowns, checks, tech stack
              detection, analytics, and fonts in one report.
            </SectionDescription>
          </SectionHeader>
          <ResultGraphic />
        </Section>

        <Features
          id="features"
          title="Everything you need to improve a site"
          description={`${totalCheckCount} checks across 8 categories, plus tech stack, analytics, and font detection.`}
        >
          <FeatureCard
            large
            title={`${totalCheckCount}-point website audit`}
            description="Eight scored categories in one pass, from performance and SEO to security and mobile."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <ListChecksIcon className="size-16 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCard
            title="Performance"
            description="Response time, compression, page size, cache headers, lazy images, and render-blocking scripts."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <LightningIcon className="size-12 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCard
            title="SEO"
            description="Titles, meta tags, Open Graph, structured data, sitemaps, hreflang, and internal link health."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <GlobeIcon className="size-12 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCard
            title="Security"
            description="HTTPS, SSL expiry, security headers, mixed content, cookie flags, SRI, and security.txt."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <ShieldCheckIcon className="size-12 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCard
            title="Accessibility and mobile"
            description="Skip links, landmarks, form labels, viewport, web manifest, and theme color."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <div className="flex items-center gap-3">
                  <EyeIcon className="size-10 text-primary/80" weight="duotone" />
                  <DeviceMobileIcon className="size-10 text-primary/80" weight="duotone" />
                </div>
              </div>
            }
          />
          <FeatureCard
            title="Privacy and content"
            description="Third-party domains, privacy policy links, readability, broken images, and placeholder copy."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <LockKeyIcon className="size-12 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCard
            title="Tech stack and analytics"
            description="Detect frameworks, UI libraries, Tailwind, shadcn, Google Analytics, ad pixels, and more."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <CodeIcon className="size-12 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCtaCard href="/scan" label="Start your first scan" />
        </Features>

        <Testimonials
          id="testimonials"
          title="Trusted by teams who ship fast"
          description="From solo founders to agencies, SiteAnalyze keeps launches on track."
        >
          <TestimonialCard
            quote="We replaced three separate tools. The reports are clear enough to send straight to clients."
            name="Maya Chen"
            role="Founder, Northline Studio"
            featured
          />
          <TestimonialCard
            quote="The full audit caught accessibility and security issues our other scanners missed."
            name="James Okonkwo"
            role="Engineering Lead, Parcel"
          />
          <TestimonialCard
            quote="Tech stack and analytics detection alone saves us hours on every client onboarding call."
            name="Elena Ruiz"
            role="Head of Growth, Lumen"
          />
        </Testimonials>

        <Pricing
          id="pricing"
          title="Simple pricing for every stage"
          description="Start free, upgrade when you need more sites and deeper history."
        >
          <PricingCard>
            <PricingHeader>
              <PricingName>Starter</PricingName>
              <PricingDescription>For personal sites and side projects.</PricingDescription>
            </PricingHeader>
            <PricingAmount>
              <PricingPrice>$0</PricingPrice>
              <PricingPeriod>/ month</PricingPeriod>
            </PricingAmount>
            <PricingFeatures>
              <PricingFeature>3 scans per month</PricingFeature>
              <PricingFeature>{totalCheckCount} checks per scan</PricingFeature>
              <PricingFeature>Tech stack and analytics detection</PricingFeature>
              <PricingFeature included={false}>Historical comparisons</PricingFeature>
            </PricingFeatures>
            <PricingAction>
              <Button className="w-full" variant="outline" render={<Link href="/scan" />}>
                Get started
              </Button>
            </PricingAction>
          </PricingCard>

          <PricingCard featured>
            <PricingHeader>
              <PricingName>Pro</PricingName>
              <PricingDescription>For freelancers and growing teams.</PricingDescription>
            </PricingHeader>
            <PricingAmount>
              <PricingPrice>$29</PricingPrice>
              <PricingPeriod>/ month</PricingPeriod>
            </PricingAmount>
            <PricingFeatures>
              <PricingFeature>Unlimited scans</PricingFeature>
              <PricingFeature>All 8 score categories</PricingFeature>
              <PricingFeature>Font detection and scan history</PricingFeature>
              <PricingFeature>Shareable client reports</PricingFeature>
            </PricingFeatures>
            <PricingAction>
              <Button className="w-full" render={<Link href="#cta" />}>
                Start trial
              </Button>
            </PricingAction>
          </PricingCard>

          <PricingCard>
            <PricingHeader>
              <PricingName>Agency</PricingName>
              <PricingDescription>For agencies managing many client sites.</PricingDescription>
            </PricingHeader>
            <PricingAmount>
              <PricingPrice>$99</PricingPrice>
              <PricingPeriod>/ month</PricingPeriod>
            </PricingAmount>
            <PricingFeatures>
              <PricingFeature>Everything in Pro</PricingFeature>
              <PricingFeature>50 monitored domains</PricingFeature>
              <PricingFeature>Team workspaces</PricingFeature>
              <PricingFeature>Priority support</PricingFeature>
            </PricingFeatures>
            <PricingAction>
              <Button className="w-full" variant="outline" render={<Link href="#cta" />}>
                Contact sales
              </Button>
            </PricingAction>
          </PricingCard>
        </Pricing>

        <Cta id="cta">
          <CtaEyebrow>Ready when you are</CtaEyebrow>
          <CtaTitle>Run your first scan in under a minute</CtaTitle>
          <CtaDescription>
            Paste a URL and get {totalCheckCount} checks, category scores, tech
            stack detection, analytics insights, and font analysis in one report.
          </CtaDescription>
          <CtaActions>
            <Button size="lg" render={<Link href="/scan" />}>
              Start free
            </Button>
            <Button size="lg" variant="outline" render={<Link href="#features" />}>
              Explore features
            </Button>
          </CtaActions>
        </Cta>
      </main>

      <Footer>
        <FooterPanel>
          <FooterMain>
            <FooterBrand href="/" logo={<SiteLogo />} name="SiteAnalyze">
              Clear website audits for teams who care about quality, speed, search
              visibility, and security.
            </FooterBrand>
            <FooterColumns>
              <FooterColumn title="Product">
                <FooterLink label="Features" href="#features" />
                <FooterLink label="Pricing" href="#pricing" />
                <FooterLink label="Free scan" href="/scan" />
              </FooterColumn>
              <FooterColumn title="Company">
                <FooterLink label="About" href="#" />
                <FooterLink label="Blog" href="#" />
                <FooterLink label="Careers" href="#" />
              </FooterColumn>
              <FooterColumn title="Legal">
                <FooterLink label="Privacy" href="#" />
                <FooterLink label="Terms" href="#" />
                <FooterLink label="Security" href="#" />
              </FooterColumn>
            </FooterColumns>
          </FooterMain>
          <FooterDivider />
          <FooterBar>
            <FooterCopyright name="SiteAnalyze" />
            <FooterLegal
              links={[
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
              ]}
            />
          </FooterBar>
        </FooterPanel>
      </Footer>
    </>
  )
}
