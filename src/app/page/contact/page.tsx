import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import SocialNetworkIcon from "@/components/SocialNetworkIcon";
import { getPublicSiteSettings } from "@/services/settings.server";
import { formatPhoneHref, formatWhatsAppHref, getSocialLinks, hasSettingValue } from "@/utils/site-settings";

const SERVICE_PILLS = ["Moving", "Cleaning", "Delivery", "Junk Removal", "Snow Removal"] as const;

type ContactCard = {
  key: string;
  icon: "location" | "phone" | "whatsapp" | "mail";
  title: string;
  value: string;
  description: string;
  href?: string;
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  const businessAddress = settings.business_address;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const mapQuery = businessAddress || "TB Service Plus";
  const mapSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(mapQuery)}`
    : null;
  const phoneHref = formatPhoneHref(settings.contact_phone);
  const whatsappHref = formatWhatsAppHref(settings.whatsapp_phone);
  const socialLinks = getSocialLinks(settings);

  const contactCards: ContactCard[] = [
    {
      key: "address",
      icon: "location",
      title: "Office address",
      value: businessAddress || "Set your address from the admin settings.",
      description: "Visit point and service coordination location.",
    },
    {
      key: "phone",
      icon: "phone",
      title: "Phone",
      value: settings.contact_phone || "Add a public phone number.",
      description: "Best for urgent requests and quick follow-up.",
      href: phoneHref ?? undefined,
    },
    {
      key: "whatsapp",
      icon: "whatsapp",
      title: "WhatsApp",
      value: settings.whatsapp_phone || "Add a WhatsApp number.",
      description: "Fast updates, confirmations, and direct chat.",
      href: whatsappHref ?? undefined,
    },
    {
      key: "email",
      icon: "mail",
      title: "Email",
      value: settings.contact_email || "Add a public email address.",
      description: "Best for written details and quote requests.",
      href: hasSettingValue(settings.contact_email) ? `mailto:${settings.contact_email}` : undefined,
    },
  ];

  const supportBullets = [
    settings.contact_email ? `Email support available at ${settings.contact_email}.` : "Add a public email to receive written requests.",
    settings.contact_phone ? `Phone line available on ${settings.contact_phone} for urgent coordination.` : "Add a public phone line for urgent coordination.",
    settings.whatsapp_phone ? `WhatsApp updates available on ${settings.whatsapp_phone}.` : "Add WhatsApp for fast confirmations and updates.",
    "Moving, cleaning, delivery, junk removal, and snow removal requests are handled here.",
  ];

  return (
    <div className="page-stage page-stage-sharp relative left-1/2 right-1/2 -mt-[104px] w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(180deg,#f4f7fd_0%,#ffffff_24%,#f6f8fd_100%)] md:-mt-[112px]">
      <section className="relative isolate overflow-hidden border-b border-white/12 bg-brand-ink">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(5, 3, 47, 0.62) 0%, rgba(5, 3, 47, 0.82) 100%), url('/hero-port-scene.svg')",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(95,103,244,0.28),transparent_34%),linear-gradient(120deg,rgba(36,81,209,0.22),transparent_48%)]" />

        <div className="relative mx-auto flex min-h-[430px] max-w-[1280px] items-center justify-center px-6 pb-18 pt-[148px] text-center md:min-h-[520px] md:px-8 md:pb-24 md:pt-[168px]">
          <div className="max-w-4xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.34em] text-white/62">Contact & location</p>
            <h1 className="public-title mt-5 text-white">
              Let&apos;s plan your next service clearly.
            </h1>
            <p className="public-copy mx-auto mt-5 max-w-3xl text-white/82">
              Reach our team, view the public contact channels, and send a precise request from one cleaner contact page.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {SERVICE_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82 backdrop-blur-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-[1280px] px-6 pb-18 md:-mt-18 md:px-8 md:pb-22">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_360px]">
          <article className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,52,0.08)] md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4">
                  <span className="flex h-15 w-15 items-center justify-center rounded-full border border-brand-primary/18 bg-brand-primary/8 text-brand-primary">
                    <ContactIcon type="support" className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Direct support</p>
                    <h2 className="public-subtitle mt-2 text-brand-ink">We help you through every request.</h2>
                  </div>
                </div>
                <p className="public-copy mt-5 text-brand-ink/72">
                  Share the service you need, the location, and the timing. We respond with the next step, the right contact channel,
                  and a clearer quote path.
                </p>
              </div>

              <div className="rounded-[20px] bg-[#f4f7fd] px-4 py-3 text-[13px] font-semibold text-brand-primary">
                Fast reply workflow
              </div>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {supportBullets.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[20px] border border-black/8 bg-[#f8faff] px-4 py-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <p className="text-[14px] leading-7 text-brand-ink/72">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,52,0.08)] md:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Stay connected</p>
            <h2 className="public-subtitle mt-3 text-brand-ink">Public links & quick actions</h2>
            <p className="public-copy mt-3 text-brand-ink/68">
              Use social links, call directly, or open WhatsApp for quicker coordination.
            </p>

            <div className="mt-5 grid gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-[18px] border border-black/8 bg-[#f8faff] px-4 py-3 text-[14px] font-semibold text-brand-ink hover:border-brand-primary/24 hover:text-brand-primary"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                      <SocialNetworkIcon network={item.key} className="h-4 w-4" />
                    </span>
                    {item.label}
                  </a>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-black/12 bg-[#f8faff] px-4 py-5 text-[14px] leading-7 text-brand-ink/62">
                  Add social links from the admin settings to show them here.
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-3">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="inline-flex items-center justify-center rounded-[18px] bg-brand-primary px-4 py-3 text-[15px] font-semibold text-white shadow-[0_16px_34px_rgba(36,81,209,0.24)]"
                >
                  Call us
                </a>
              ) : null}
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-[18px] border border-brand-primary/18 bg-[#f4f7fd] px-4 py-3 text-[15px] font-semibold text-brand-primary"
                >
                  Open WhatsApp
                </a>
              ) : null}
              {hasSettingValue(settings.contact_email) ? (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="inline-flex items-center justify-center rounded-[18px] border border-black/8 bg-white px-4 py-3 text-[15px] font-semibold text-brand-ink"
                >
                  Send an email
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-18 md:px-8 md:pb-22">
        <SectionHeading
          eyebrow="Contact details"
          title="Reach us through the right channel."
          description="Address, phone, WhatsApp, and email stay visible here so the page works as a real contact hub."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card) => (
            <ContactCardItem key={card.key} card={card} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-18 md:px-8 md:pb-22">
        <SectionHeading
          eyebrow="Send a request"
          title="Write to us and pin the location."
          description="Use the form to describe the work, then check the address area or map block before we confirm the next step."
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ContactForm />
          <LocationPanel
            businessAddress={businessAddress}
            mapSrc={mapSrc}
            phone={settings.contact_phone}
            email={settings.contact_email}
            phoneHref={phoneHref ?? undefined}
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20 md:px-8 md:pb-24">
        <div className="rounded-[32px] border border-black/8 bg-white px-7 py-8 shadow-[0_22px_54px_rgba(15,23,52,0.06)] md:px-10 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Need help now?</p>
              <h2 className="public-subtitle mt-3 text-brand-ink">
                We are ready to guide your request.
              </h2>
              <p className="public-copy mt-4 text-brand-ink/72">
                Clear details lead to faster answers. If you already know the type of job you need, open the services page and
                then send your request with the right context.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/page/services"
                className="inline-flex items-center justify-center rounded-[18px] bg-brand-primary px-6 py-3 text-[15px] font-semibold text-white shadow-[0_16px_34px_rgba(36,81,209,0.24)]"
              >
                Our services
              </Link>
              <Link
                href="/page/home"
                className="inline-flex items-center justify-center rounded-[18px] border border-black/8 bg-white px-6 py-3 text-[15px] font-semibold text-brand-ink"
              >
                Back home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-brand-primary/78">{eyebrow}</p>
      <h2 className="public-subtitle mt-3 text-brand-ink">
        {title}
      </h2>
      <span className="mx-auto mt-6 block h-[4px] w-24 rounded-full bg-brand-primary" />
      <p className="public-copy mt-6 text-brand-ink/68">{description}</p>
    </div>
  );
}

function ContactCardItem({ card }: { card: ContactCard }) {
  const content = (
    <div className="h-full rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,52,0.05)]">
      <div className="flex items-start gap-4">
        <span className="flex h-15 w-15 shrink-0 items-center justify-center rounded-full border border-brand-primary/18 bg-brand-primary/8 text-brand-primary">
          <ContactIcon type={card.icon} className="h-6 w-6" />
        </span>

        <div className="min-w-0">
          <p className="text-[1.1rem] font-semibold text-brand-ink">{card.title}</p>
          <p className="mt-2 text-[15px] leading-7 text-brand-ink/78">{card.value}</p>
          <p className="mt-3 text-[13px] leading-6 text-brand-ink/56">{card.description}</p>
        </div>
      </div>
    </div>
  );

  if (!card.href) {
    return content;
  }

  return (
    <a
      href={card.href}
      target={card.href.startsWith("http") ? "_blank" : undefined}
      rel={card.href.startsWith("http") ? "noreferrer" : undefined}
      className="block"
    >
      {content}
    </a>
  );
}

function LocationPanel({
  businessAddress,
  mapSrc,
  phone,
  email,
  phoneHref,
}: {
  businessAddress: string;
  mapSrc: string | null;
  phone: string;
  email: string;
  phoneHref?: string;
}) {
  return (
    <article className="overflow-hidden rounded-[30px] border border-black/8 bg-white shadow-[0_24px_64px_rgba(15,23,52,0.08)]">
      <div className="border-b border-black/8 px-6 py-6 md:px-7">
        <div className="flex items-start gap-4">
          <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-brand-primary/18 bg-brand-primary/8 text-brand-primary">
            <ContactIcon type="location" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Our location</p>
            <h3 className="mt-2 text-[1.6rem] font-semibold tracking-[-0.05em] text-brand-ink">Map & address context</h3>
            <p className="mt-2 text-[15px] leading-7 text-brand-ink/72">
              {businessAddress || "Add your business address from admin settings to show the exact location here."}
            </p>
          </div>
        </div>
      </div>

      {mapSrc ? (
        <iframe
          title="TB Service Plus location map"
          src={mapSrc}
          className="h-[360px] w-full border-0 md:h-[540px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="flex min-h-[360px] items-center justify-center bg-[linear-gradient(135deg,#f8fbff_0%,#eef3ff_100%)] px-6 py-10 text-center md:min-h-[540px]">
          <div className="max-w-md">
            <p className="text-[1.1rem] font-semibold text-brand-ink">Map preview will appear here</p>
            <p className="mt-3 text-[14px] leading-7 text-brand-ink/66">
              Add `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` to show the live map panel.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 border-t border-black/8 bg-[#f8faff] px-6 py-5 md:grid-cols-2 md:px-7">
        <div className="rounded-[18px] border border-black/8 bg-white px-4 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-primary/72">Address</p>
          <p className="mt-2 text-[14px] leading-7 text-brand-ink/76">{businessAddress || "No address configured yet."}</p>
        </div>
        <div className="rounded-[18px] border border-black/8 bg-white px-4 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-primary/72">Direct line</p>
          {phoneHref ? (
            <a href={phoneHref} className="mt-2 block text-[14px] leading-7 text-brand-ink/76 hover:text-brand-primary">
              {phone}
            </a>
          ) : (
            <p className="mt-2 text-[14px] leading-7 text-brand-ink/76">{phone || "No phone configured yet."}</p>
          )}
          <p className="mt-2 text-[14px] leading-7 text-brand-ink/56">{email || "No public email configured yet."}</p>
        </div>
      </div>
    </article>
  );
}

function ContactIcon({
  type,
  className,
}: {
  type: "support" | "social" | "location" | "phone" | "whatsapp" | "mail";
  className?: string;
}) {
  if (type === "support") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4.5 12a7.5 7.5 0 0115 0v4a2 2 0 01-2 2h-2v-5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 13h4v5h-2a2 2 0 01-2-2v-3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "social") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 19a8.4 8.4 0 0114 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6 7.5a2 2 0 100-4 2 2 0 000 4zM18 7.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (type === "location") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 21s6-5.6 6-11a6 6 0 10-12 0c0 5.4 6 11 6 11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M8.2 4.5l2.4 2.9-1.3 2.3a16 16 0 004.8 4.8l2.3-1.3 2.9 2.4-1.3 3c-.3.7-1.1 1-1.9.9C9.8 18.7 5.3 14.2 4.5 7.7c-.1-.8.2-1.6.9-1.9l2.8-1.3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "whatsapp") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 4.5a7.5 7.5 0 00-6.5 11.3L4.5 20l4.4-1.1A7.5 7.5 0 1012 4.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path
          d="M9.3 10c.1-.3.3-.5.6-.5h.5c.2 0 .4.2.5.4l.6 1.4c.1.2 0 .5-.1.7l-.4.5c.5 1 1.3 1.8 2.3 2.3l.5-.4c.2-.2.5-.2.7-.1l1.4.6c.2.1.4.3.4.5v.5c0 .3-.2.5-.5.6-.5.2-1 .2-1.6.1A7 7 0 018 12.2c-.1-.5-.1-1.1.1-1.6.1-.3.3-.5.6-.6h.6"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4.5 7l7.5 5.7L19.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5 10.2l3 3L15 6.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
