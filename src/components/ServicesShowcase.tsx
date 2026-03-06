"use client";

import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { useServices } from "@/hooks/useServices";

type ServicesShowcaseProps = {
  sectionId?: string;
  badge: string;
  heading: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  maxItems?: number;
  showDescription?: boolean;
};

export default function ServicesShowcase({
  sectionId,
  badge,
  heading,
  description,
  ctaHref,
  ctaLabel,
  maxItems,
  showDescription = false,
}: ServicesShowcaseProps) {
  const { services, loading, error } = useServices();
  const visibleServices = maxItems ? services.slice(0, maxItems) : services;

  return (
    <section id={sectionId} className="bg-[#e8ddd1]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-8 md:py-24">
        <div className="relative overflow-hidden rounded-[42px] border border-black/8 bg-[#f5ede3] px-6 py-8 shadow-[0_32px_80px_rgba(49,32,21,0.12)] md:px-10 md:py-12 lg:px-12 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(187,155,122,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.68),transparent_30%)]" />
          <div className="absolute left-1/2 top-[-18%] h-[380px] w-[140px] -translate-x-1/2 rotate-[35deg] rounded-full bg-black/12 blur-[75px]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(245,237,227,0)_0%,rgba(236,224,210,0.62)_100%)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-start lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white/82 px-4 py-2 text-[12px] font-semibold text-[#4c3a2d] shadow-[0_10px_24px_rgba(72,49,31,0.08)] backdrop-blur">
                <WrenchIcon className="h-4 w-4" />
                {badge}
              </span>
              <h2 className="mt-6 max-w-[10ch] text-[clamp(2.6rem,5.6vw,5.1rem)] font-serif italic leading-[0.94] tracking-[-0.05em] text-[#241710]">
                {heading}
              </h2>
            </div>

            <div className="max-w-[520px] lg:ml-auto lg:pt-16">
              <p className="text-[17px] leading-8 text-[#56453a] md:text-[19px] md:leading-9">{description}</p>
              <Link
                href={ctaHref}
                className="mt-8 inline-flex items-center gap-4 rounded-full border border-[#b39576] bg-[#d9c0a2] px-6 py-3 text-[15px] font-semibold text-[#2c1d15] shadow-[0_16px_36px_rgba(80,55,34,0.12)] transition hover:-translate-y-0.5"
              >
                {ctaLabel}
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2c1d15] text-white">
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>

          <div className="relative mt-12">
            {loading ? <ServicesSkeleton count={maxItems ?? 5} /> : null}
            {!loading && error ? (
              <div className="rounded-[28px] border border-black/10 bg-white/88 px-6 py-8 text-[15px] text-[#6b5646] shadow-[0_18px_40px_rgba(49,32,21,0.08)]">
                Impossible de charger les services pour le moment.
              </div>
            ) : null}
            {!loading && !error && visibleServices.length === 0 ? (
              <div className="rounded-[28px] border border-black/10 bg-white/88 px-6 py-8 text-[15px] text-[#6b5646] shadow-[0_18px_40px_rgba(49,32,21,0.08)]">
                Aucun service actif n&apos;est encore disponible dans l&apos;API.
              </div>
            ) : null}
            {!loading && !error && visibleServices.length > 0 ? (
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                {visibleServices.map((service) => (
                  <ServiceCard key={service.id} service={service} showDescription={showDescription} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSkeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="min-h-[360px] animate-pulse rounded-[28px] border border-black/8 bg-[linear-gradient(160deg,#ddceb9_0%,#c8b59f_100%)] shadow-[0_24px_55px_rgba(48,31,20,0.08)]"
        />
      ))}
    </div>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M11.8 4.2a3.2 3.2 0 01-4.3 4.3l-3.7 3.7a1.3 1.3 0 001.8 1.8l3.7-3.7a3.2 3.2 0 004.3-4.3l-1.7 1.7-2.1-.4-.4-2.1 2.4-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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