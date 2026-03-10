"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdminMessageNotifications } from "@/hooks/useAdminMessageNotifications";
import type { AdminNotification } from "@/types/admin-notification";

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  eyebrowClassName?: string;
};

const mainNavigation = [
  { href: "/page/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/page/admin/services", label: "Services", icon: LayersIcon },
  { href: "/page/admin/messages", label: "Messages", icon: InboxIcon },
  { href: "/page/admin/profile", label: "Profile", icon: ProfileIcon },
  { href: "/page/admin/settings", label: "Settings", icon: SettingsIcon },
] as const;

function formatNotificationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function compactNotificationPreview(notification: AdminNotification) {
  const compact = notification.message_preview.replace(/\s+/g, " ").trim();
  if (compact.length <= 120) return compact;
  return `${compact.slice(0, 117)}...`;
}

export default function AdminLayout({
  children,
  title,
  description,
  eyebrow = "Admin dashboard",
  actions,
  titleClassName,
  descriptionClassName,
  eyebrowClassName,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout, token } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const notificationsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const notificationsPopupRef = useRef<HTMLDivElement | null>(null);
  const [popupStyle, setPopupStyle] = useState<{ top: number; left: number; width: number } | null>(null);
  const {
    supported: notificationSupported,
    permission: notificationPermission,
    unreadCount,
    newCount,
    recentNotifications,
    markingIds,
    markingAll,
    deletingIds,
    clearingAll,
    pushSupported,
    pushConfigured,
    pushSubscribed,
    pushLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestPermission,
    enableWebPush,
    disableWebPush,
  } = useAdminMessageNotifications(token);

  const activeItem = mainNavigation.find((item) => pathname.startsWith(item.href)) ?? mainNavigation[0];
  const resolvedTitle = title ?? activeItem.label;
  const resolvedDescription = description ?? "Manage the website content and customer activity.";
  const notificationStatusLabel =
    pushConfigured && pushSupported
      ? pushSubscribed
        ? "Web push enabled for new messages"
        : notificationPermission === "denied"
          ? "Browser alerts blocked for web push"
          : "Enable web push for new messages"
      : notificationPermission === "granted"
        ? "Browser alerts enabled"
      : notificationPermission === "denied"
          ? "Browser alerts blocked"
          : notificationSupported
            ? "Enable browser alerts"
            : "Browser alerts unavailable";

  function handleLogout() {
    logout();
    router.push("/page/admin/login");
  }

  function handleMobileNavigate() {
    setMobileMenuOpen(false);
  }

  function openMessagesInbox() {
    setNotificationsOpen(false);
    router.push("/page/admin/messages");
  }

  function handleNotificationAction() {
    setNotificationsOpen((current) => !current);
  }

  useEffect(() => {
    if (!notificationsOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (notificationsRef.current?.contains(target)) return;
      if (notificationsPopupRef.current?.contains(target)) return;
      setNotificationsOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationsOpen]);

  useEffect(() => {
    if (!notificationsOpen) return;

    const syncPopupPosition = () => {
      const trigger = notificationsTriggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const width = Math.min(440, Math.max(320, window.innerWidth - 32));
      const left = Math.max(16, Math.min(rect.right - width, window.innerWidth - width - 16));

      setPopupStyle({
        top: rect.bottom + 12,
        left,
        width,
      });
    };

    syncPopupPosition();
    window.addEventListener("resize", syncPopupPosition);
    window.addEventListener("scroll", syncPopupPosition, true);

    return () => {
      window.removeEventListener("resize", syncPopupPosition);
      window.removeEventListener("scroll", syncPopupPosition, true);
    };
  }, [notificationsOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] p-2 text-brand-ink md:p-3">
      <div className="flex min-h-[calc(100vh-1rem)] w-full gap-2 rounded-[30px] bg-[#0a0a0b] md:min-h-[calc(100vh-1.5rem)] md:gap-3 md:rounded-[36px]">
        <aside className="hidden w-[220px] shrink-0 rounded-[28px] bg-[#09090b] px-4 py-5 text-white xl:sticky xl:top-3 xl:flex xl:self-start xl:flex-col">
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
          </div>
        </aside>

        <div className="page-admin-panel min-w-0 flex-1 rounded-[28px] bg-[#f6f6f7] p-3 md:rounded-[32px] md:p-4 xl:p-5">
          <div className="min-h-full rounded-[24px] bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,52,0.06)] md:rounded-[28px] md:px-5 md:py-5 xl:px-6 xl:py-6">
            <div className="page-admin-header flex flex-col gap-4 border-b border-black/6 pb-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 flex-1">
                <div className="-ml-1 flex items-start gap-3 md:-ml-0">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((current) => !current)}
                    className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/6 bg-brand-ink text-white shadow-[0_14px_34px_rgba(5,3,47,0.18)] transition hover:scale-[1.02] xl:hidden"
                  >
                    <MenuIcon className="h-4 w-4" />
                  </button>

                  <div className="min-w-0">
                    <p className={["text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35 md:text-[11px]", eyebrowClassName].filter(Boolean).join(" ")}>
                      {eyebrow}
                    </p>
                    <h1 className={["mt-1 text-[1.55rem] font-semibold tracking-[-0.04em] text-brand-ink md:mt-2 md:text-[2rem]", titleClassName].filter(Boolean).join(" ")}>
                      {resolvedTitle}
                    </h1>
                    <p className={["mt-1 max-w-3xl text-[12px] leading-5 text-muted md:text-[14px] md:leading-6", descriptionClassName].filter(Boolean).join(" ")}>
                      {resolvedDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div ref={notificationsRef} className="relative flex min-w-0 flex-col gap-3 xl:items-end">
                <div className="flex w-full flex-wrap items-center gap-2 xl:justify-end">
                  <div className="relative min-w-[240px] flex-1 xl:min-w-[340px] xl:flex-none">
                    <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                    <input
                      type="search"
                      placeholder="Search here..."
                      className="h-11 w-full rounded-full border border-black/6 bg-[#f7f7f8] pl-11 pr-4 text-[13px] text-brand-ink outline-none focus:border-brand-primary"
                    />
                  </div>

                  <button type="button" className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-[#fafafa] text-black/60 xl:flex">
                    <ChatIcon className="h-4 w-4" />
                  </button>
                  <button
                    ref={notificationsTriggerRef}
                    type="button"
                    onClick={handleNotificationAction}
                    className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-[#fafafa] text-black/60"
                    title={notificationStatusLabel}
                  >
                    <BellIcon className={`h-4 w-4 ${notificationPermission === "granted" ? "text-brand-primary" : ""}`} />
                    {unreadCount > 0 ? (
                      <span className="absolute -right-1.5 -top-1.5 min-w-[22px] rounded-full bg-brand-primary px-1.5 py-0.5 text-center text-[11px] font-semibold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                  </button>
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#eef1f6] text-[13px] font-semibold text-brand-ink">
                    {(admin?.email ?? "A").slice(0, 1).toUpperCase()}
                  </span>
                </div>

                {actions ? <div className="flex w-full flex-wrap gap-2 xl:justify-end">{actions}</div> : null}
              </div>
            </div>

            <div className="mt-5 page-enter">{children}</div>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-50 xl:hidden ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!mobileMenuOpen}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className={`absolute inset-0 bg-[#050507]/55 backdrop-blur-[3px] transition duration-300 ${
              mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`absolute inset-y-0 left-0 w-[min(86vw,360px)] overflow-hidden rounded-r-[28px] bg-[#0a0a0b] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            <div className="flex h-full flex-col rounded-[24px] bg-[#111114] px-4 py-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/page/admin/dashboard"
                  onClick={handleMobileNavigate}
                  className="flex items-center gap-3 rounded-[18px] bg-white/8 px-3 py-3 text-[#7c8dff]"
                >
                  <LogoIcon className="h-6 w-6" />
                  <div>
                    <p className="text-[14px] font-semibold text-white">TB Service Plus</p>
                    <p className="text-[12px] text-white/45">Admin panel</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/6 px-3 py-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-brand-ink">
                  {(admin?.email ?? "A").slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-white">{admin?.email ?? "Administrator"}</p>
                  <p className="truncate text-[12px] text-white/45">{admin?.role ?? "Admin access"}</p>
                </div>
              </div>

              <nav className="mt-6 flex flex-col gap-2">
                {mainNavigation.map((item) => {
                  const active = pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleMobileNavigate}
                      className={`inline-flex items-center gap-3 rounded-[16px] px-4 py-3 text-[14px] font-medium transition duration-300 ${
                        active ? "bg-white text-brand-ink shadow-[0_12px_30px_rgba(255,255,255,0.14)]" : "bg-white/5 text-white/78 hover:bg-white/10"
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${active ? "bg-[#eef1f6] text-brand-ink" : "bg-white/8 text-white/78"}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-white/8 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center gap-3 rounded-[16px] bg-white/5 px-4 py-3 text-left text-[14px] font-medium text-white/78 transition duration-300 hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/8 text-white/78">
                    <LogoutIcon className="h-5 w-5" />
                  </span>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notificationsOpen && popupStyle
        ? createPortal(
            <div
              ref={notificationsPopupRef}
              className="fixed z-[500] rounded-[24px] border border-black/8 bg-[#fcfcfd] p-3 shadow-[0_24px_60px_rgba(15,23,52,0.18)]"
              style={{ top: popupStyle.top, left: popupStyle.left, width: popupStyle.width }}
            >
              <div className="flex flex-col gap-3 border-b border-black/6 px-1 pb-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/35">Notifications</p>
                  <p className="mt-1 text-[16px] font-semibold text-brand-ink">Recent contact messages</p>
                  <p className="mt-1 text-[13px] text-muted">Name and latest message preview from the inbox.</p>
                  <p className="mt-2 text-[12px] font-medium text-brand-primary">{notificationStatusLabel}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#eef3ff] px-3 py-2 text-[12px] font-semibold text-brand-primary">
                    New {newCount}
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full bg-[#f3f4f6] px-3 py-2 text-[12px] font-semibold text-brand-ink">
                    Unread {unreadCount}
                  </span>

                  {unreadCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => markAllAsRead()}
                      disabled={markingAll}
                      className="inline-flex items-center justify-center rounded-full border border-brand-primary/16 bg-brand-primary/8 px-3 py-2 text-[12px] font-semibold text-brand-primary disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {markingAll ? "Updating..." : "Mark all as read"}
                    </button>
                  ) : null}

                  {recentNotifications.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => clearAll()}
                      disabled={clearingAll}
                      className="inline-flex items-center justify-center rounded-full border border-brand-primary/16 bg-brand-primary/8 px-3 py-2 text-[12px] font-semibold text-brand-primary"
                    >
                      {clearingAll ? "Clearing..." : "Clear all"}
                    </button>
                  ) : null}

                  {pushConfigured && pushSupported ? (
                    <button
                      type="button"
                      onClick={() => (pushSubscribed ? disableWebPush() : enableWebPush())}
                      disabled={pushLoading}
                      className="inline-flex items-center justify-center rounded-full border border-brand-primary/16 bg-brand-primary/8 px-3 py-2 text-[12px] font-semibold text-brand-primary disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {pushLoading ? "Updating..." : pushSubscribed ? "Disable web push" : "Enable web push"}
                    </button>
                  ) : notificationPermission === "default" && notificationSupported ? (
                    <button
                      type="button"
                      onClick={() => requestPermission()}
                      className="inline-flex items-center justify-center rounded-full border border-brand-primary/16 bg-brand-primary/8 px-3 py-2 text-[12px] font-semibold text-brand-primary"
                    >
                      Enable browser alerts
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={openMessagesInbox}
                    className="inline-flex items-center justify-center rounded-full bg-brand-ink px-3 py-2 text-[12px] font-semibold text-white"
                  >
                    Open inbox
                  </button>
                </div>
              </div>

              <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification) => (
                    <article
                      key={notification.id}
                      className="rounded-[18px] border border-black/8 bg-white px-4 py-4 transition hover:border-brand-primary/18 hover:bg-[#f8faff]"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                            notification.is_read ? "bg-black/12" : "bg-brand-primary"
                          }`}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="truncate text-[14px] font-semibold text-brand-ink">{notification.message_name}</p>
                            <span className="shrink-0 text-[11px] text-black/38">{formatNotificationDate(notification.created_at)}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-muted">{compactNotificationPreview(notification)}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {!notification.is_read ? (
                              <button
                                type="button"
                                onClick={() => markAsRead(notification.id)}
                                disabled={markingIds.includes(notification.id)}
                                className="inline-flex items-center justify-center rounded-full border border-brand-primary/16 bg-brand-primary/8 px-3 py-2 text-[12px] font-semibold text-brand-primary disabled:cursor-not-allowed disabled:opacity-55"
                              >
                                {markingIds.includes(notification.id) ? "Updating..." : "Mark as read"}
                              </button>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-[#f3f4f6] px-3 py-2 text-[12px] font-semibold text-black/48">
                                Read
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => removeNotification(notification.id)}
                              disabled={deletingIds.includes(notification.id)}
                              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-3 py-2 text-[12px] font-semibold text-brand-ink disabled:cursor-not-allowed disabled:opacity-55"
                            >
                              {deletingIds.includes(notification.id) ? "Deleting..." : "Delete"}
                            </button>

                            <button
                              type="button"
                              onClick={openMessagesInbox}
                              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-3 py-2 text-[12px] font-semibold text-brand-ink"
                            >
                              Open message
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-black/10 bg-white px-4 py-6 text-center text-[13px] text-muted">
                    No message notifications yet.
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 8h14M5 12h14M5 16h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19 12a7 7 0 00-.1-1.1l2-1.5-2-3.4-2.4 1a7.8 7.8 0 00-1.9-1.1l-.3-2.6h-4l-.3 2.6a7.8 7.8 0 00-1.9 1.1l-2.4-1-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .7.1 1.1l-2 1.5 2 3.4 2.4-1c.6.5 1.2.8 1.9 1.1l.3 2.6h4l.3-2.6c.7-.3 1.3-.6 1.9-1.1l2.4 1 2-3.4-2-1.5c.1-.4.1-.7.1-1.1z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
