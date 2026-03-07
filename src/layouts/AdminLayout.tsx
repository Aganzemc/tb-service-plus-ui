"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
};

const navigationItems = [
  {
    href: "/page/admin/dashboard",
    label: "Dashboard",
    description: "Vue d'ensemble",
    icon: DashboardIcon,
  },
  {
    href: "/page/admin/services",
    label: "Services",
    description: "Catalogue public",
    icon: LayersIcon,
  },
  {
    href: "/page/admin/messages",
    label: "Messages",
    description: "Demandes clients",
    icon: InboxIcon,
  },
] as const;

export default function AdminLayout({
  children,
  title,
  description,
  eyebrow = "TB Service Plus Admin",
  actions,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuth();

  const activeItem = navigationItems.find((item) => pathname.startsWith(item.href)) ?? navigationItems[0];

  function handleLogout() {
    logout();
    router.push("/page/admin/login");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f6ff] text-brand-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,130,92,0.14),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0))]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-5 md:px-6 lg:px-8">
        <aside className="hidden w-[290px] shrink-0 lg:block">
          <div className="sticky top-5 space-y-5 rounded-[30px] border border-white/65 bg-white/80 p-5 shadow-[0_26px_80px_rgba(41,47,96,0.12)] backdrop-blur-xl">
            <div className="rounded-[24px] bg-[linear-gradient(135deg,#0f1734_0%,#5f67f4_100%)] p-5 text-white shadow-[0_24px_60px_rgba(47,56,140,0.35)]">
              <div className="inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/86">
                Espace interne
              </div>
              <h2 className="mt-4 text-[1.55rem] font-semibold tracking-[-0.05em]">TB Service Plus</h2>
              <p className="mt-2 text-[14px] leading-6 text-white/78">
                Un tableau de bord plus propre pour gérer les services et suivre les demandes.
              </p>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-[22px] px-4 py-3 transition ${
                      active
                        ? "bg-brand-ink text-white shadow-[0_18px_40px_rgba(15,23,52,0.22)]"
                        : "border border-black/6 bg-[#f8f9ff] text-brand-ink hover:border-brand-primary/20 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-[16px] ${
                        active ? "bg-white/12 text-white" : "bg-white text-brand-primary shadow-[0_10px_24px_rgba(95,103,244,0.14)]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold">{item.label}</span>
                      <span className={`block text-[12px] ${active ? "text-white/68" : "text-muted"}`}>{item.description}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-[24px] border border-black/6 bg-[#f8f9ff] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Session</p>
              <p className="mt-3 text-[15px] font-semibold text-brand-ink">{admin?.email ?? "Administrator"}</p>
              <p className="mt-1 text-[13px] text-muted">{admin?.role ?? "Admin access"}</p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[16px] border border-black/8 bg-white text-[14px] font-semibold text-brand-ink hover:border-red-200 hover:text-red-600"
              >
                <LogoutIcon className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="rounded-[28px] border border-white/65 bg-white/76 p-4 shadow-[0_18px_50px_rgba(41,47,96,0.09)] backdrop-blur-xl md:p-5 lg:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Navigation</p>
                <p className="mt-2 text-[1.2rem] font-semibold tracking-[-0.04em] text-brand-ink">{activeItem.label}</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] border border-black/8 bg-white px-4 text-[14px] font-semibold text-brand-ink"
              >
                <LogoutIcon className="h-4 w-4" />
                Déconnexion
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                      active ? "bg-brand-ink text-white" : "border border-black/8 bg-[#f8f9ff] text-brand-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {(title || description || actions) && (
            <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(246,248,255,0.88))] p-6 shadow-[0_24px_70px_rgba(41,47,96,0.12)] backdrop-blur-xl md:p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-muted">{eyebrow}</p>
                  {title ? (
                    <h1 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-brand-ink">
                      {title}
                    </h1>
                  ) : null}
                  {description ? <p className="mt-4 max-w-2xl text-[15px] leading-8 text-muted md:text-[17px]">{description}</p> : null}
                </div>

                {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
              </div>
            </section>
          )}

          <div className="page-enter">{children}</div>
        </div>
      </div>
    </div>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4.5 13.5h6v6h-6v-6zM13.5 4.5h6v15h-6v-15zM4.5 4.5h6v6h-6v-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 13l2.8-5.4A2 2 0 018.6 6h6.8a2 2 0 011.8 1.1L20 13v5H4v-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 13a3 3 0 006 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
