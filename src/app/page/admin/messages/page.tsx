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
        setLoading(false);
      })
      .catch((messagesError: unknown) => {
        if (!active) return;
        const maybe = messagesError as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Loading error");
        setLoading(false);
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
  const readCount = useMemo(() => messages.filter((message) => message.is_read).length, [messages]);

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
        setError(typeof maybe?.message === "string" ? maybe.message : "Update error");
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
        setError(typeof maybe?.message === "string" ? maybe.message : "Delete error");
      }
    },
    [messages, token],
  );

  return (
    <AdminLayout
      title="Messages Inbox"
      description="A denser inbox layout inspired by the reference mockup, with compact filters and a clean table structure."
      actions={
        <Link
          href="/page/admin/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-black/8 bg-[#fafafa] px-4 text-[13px] font-medium text-brand-ink"
        >
          Dashboard
        </Link>
      }
    >
      <div className="space-y-5">
        {error ? (
          <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <AdminStatCard label="Total" value={loading ? "--" : String(messages.length)} hint="All received messages." tone="dark" />
          <AdminStatCard label="Unread" value={loading ? "--" : String(unreadCount)} hint="Messages waiting to be reviewed." tone="coral" />
          <AdminStatCard label="Read" value={loading ? "--" : String(readCount)} hint="Messages already reviewed." tone="mint" />
        </section>

        <section className="rounded-[22px] border border-black/6 bg-[#fbfbfc] p-4 shadow-[0_10px_24px_rgba(15,23,52,0.05)] md:p-5">
          <div className="flex flex-col gap-3 border-b border-black/6 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[1.05rem] font-semibold text-brand-ink md:text-[1.15rem]">Recent Contact Messages</h2>
              <p className="mt-1 text-[13px] text-muted">Rechercher, filtrer et traiter les messages depuis une seule vue.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px] flex-1 lg:flex-none">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search"
                  className="h-10 w-full rounded-[12px] border border-black/8 bg-white pl-9 pr-3 text-[13px] text-brand-ink outline-none focus:border-brand-primary"
                />
              </div>

              {[
                { value: "all", label: "All" },
                { value: "unread", label: "Unread" },
                { value: "read", label: "Read" },
              ].map((item) => {
                const active = filter === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value as FilterMode)}
                    className={`inline-flex h-10 items-center justify-center rounded-[12px] px-4 text-[13px] font-medium ${
                      active ? "bg-brand-ink text-white" : "border border-black/8 bg-white text-brand-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="text-[12px] text-black/45">
                  <th className="rounded-l-[14px] bg-[#f1f2f4] px-4 py-3 font-medium">Name</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Contact</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Message</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Date</th>
                  <th className="bg-[#f1f2f4] px-4 py-3 font-medium">Status</th>
                  <th className="rounded-r-[14px] bg-[#f1f2f4] px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-muted">
                      Loading messages...
                    </td>
                  </tr>
                ) : filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-muted">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((message) => (
                    <tr key={message.id} className="text-[13px] text-brand-ink align-top">
                      <td className="border-b border-black/6 px-4 py-4 font-semibold">{message.name}</td>
                      <td className="border-b border-black/6 px-4 py-4 text-muted">
                        <div>{message.email || "No email provided"}</div>
                        <div className="mt-1 text-[12px]">{message.phone || "No phone provided"}</div>
                      </td>
                      <td className="border-b border-black/6 px-4 py-4 text-muted">
                        <p className="line-clamp-2 max-w-[380px]">{message.message}</p>
                      </td>
                      <td className="border-b border-black/6 px-4 py-4 text-muted">{formatDate(message.created_at)}</td>
                      <td className="border-b border-black/6 px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            message.is_read ? "bg-[#eef1f4] text-muted" : "bg-[#fff1ec] text-[#d66b47]"
                          }`}
                        >
                          {message.is_read ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="border-b border-black/6 px-4 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <button
                            type="button"
                            onClick={() => toggleRead(message)}
                            className="text-[12px] font-medium text-brand-primary"
                          >
                            {message.is_read ? "Mark unread" : "Mark read"}
                          </button>
                          <button type="button" onClick={() => onDelete(message)} className="text-[12px] font-medium text-[#d66565]">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
