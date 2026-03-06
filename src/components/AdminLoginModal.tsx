"use client";

import { useEffect } from "react";
import AdminLoginCard from "@/components/AdminLoginCard";

type AdminLoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-ink/60 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div className="relative w-full max-w-[600px]" onClick={(event) => event.stopPropagation()} role="presentation">
        <button
          type="button"
          aria-label="Fermer la connexion"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-sand/80 text-brand-ink hover:bg-brand-sand"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <AdminLoginCard onSuccess={onClose} onCancel={onClose} showCancel />
      </div>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}