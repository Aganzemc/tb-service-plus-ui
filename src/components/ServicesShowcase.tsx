"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
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
    <section id={sectionId} className="bg-[#e6ddd1]">
      <div className="mx-auto max-w-[1380px] px-5 py-14 md:px-8 md:py-20 xl:px-10">
        <div className="relative overflow-hidden rounded-[44px] border border-black/6 bg-[#f7f1e9] px-6 py-8 shadow-[0_32px_80px_rgba(49,32,21,0.12)] md:px-10 md:py-12 lg:px-12 lg:py-14 xl:px-14 xl:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(187,155,122,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_30%)]" />
          <div className="absolute left-[32%] top-[-14%] h-[360px] w-[120px] -translate-x-1/2 rotate-[35deg] rounded-full bg-black/10 blur-[70px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white/82 px-4 py-2 text-[12px] font-semibold text-[#4c3a2d] shadow-[0_10px_24px_rgba(72,49,31,0.08)] backdrop-blur">
                <WrenchIcon className="h-4 w-4" />
                {badge}
              </span>
              <h2 className="public-title text-balance mt-6 max-w-[14ch] leading-[0.96] text-[#241710]">
                {heading}
              </h2>
            </Reveal>

            <Reveal delay={120} variant="left" className="max-w-[32rem] lg:ml-auto lg:pt-18 xl:pt-20">
              <p className="public-copy max-w-[31rem] text-[#5d4c40]">{description}</p>
              <Link
                href={ctaHref}
                className="surface-lift mt-8 inline-flex items-center gap-4 rounded-full border border-[#b39576] bg-[#d6bf9e] px-6 py-3 text-[16px] font-semibold text-[#2c1d15] shadow-[0_16px_36px_rgba(80,55,34,0.12)]"
              >
                {ctaLabel}
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2c1d15] text-white">
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
              </Link>
            </Reveal>
          </div>

          <div className="relative mt-12 xl:mt-14">
            {loading ? <ServicesSkeleton count={maxItems ?? 5} /> : null}
            {!loading && error ? (
              <Reveal className="rounded-[28px] border border-black/10 bg-white/88 px-6 py-8 text-[15px] text-[#6b5646] shadow-[0_18px_40px_rgba(49,32,21,0.08)]">
                Unable to load services right now.
              </Reveal>
            ) : null}
            {!loading && !error && visibleServices.length === 0 ? (
              <Reveal className="rounded-[28px] border border-black/10 bg-white/88 px-6 py-8 text-[15px] text-[#6b5646] shadow-[0_18px_40px_rgba(49,32,21,0.08)]">
                No active services are currently available from the API.
              </Reveal>
            ) : null}
            {!loading && !error && visibleServices.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {visibleServices.map((service, index) => (
                  <Reveal key={service.id} delay={120 + index * 80}>
                    <ServiceCard service={service} showDescription={showDescription} />
                  </Reveal>
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="min-h-[320px] animate-pulse rounded-[30px] border border-black/8 bg-[linear-gradient(160deg,#ddceb9_0%,#c8b59f_100%)] shadow-[0_24px_55px_rgba(48,31,20,0.08)]"
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
