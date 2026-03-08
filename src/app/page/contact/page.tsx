import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

const CONTACT_PHONE_DISPLAY = "403-926-4063";
const CONTACT_PHONE_TEL = "4039264063";
const CONTACT_EMAIL = "TBserviceplus1@gmail.com";

const SERVICE_PILLS = ["Moving", "Cleaning", "Delivery", "Junk Removal", "Snow Removal"] as const;

export default function ContactPage() {
  const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS?.trim() || "";
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const mapQuery = businessAddress || "TB Service Plus";
  const mapSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(mapQuery)}`
    : null;

  return (
    <div className="contact-reference-type relative left-1/2 right-1/2 -mt-4 -mb-12 w-screen -translate-x-1/2 overflow-hidden bg-[#f3f2ee] md:-mt-6 md:-mb-16">
      <ContactHero />

      <section className="relative z-10 mx-auto -mt-16 max-w-[1280px] px-6 pb-20 md:-mt-24 md:px-8 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <Reveal className="pt-4 lg:pt-28">
            <p className="text-[13px] font-medium tracking-[-0.01em] text-brand-ink/56">Direct contact</p>
            <h2 className="mt-4 max-w-[12ch] text-[clamp(2.45rem,4.7vw,4rem)] font-medium leading-[0.98] tracking-[-0.05em] text-brand-ink">
              Get in touch with us
            </h2>
            <p className="mt-4 max-w-[35rem] text-[16px] leading-[1.58] text-brand-ink/72 md:text-[18px]">
              Fill out the form to tell us what you need. We will get back to you quickly with the next step, quote
              context, and the key details to move forward.
            </p>

            <div className="mt-9 space-y-4">
              <ContactInfoItem
                icon="phone"
                label="Phone"
                lines={[CONTACT_PHONE_DISPLAY, "For urgent requests or fast coordination."]}
                href={`tel:${CONTACT_PHONE_TEL}`}
              />
              <ContactInfoItem
                icon="mail"
                label="Email"
                lines={[CONTACT_EMAIL, "Best if you want to send your request details in writing."]}
                href={`mailto:${CONTACT_EMAIL}`}
              />
              <ContactInfoItem
                icon="services"
                label="Services covered"
                lines={["Moving, cleaning, delivery,", "junk removal, and snow removal."]}
              />
              <ContactInfoItem
                icon="clock"
                label="Response"
                lines={["Fast follow-up by phone or email", "with a clear next step."]}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {SERVICE_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full border border-black/8 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink/66 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} variant="left">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-20 md:px-8 md:pb-24">
        <Reveal className="text-center">
          <p className="text-[13px] font-medium tracking-[-0.01em] text-brand-ink/56">Location</p>
          <h2 className="mt-4 text-[clamp(2.2rem,4.1vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.05em] text-brand-ink">
            Our location
          </h2>
          <p className="mt-4 text-[16px] leading-[1.58] text-brand-ink/72 md:text-[18px]">
            Check the map to view the service area or location point before your request is confirmed.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-8 overflow-hidden rounded-[34px] border border-black/8 bg-white shadow-[0_26px_70px_rgba(15,23,42,0.08)]">
          {mapSrc ? (
            <iframe
              title="TB Service Plus location map"
              src={mapSrc}
              className="h-[380px] w-full border-0 md:h-[520px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#fbfbf8_0%,#f0efe9_100%)] px-6 py-12 text-center md:min-h-[420px]">
              <div className="max-w-xl">
                <p className="text-[1.05rem] font-semibold text-brand-ink">The map will appear here</p>
                <p className="mt-3 text-[14px] leading-6 text-brand-ink/66">
                  Configure the business location to display the full map in this section.
                </p>
                {businessAddress ? (
                  <p className="mt-4 text-[14px] font-medium text-brand-ink/72">{businessAddress}</p>
                ) : null}
              </div>
            </div>
          )}
        </Reveal>

        {businessAddress ? (
          <p className="mt-5 text-center text-[14px] leading-7 text-brand-ink/62">{businessAddress}</p>
        ) : null}
      </section>
    </div>
  );
}

function ContactHero() {
  return (
    <Reveal className="relative isolate min-h-[320px] overflow-hidden md:min-h-[420px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(5, 3, 47, 0.46) 0%, rgba(5, 3, 47, 0.62) 100%), url('/hero-port-scene.svg')",
        }}
      />
      <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_36%)]" />

      <div className="relative mx-auto flex min-h-[320px] max-w-[1280px] items-center justify-center px-6 py-16 text-center md:min-h-[420px] md:px-8">
        <div className="max-w-4xl">
          <p className="text-[15px] font-medium tracking-[-0.01em] text-white/74">TB Service Plus</p>
          <h1 className="mt-5 text-[clamp(3.1rem,6.5vw,5.6rem)] font-medium leading-[0.94] tracking-[-0.06em] text-white">
            Contact us
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-[18px] leading-[1.6] text-white/86 md:text-[21px]">
            We are here to answer your questions and help you find the right solution for your needs.
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function ContactInfoItem({
  icon,
  label,
  lines,
  href,
}: {
  icon: "phone" | "mail" | "services" | "clock";
  label: string;
  lines: [string, string] | string[];
  href?: string;
}) {
  const content = (
    <div className="surface-lift flex items-start gap-4 rounded-[24px] border border-black/8 bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
        <InfoIcon type={icon} className="h-5 w-5" />
      </span>

      <div>
        <p className="text-[13px] font-medium tracking-[-0.01em] text-brand-ink/56">{label}</p>
        {lines.map((line) => (
          <p key={line} className="mt-1 text-[15px] leading-[1.5] text-brand-ink/76">
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
}

function InfoIcon({ type, className }: { type: "phone" | "mail" | "services" | "clock"; className?: string }) {
  if (type === "phone") {
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

  if (type === "mail") {
    return (
      <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
        <path d="M3.5 5.5h13v9h-13v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M4 6l6 4.5L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "services") {
    return (
      <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
        <path d="M4 5.5h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 14.5h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 6.5v3.8l2.4 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
