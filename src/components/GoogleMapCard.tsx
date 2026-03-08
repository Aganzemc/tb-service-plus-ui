type GoogleMapCardProps = {
  title?: string;
  description?: string;
};

export default function GoogleMapCard({
  title = "Business location",
  description = "Use the map below to view the business location and nearby access.",
}: GoogleMapCardProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS;

  const mapQuery = businessAddress?.trim() || "TB Service Plus";
  const mapSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(mapQuery)}`
    : null;

  return (
    <div className="surface-lift overflow-hidden rounded-[30px] border border-black/8 bg-white shadow-[0_18px_40px_rgba(5,3,47,0.06)]">
      <div className="border-b border-black/8 px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/45">Location</p>
        <p className="mt-3 text-[1.7rem] font-semibold tracking-[-0.05em] text-brand-ink">{title}</p>
        <p className="mt-3 text-[15px] leading-7 text-brand-ink/68">{description}</p>
      </div>

      <div className="px-6 py-6">
        {mapSrc ? (
          <div className="overflow-hidden rounded-[24px] border border-black/8 bg-[#f8f9fb] shadow-[0_10px_24px_rgba(15,23,52,0.06)]">
            <iframe
              title="TB Service Plus location map"
              src={mapSrc}
              className="h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-black/12 bg-[#f8f9fb] px-5 py-10 text-center">
            <p className="text-[1.05rem] font-semibold text-brand-ink">Google Maps is not configured yet</p>
            <p className="mt-3 text-[14px] leading-7 text-brand-ink/68">
              Add `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` and `NEXT_PUBLIC_BUSINESS_ADDRESS` to display the live map here.
            </p>
          </div>
        )}

        <div className="mt-4 rounded-[20px] border border-black/8 bg-[#f8f9fb] px-4 py-4 text-[14px] leading-7 text-brand-ink/72">
          <p>
            <span className="font-semibold text-brand-ink">Address query:</span> {businessAddress?.trim() || "TB Service Plus"}
          </p>
          <p className="mt-2">Tip: use the full business address in the environment variable for the most accurate map result.</p>
        </div>
      </div>
    </div>
  );
}
