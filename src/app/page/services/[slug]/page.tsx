import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getPublicServiceBySlug } from "@/services/services.api";

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);
  const imageUrl = service.image_url?.trim();
  const summary = service.short_description?.trim() || service.description?.trim() || "Local support tailored to your needs.";
  const serviceLabel = service.sort_order != null ? `Service ${String(service.sort_order).padStart(2, "0")}` : "Local service";

  return (
    <div className="space-y-8">
      <Reveal className="relative overflow-hidden rounded-[34px] border border-black/8 bg-brand-ink text-white shadow-[0_24px_60px_rgba(5,3,47,0.18)]">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `linear-gradient(120deg, rgba(5, 3, 47, 0.92) 0%, rgba(5, 3, 47, 0.58) 54%, rgba(5, 3, 47, 0.78) 100%), url(${imageUrl})`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#05032f_0%,#24206a_48%,#5f67f4_100%)]" />
        )}
        <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,130,92,0.18),transparent_24%)]" />

        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <span className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82">
              {serviceLabel}
            </span>
            <h1 className="mt-5 max-w-[12ch] text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-8 text-white/80 md:text-[18px]">{summary}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/page/contact"
                className="surface-lift inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-[15px] font-semibold text-brand-primary"
              >
                Get a quote
              </Link>
              <Link
                href="/page/services"
                className="surface-lift inline-flex items-center justify-center rounded-2xl border border-white/18 bg-white/10 px-5 py-3 text-[15px] font-semibold text-white"
              >
                Back to services
              </Link>
            </div>
          </div>

          <Reveal delay={120} variant="left" className="space-y-4">
            <div className="surface-lift rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">Availability</p>
              <p className="mt-3 text-[1.45rem] font-semibold tracking-[-0.04em] text-white">Fast response through direct contact</p>
            </div>
            <div className="surface-lift rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">Best for</p>
              <p className="mt-3 text-[15px] leading-7 text-white/78">
                Jobs that need a clear exchange, a quick quote, and local support without a complicated process.
              </p>
            </div>
          </Reveal>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <Reveal delay={90} className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)] md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/42">Description</p>
          <h2 className="mt-4 text-[1.9rem] font-semibold tracking-[-0.05em] text-brand-ink">This service in detail</h2>
          <p className="mt-4 text-[16px] leading-8 text-brand-ink/72">{service.description?.trim() || summary}</p>
        </Reveal>

        <Reveal delay={180} variant="left" className="space-y-4">
          <div className="surface-lift rounded-[30px] border border-black/8 bg-brand-sand/40 p-6 shadow-[0_18px_40px_rgba(5,3,47,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/42">How it works</p>
            <ul className="mt-4 space-y-3 text-[15px] leading-7 text-brand-ink/74">
              <li>Share the useful details through the contact page.</li>
              <li>Specify the location, volume, or type of request.</li>
              <li>We follow up to confirm the next step.</li>
            </ul>
          </div>

          <div className="surface-lift rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/42">Contact</p>
            <a href="tel:4039264063" className="mt-4 block text-[1.4rem] font-semibold tracking-[-0.04em] text-brand-ink">
              403-926-4063
            </a>
            <a href="mailto:TBserviceplus1@gmail.com" className="mt-2 block text-[15px] text-brand-primary">
              TBserviceplus1@gmail.com
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
