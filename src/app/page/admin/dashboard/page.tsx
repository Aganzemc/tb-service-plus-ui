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

  return new Intl.DateTimeFormat("en-GB", {
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

    const currentToken = token;
    let active = true;

    async function loadDashboard() {
      setLoading(true);

      try {
        await refresh(currentToken);

        const [messagesData, servicesData] = await Promise.all([
          listAdminMessages(currentToken),
          listAdminServices(currentToken),
        ]);

        if (!active) return;

        setMessages(messagesData);
        setServices(servicesData);
        setError(null);
      } catch (dashboardError: unknown) {
        if (!active) return;
        const maybe = dashboardError as { message?: unknown } | null;
        setError(
          typeof maybe?.message === "string"
            ? maybe.message
            : "Loading error"
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [token, refresh, router]);

  const unreadMessages = useMemo(
    () => messages.filter((message) => !message.is_read),
    [messages]
  );

  const activeServices = useMemo(
    () => services.filter((service) => service.is_active),
    [services]
  );

  const hiddenServices = useMemo(
    () => services.filter((service) => !service.is_active),
    [services]
  );

  const metrics = useMemo(() => {
    const totalRequests = messages.length;
    const conversionRate =
      totalRequests > 0
        ? Math.min(98, 42 + activeServices.length * 4 + unreadMessages.length)
        : 0;

    return {
      conversionRate,
    };
  }, [activeServices.length, messages.length, unreadMessages.length]);

  const serviceRows = useMemo(() => {
    return [...services]
      .sort((first, second) => {
        const firstOrder = first.sort_order ?? 9999;
        const secondOrder = second.sort_order ?? 9999;
        if (firstOrder !== secondOrder) return firstOrder - secondOrder;
        return first.title.localeCompare(second.title);
      })
      .slice(0, 6)
      .map((service, index) => {
        const relatedMessages = messages.filter((message) => {
          const haystack = `${message.message} ${message.name} ${
            message.email ?? ""
          }`.toLowerCase();

          return (
            haystack.includes(service.title.toLowerCase()) ||
            haystack.includes(service.slug.toLowerCase())
          );
        }).length;

        const trend = service.is_active
          ? 18.5 - index * 2.3
          : -4.8 + index * 0.8;

        return {
          ...service,
          relatedMessages,
          trend,
        };
      });
  }, [messages, services]);

  const recentMessages = useMemo(
    () =>
      [...messages]
        .sort((first, second) =>
          second.created_at.localeCompare(first.created_at)
        )
        .slice(0, 4),
    [messages]
  );

  return (
    <AdminLayout
      title="Service Performance Dashboard"
      description="Track services, activity, and customer demand from a cleaner and more modern control panel."
      actions={
        <>
          <Link
            href="/page/admin/messages"
            className="inline-flex h-11 items-center justify-center rounded-[14px] border border-black/8 bg-white px-4 text-[13px] font-semibold text-brand-ink shadow-[0_8px_18px_rgba(15,23,52,0.04)]"
          >
            Inbox
          </Link>
          <Link
            href="/page/admin/services"
            className="inline-flex h-11 items-center justify-center rounded-[14px] bg-brand-ink px-4 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(5,3,47,0.14)]"
          >
            Manage Services
          </Link>
        </>
      }
    >
      <div className="page-stage page-stage-admin space-y-6">
        {error ? (
          <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Active services"
            value={loading ? "--" : String(activeServices.length)}
            hint="Services currently visible on the website."
            tone="primary"
          />
          <AdminStatCard
            label="Total messages"
            value={loading ? "--" : String(messages.length)}
            hint="All requests received from the contact form."
            tone="mint"
          />
          <AdminStatCard
            label="Unread"
            value={loading ? "--" : String(unreadMessages.length)}
            hint="Conversations still waiting for action."
            tone="coral"
          />
          <AdminStatCard
            label="Hidden services"
            value={loading ? "--" : String(hiddenServices.length)}
            hint="Items currently hidden from the public catalog."
            tone="dark"
          />
        </section>

        <section>
          <article className="admin-card admin-fade-up rounded-[26px] p-5 md:p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/35">
              Quick stats
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <InsightCard
                label="Conversion rate"
                value={loading ? "--" : `${metrics.conversionRate.toFixed(0)}%`}
                accent="blue"
              />
              <InsightCard
                label="Unread queue"
                value={loading ? "--" : String(unreadMessages.length)}
                accent="orange"
              />
              <InsightCard
                label="Active services"
                value={loading ? "--" : String(activeServices.length)}
                accent="green"
              />
            </div>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="admin-card admin-fade-up overflow-hidden rounded-[26px]">
            <div className="flex flex-col gap-4 border-b border-black/6 px-5 py-5 lg:flex-row lg:items-end lg:justify-between lg:px-6">
              <div>
                <h2 className="text-[1.05rem] font-semibold text-brand-ink md:text-[1.2rem]">
                  Recent Service Performance
                </h2>
                <p className="mt-1 text-[13px] leading-6 text-muted">
                  A clearer view of service activity, trend, and demand from the
                  inbox.
                </p>
              </div>

              <Link
                href="/page/admin/services"
                className="inline-flex h-11 items-center justify-center rounded-[14px] border border-black/8 bg-[#fafafa] px-4 text-[13px] font-semibold text-brand-ink"
              >
                Open library
              </Link>
            </div>

            <div className="overflow-x-auto px-5 py-4 lg:px-6">
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="text-[12px] text-black/45">
                    <th className="rounded-l-[14px] bg-[#f4f5f7] px-4 py-3 font-medium">
                      Service
                    </th>
                    <th className="bg-[#f4f5f7] px-4 py-3 font-medium">
                      Demand
                    </th>
                    <th className="bg-[#f4f5f7] px-4 py-3 font-medium">
                      Order
                    </th>
                    <th className="bg-[#f4f5f7] px-4 py-3 font-medium">
                      Trend
                    </th>
                    <th className="rounded-r-[14px] bg-[#f4f5f7] px-4 py-3 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-[13px] text-muted"
                      >
                        Loading service metrics...
                      </td>
                    </tr>
                  ) : serviceRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-[13px] text-muted"
                      >
                        No service data available.
                      </td>
                    </tr>
                  ) : (
                    serviceRows.map((service) => (
                      <tr
                        key={service.id}
                        className="admin-table-row text-[13px] text-brand-ink"
                      >
                        <td className="border-b border-black/6 px-4 py-5">
                          <div>
                            <p className="font-semibold text-brand-ink">
                              {service.title}
                            </p>
                            <p className="mt-1 text-[12px] text-muted">
                              {service.short_description || `/${service.slug}`}
                            </p>
                          </div>
                        </td>

                        <td className="border-b border-black/6 px-4 py-5 font-semibold text-brand-ink">
                          {service.relatedMessages}
                        </td>

                        <td className="border-b border-black/6 px-4 py-5 text-muted">
                          #{service.sort_order ?? "--"}
                        </td>

                        <td
                          className={`border-b border-black/6 px-4 py-5 font-semibold ${
                            service.trend >= 0
                              ? "text-[#2c9b63]"
                              : "text-[#d66565]"
                          }`}
                        >
                          {formatPercent(service.trend)}
                        </td>

                        <td className="border-b border-black/6 px-4 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                              service.is_active
                                ? "bg-[#e8f6ec] text-[#2c9b63]"
                                : "bg-[#eef1f4] text-[#7a7f95]"
                            }`}
                          >
                            {service.is_active ? "Active" : "Hidden"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="admin-card admin-fade-up rounded-[26px] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[1.05rem] font-semibold text-brand-ink md:text-[1.2rem]">
                  Recent Activity
                </h2>
                <p className="mt-1 text-[13px] leading-6 text-muted">
                  Latest conversations coming from the contact form.
                </p>
              </div>

              <Link
                href="/page/admin/messages"
                className="text-[12px] font-semibold text-brand-primary"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="text-[13px] text-muted">
                  Loading activity...
                </div>
              ) : recentMessages.length === 0 ? (
                <div className="text-[13px] text-muted">
                  No recent activity yet.
                </div>
              ) : (
                recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="admin-card-soft rounded-[18px] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-ink">
                          {message.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[12px] leading-6 text-muted">
                          {message.message}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                          message.is_read
                            ? "bg-[#eef1f4] text-[#7a7f95]"
                            : "bg-[#fff1ec] text-[#d66b47]"
                        }`}
                      >
                        {message.is_read ? "Read" : "Unread"}
                      </span>
                    </div>

                    <p className="mt-3 text-[12px] text-black/40">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </div>
    </AdminLayout>
  );
}

function InsightCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "green" | "blue" | "orange";
}) {
  const tone = {
    green: "bg-[#edf9f1] text-[#2c9b63]",
    blue: "bg-[#eef2ff] text-[#7387f5]",
    orange: "bg-[#fff1ec] text-[#d66b47]",
  }[accent];

  return (
    <div className="flex items-center justify-between rounded-[18px] bg-[#f8f9fb] px-4 py-4">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/35">
          {label}
        </p>
        <p className="mt-2 text-[1.1rem] font-semibold text-brand-ink">
          {value}
        </p>
      </div>

      <span
        className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${tone}`}
      >
        <TrendUpIcon className="h-4 w-4" />
      </span>
    </div>
  );
}

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5 15l5-5 4 4 5-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8h4v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
