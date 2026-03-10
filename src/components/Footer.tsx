"use client";

import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import Reveal from "@/components/Reveal";
import SocialNetworkIcon from "@/components/SocialNetworkIcon";
import type { SiteSettings } from "@/types/site-settings";
import { formatPhoneHref, formatWhatsAppHref, getSocialLinks, hasSettingValue } from "@/utils/site-settings";

const serviceLinks = [
  "Moving Services",
  "Cleaning Services",
  "Delivery Services",
  "Junk Removal",
  "Snow Removal",
];

const quickLinks = [
  { href: "/page/home", label: "Home" },
  { href: "/page/home#services", label: "Services" },
  { href: "/page/contact", label: "Get a quote" },
  { href: "/page/about", label: "About" },
];

export default function Footer({ settings }: { settings: SiteSettings }) {
  const phoneHref = formatPhoneHref(settings.contact_phone);
  const whatsappHref = formatWhatsAppHref(settings.whatsapp_phone);
  const socialLinks = getSocialLinks(settings);

  return (
    <footer className="overflow-hidden bg-brand-ink text-white">
      <div className="mx-auto max-w-[1280px] px-6 pb-12 pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <Reveal className="max-w-sm space-y-4">
            <Link href="/page/home" className="inline-flex items-center gap-3">
              <BrandMark
                logoUrl={settings.logo_url}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white/10"
                imageClassName="h-full w-full object-cover"
                fallbackClassName="bg-white/10 text-sm font-semibold text-white"
              />
              <div>
                <p className="text-[15px] font-semibold tracking-tight md:text-base">TB Service Plus</p>
                <p className="text-[12px] text-white/60">Moving, cleaning, delivery, junk removal, snow removal</p>
              </div>
            </Link>
            <p className="text-[15px] leading-7 text-white/65 md:text-[16px]">
              Practical local help for homes and small businesses. Call directly, send an email, or use the contact
              form to request your next job.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">Services</p>
            <ul className="mt-4 space-y-3 text-[15px] text-white/78">
              {serviceLinks.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">Reach us</p>
            <ul className="mt-4 space-y-3 text-[15px] text-white/78">
              {phoneHref ? (
                <li>
                  <a href={phoneHref} className="hover:text-white">
                    {settings.contact_phone}
                  </a>
                </li>
              ) : null}
              {hasSettingValue(settings.contact_email) ? (
                <li>
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white">
                    {settings.contact_email}
                  </a>
                </li>
              ) : null}
              {whatsappHref ? (
                <li>
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="hover:text-white">
                    WhatsApp {settings.whatsapp_phone}
                  </a>
                </li>
              ) : null}
              <li>{settings.business_address || "Use the contact page for quote details and location context."}</li>
            </ul>
          </Reveal>

          <Reveal delay={270}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">Quick links</p>
            <ul className="mt-4 space-y-3 text-[15px] text-white/78">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            {phoneHref ? (
              <a
                href={phoneHref}
                className="surface-lift inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[15px] font-semibold text-white/85 hover:bg-white/10 hover:text-white"
              >
                <PhoneIcon className="h-4 w-4" />
                Call {settings.contact_phone}
              </a>
            ) : null}

            {hasSettingValue(settings.contact_email) ? (
              <a
                href={`mailto:${settings.contact_email}`}
                className="surface-lift inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[15px] font-semibold text-white/85 hover:bg-white/10 hover:text-white"
              >
                <MailIcon className="h-4 w-4" />
                Email us
              </a>
            ) : null}

            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="surface-lift inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[15px] font-semibold text-white/85 hover:bg-white/10 hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            ) : null}

            {socialLinks.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="surface-lift inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[15px] font-semibold text-white/85 hover:bg-white/10 hover:text-white"
              >
                <SocialNetworkIcon network={item.key} className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[15px] text-white/75 sm:self-start">
            Open for the jobs your day actually needs.
          </div>
        </Reveal>
      </div>
    </footer>
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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3.5 5.5h13v9h-13v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 6l6 4.5L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 3.5a6 6 0 00-5.2 9l-.8 4 4-1A6 6 0 1010 3.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path
        d="M7.8 8.1c.1-.3.3-.4.5-.4h.5c.2 0 .4.1.5.4l.5 1.3c.1.2 0 .4-.1.6l-.4.5c.5.9 1.1 1.6 2 2l.5-.4c.2-.1.4-.2.6-.1l1.3.5c.3.1.4.3.4.5v.5c0 .2-.1.4-.4.5-.5.2-1 .2-1.5.1A6 6 0 017 9.5c-.1-.5-.1-1 .1-1.4.1 0 .3-.1.7 0z"
        fill="currentColor"
      />
    </svg>
  );
}
