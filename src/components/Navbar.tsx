"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/page/services", label: "Services" },
  { href: "/page/about", label: "About" },
  { href: "/page/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    if (mobileOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1180px] rounded-[24px] border border-white/70 bg-surface/95 px-5 py-4 shadow-[0_18px_50px_rgba(5,3,47,0.08)] backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <Link href="/page/home" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,73,191,0.35)]">
              TB
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-semibold tracking-tight text-brand-ink md:text-base">TB Service Plus</p>
              <p className="text-[12px] text-muted md:text-[13px]">Moving . Cleaning . Delivery</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-[15px] font-medium text-brand-ink/80 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand-ink">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:4039264063"
              className="hidden items-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(15,73,191,0.3)] hover:bg-brand-primary-deep sm:inline-flex"
            >
              Call Now
              <PhoneIcon className="h-4 w-4" />
            </a>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border-soft bg-white text-brand-ink md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-4 border-t border-border-soft pt-4 md:hidden">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-[15px] font-medium text-brand-ink hover:bg-brand-sand"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="tel:4039264063"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-3 text-[15px] font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Call 403-926-4063
                <PhoneIcon className="h-4 w-4" />
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M6.5 3.5l2.2 2.6-1.2 2.1a13.6 13.6 0 004.1 4.1l2.1-1.2 2.6 2.2-1.2 2.7c-.3.7-1 .9-1.7.8C8.3 16.9 3.1 11.7 2.3 5.4c-.1-.7.2-1.4.8-1.7L6.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
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

