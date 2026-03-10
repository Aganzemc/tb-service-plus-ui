"use client";

import { useState } from "react";
import Image from "next/image";

type BrandMarkProps = {
  logoUrl?: string;
  label?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

export default function BrandMark({
  logoUrl,
  label = "TB",
  className = "flex h-11 w-11 items-center justify-center overflow-hidden rounded-full",
  imageClassName = "h-full w-full object-cover",
  fallbackClassName = "border border-brand-primary/15 bg-brand-primary/10 text-[15px] font-semibold text-brand-primary shadow-[0_10px_24px_rgba(95,103,244,0.08)]",
}: BrandMarkProps) {
  const normalized = logoUrl?.trim() ?? "";
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);

  if (normalized && failedLogoUrl !== normalized) {
    return (
      <span className={["relative", className].join(" ")}>
        <Image
          src={normalized}
          alt="TB Service Plus logo"
          fill
          unoptimized
          sizes="64px"
          className={imageClassName}
          onError={() => setFailedLogoUrl(normalized)}
        />
      </span>
    );
  }

  return <span className={[className, fallbackClassName].join(" ")}>{label}</span>;
}
