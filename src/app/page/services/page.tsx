import Link from "next/link";
import Reveal from "@/components/Reveal";
import ServicesShowcase from "@/components/ServicesShowcase";

const SERVICE_PILLS = ["Moving", "Cleaning", "Delivery", "Junk Removal", "Snow Removal"] as const;

export default function ServicesPage() {
  return (
    <div className="page-stage relative left-1/2 right-1/2 -mt-4 -mb-12 w-screen -translate-x-1/2 overflow-hidden bg-[#e6ddd1] md:-mt-6 md:-mb-16">
      <ServicesHero />

      <ServicesShowcase
        sectionId="service-catalog"
        badge="Service catalog"
        heading="Useful services for the home and the practical jobs people need every day"
        description="Browse the active TB Service Plus offers, open the detail page for each service, and move quickly to contact when you are ready to book or request a quote."
        ctaHref="/page/contact"
        ctaLabel="Get a quote"
        showDescription
      />
    </div>
  );
}

function ServicesHero() {
  return (
    <section className="relative isolate min-h-[340px] overflow-hidden bg-brand-ink text-white md:min-h-[420px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(5, 3, 47, 0.84) 0%, rgba(5, 3, 47, 0.72) 40%, rgba(5, 3, 47, 0.48) 100%), url('/hero-port-scene.svg')",
        }}
      />
      <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.22),transparent_35%)]" />
      <div className="float-orb pointer-events-none absolute left-[-8%] top-[12%] h-64 w-64 rounded-full bg-brand-primary/18 blur-3xl" />
      <div className="float-orb float-orb-delayed pointer-events-none absolute right-[-5%] top-[18%] h-72 w-72 rounded-full bg-brand-coral/14 blur-3xl" />

      <div className="relative mx-auto flex min-h-[340px] max-w-[1280px] items-center px-6 py-20 md:min-h-[420px] md:px-8">
        <div className="max-w-[780px]">
          <Reveal className="flex flex-wrap gap-3">
            {SERVICE_PILLS.map((pill) => (
              <span
                key={pill}
                className="surface-lift inline-flex items-center rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/86 backdrop-blur"
              >
                {pill}
              </span>
            ))}
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-8 max-w-[860px] text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.94] tracking-[-0.07em] text-white">
              Explore the services available through TB Service Plus.
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-6 max-w-3xl text-[17px] leading-8 text-white/82 md:text-[19px] md:leading-9">
              Review the active offers, compare the jobs we handle, and move directly to contact when you are ready to
              request a quote.
            </p>
          </Reveal>

          <Reveal delay={270}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/page/contact"
                className="surface-lift inline-flex min-h-14 min-w-[220px] items-center justify-center rounded-[14px] bg-white px-7 py-4 text-[15px] font-semibold text-brand-primary shadow-[0_18px_44px_rgba(255,255,255,0.18)]"
              >
                Get a quote
              </Link>
              <a
                href="#service-catalog"
                className="surface-lift inline-flex min-h-14 min-w-[220px] items-center justify-center rounded-[14px] border border-white/28 bg-white/6 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur"
              >
                Browse catalog
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
