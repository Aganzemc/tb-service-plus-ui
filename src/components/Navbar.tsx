"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminLoginModal from "@/components/AdminLoginModal";
import BrandMark from "@/components/BrandMark";
import type { SiteSettings } from "@/types/site-settings";

const navItems = [
  { href: "/page/home", label: "Home" },
  { href: "/page/services", label: "Services" },
  { href: "/page/about", label: "About" },
  { href: "/page/contact", label: "Contact" },
];

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    if (mobileOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/8 bg-white shadow-[0_10px_28px_rgba(15,23,52,0.05)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4 md:px-8">
          <Link href="/page/home" className="group flex items-center gap-3">
            <BrandMark
              logoUrl={settings.logo_url}
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white transition duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg]"
              imageClassName="h-full w-full object-cover"
              fallbackClassName="border border-brand-primary/15 bg-brand-primary/10 text-[15px] font-semibold text-brand-primary shadow-[0_10px_24px_rgba(95,103,244,0.08)] group-hover:bg-brand-primary/14"
            />
            <div className="leading-tight">
              <p className="text-[1.45rem] font-semibold tracking-[-0.04em] text-brand-ink">
                <span className="text-brand-primary">TB</span> Service Plus
              </p>
              <p className="text-[13px] text-muted">Moving . Cleaning . Delivery . Junk Removal . Snow Removal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-[15px] font-medium text-brand-ink/85 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link hover:text-brand-primary">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="surface-lift hidden items-center justify-center rounded-xl border border-brand-primary/16 bg-white px-5 py-3 text-[15px] font-semibold text-brand-ink hover:border-brand-primary hover:text-brand-primary md:inline-flex"
            >
              Sign in
            </button>

            <Link
              href="/page/contact"
              className="surface-lift hidden items-center justify-center rounded-xl bg-brand-primary px-5 py-3 text-[15px] font-semibold text-white shadow-[0_14px_26px_rgba(15,73,191,0.22)] hover:bg-brand-primary-deep md:inline-flex"
            >
              Get a quote
            </Link>

            <button
              type="button"
              className="surface-lift inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white text-brand-ink lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="menu-enter border-t border-black/8 bg-white lg:hidden">
            <div className="mx-auto max-w-[1280px] px-6 py-4 md:px-8">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="surface-lift rounded-xl px-4 py-3 text-[15px] font-medium text-brand-ink hover:bg-brand-sand"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  className="surface-lift inline-flex items-center justify-center rounded-xl border border-brand-primary/16 bg-white px-4 py-3 text-[15px] font-semibold text-brand-ink hover:border-brand-primary hover:text-brand-primary"
                  onClick={() => {
                    setMobileOpen(false);
                    setLoginOpen(true);
                  }}
                >
                  Sign in
                </button>
                <Link
                  href="/page/contact"
                  className="surface-lift mt-2 inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-[15px] font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Get a quote
                </Link>
              </nav>
            </div>
          </div>
        ) : null}
      </header>

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
