"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/layouts/AdminLayout";
import { deleteAdminMessage, listAdminMessages, updateAdminMessage } from "@/services/messages.api";
import type { Message } from "@/types/message";

type FilterMode = "all" | "unread" | "read";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminMessagesPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    let active = true;

    listAdminMessages(token)
      .then((data) => {
        if (!active) return;
        setMessages(data);
        setError(null);
      })
      .catch((messagesError: unknown) => {
        if (!active) return;
        const maybe = messagesError as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur de chargement");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token, router]);

  const sortedMessages = useMemo(
    () => [...messages].sort((first, second) => second.created_at.localeCompare(first.created_at)),
    [messages],
  );

  const unreadCount = useMemo(() => messages.filter((message) => !message.is_read).length, [messages]);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return sortedMessages.filter((message) => {
      if (filter === "unread" && message.is_read) return false;
      if (filter === "read" && !message.is_read) return false;

      if (!normalizedSearch) return true;

      return [message.name, message.email ?? "", message.phone ?? "", message.message]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [filter, search, sortedMessages]);

  const toggleRead = useCallback(
    async (message: Message) => {
      if (!token) return;

      const nextReadState = !message.is_read;
      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === message.id ? { ...currentMessage, is_read: nextReadState } : currentMessage,
        ),
      );

      try {
        const updated = await updateAdminMessage(token, message.id, { is_read: nextReadState });
        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) => (currentMessage.id === message.id ? updated : currentMessage)),
        );
      } catch (toggleError: unknown) {
        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === message.id ? { ...currentMessage, is_read: message.is_read } : currentMessage,
          ),
        );
        const maybe = toggleError as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur de mise à jour");
      }
    },
    [token],
  );

  const onDelete = useCallback(
    async (message: Message) => {
      if (!token) return;
      const confirmed = window.confirm(`Supprimer le message de ${message.name} ?`);
      if (!confirmed) return;

      const previousMessages = messages;
      setMessages((currentMessages) => currentMessages.filter((currentMessage) => currentMessage.id !== message.id));

      try {
        await deleteAdminMessage(token, message.id);
      } catch (deleteError: unknown) {
        setMessages(previousMessages);
        const maybe = deleteError as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur de suppression");
      }
    },
    [messages, token],
  );

  return (
    <AdminLayout
      title="Messages clients"
      description="Centralisez les demandes, filtrez les conversations et traitez rapidement les nouveaux messages grâce à une vue plus lisible."
      actions={
        <Link
          href="/page/admin/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-[16px] border border-black/8 bg-white px-5 text-[14px] font-semibold text-brand-ink"
        >
          Retour au dashboard
        </Link>
      }
    >
      <div className="space-y-6">
        {error ? (
          <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-[14px] text-red-700">{error}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <AdminStatCard
            label="Total"
            value={loading ? "--" : String(messages.length)}
            hint="Nombre de messages disponibles dans la boîte admin."
            tone="dark"
          />
          <AdminStatCard
            label="Non lus"
            value={loading ? "--" : String(unreadCount)}
            hint="Messages à traiter en priorité."
            tone="coral"
          />
          <AdminStatCard
            label="Résultats"
            value={loading ? "--" : String(filteredMessages.length)}
            hint="Messages visibles après filtre et recherche."
            tone="primary"
          />
        </section>

        <section className="rounded-[30px] border border-white/70 bg-white/88 p-5 shadow-[0_24px_70px_rgba(41,47,96,0.1)] backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-xl">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par nom, email, téléphone ou contenu"
                className="h-14 w-full rounded-[18px] border border-black/8 bg-[#f8f9ff] pl-12 pr-4 text-[15px] text-brand-ink outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Tous" },
                { value: "unread", label: "Non lus" },
                { value: "read", label: "Lus" },
              ].map((item) => {
                const active = filter === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value as FilterMode)}
                    className={`inline-flex h-11 items-center justify-center rounded-full px-4 text-[14px] font-semibold transition ${
                      active ? "bg-brand-ink text-white" : "border border-black/8 bg-[#f8f9ff] text-brand-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {loading ? <p className="px-1 text-[15px] text-muted">Chargement des messages…</p> : null}

          {!loading && filteredMessages.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-black/10 bg-white/75 px-6 py-12 text-center shadow-[0_18px_50px_rgba(41,47,96,0.06)]">
              <p className="text-[1.4rem] font-semibold tracking-[-0.04em] text-brand-ink">Aucun message trouvé</p>
              <p className="mt-3 text-[15px] leading-7 text-muted">
                Ajustez la recherche ou les filtres pour afficher d&apos;autres conversations.
              </p>
            </div>
          ) : null}

          {filteredMessages.map((message) => (
            <article
              key={message.id}
              className="rounded-[30px] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_rgba(41,47,96,0.09)] backdrop-blur-xl md:p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        message.is_read ? "bg-black/5 text-muted" : "bg-brand-coral/18 text-[#c95633]"
                      }`}
                    >
                      {message.is_read ? "Lu" : "Nouveau"}
                    </span>
                    <span className="inline-flex rounded-full bg-brand-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-primary">
                      {formatDate(message.created_at)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-brand-ink">{message.name}</h2>
                      <div className="mt-3 flex flex-wrap gap-3 text-[14px] text-muted">
                        <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-[#f8f9ff] px-3 py-1.5">
                          <MailIcon className="h-4 w-4" />
                          {message.email || "Email non renseigné"}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-[#f8f9ff] px-3 py-1.5">
                          <PhoneIcon className="h-4 w-4" />
                          {message.phone || "Téléphone non renseigné"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center rounded-[16px] border border-black/8 bg-[#f8f9ff] px-4 text-[14px] font-semibold text-brand-ink"
                        onClick={() => toggleRead(message)}
                      >
                        {message.is_read ? "Marquer non lu" : "Marquer lu"}
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-11 items-center justify-center rounded-[16px] border border-red-200 bg-red-50 px-4 text-[14px] font-semibold text-red-700"
                        onClick={() => onDelete(message)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[22px] border border-black/6 bg-[#f8f9ff] p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-muted">Message</p>
                    <p className="mt-3 whitespace-pre-wrap text-[15px] leading-8 text-brand-ink/82">{message.message}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AdminLayout>
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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3.5 5.5h13v9h-13v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 6l6 4.5L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M6.5 3.5l2.2 2.6-1.2 2.1a13.6 13.6 0 004.1 4.1l2.1-1.2 2.6 2.2-1.2 2.7c-.3.7-1 .9-1.7.8C8.3 16.9 3.1 11.7 2.3 5.4c-.1-.7.2-1.4.8-1.7L6.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
