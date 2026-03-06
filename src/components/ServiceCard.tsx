import Link from "next/link";
import type { Service } from "@/types/service";

type ServiceCardProps = {
  service: Service;
  showDescription?: boolean;
};

export default function ServiceCard({ service, showDescription = false }: ServiceCardProps) {
  const imageUrl = service.image_url?.trim();
  const summary = service.short_description?.trim() || service.description?.trim() || "Support local adapte a votre besoin.";
  const serviceLabel = service.sort_order != null ? `Service ${String(service.sort_order).padStart(2, "0")}` : "Service local";

  return (
    <Link
      href={`/page/services/${service.slug}`}
      className={`group relative flex overflow-hidden rounded-[28px] border border-black/8 bg-[#d7cab8] shadow-[0_24px_55px_rgba(48,31,20,0.14)] ${
        showDescription ? "min-h-[400px]" : "min-h-[360px]"
      }`}
    >
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.04]"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.52),transparent_30%),linear-gradient(160deg,#d8c2aa_0%,#b99068_100%)]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,16,12,0.04)_0%,rgba(22,16,12,0.18)_34%,rgba(14,10,8,0.82)_100%)]" />

      <div className="relative flex h-full w-full flex-col justify-between p-4 sm:p-5">
        <div className="flex justify-end">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/28 bg-white/10 text-white backdrop-blur transition duration-300 group-hover:-translate-y-1 group-hover:bg-white/18">
            <ArrowUpRightIcon className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-auto">
          <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
            {serviceLabel}
          </span>
          <h3 className="mt-4 max-w-[12ch] text-[clamp(1.5rem,2.4vw,2.15rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-white">
            {service.title}
          </h3>
          {showDescription ? <p className="mt-3 max-w-[24ch] text-[14px] leading-6 text-white/82">{summary}</p> : null}
        </div>
      </div>
    </Link>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M6 14L14 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 6h7v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}