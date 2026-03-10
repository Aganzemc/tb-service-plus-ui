import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getPublicSiteSettings } from "@/services/settings.server";
import { getPublicServiceBySlug } from "@/services/services.api";

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getPublicSiteSettings();
  const service = await getPublicServiceBySlug(slug);
  const imageUrl = service.image_url?.trim();
  const summary = service.short_description?.trim() || service.description?.trim() || "Local support tailored to your needs.";
  const serviceLabel = service.sort_order != null ? `Service ${String(service.sort_order).padStart(2, "0")}` : "Local service";
  const quickContactItems = [
    settings.contact_phone ? `Call ${settings.contact_phone} for direct coordination.` : null,
    settings.contact_email ? `Email ${settings.contact_email} with your request.` : null,
    "Use the contact page to send the job details.",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8 md:space-y-10">
      <Reveal className="relative overflow-hidden rounded-[36px] border border-black/8 bg-brand-ink text-white shadow-[0_24px_60px_rgba(5,3,47,0.18)]">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `linear-gradient(120deg, rgba(5, 3, 47, 0.92) 0%, rgba(5, 3, 47, 0.56) 54%, rgba(5, 3, 47, 0.82) 100%), url(${imageUrl})`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#05032f_0%,#24206a_48%,#5f67f4_100%)]" />
        )}

        <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,130,92,0.16),transparent_24%)]" />

        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:p-10 xl:p-12">
          <div>
            <span className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82">
              {serviceLabel}
            </span>
            <h1 className="public-title mt-5 max-w-[11ch]">
              {service.title}
            </h1>
            <p className="public-copy mt-5 max-w-2xl text-white/80">{summary}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/page/contact"
                className="surface-lift inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-[15px] font-semibold text-brand-primary"
              >
                Request a quote
              </Link>
              <Link
                href="/page/services"
                className="surface-lift inline-flex items-center justify-center rounded-2xl border border-white/18 bg-white/10 px-6 py-3.5 text-[15px] font-semibold text-white"
              >
                Back to services
              </Link>
            </div>
          </div>

          <Reveal delay={120} variant="left" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <HeroInfoCard
              label="Availability"
              title="Fast response through direct contact"
              text="We help you move from request to quote without a complicated process."
            />
            <HeroInfoCard
              label="Best for"
              title="Practical local support"
              text="Great for jobs that need clear timing, access details, and a reliable next step."
            />
          </Reveal>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal delay={90} className="rounded-[32px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)] md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/42">Description</p>
          <h2 className="public-subtitle mt-4 text-brand-ink">This service in detail</h2>
          <p className="public-copy mt-5 text-brand-ink/72">{service.description?.trim() || summary}</p>
        </Reveal>

        <Reveal delay={180} variant="left" className="space-y-4">
          <InfoPanel
            label="How it works"
            title="A simple booking flow"
            items={[
              "Share the useful details through the contact page.",
              "Specify the location, volume, or type of request.",
              "We follow up to confirm the next step.",
            ]}
            tone="sand"
          />
          <InfoPanel
            label="Quick contact"
            title="Ready when you are"
            items={quickContactItems}
            tone="white"
          />
        </Reveal>
      </div>
    </div>
  );
}

function HeroInfoCard({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="surface-lift rounded-[26px] border border-white/12 bg-white/10 p-5 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">{label}</p>
      <p className="mt-3 text-[1.35rem] font-semibold tracking-[-0.04em] text-white">{title}</p>
      <p className="mt-3 text-[15px] leading-7 text-white/78">{text}</p>
    </div>
  );
}

function InfoPanel({
  label,
  title,
  items,
  tone,
}: {
  label: string;
  title: string;
  items: string[];
  tone: "sand" | "white";
}) {
  const className =
    tone === "sand"
      ? "surface-lift rounded-[30px] border border-black/8 bg-brand-sand/40 p-6 shadow-[0_18px_40px_rgba(5,3,47,0.04)]"
      : "surface-lift rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)]";

  return (
    <div className={className}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/42">{label}</p>
      <p className="mt-3 text-[1.55rem] font-semibold tracking-[-0.05em] text-brand-ink">{title}</p>
      <ul className="mt-4 space-y-3 text-[15px] leading-7 text-brand-ink/74">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-brand-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
