import Link from "next/link";
import type { ReactNode } from "react";

const coreServices = [
  {
    title: "Moving Services",
    description: "Apartment, house, and small office moves with careful loading, transport support, and unloading help.",
    tag: "Moving",
    tone: "from-[#0f49bf] to-[#7fa8ff]",
    icon: "moving",
    detail: "Boxes, furniture, loading, unloading",
  },
  {
    title: "Cleaning Services",
    description: "Regular cleaning, deep cleaning, and move-in or move-out support for homes and small business spaces.",
    tag: "Cleaning",
    tone: "from-[#ff992f] to-[#ffd57b]",
    icon: "cleaning",
    detail: "Kitchens, bathrooms, floors, reset cleans",
  },
  {
    title: "Delivery Services",
    description: "Fast local pickup and delivery for boxes, small furniture, supplies, and everyday items.",
    tag: "Delivery",
    tone: "from-[#2f6ae8] to-[#9fc1ff]",
    icon: "delivery",
    detail: "Local drop-offs and scheduled runs",
  },
  {
    title: "Junk Removal",
    description: "Quick removal of unwanted furniture, bags, household clutter, and light renovation debris.",
    tag: "Junk Removal",
    tone: "from-[#ff7a45] to-[#ffbf92]",
    icon: "junk",
    detail: "Clean-outs, curb pickup, haul-away help",
  },
  {
    title: "Snow Removal",
    description: "Driveway, walkway, and property access clearing to keep your home or business safer in winter.",
    tag: "Snow Removal",
    tone: "from-[#5d84db] to-[#dde8ff]",
    icon: "snow",
    detail: "Walkways, entrances, and winter access",
  },
];

const reasons = [
  {
    title: "Direct contact from the start",
    description: "Customers can call or email TB Service Plus directly instead of getting lost in a long booking flow.",
    icon: "phone",
  },
  {
    title: "Five practical service lanes",
    description: "Moving, cleaning, delivery, junk removal, and snow removal are clearly presented on the homepage.",
    icon: "grid",
  },
  {
    title: "Built for real day-to-day jobs",
    description: "The page is organized around the work people actually need help with at home or at a small business.",
    icon: "home",
  },
  {
    title: "Simple next steps",
    description: "Every major section gives a clear action: call now, request a quote, or open the contact form.",
    icon: "arrow",
  },
  {
    title: "Seasonal support included",
    description: "Snow removal sits naturally beside the rest of the offer so the business feels useful year-round.",
    icon: "snow",
  },
];

const stepItems = [
  {
    step: "01",
    title: "Tell us the job",
    description: "Call, email, or use the contact form and explain what you need help with.",
  },
  {
    step: "02",
    title: "Confirm the service",
    description: "We align on the service type, timing, and the practical details needed to get started.",
  },
  {
    step: "03",
    title: "Get the work moving",
    description: "TB Service Plus shows up ready to help with moving, cleaning, delivery, junk removal, or snow clearing.",
  },
];

const focusAreas = ["Homes", "Apartments", "Small offices", "Move-outs", "Driveways", "Walkways"];

