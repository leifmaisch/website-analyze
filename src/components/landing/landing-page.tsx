"use client"

import Link from "next/link"
import {
  ChartLineUpIcon,
  GlobeIcon,
  LightningIcon,
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
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarFrame,
  NavbarLink,
  NavbarLinks,
  NavbarMenuButton,
  NavbarMobileActions,
  NavbarMobileLink,
  NavbarMobileMenu,
} from "@/components/ui/navbar"
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
import { SiteLogo } from "@/components/site-logo"

export function LandingPage() {
  return (
    <>
      <Navbar sticky>
        <NavbarFrame>
          <NavbarBrand href="/" logo={<SiteLogo />} name="SiteAnalyze" />
          <NavbarLinks>
            <NavbarLink href="/scan" label="Free scan" />
            <NavbarLink href="#features" label="Features" />
            <NavbarLink href="#testimonials" label="Testimonials" />
            <NavbarLink href="#pricing" label="Pricing" />
          </NavbarLinks>
          <NavbarActions>
            <Button variant="ghost" render={<Link href="#pricing" />}>
              Sign in
            </Button>
            <Button render={<Link href="/scan" />}>Start free scan</Button>
          </NavbarActions>
          <NavbarMenuButton />
        </NavbarFrame>
        <NavbarMobileMenu>
          <NavbarMobileLink href="/scan" label="Free scan" />
          <NavbarMobileLink href="#features" label="Features" />
          <NavbarMobileLink href="#testimonials" label="Testimonials" />
          <NavbarMobileLink href="#pricing" label="Pricing" />
          <NavbarMobileActions>
            <Button variant="outline" className="w-full" render={<Link href="#pricing" />}>
              Sign in
            </Button>
            <Button className="w-full" render={<Link href="/scan" />}>
              Start free scan
            </Button>
          </NavbarMobileActions>
        </NavbarMobileMenu>
      </Navbar>

      <main>
        <Hero>
          <HeroFrame>
            <HeroIntro>
              <HeroLabel>Website intelligence</HeroLabel>
              <HeroTitle>Understand every site in minutes</HeroTitle>
              <HeroDescription>
                Audit performance, SEO, accessibility, and security from one
                dashboard. Get clear scores and actionable fixes without
                switching tools.
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
                <HeroChip>Core Web Vitals</HeroChip>
                <HeroChip>SEO checks</HeroChip>
                <HeroChip>Accessibility</HeroChip>
                <HeroChip>Security headers</HeroChip>
              </HeroChips>
            </HeroIntro>
            <HeroShowcase>
              <HeroShowcaseContent />
            </HeroShowcase>
          </HeroFrame>
        </Hero>

        <Features
          id="features"
          title="Everything you need to improve a site"
          description="Run a full audit, track changes over time, and share reports with your team."
        >
          <FeatureCard
            large
            title="Performance insights"
            description="Measure load time, Core Web Vitals, and asset weight with clear priorities."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <LightningIcon className="size-16 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCard
            title="SEO coverage"
            description="Catch missing metadata, broken links, and indexability issues early."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <GlobeIcon className="size-12 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCard
            title="Security checks"
            description="Review HTTPS, headers, and common misconfigurations in one pass."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <ShieldCheckIcon className="size-12 text-primary/80" weight="duotone" />
              </div>
            }
          />
          <FeatureCard
            title="Trend tracking"
            description="Compare scans over time and spot regressions before they ship."
            visual={
              <div className="flex h-full items-center justify-center p-6">
                <ChartLineUpIcon className="size-12 text-primary/80" weight="duotone" />
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
            quote="The performance breakdown helped us cut LCP by 40% in a single sprint."
            name="James Okonkwo"
            role="Engineering Lead, Parcel"
          />
          <TestimonialCard
            quote="Weekly scans catch SEO regressions before they hit search rankings."
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
              <PricingFeature>Performance and SEO scores</PricingFeature>
              <PricingFeature>Email report export</PricingFeature>
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
              <PricingFeature>Full audit categories</PricingFeature>
              <PricingFeature>30-day scan history</PricingFeature>
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
            Paste a URL, get a complete health report, and know exactly what to
            fix next.
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
              Clear website audits for teams who care about quality, speed, and
              search visibility.
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
