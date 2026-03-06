import Link from "next/link";
import type { ReactNode } from "react";

const heroBadges = ["MOVING", "CLEANING", "DELIVERY", "JUNK REMOVAL", "SNOW REMOVAL"];

const overviewCards = [
  {
    title: "Contact direct",
    description: "Appelez ou ecrivez directement a TB Service Plus pour expliquer le travail a faire.",
    icon: "phone",
  },
  {
    title: "Services utiles",
    description: "Le site met en avant les cinq services qui reviennent le plus souvent pour les clients.",
    icon: "grid",
  },
  {
    title: "Intervention locale",
    description: "La page est organisee pour aider rapidement les maisons et petites entreprises.",
    icon: "home",
  },
];

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

const promisePoints = [
  "Un hero qui explique le service des le premier ecran.",
  "Des CTA visibles pour appeler ou demander un devis.",
  "Une grille de services plus facile a parcourir.",
  "Une structure de page plus nette et plus professionnelle.",
];

const processSteps = [
  {
    step: "01",
    title: "Dites-nous le besoin",
    description: "Appelez, envoyez un email, ou ouvrez le formulaire de contact pour decrire le travail.",
  },
  {
    step: "02",
    title: "Nous confirmons le service",
    description: "Nous clarifions le type de service, le lieu, le timing et les details utiles avant l'intervention.",
  },
  {
    step: "03",
    title: "Nous intervenons",
    description: "TB Service Plus se deplace pour la mission avec une approche pratique et directe.",
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

            <h1 className="mt-8 max-w-[820px] text-[clamp(3rem,8vw,6.1rem)] font-semibold leading-[0.93] tracking-[-0.08em] text-white">
              One call for moving, cleaning, delivery, junk removal, and snow removal.
            </h1>

            <p className="mt-6 max-w-3xl text-[17px] leading-8 text-white/82 md:text-[20px] md:leading-9">
              TB Service Plus helps homes and small businesses with dependable local support, direct communication, and
              practical service for the jobs that need to get done.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a
                href="tel:4039264063"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-[15px] font-semibold text-brand-primary shadow-[0_18px_44px_rgba(255,255,255,0.18)]"
              >
                Call 403-926-4063
                <PhoneIcon className="h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur"
              >
                Discover our services
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <HeroStat title="Direct contact" value="Phone + email" />
              <HeroStat title="Core offer" value="5 service lines" />
              <HeroStat title="Best fit" value="Home + business" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f2]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="max-w-xl">
              <SectionLabel>TB Service Plus</SectionLabel>
              <h2 className="mt-5 text-[clamp(2.3rem,4.8vw,4.3rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-brand-ink">
                Une page qui prend toute la largeur et qui annonce le service tout de suite.
              </h2>
              <p className="mt-6 text-[16px] leading-8 text-muted md:text-[18px]">
                La maquette montre une structure directe. Le visiteur voit le service, comprend les prestations, puis passe rapidement vers un appel ou un devis.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {overviewCards.map((card) => (
                <OverviewCard key={card.title} title={card.title} description={card.description} icon={card.icon} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <SectionLabel>Services</SectionLabel>
              <h2 className="mt-5 text-[clamp(2.25rem,4.8vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-brand-ink">
                Vos services principaux, presentes dans une grille plus propre.
              </h2>
            </div>
            <p className="max-w-2xl text-[16px] leading-8 text-muted md:text-[18px]">
              Chaque carte met en avant une ligne de service claire. Cela rapproche la page du format d un vrai site de services, au lieu d une landing generique.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {serviceCards.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f2]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-24">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[32px] bg-brand-ink p-7 text-white shadow-[0_24px_60px_rgba(5,3,47,0.18)] md:p-10">
              <SectionLabel tone="dark">Why choose us</SectionLabel>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,4.4vw,3.7rem)] font-semibold leading-[1] tracking-[-0.06em]">
                Une structure plus nette, plus directe, et plus credible pour TB Service Plus.
              </h2>
              <p className="mt-6 max-w-2xl text-[16px] leading-8 text-white/76 md:text-[18px]">
                La page suit maintenant une logique simple: un hero fort, des services faciles a parcourir, puis un chemin
                de contact clair pour faire avancer la demande.
              </p>

              <div className="mt-8 space-y-4">
                {promisePoints.map((item) => (
                  <PromisePoint key={item}>{item}</PromisePoint>
                ))}
              </div>
            </article>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {processSteps.map((step) => (
                <ProcessCard key={step.step} step={step.step} title={step.title} description={step.description} />
              ))}
            </div>
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

function HeroStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/12 bg-white/8 px-5 py-4 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">{title}</p>
      <p className="mt-2 text-[16px] font-semibold text-white">{value}</p>
    </div>
  );
}

function OverviewCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <article className="rounded-[28px] border border-border-soft bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.05)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sand text-brand-primary">
        <SupportIcon type={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-6 text-[1.35rem] font-semibold leading-[1.05] tracking-[-0.04em] text-brand-ink">{title}</h3>
      <p className="mt-4 text-[15px] leading-7 text-muted">{description}</p>
    </article>
  );
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

function PromisePoint({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] bg-white/8 px-4 py-4">
      <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-primary">
        <CheckIcon className="h-4 w-4" />
      </span>
      <p className="text-[15px] leading-7 text-white/82">{children}</p>
    </div>
  );
}

function ProcessCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <article className="rounded-[28px] border border-border-soft bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-primary">Step {step}</p>
      <h3 className="mt-4 text-[1.45rem] font-semibold leading-[1.04] tracking-[-0.04em] text-brand-ink">{title}</h3>
      <p className="mt-4 text-[15px] leading-7 text-muted">{description}</p>
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5 10.5l3.1 3.1L15 6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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