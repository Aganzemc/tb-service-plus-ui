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
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur de chargement");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [token, refresh, router]);

  const unreadMessages = useMemo(() => messages.filter((message) => !message.is_read), [messages]);
  const activeServices = useMemo(() => services.filter((service) => service.is_active), [services]);
  const latestMessages = useMemo(
    () => [...messages].sort((first, second) => second.created_at.localeCompare(first.created_at)).slice(0, 4),
    [messages],
  );
  const orderedServices = useMemo(
    () =>
      [...services]
        .sort((first, second) => {
          const firstOrder = first.sort_order ?? 9999;
          const secondOrder = second.sort_order ?? 9999;
          if (firstOrder !== secondOrder) return firstOrder - secondOrder;
          return first.title.localeCompare(second.title);
        })
        .slice(0, 4),
    [services],
  );

  return (
    <AdminLayout
      title="Dashboard administrateur"
      description="Suivez rapidement l'activité du site, les messages entrants et l'état des services publiés depuis une interface plus claire et plus moderne."
      actions={
        <>
          <Link
            href="/page/admin/services"
            className="inline-flex h-12 items-center justify-center rounded-[16px] bg-brand-primary px-5 text-[14px] font-semibold text-white shadow-[0_18px_36px_rgba(95,103,244,0.24)] hover:bg-brand-primary-deep"
          >
            Gérer les services
          </Link>
          <Link
            href="/page/admin/messages"
            className="inline-flex h-12 items-center justify-center rounded-[16px] border border-black/8 bg-white px-5 text-[14px] font-semibold text-brand-ink"
          >
            Voir les messages
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        {error ? (
          <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-[14px] text-red-700">{error}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Services"
            value={loading ? "--" : String(services.length)}
            hint="Total des fiches présentes dans le catalogue admin."
            tone="primary"
          />
          <AdminStatCard
            label="Actifs"
            value={loading ? "--" : String(activeServices.length)}
            hint="Services actuellement visibles sur le site public."
            tone="mint"
          />
          <AdminStatCard
            label="Messages"
            value={loading ? "--" : String(messages.length)}
            hint="Demandes reçues depuis le formulaire de contact."
            tone="dark"
          />
          <AdminStatCard
            label="À lire"
            value={loading ? "--" : String(unreadMessages.length)}
            hint="Messages qui demandent encore une attention."
            tone="coral"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_rgba(41,47,96,0.1)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-muted">Messages récents</p>
                <h2 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.05em] text-brand-ink">Dernières demandes</h2>
              </div>
              <Link href="/page/admin/messages" className="text-[14px] font-semibold text-brand-primary">
                Ouvrir la boîte
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                <p className="text-[15px] text-muted">Chargement des messages…</p>
              ) : latestMessages.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-black/10 bg-[#f9faff] px-5 py-8 text-[15px] text-muted">
                  Aucun message reçu pour le moment.
                </div>
              ) : (
                latestMessages.map((message) => (
                  <div key={message.id} className="rounded-[22px] border border-black/6 bg-[#f9faff] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[15px] font-semibold text-brand-ink">{message.name}</p>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                              message.is_read ? "bg-black/5 text-muted" : "bg-brand-coral/18 text-[#c95633]"
                            }`}
                          >
                            {message.is_read ? "Lu" : "Nouveau"}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-muted">{message.email || message.phone || "Aucun contact secondaire"}</p>
                      </div>
                      <p className="text-[12px] font-medium text-muted">{formatDate(message.created_at)}</p>
                    </div>

                    <p className="mt-3 line-clamp-2 text-[14px] leading-7 text-muted">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_rgba(41,47,96,0.1)] backdrop-blur-xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-muted">Catalogue</p>
              <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-brand-ink">Services prioritaires</h2>

              <div className="mt-5 space-y-3">
                {loading ? (
                  <p className="text-[15px] text-muted">Chargement des services…</p>
                ) : orderedServices.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-black/10 bg-[#f9faff] px-5 py-8 text-[15px] text-muted">
                    Aucun service n&apos;est encore configuré.
                  </div>
                ) : (
                  orderedServices.map((service) => (
                    <div key={service.id} className="rounded-[22px] border border-black/6 bg-[#f9faff] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold text-brand-ink">{service.title}</p>
                          <p className="mt-1 truncate text-[13px] text-muted">/{service.slug}</p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            service.is_active ? "bg-brand-mint/24 text-[#21885e]" : "bg-black/5 text-muted"
                          }`}
                        >
                          {service.is_active ? "Actif" : "Masqué"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-[30px] bg-[linear-gradient(135deg,#0f1734_0%,#5f67f4_100%)] p-6 text-white shadow-[0_28px_70px_rgba(47,56,140,0.32)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/66">Raccourcis</p>
              <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em]">Actions utiles</h2>
              <p className="mt-3 text-[14px] leading-7 text-white/78">
                Passez rapidement de la supervision à l&apos;action sans quitter le tableau de bord.
              </p>

              <div className="mt-6 grid gap-3">
                <Link href="/page/admin/services" className="rounded-[18px] border border-white/14 bg-white/10 px-4 py-3 text-[14px] font-semibold text-white">
                  Ajouter ou modifier un service
                </Link>
                <Link href="/page/admin/messages" className="rounded-[18px] border border-white/14 bg-white/10 px-4 py-3 text-[14px] font-semibold text-white">
                  Trier les messages entrants
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
