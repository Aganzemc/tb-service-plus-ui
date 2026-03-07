"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealVariant = "up" | "left" | "right" | "zoom";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  threshold?: number;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  threshold = 0.2,
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof window === "undefined" || visible) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, visible]);

  const revealStyle = {
    ...style,
    "--reveal-delay": `${delay}ms`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      data-variant={variant}
      className={["reveal", visible ? "is-visible" : "", className].filter(Boolean).join(" ")}
      style={revealStyle}
      {...props}
    >
      {children}
    </div>
  );
}
