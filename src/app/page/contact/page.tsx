import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import SocialNetworkIcon from "@/components/SocialNetworkIcon";
import { getPublicSiteSettings } from "@/services/settings.server";
import { formatPhoneHref, formatWhatsAppHref, getSocialLinks, hasSettingValue } from "@/utils/site-settings";

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
    <div className="page-stage page-stage-sharp relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_28%,#f6f8fc_100%)]">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-brand-ink text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(5, 3, 47, 0.52) 0%, rgba(5, 3, 47, 0.82) 100%), url('/hero-port-scene.svg')",
          }}
        />
        <div className="contact-hero-glow absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(95,103,244,0.24),transparent_34%),linear-gradient(120deg,rgba(36,81,209,0.18),transparent_54%)]" />

        <div className="relative mx-auto flex min-h-[420px] max-w-[1280px] items-center justify-center px-6 py-18 text-center md:min-h-[500px] md:px-8 md:py-24">
          <div className="max-w-4xl">
            <span className="contact-rise contact-delay-1 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white/88 backdrop-blur-sm">
              <ContactIcon type="mail" className="h-4 w-4" />
              Contact & location
            </span>
            <h1 className="public-title contact-rise contact-delay-2 mt-6 text-white">Let&apos;s plan your next service clearly.</h1>
            <p className="public-copy contact-rise contact-delay-3 mx-auto mt-5 max-w-[34rem] text-white/84">
              Reach our team, view the public contact channels, and send a precise request from one cleaner contact page.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
          <article className="contact-rise-left contact-delay-2 rounded-[28px] border border-black/10 bg-white px-6 py-7 md:px-8 md:py-8">
            <div className="max-w-3xl">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-primary/18 bg-white text-brand-primary">
                  <ContactIcon type="support" className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Direct support</p>
                  <h2 className="public-subtitle mt-2 text-brand-ink">We help you through every request.</h2>
                </div>
              </div>
              <p className="public-copy mt-5 max-w-3xl text-brand-ink/72">
                Share the service you need, the location, and the timing. We respond with the next step, the right contact channel,
                and a clearer quote path.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {supportBullets.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-primary/18 bg-white text-brand-primary">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <p className="text-[15px] leading-8 text-brand-ink/72">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="contact-rise-right contact-delay-3 px-1 py-2 md:px-4 md:py-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Stay connected</p>
            <h2 className="public-subtitle mt-3 text-brand-ink">Public links & quick actions</h2>
            <p className="public-copy mt-4 text-brand-ink/68">
              Use social links, call directly, or open WhatsApp for quicker coordination.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {socialLinks.length > 0 ? (
                socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-[16px] border border-black/12 bg-white px-4 py-3 text-[14px] font-semibold text-brand-ink transition-colors hover:border-brand-primary/28 hover:text-brand-primary"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary/16 bg-white text-brand-primary">
                      <SocialNetworkIcon network={item.key} className="h-4 w-4" />
                    </span>
                    {item.label}
                  </a>
                ))
              ) : (
                <div className="rounded-[16px] border border-dashed border-black/12 bg-white px-4 py-5 text-[14px] leading-7 text-brand-ink/62">
                  Add social links from the admin settings to show them here.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-brand-primary px-5 py-3 text-[15px] font-semibold text-white"
                >
                  Call us
                </a>
              ) : null}
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-brand-primary/18 bg-white px-5 py-3 text-[15px] font-semibold text-brand-primary"
                >
                  Open WhatsApp
                </a>
              ) : null}
              {hasSettingValue(settings.contact_email) ? (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-black/12 bg-white px-5 py-3 text-[15px] font-semibold text-brand-ink"
                >
                  Send an email
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-18 md:px-8 md:pb-22">
        <div className="contact-rise contact-delay-2">
          <SectionHeading
            eyebrow="Contact details"
            title="Reach us through the right channel."
            description="Address, phone, WhatsApp, and email stay visible here so the page works as a real contact hub."
          />
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card, index) => (
            <ContactCardItem key={card.key} card={card} animationClass={CONTACT_ITEM_ANIMATION[index] ?? "contact-rise contact-delay-3"} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-18 md:px-8 md:pb-22">
        <div className="contact-rise contact-delay-2">
          <SectionHeading
            eyebrow="Send a request"
            title="Write to us and pin the location."
            description="Use the form to describe the work, then check the address area or map block before we confirm the next step."
          />
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="contact-rise-left contact-delay-3">
            <ContactForm />
          </div>
          <div className="contact-rise-right contact-delay-4">
            <LocationPanel
              businessAddress={businessAddress}
              mapSrc={mapSrc}
              phone={settings.contact_phone}
              email={settings.contact_email}
              phoneHref={phoneHref ?? undefined}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20 md:px-8 md:pb-24">
        <div className="contact-rise contact-delay-3 rounded-[28px] border border-black/10 bg-white px-7 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Need help now?</p>
              <h2 className="public-subtitle mt-3 text-brand-ink">We are ready to guide your request.</h2>
              <p className="public-copy mt-4 text-brand-ink/72">
                Clear details lead to faster answers. If you already know the type of job you need, open the services page and
                then send your request with the right context.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                href="/page/services"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-[15px] font-semibold text-white"
              >
                Our services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const CONTACT_ITEM_ANIMATION = [
  "contact-rise contact-delay-2",
  "contact-rise contact-delay-3",
  "contact-rise contact-delay-4",
  "contact-rise contact-delay-5",
] as const;

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
      <h2 className="public-subtitle mt-3 text-brand-ink">{title}</h2>
      <span className="mx-auto mt-6 block h-[4px] w-24 rounded-full bg-brand-primary" />
      <p className="public-copy mt-6 text-brand-ink/68">{description}</p>
    </div>
  );
}

function ContactCardItem({ card, animationClass }: { card: ContactCard; animationClass?: string }) {
  const content = (
    <div className={[animationClass, "flex items-start gap-4"].filter(Boolean).join(" ")}>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brand-primary/22 bg-white text-brand-primary">
        <ContactIcon type={card.icon} className="h-5 w-5" />
      </span>

      <div className="min-w-0">
        <p className="text-[1.05rem] font-semibold text-brand-ink">{card.title}</p>
        <p className="mt-1 text-[15px] leading-7 text-brand-ink/78">{card.value}</p>
        <p className="mt-1 text-[13px] leading-6 text-brand-ink/54">{card.description}</p>
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
  businessAddress: string | null;
  mapSrc: string | null;
  phone: string | null;
  email: string | null;
  phoneHref?: string;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-black/10 bg-white">
      <div className="border-b border-black/8 px-6 py-6 md:px-7">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-primary/18 bg-white text-brand-primary">
            <ContactIcon type="location" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Our location</p>
            <h3 className="mt-2 text-[1.6rem] font-semibold tracking-[-0.05em] text-brand-ink">Map & address context</h3>
            <p className="mt-2 text-[15px] leading-7 text-brand-primary">
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

      {(phone || email) ? (
        <div className="border-t border-black/8 bg-[#f8faff] px-6 py-5 md:px-7">
          <div className="flex flex-col gap-2 text-[14px] leading-7 text-brand-ink/76">
            {phoneHref ? (
              <a href={phoneHref} className="hover:text-brand-primary">
                {phone}
              </a>
            ) : phone ? (
              <p>{phone}</p>
            ) : null}
            {email ? <p>{email}</p> : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ContactIcon({
  type,
  className,
}: {
  type: "support" | "location" | "phone" | "whatsapp" | "mail";
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
