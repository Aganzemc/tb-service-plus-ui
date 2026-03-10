import Link from "next/link";
import Reveal from "@/components/Reveal";

const highlights = [
  {
    title: "Local service",
    description: "A direct, easy-to-reach approach for the practical jobs people need at home and in daily life.",
  },
  {
    title: "Reliable execution",
    description: "Each request is built around quick action: quote, confirmation, and a clear next step for the job.",
  },
  {
    title: "Flexible support",
    description: "Moving, cleaning, delivery, junk removal, or snow removal depending on what the day requires.",
  },
] as const;

const ABOUT_PILLS = ["Local support", "Clear communication", "Fast follow-up"] as const;

export default function AboutPage() {
  return (
    <div className="page-stage relative left-1/2 right-1/2 -mt-4 -mb-12 w-screen -translate-x-1/2 overflow-hidden bg-[#f4f4ef] md:-mt-6 md:-mb-16">
      <AboutHero />

      <section className="mx-auto max-w-[1180px] px-6 py-16 md:px-8 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => (
            <Reveal
              key={item.title}
              delay={90 + index * 90}
              className="surface-lift rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-primary/72">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 text-[1.55rem] font-semibold tracking-[-0.05em] text-brand-ink">{item.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-brand-ink/70">{item.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={120}
          className="mt-8 rounded-[30px] border border-black/8 bg-brand-sand/45 p-6 shadow-[0_18px_40px_rgba(5,3,47,0.04)] md:p-8"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/42">Next step</p>
              <h2 className="public-subtitle mt-3 text-brand-ink">
                You can move straight to a quote.
              </h2>
              <p className="public-copy mt-3 text-brand-ink/70">
                The site is meant to keep things simple: understand the offer, then book without friction.
              </p>
            </div>

            <Link
              href="/page/contact"
              className="surface-lift inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-primary px-5 py-3 text-[15px] font-semibold text-white shadow-[0_18px_34px_rgba(95,103,244,0.2)]"
            >
              Get a quote
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function AboutHero() {
  return (
    <section className="relative isolate min-h-[340px] overflow-hidden bg-brand-ink text-white md:min-h-[420px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(5, 3, 47, 0.86) 0%, rgba(5, 3, 47, 0.72) 42%, rgba(5, 3, 47, 0.52) 100%), url('/hero-port-scene.svg')",
        }}
      />
      <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.24),transparent_35%)]" />
      <div className="float-orb pointer-events-none absolute left-[-8%] top-[12%] h-64 w-64 rounded-full bg-brand-primary/18 blur-3xl" />
      <div className="float-orb float-orb-delayed pointer-events-none absolute right-[-6%] top-[20%] h-72 w-72 rounded-full bg-brand-coral/14 blur-3xl" />

      <div className="relative mx-auto flex min-h-[340px] max-w-[1280px] items-center px-6 py-20 md:min-h-[420px] md:px-8">
        <div className="max-w-[760px]">
          <Reveal className="flex flex-wrap gap-3">
            {ABOUT_PILLS.map((pill) => (
              <span
                key={pill}
                className="surface-lift inline-flex items-center rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/86 backdrop-blur"
              >
                {pill}
              </span>
            ))}
          </Reveal>

          <Reveal delay={90}>
            <h1 className="public-title mt-8 max-w-[820px] text-white">
              TB Service Plus handles the useful jobs that keep daily life moving.
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="public-copy mt-6 max-w-3xl text-white/82">
              The project is built around a simple promise: respond quickly, stay clear, and deliver practical help
              when it is time to move, clean, deliver, clear out, or remove snow.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
