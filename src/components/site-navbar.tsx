"use client"

import Link from "next/link"

import { SiteLogo } from "@/components/site-logo"
import { Button } from "@/components/ui/button"
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

const navItems = [
  { href: "/#features", label: "Features" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#pricing", label: "Pricing" },
] as const

export function SiteNavbar() {
  return (
    <Navbar sticky>
      <NavbarFrame>
        <NavbarBrand href="/" logo={<SiteLogo />} name="SiteAnalyze" />
        <NavbarLinks>
          {navItems.map((item) => (
            <NavbarLink key={item.href} href={item.href} label={item.label} />
          ))}
        </NavbarLinks>
        <NavbarActions>
          <Button variant="ghost" render={<Link href="/#pricing" />}>
            Sign in
          </Button>
          <Button render={<Link href="/scan" />}>Start free scan</Button>
        </NavbarActions>
        <NavbarMenuButton />
      </NavbarFrame>
      <NavbarMobileMenu>
        {navItems.map((item) => (
          <NavbarMobileLink key={item.href} href={item.href} label={item.label} />
        ))}
        <NavbarMobileActions>
          <Button variant="outline" className="w-full" render={<Link href="/#pricing" />}>
            Sign in
          </Button>
          <Button className="w-full" render={<Link href="/scan" />}>
            Start free scan
          </Button>
        </NavbarMobileActions>
      </NavbarMobileMenu>
    </Navbar>
  )
}
