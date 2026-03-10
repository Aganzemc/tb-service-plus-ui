import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import ServicesShowcase from "@/components/ServicesShowcase";
import { getPublicSiteSettings } from "@/services/settings.server";
import type { SiteSettings } from "@/types/site-settings";
import { formatPhoneHref, formatWhatsAppHref, hasSettingValue } from "@/utils/site-settings";

const heroBadges = ["MOVING", "CLEANING", "DELIVERY", "JUNK REMOVAL", "SNOW REMOVAL"] as const;

type SupportIconType = "phone" | "mail" | "whatsapp" | "arrow";

export default async function HomePage() {
  const settings = await getPublicSiteSettings();

  return (
    <div className="page-stage relative left-1/2 right-1/2 -mt-4 -mb-12 w-screen -translate-x-1/2 overflow-hidden bg-white md:-mt-6 md:-mb-16">
      <HeroSection />

      <ServicesShowcase
        sectionId="services"
        badge="Our services"
        heading="What we can do for you"
        description="Moving, cleaning, delivery, junk removal, and snow removal. The home page now presents the active services coming from the API in a more editorial layout."
        ctaHref="/page/services"
        ctaLabel="View all services"
        maxItems={4}
      />

      <ContactSection settings={settings} />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100vh-78px)] overflow-hidden bg-brand-ink text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(5, 3, 47, 0.84) 0%, rgba(5, 3, 47, 0.72) 40%, rgba(5, 3, 47, 0.44) 100%), url('/hero-port-scene.svg')",
        }}
      />
      <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.24),transparent_35%)]" />
      <div className="float-orb pointer-events-none absolute left-[-8%] top-[12%] h-64 w-64 rounded-full bg-brand-primary/20 blur-3xl" />
      <div className="float-orb float-orb-delayed pointer-events-none absolute right-[-6%] top-[18%] h-72 w-72 rounded-full bg-brand-coral/18 blur-3xl" />
      <div className="float-orb pointer-events-none absolute bottom-[-10%] left-[32%] h-60 w-60 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-78px)] max-w-[1280px] items-center px-6 py-20 md:px-8 md:py-28">
        <div className="max-w-[760px]">
          <Reveal className="flex flex-wrap gap-3">
            {heroBadges.map((badge) => (
              <span
                key={badge}
                className="surface-lift inline-flex items-center rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/86 backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </Reveal>

          <Reveal delay={90}>
            <h1 className="public-title mt-8 max-w-[820px] text-white">
              One call for moving, cleaning, delivery, junk removal, and snow removal.
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="public-copy mt-6 max-w-3xl text-white/82">
              TB Service Plus helps homes and small businesses with dependable local support, direct communication, and
              practical service for the jobs that need to get done.
            </p>
          </Reveal>

          <Reveal delay={270}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/page/contact"
                className="surface-lift inline-flex min-h-14 min-w-[250px] items-center justify-between gap-4 rounded-[14px] bg-white px-7 py-4 text-[15px] font-semibold text-brand-primary shadow-[0_18px_44px_rgba(255,255,255,0.18)]"
              >
                Book now
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href="#services"
                className="surface-lift inline-flex min-h-14 min-w-[250px] items-center justify-between gap-4 rounded-[14px] border border-white/28 bg-white/6 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur"
              >
                Explore our services
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ settings }: { settings: SiteSettings }) {
  const phoneHref = formatPhoneHref(settings.contact_phone);
  const whatsappHref = formatWhatsAppHref(settings.whatsapp_phone);

  return (
    <section id="contact" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-24">
        <Reveal className="rounded-[36px] bg-[linear-gradient(135deg,#5f67f4_0%,#3e46c9_100%)] p-8 text-white shadow-[0_30px_70px_rgba(95,103,244,0.28)] md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <SectionLabel tone="dark">Ready to book</SectionLabel>
              <h2 className="public-subtitle mt-5 max-w-3xl">
                Need help moving, cleaning, delivering, clearing out, or removing snow?
              </h2>
              <p className="public-copy mt-6 max-w-2xl text-white/84">
                Call now, write on WhatsApp, or use the contact form to request a quote that fits your job.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                {phoneHref ? (
                  <a
                    href={phoneHref}
                    className="surface-lift inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-[15px] font-semibold text-brand-primary"
                  >
                    Call {settings.contact_phone}
                    <PhoneIcon className="h-4 w-4" />
                  </a>
                ) : null}

                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="surface-lift inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/10 px-6 py-4 text-[15px] font-semibold text-white"
                  >
                    WhatsApp us
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                ) : null}

                <Link
                  href="/page/contact"
                  className="surface-lift inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/10 px-6 py-4 text-[15px] font-semibold text-white"
                >
                  Get a quote
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <Reveal delay={140} variant="left" className="rounded-[28px] border border-white/16 bg-white/10 p-6 backdrop-blur md:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/68">Direct contact</p>
              <div className="mt-6 space-y-4">
                {phoneHref ? <ContactLine icon="phone" label="Phone" value={settings.contact_phone} href={phoneHref} /> : null}
                {hasSettingValue(settings.contact_email) ? (
                  <ContactLine icon="mail" label="Email" value={settings.contact_email} href={`mailto:${settings.contact_email}`} />
                ) : null}
                {whatsappHref ? (
                  <ContactLine icon="whatsapp" label="WhatsApp" value={settings.whatsapp_phone} href={whatsappHref} />
                ) : null}
                <ContactLine icon="arrow" label="Next step" value="Open the contact page for quote details" />
              </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SectionLabel({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  const className =
    tone === "dark"
      ? "inline-flex items-center rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82"
      : "inline-flex items-center rounded-full border border-border-soft bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-ink/65";

  return <span className={className}>{children}</span>;
}

function ContactLine({
  icon,
  label,
  value,
  href,
}: {
  icon: SupportIconType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="surface-lift flex items-start gap-3 rounded-[20px] bg-white/10 px-4 py-4">
      <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-primary">
        <SupportIcon type={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">{label}</p>
        <p className="mt-1 text-[15px] font-semibold text-white">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{content}</a>;
  }

  return content;
}

function SupportIcon({ type, className }: { type: SupportIconType; className?: string }) {
  if (type === "phone") return <PhoneIcon className={className} />;
  if (type === "mail") return <MailIcon className={className} />;
  if (type === "whatsapp") return <WhatsAppIcon className={className} />;
  if (type === "arrow") return <ArrowRightIcon className={className} />;

  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 8h5v5H6V8zM13 8h5v5h-5V8zM6 15h5v5H6v-5zM13 15h5v5h-5v-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4.5 10h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
