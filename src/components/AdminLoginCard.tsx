"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type AdminLoginCardProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  title?: string;
  subtitle?: string;
};

export default function AdminLoginCard({
  onSuccess,
  onCancel,
  showCancel = false,
  title = "Sign In",
  subtitle = "Veuillez vous connecter pour continuer.",
}: AdminLoginCardProps) {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onSuccess?.();
      router.push("/page/admin/dashboard");
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-[28px] bg-white p-8 shadow-[0_26px_70px_rgba(5,3,47,0.18)] md:p-10">
      <div className="text-center">
        <h2 className="text-[clamp(2rem,4vw,2.7rem)] font-semibold tracking-[-0.05em] text-[#0f4b78]">{title}</h2>
        <p className="mt-3 text-[16px] text-muted md:text-[17px]">{subtitle}</p>
      </div>

      {error ? (
        <p className="mt-6 rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-[14px] text-red-600">{error}</p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="admin-email" className="block text-[14px] font-medium text-brand-ink/78">
            Email
          </label>
          <input
            id="admin-email"
            className="mt-2 h-14 w-full rounded-[16px] border border-black/12 px-4 text-[15px] text-brand-ink outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/12"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="block text-[14px] font-medium text-brand-ink/78">
            Mot de passe
          </label>
          <div className="relative mt-2">
            <input
              id="admin-password"
              className="h-14 w-full rounded-[16px] border border-black/12 px-4 pr-14 text-[15px] text-brand-ink outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/12"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 my-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-brand-sand hover:text-brand-primary"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              onClick={() => setShowPassword((current) => !current)}
            >
              <EyeIcon className="h-5 w-5" open={showPassword} />
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          className="inline-flex h-14 w-full items-center justify-center rounded-[16px] bg-brand-primary px-5 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(95,103,244,0.25)] hover:bg-brand-primary-deep disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {showCancel && onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 text-[15px] font-semibold text-brand-primary"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </button>
      ) : null}
    </div>
  );
}

function EyeIcon({ className, open }: { className?: string; open: boolean }) {
  if (open) {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.7 6.2A10.8 10.8 0 0112 6c6 0 9.5 6 9.5 6a15.9 15.9 0 01-3.4 4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.1 8.1C3.8 9.7 2.5 12 2.5 12S6 18 12 18c1.4 0 2.7-.3 3.8-.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M15.5 10h-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}