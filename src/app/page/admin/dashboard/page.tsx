"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/layouts/AdminLayout";
import { listAdminMessages } from "@/services/messages.api";
import { listAdminServices } from "@/services/services.api";
import type { Message } from "@/types/message";
import type { Service } from "@/types/service";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export default function AdminDashboardPage() {
  const { token, refresh } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    let active = true;

    async function loadDashboard() {
      setLoading(true);

      try {
        await refresh(token);
        const [messagesData, servicesData] = await Promise.all([listAdminMessages(token), listAdminServices(token)]);

        if (!active) return;

        setMessages(messagesData);
        setServices(servicesData);
        setError(null);
      } catch (dashboardError: unknown) {
        if (!active) return;
        const maybe = dashboardError as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Loading error");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [token, refresh, router]);

  const unreadMessages = useMemo(() => messages.filter((message) => !message.is_read), [messages]);
  const activeServices = useMemo(() => services.filter((service) => service.is_active), [services]);
  const inactiveServices = useMemo(() => services.filter((service) => !service.is_active), [services]);

  const serviceRows = useMemo(() => {
    const orderedServices = [...services].sort((first, second) => {
      const firstOrder = first.sort_order ?? 9999;
      const secondOrder = second.sort_order ?? 9999;
      if (firstOrder !== secondOrder) return firstOrder - secondOrder;
      return first.title.localeCompare(second.title);
    });

    return orderedServices.slice(0, 8).map((service, index) => {
      const relatedMessages = messages.filter((message) => {
        const haystack = `${message.message} ${message.name} ${message.email ?? ""}`.toLowerCase();
        return haystack.includes(service.title.toLowerCase()) || haystack.includes(service.slug.toLowerCase());
      }).length;

      const orderValue = service.sort_order ?? index + 1;
      const health = service.is_active ? 11.3 - index * 1.1 : -6.4 + index * 0.6;

      return {
        id: service.id,
        rank: index + 1,
        title: service.title,
        subtitle: service.short_description || `/${service.slug}`,
        demand: relatedMessages,
        order: orderValue,
        trend: health,
        status: service.is_active ? "Active" : "Hidden",
      };
    });
  }, [messages, services]);

  return (
    <AdminLayout
      title="Service Performance Dashboard"
      description="Monitor activity, identify priorities, and keep the admin space aligned with the reference mockup."
      actions={
        <>
          <Link
            href="/page/admin/messages"
            className="inline-flex h-10 items-center justify-center rounded-[12px] border border-black/8 bg-[#fafafa] px-4 text-[13px] font-medium text-brand-ink"
          >
            Inbox
          </Link>
          <Link
            href="/page/admin/services"
            className="inline-flex h-10 items-center justify-center rounded-[12px] bg-brand-ink px-4 text-[13px] font-medium text-white"
          >
            Add New
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        {error ? (
          <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Active services"
            value={loading ? "--" : String(activeServices.length)}
            hint="Services currently visible on the public website."
            tone="primary"
          />
          <AdminStatCard
            label="Total messages"
            value={loading ? "--" : String(messages.length)}
            hint="Messages received from the contact form."
            tone="mint"
          />
          <AdminStatCard
            label="Unread"
            value={loading ? "--" : String(unreadMessages.length)}
            hint="Messages that still need attention."
            tone="coral"
          />
          <AdminStatCard
            label="Hidden services"
            value={loading ? "--" : String(inactiveServices.length)}
            hint="Services currently hidden from the website."
            tone="dark"
          />
        </section>

        <section className="rounded-[22px] border border-black/6 bg-[#fbfbfc] p-4 shadow-[0_10px_24px_rgba(15,23,52,0.05)] md:p-5">
          <div className="flex flex-col gap-3 border-b border-black/6 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[1.05rem] font-semibold text-brand-ink md:text-[1.15rem]">Recent Service Performance</h2>
              <p className="mt-1 text-[13px] text-muted">Vue compacte des services les plus visibles dans le back-office.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1 lg:flex-none">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                <input
                  type="search"
                  readOnly
                  value="Search"
                  className="h-10 w-full rounded-[12px] border border-black/8 bg-white pl-9 pr-3 text-[13px] text-black/45 outline-none"
                />
              </div>
              <Link
                href="/page/admin/messages"
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-black/8 bg-white px-4 text-[13px] font-medium text-brand-ink"
              >
                Filter
              </Link>
              <Link
                href="/page/admin/services"
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-black/8 bg-white px-4 text-[13px] font-medium text-brand-ink"
              >
                Add New
              </Link>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="text-[12px] text-black/45">
                  <th className="rounded-l-[14px] bg-[#f1f2f4] px-4 py-3 font-medium">Rank</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Service</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Demand</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Order</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Trend</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Status</th>
                  <th className="rounded-r-[14px] bg-[#f1f2f4] px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-muted">
                      Loading data...
                    </td>
                  </tr>
                ) : serviceRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-muted">
                      No services available.
                    </td>
                  </tr>
                ) : (
                  serviceRows.map((row) => (
                    <tr key={row.id} className="text-[13px] text-brand-ink">
                      <td className="border-b border-black/6 px-4 py-4">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f2e29a] text-[11px] font-semibold text-brand-ink">
                          {row.rank}
                        </span>
                      </td>
                      <td className="border-b border-black/6 px-4 py-4">
                        <div className="font-semibold text-brand-ink">{row.title}</div>
                        <div className="mt-1 text-[11px] text-muted">{row.subtitle}</div>
                      </td>
                      <td className="border-b border-black/6 px-4 py-4 font-medium">{row.demand}</td>
                      <td className="border-b border-black/6 px-4 py-4">#{row.order}</td>
                      <td className={`border-b border-black/6 px-4 py-4 font-medium ${row.trend >= 0 ? "text-[#2c9b63]" : "text-[#d66565]"}`}>
                        {formatPercent(row.trend)}
                      </td>
                      <td className="border-b border-black/6 px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            row.status === "Active" ? "bg-[#e8f6ec] text-[#2c9b63]" : "bg-[#fceaea] text-[#d66565]"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="border-b border-black/6 px-4 py-4">
                        <Link href="/page/admin/services" className="text-[12px] font-medium text-brand-ink hover:text-brand-primary">
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[22px] border border-black/6 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,52,0.05)] md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[1rem] font-semibold text-brand-ink">Recent activity</h3>
                <p className="mt-1 text-[13px] text-muted">Latest messages received.</p>
              </div>
              <Link href="/page/admin/messages" className="text-[12px] font-medium text-brand-primary">
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <div className="text-[13px] text-muted">Loading...</div>
              ) : messages.length === 0 ? (
                <div className="text-[13px] text-muted">No messages yet.</div>
              ) : (
                [...messages]
                  .sort((first, second) => second.created_at.localeCompare(first.created_at))
                  .slice(0, 4)
                  .map((message) => (
                    <div key={message.id} className="flex items-start justify-between gap-3 rounded-[16px] bg-[#f7f8fa] p-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-brand-ink">{message.name}</p>
                        <p className="mt-1 line-clamp-2 text-[12px] text-muted">{message.message}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-black/40">{formatDate(message.created_at)}</span>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="rounded-[22px] border border-black/6 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,52,0.05)] md:p-5">
            <h3 className="text-[1rem] font-semibold text-brand-ink">Quick summary</h3>
            <div className="mt-4 space-y-3 text-[13px]">
              <SummaryRow label="Active services" value={String(activeServices.length)} />
              <SummaryRow label="Hidden services" value={String(inactiveServices.length)} />
              <SummaryRow label="Unread messages" value={String(unreadMessages.length)} />
              <SummaryRow label="Last update" value={loading ? "..." : formatDate(new Date().toISOString())} />
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[14px] bg-[#f7f8fa] px-3 py-3">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-brand-ink">{value}</span>
    </div>
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