export default function HomePage() {
  return (
    <div className="space-y-16 bg-background text-foreground md:space-y-20">
      <section className="relative overflow-hidden rounded-[40px] border border-border-soft bg-surface px-6 py-10 shadow-[0_30px_80px_rgba(5,3,47,0.08)] md:px-10 md:py-12">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(15,73,191,0.16),_transparent_65%)]" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(255,153,47,0.18),_transparent_68%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Moving</Badge>
              <Badge>Cleaning</Badge>
              <Badge>Delivery</Badge>
              <Badge>Junk Removal</Badge>
              <Badge>Snow Removal</Badge>
            </div>

            <h1 className="mt-6 max-w-4xl text-[clamp(2.9rem,7.2vw,5rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-brand-ink">
              One reliable team for moving, cleaning, delivery, junk removal, and snow removal.
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-muted md:text-[17px]">
              This page now follows a stronger service-company structure: a direct headline, strong calls to action,
              clear reasons to choose TB Service Plus, and a cleaner path to contact.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="tel:4039264063"
                className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-brand-ink px-6 py-4 text-[15px] font-semibold text-white shadow-[0_16px_30px_rgba(5,3,47,0.14)]"
              >
                <PhoneIcon className="h-4 w-4" />
                Call 403-926-4063
              </a>
              <Link
                href="/page/contact"
                className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-brand-primary px-6 py-4 text-[15px] font-semibold text-white shadow-[0_16px_30px_rgba(15,73,191,0.28)] hover:bg-brand-primary-deep"
              >
                Request Quote
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href="mailto:TBserviceplus1@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-border-soft bg-white px-6 py-4 text-[15px] font-semibold text-brand-ink"
              >
                <MailIcon className="h-4 w-4 text-brand-primary" />
                Email Us
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <InfoPill title="Direct contact" value="Phone + email" />
              <InfoPill title="Core offer" value="5 service lines" />
              <InfoPill title="Best fit" value="Homes + small business" />
            </div>
          </div>

          <div className="rounded-[32px] bg-[linear-gradient(180deg,#144dbe_0%,#0a265a_100%)] p-6 text-white shadow-[0_30px_60px_rgba(15,73,191,0.28)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/65">Get started</p>
                <h2 className="mt-2 text-[1.6rem] font-semibold tracking-[-0.04em] md:text-[1.9rem]">Call or request a quote</h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white text-brand-primary">
                <HouseIcon className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur">
              <ContactRow label="Phone" value="403-926-4063" href="tel:4039264063" icon="phone" />
              <ContactRow label="Email" value="TBserviceplus1@gmail.com" href="mailto:TBserviceplus1@gmail.com" icon="mail" />
              <ContactRow label="Best next step" value="Tell us which service you need" icon="arrow" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {coreServices.map((service) => (
                <div key={service.title} className="rounded-[22px] border border-white/12 bg-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-primary">
                      <ServiceIcon type={service.icon} className="h-5 w-5" />
                    </span>
                    <p className="text-[15px] font-semibold">{service.title}</p>
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-white/72">{service.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TrustStripCard
          title="Direct and simple"
          description="The page leads with your contact options instead of hiding them."
        />
        <TrustStripCard
          title="Service-first structure"
          description="The content is grouped around what TB Service Plus actually does."
        />
        <TrustStripCard
          title="Clear decision path"
          description="Visitors can quickly understand the offer and move to the next step."
        />
        <TrustStripCard
          title="More like a real service site"
          description="The page rhythm now feels closer to a focused moving and home-service brand."
        />
      </section>

      <section id="why-choose-us">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Badge>Why Us</Badge>
            <h2 className="mt-5 text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-brand-ink">
              5 reasons people can trust this page faster.
            </h2>
          </div>
          <p className="max-w-2xl text-[15px] leading-7 text-muted md:text-[16px]">
            Inspired by the reference site&apos;s structure, this section focuses on quick clarity. Each card explains why
            TB Service Plus feels easier to understand and easier to contact.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {reasons.map((reason) => (
            <article key={reason.title} className="rounded-[28px] border border-border-soft bg-white p-5 shadow-[0_18px_40px_rgba(5,3,47,0.06)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-sand text-brand-primary">
                <ReasonIcon type={reason.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-brand-ink md:text-[1.55rem]">
                {reason.title}
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-muted">{reason.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <Badge>Services</Badge>
            <h2 className="mt-5 text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-brand-ink">
              The service lineup is now much easier to scan.
            </h2>
          </div>
          <p className="max-w-2xl text-[15px] leading-7 text-muted md:text-[16px]">
            Instead of a generic landing page, the homepage now behaves like a proper service site with dedicated cards
            for each core job category.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {coreServices.map((service) => (
            <article
              key={service.title}
              className="group overflow-hidden rounded-[28px] border border-border-soft bg-white shadow-[0_18px_40px_rgba(5,3,47,0.06)]"
            >
              <div className={`h-3 bg-gradient-to-r ${service.tone}`} />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-border-soft bg-brand-sand px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/60">
                    {service.tag}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink text-white">
                    <ServiceIcon type={service.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-5 text-[1.45rem] font-semibold tracking-[-0.04em] text-brand-ink md:text-[1.7rem]">
                  {service.title}
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-muted">{service.description}</p>
                <div className={`mt-8 rounded-[22px] bg-gradient-to-br ${service.tone} p-4 text-[15px] font-semibold leading-6 text-white`}>
                  {service.detail}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[32px] bg-white p-7 shadow-[0_18px_40px_rgba(5,3,47,0.06)]">
          <Badge>Our Approach</Badge>
          <h2 className="mt-5 text-[clamp(2.15rem,4.2vw,3.2rem)] font-semibold leading-[1.03] tracking-[-0.05em] text-brand-ink">
            The page now follows a more credible service-company rhythm.
          </h2>
          <p className="mt-6 text-[15px] leading-7 text-muted md:text-[16px]">
            The reference site works because the visitor immediately understands three things: what the company does,
            why it is worth calling, and what to do next. Your homepage is now organized around that same logic.
          </p>
          <p className="mt-5 text-[15px] leading-7 text-muted md:text-[16px]">
            For TB Service Plus, that means a strong hero, visible contact options, clear service cards, structured
            reasons to choose the business, and a direct path to request help.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {focusAreas.map((item) => (
              <span key={item} className="rounded-full bg-brand-sand px-4 py-2 text-[14px] font-medium text-brand-ink">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[32px] bg-brand-ink p-7 text-white shadow-[0_20px_44px_rgba(5,3,47,0.16)]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Core promise</p>
          <h2 className="mt-5 text-[clamp(2.1rem,4.2vw,3rem)] font-semibold leading-[1.04] tracking-[-0.05em]">
            Clear offer. Clear contact. Clear next step.
          </h2>
          <div className="mt-8 space-y-4">
            <PromiseLine>Lead with the services customers are actually searching for.</PromiseLine>
            <PromiseLine>Keep the phone number and quote request visible in the right places.</PromiseLine>
            <PromiseLine>Explain the offer in short blocks instead of vague marketing language.</PromiseLine>
            <PromiseLine>Use the final section to convert the visitor, not just decorate the page.</PromiseLine>
          </div>
        </article>
      </section>

      <section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Badge>How It Works</Badge>
            <h2 className="mt-5 text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-brand-ink">
              A better page flow for getting visitors to act.
            </h2>
          </div>
          <p className="max-w-2xl text-[15px] leading-7 text-muted md:text-[16px]">
            The reference site uses a strong conversion sequence. This version adapts that idea for TB Service Plus with
            a simpler three-step path.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {stepItems.map((item) => (
            <article key={item.step} className="rounded-[28px] border border-border-soft bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-brand-primary">Step {item.step}</p>
              <h3 className="mt-4 text-[1.45rem] font-semibold tracking-[-0.04em] text-brand-ink md:text-[1.65rem]">
                {item.title}
              </h3>
              <p className="mt-4 text-[15px] leading-7 text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="rounded-[40px] bg-brand-primary px-6 py-10 text-white shadow-[0_34px_70px_rgba(15,73,191,0.3)] md:px-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/65">Final call to action</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2.35rem,4.8vw,4.2rem)] font-semibold leading-[1.03] tracking-[-0.05em]">
              If the page makes sense faster, more visitors will call faster.
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-white/82 md:text-[17px]">
              That is the main improvement taken from the reference layout. The homepage now guides visitors toward the
              real business goal: direct contact for a quote or service request.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="tel:4039264063"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-brand-primary"
              >
                <PhoneIcon className="h-4 w-4" />
                403-926-4063
              </a>
              <a
                href="mailto:TBserviceplus1@gmail.com"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 text-[15px] font-semibold text-white"
              >
                <MailIcon className="h-4 w-4" />
                TBserviceplus1@gmail.com
              </a>
              <Link
                href="/page/contact"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand-ink px-6 text-[15px] font-semibold text-white"
              >
                Open Contact Form
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/14 bg-white/10 p-6 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/65">What this layout now does better</p>
            <div className="mt-6 space-y-4">
              <ChecklistItem>Stronger headline hierarchy</ChecklistItem>
              <ChecklistItem>More useful section order</ChecklistItem>
              <ChecklistItem>Better CTA placement</ChecklistItem>
              <ChecklistItem>Service-first page structure</ChecklistItem>
              <ChecklistItem>Cleaner path from interest to contact</ChecklistItem>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border-soft bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/60">
      {children}
    </span>
  );
}

function InfoPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-border-soft bg-white px-5 py-4 shadow-[0_14px_28px_rgba(5,3,47,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{title}</p>
      <p className="mt-2 text-[15px] font-semibold text-brand-ink">{value}</p>
    </div>
  );
}

function TrustStripCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-[28px] border border-border-soft bg-white p-5 shadow-[0_18px_40px_rgba(5,3,47,0.05)]">
      <h3 className="text-[1.15rem] font-semibold tracking-[-0.03em] text-brand-ink">{title}</h3>
      <p className="mt-3 text-[15px] leading-7 text-muted">{description}</p>
    </article>
  );
}

function ContactRow({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: string;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-[18px] bg-white/8 px-4 py-3">
      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-primary">
        <ReasonIcon type={icon} className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">{label}</p>
        <p className="mt-1 text-[15px] font-semibold text-white">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}

function PromiseLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] bg-white/8 px-4 py-4">
      <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-primary">
        <CheckIcon className="h-4 w-4" />
      </span>
      <p className="text-[15px] leading-7 text-white/82">{children}</p>
    </div>
  );
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-white/8 px-4 py-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-primary">
        <CheckIcon className="h-4 w-4" />
      </span>
      <p className="text-[15px] font-medium text-white/85">{children}</p>
    </div>
  );
}

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 11.5L12 5l8 6.5V20H4v-8.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 20v-4.5h6V20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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
      <path
        d="M10.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function ReasonIcon({ type, className }: { type: string; className?: string }) {
  if (type === "phone") return <PhoneIcon className={className} />;
  if (type === "mail") return <MailIcon className={className} />;
  if (type === "home") return <HouseIcon className={className} />;
  if (type === "arrow") return <ArrowRightIcon className={className} />;
  if (type === "snow") return <ServiceIcon type="snow" className={className} />;

  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 8h5v5H6V8zM13 8h5v5h-5V8zM6 15h5v5H6v-5zM13 15h5v5h-5v-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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
