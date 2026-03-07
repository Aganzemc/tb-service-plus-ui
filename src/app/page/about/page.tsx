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
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <Reveal className="relative overflow-hidden rounded-[32px] bg-brand-ink px-6 py-8 text-white shadow-[0_24px_60px_rgba(5,3,47,0.18)] md:px-8 md:py-10">
        <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,130,92,0.18),transparent_26%)]" />
        <div className="relative max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">About</p>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
            TB Service Plus handles the useful jobs that keep daily life moving.
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-8 text-white/76 md:text-[18px]">
            The project is built around a simple promise: respond quickly, stay clear, and deliver practical help when it is
            time to move, clean, deliver, clear out, or remove snow.
          </p>
        </div>
      </Reveal>

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

      <Reveal delay={120} className="rounded-[30px] border border-black/8 bg-brand-sand/45 p-6 shadow-[0_18px_40px_rgba(5,3,47,0.04)] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/42">Next step</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3vw,2.8rem)] font-semibold tracking-[-0.05em] text-brand-ink">
              You can move straight to a quote.
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-brand-ink/70">
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
    </div>
  );
}
