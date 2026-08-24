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
import { FeatureCard, FeatureOverviewCard, Features } from "@/components/ui/features"
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
              Overview scores, issue highlights, category breakdowns, viewport
              previews, tech stack, analytics, and fonts in one report.
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
          <FeatureOverviewCard
            title={`${totalCheckCount}-point website audit`}
            description="Eight scored categories in one pass, from performance and SEO to security and mobile."
            items={[
              {
                title: "Performance",
                description:
                  "Response time, compression, page size, cache headers, lazy images, and render-blocking scripts.",
              },
              {
                title: "SEO",
                description:
                  "Titles, meta tags, Open Graph, structured data, sitemaps, hreflang, and internal link health.",
              },
              {
                title: "Security",
                description:
                  "HTTPS, SSL expiry, security headers, mixed content, cookie flags, SRI, and security.txt.",
              },
              {
                title: "Accessibility and mobile",
                description:
                  "Skip links, landmarks, form labels, viewport, web manifest, and theme color.",
              },
              {
                title: "Privacy and content",
                description:
                  "Third-party domains, privacy policy links, readability, broken images, and placeholder copy.",
              },
              {
                title: "Tech stack and analytics",
                description:
                  "Detect frameworks, UI libraries, Tailwind, shadcn, Google Analytics, ad pixels, and more.",
              },
            ]}
            cta={
              <Button render={<Link href="/scan" />}>Start your first scan</Button>
            }
          />
        </Features>

        <Testimonials
          id="testimonials"
          title="People are saying things"
          description="We don't have real reviews yet. Enjoy these made-up quotes until someone actually likes us."
        >
          <TestimonialCard
            quote="I scanned my own site and it flagged placeholder copy in three places. Rude. Accurate."
            name="The Guy Who Built This"
            role="Founder, probably"
            featured
          />
          <TestimonialCard
            quote="It found twelve analytics scripts on a page I called privacy-friendly. My GDPR consultant is thrilled. I am not."
            name="Anonymous PM"
            role="Definitely works here"
          />
          <TestimonialCard
            quote="Best part: it's free. Worst part: I can't bill my client for premium audit tooling anymore."
            name="Sasha K."
            role="Agency partner (billing team furious)"
          />
        </Testimonials>

        <Pricing
          id="pricing"
          scribble
          title="Simple pricing for every stage"
          description="Everything is free right now. Run scans and explore the full report."
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
                <FooterLink label="About" href="#" disabled />
                <FooterLink label="Blog" href="#" disabled />
                <FooterLink label="Careers" href="#" disabled />
              </FooterColumn>
              <FooterColumn title="Legal">
                <FooterLink label="Privacy" href="#" disabled />
                <FooterLink label="Terms" href="#" disabled />
                <FooterLink label="Security" href="#" disabled />
              </FooterColumn>
            </FooterColumns>
          </FooterMain>
          <FooterDivider />
          <FooterBar>
            <FooterCopyright name="SiteAnalyze" />
            <FooterLegal
              links={[
                { label: "Privacy", href: "#", disabled: true },
                { label: "Terms", href: "#", disabled: true },
              ]}
            />
          </FooterBar>
        </FooterPanel>
      </Footer>
    </>
  )
}
