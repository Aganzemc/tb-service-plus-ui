import Link from "next/link";
import type { ReactNode } from "react";

const heroBadges = ["MOVING", "CLEANING", "DELIVERY", "JUNK REMOVAL", "SNOW REMOVAL"];


const serviceCards = [
  {
    number: "01",
    title: "Moving Services",
    description: "Aide pour demenagement de maison, appartement, meubles, cartons, chargement et dechargement.",
    detail: "Homes, apartments, boxes, furniture",
    accent: "#2563eb",
    tint: "#edf4ff",
    icon: "moving",
  },
  {
    number: "02",
    title: "Cleaning Services",
    description: "Nettoyage regulier, nettoyage complet, remise en etat et soutien avant ou apres un demenagement.",
    detail: "Kitchens, bathrooms, floors, reset cleans",
    accent: "#ff8d44",
    tint: "#fff1e8",
    icon: "cleaning",
  },
  {
    number: "03",
    title: "Delivery Services",
    description: "Livraison locale de cartons, petits meubles, fournitures et commandes de proximite.",
    detail: "Fast local pickup and drop-off",
    accent: "#4f46e5",
    tint: "#eeefff",
    icon: "delivery",
  },
  {
    number: "04",
    title: "Junk Removal",
    description: "Debarras pratique pour meubles, sacs, objets encombrants et petits residus de chantier.",
    detail: "Clean-outs, haul-away, curb pickup",
    accent: "#d946ef",
    tint: "#fdf0ff",
    icon: "junk",
  },
  {
    number: "05",
    title: "Snow Removal",
    description: "Degagement des entrees, trottoirs et acces pour garder la propriete plus sure en hiver.",
    detail: "Driveways, walkways, entrances",
    accent: "#0ea5e9",
    tint: "#ebf8ff",
    icon: "snow",
  },
];


export default function HomePage() {
  return (
    <div className="relative left-1/2 right-1/2 -mt-4 -mb-12 w-screen -translate-x-1/2 overflow-hidden bg-white md:-mt-6 md:-mb-16">
      <section className="relative isolate min-h-[calc(100vh-78px)] overflow-hidden bg-brand-ink text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5, 3, 47, 0.84) 0%, rgba(5, 3, 47, 0.72) 40%, rgba(5, 3, 47, 0.44) 100%), url('/hero-port-scene.svg')",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.22),transparent_35%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-78px)] max-w-[1280px] items-center px-6 py-20 md:px-8 md:py-28">
          <div className="max-w-[760px]">
            <div className="flex flex-wrap gap-3">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/86 backdrop-blur"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="mt-8 max-w-[820px] text-[clamp(2.6rem,6.9vw,5.2rem)] font-semibold leading-[0.93] tracking-[-0.08em] text-white">
              One call for moving, cleaning, delivery, junk removal, and snow removal.
            </h1>

            <p className="mt-6 max-w-3xl text-[17px] leading-8 text-white/82 md:text-[20px] md:leading-9">
              TB Service Plus helps homes and small businesses with dependable local support, direct communication, and
              practical service for the jobs that need to get done.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/page/contact"
                className="inline-flex min-h-14 min-w-[250px] items-center justify-between gap-4 rounded-[14px] bg-white px-7 py-4 text-[15px] font-semibold text-brand-primary shadow-[0_18px_44px_rgba(255,255,255,0.18)]"
              >
                Reservez maintenant
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href="#services"
                className="inline-flex min-h-14 min-w-[250px] items-center justify-between gap-4 rounded-[14px] border border-white/28 bg-white/6 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur"
              >
                Decouvrir nos services
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>


      <section id="services" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-24">
          <div>
            <h2 className="text-[clamp(2.25rem,4.8vw,4rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-brand-ink">
              Nos services
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {serviceCards.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-24">
          <div className="rounded-[36px] bg-[linear-gradient(135deg,#5f67f4_0%,#3e46c9_100%)] p-8 text-white shadow-[0_30px_70px_rgba(95,103,244,0.28)] md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <SectionLabel tone="dark">Ready to book</SectionLabel>
                <h2 className="mt-5 max-w-3xl text-[clamp(2.35rem,5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.06em]">
                  Besoin de soutien pour demenager, nettoyer, livrer, debarrasser ou deneiger?
                </h2>
                <p className="mt-6 max-w-2xl text-[16px] leading-8 text-white/84 md:text-[18px]">
                  Appelez maintenant ou utilisez le formulaire de contact pour demander un devis adapte a votre besoin.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <a
                    href="tel:4039264063"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-[15px] font-semibold text-brand-primary"
                  >
                    Call 403-926-4063
                    <PhoneIcon className="h-4 w-4" />
                  </a>
                  <Link
                    href="/page/contact"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/10 px-6 py-4 text-[15px] font-semibold text-white"
                  >
                    Demander un devis
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/16 bg-white/10 p-6 backdrop-blur md:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/68">Direct contact</p>
                <div className="mt-6 space-y-4">
                  <ContactLine icon="phone" label="Telephone" value="403-926-4063" href="tel:4039264063" />
                  <ContactLine icon="mail" label="Email" value="TBserviceplus1@gmail.com" href="mailto:TBserviceplus1@gmail.com" />
                  <ContactLine icon="arrow" label="Next step" value="Open the contact page for quote details" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  const className =
    tone === "dark"
      ? "inline-flex items-center rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82"
      : "inline-flex items-center rounded-full border border-border-soft bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-ink/65";

  return <span className={className}>{children}</span>;
}

function ServiceCard({
  service,
}: {
  service: {
    number: string;
    title: string;
    description: string;
    detail: string;
    accent: string;
    tint: string;
    icon: string;
  };
}) {
  return (
    <article className="overflow-hidden rounded-[30px] border border-border-soft bg-white shadow-[0_18px_40px_rgba(5,3,47,0.05)]">
      <div className="h-2" style={{ backgroundColor: service.accent }} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{service.number}</span>
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: service.tint, color: service.accent }}
          >
            <ServiceIcon type={service.icon} className="h-6 w-6" />
          </span>
        </div>
        <h3 className="mt-6 text-[1.55rem] font-semibold leading-[1.02] tracking-[-0.05em] text-brand-ink">{service.title}</h3>
        <p className="mt-4 text-[15px] leading-7 text-muted">{service.description}</p>
        <div className="mt-6 rounded-[22px] px-4 py-3 text-[14px] font-semibold leading-6 text-brand-ink" style={{ backgroundColor: service.tint }}>
          {service.detail}
        </div>
      </div>
    </article>
  );
}


function ContactLine({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-[20px] bg-white/10 px-4 py-4">
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
    return <a href={href}>{content}</a>;
  }

  return content;
}

function SupportIcon({ type, className }: { type: string; className?: string }) {
  if (type === "phone") return <PhoneIcon className={className} />;
  if (type === "mail") return <MailIcon className={className} />;
  if (type === "arrow") return <ArrowRightIcon className={className} />;

  if (type === "home") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 11.5L12 5l8 6.5V20H4v-8.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 20v-4.5h6V20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4.5 10h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


function ServiceIcon({ type, className }: { type: string; className?: string }) {
  if (type === "moving") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 8h11v8H4V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M15 10h3l2 2v4h-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="7.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="17.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "cleaning") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 5h6l2 4H7l2-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 9h8l-1 10H9L8 9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 12v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "delivery") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M5 7l7-3 7 3-7 3-7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 7v10l7 3 7-3V7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 10v10" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "junk") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 7h8l-1 12H9L8 7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M6 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 17l4-10 2 5 2-2 2 7H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}