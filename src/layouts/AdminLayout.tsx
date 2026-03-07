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

const mainNavigation = [
  { href: "/page/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/page/admin/services", label: "Services", icon: LayersIcon },
  { href: "/page/admin/messages", label: "Messages", icon: InboxIcon },
] as const;

export default function AdminLayout({
  children,
  title,
  description,
  eyebrow = "Admin dashboard",
  actions,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAuth();

  const activeItem = mainNavigation.find((item) => pathname.startsWith(item.href)) ?? mainNavigation[0];
  const resolvedTitle = title ?? activeItem.label;
  const resolvedDescription = description ?? "Manage the website content and customer activity.";

  function handleLogout() {
    logout();
    router.push("/page/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] p-2 text-brand-ink md:p-3">
      <div className="flex min-h-[calc(100vh-1rem)] w-full gap-2 rounded-[30px] bg-[#0a0a0b] md:min-h-[calc(100vh-1.5rem)] md:gap-3 md:rounded-[36px]">
        <aside className="hidden w-[220px] shrink-0 rounded-[28px] bg-[#09090b] px-4 py-5 text-white xl:flex xl:flex-col xl:justify-between">
          <div className="flex w-full flex-col gap-6">
            <Link href="/page/admin/dashboard" className="flex items-center gap-3 rounded-[18px] bg-white/8 px-3 py-3 text-[#7c8dff]">
              <LogoIcon className="h-6 w-6" />
              <div>
                <p className="text-[14px] font-semibold text-white">TB Service Plus</p>
                <p className="text-[12px] text-white/45">Admin panel</p>
              </div>
            </Link>

            <nav className="flex w-full flex-col gap-2">
              {mainNavigation.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-[16px] px-3 py-3 text-[14px] font-medium transition ${
                      active
                        ? "bg-white text-brand-ink shadow-[0_10px_24px_rgba(255,255,255,0.14)]"
                        : "text-white/72 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${active ? "bg-[#eef1f6] text-brand-ink" : "bg-white/5 text-white/72"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex w-full flex-col gap-2 border-t border-white/8 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-[16px] px-3 py-3 text-left text-[14px] font-medium text-white/72 transition hover:bg-white/8 hover:text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/5 text-white/72">
                <LogoutIcon className="h-5 w-5" />
              </span>
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 rounded-[28px] bg-[#f6f6f7] p-3 md:rounded-[32px] md:p-4 xl:p-5">
          <div className="min-h-full rounded-[24px] bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,52,0.06)] md:rounded-[28px] md:px-5 md:py-5 xl:px-6 xl:py-6">
            <div className="flex flex-col gap-4 border-b border-black/6 pb-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/35">{eyebrow}</p>
                <h1 className="mt-2 text-[1.85rem] font-semibold tracking-[-0.04em] text-brand-ink md:text-[2rem]">{resolvedTitle}</h1>
                <p className="mt-1 max-w-3xl text-[13px] leading-6 text-muted md:text-[14px]">{resolvedDescription}</p>
              </div>

              <div className="flex min-w-0 flex-col gap-3 xl:items-end">
                <div className="flex w-full flex-wrap items-center gap-2 xl:justify-end">
                  <div className="relative min-w-[240px] flex-1 xl:min-w-[340px] xl:flex-none">
                    <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                    <input
                      type="search"
                      placeholder="Search here..."
                      className="h-11 w-full rounded-full border border-black/6 bg-[#f7f7f8] pl-11 pr-4 text-[13px] text-brand-ink outline-none focus:border-brand-primary"
                    />
                  </div>

                  <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-[#fafafa] text-black/60">
                    <ChatIcon className="h-4 w-4" />
                  </button>
                  <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-[#fafafa] text-black/60">
                    <BellIcon className="h-4 w-4" />
                  </button>
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#eef1f6] text-[13px] font-semibold text-brand-ink">
                    {(admin?.email ?? "A").slice(0, 1).toUpperCase()}
                  </span>
                </div>

                {actions ? <div className="flex w-full flex-wrap gap-2 xl:justify-end">{actions}</div> : null}
              </div>
            </div>

            <div className="mt-4 xl:hidden">
              <div className="flex flex-wrap gap-2 border-b border-black/6 pb-4">
                {mainNavigation.map((item) => {
                  const active = pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                        active ? "bg-brand-ink text-white" : "bg-[#f4f4f5] text-brand-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 page-enter">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 4.5l7 4v7l-7 4-4-2.3v-7l4-2.7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 4.5v7l7 4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M11 18a7 7 0 100-14 7 7 0 000 14z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 17l-3 2v-4.5A7 7 0 0111 7h2a7 7 0 017 7v3H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12h6M9 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 10a5 5 0 1110 0v3.4l1.3 2.1a1 1 0 01-.9 1.5H6.6a1 1 0 01-.9-1.5L7 13.4V10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
