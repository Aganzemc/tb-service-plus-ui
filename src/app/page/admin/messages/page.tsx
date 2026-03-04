"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { deleteAdminMessage, listAdminMessages, updateAdminMessage } from "@/services/messages.api";
import type { Message } from "@/types/message";

export default function AdminMessagesPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [messages]);

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    listAdminMessages(token)
      .then((data) => setMessages(data))
      .catch((e: unknown) => {
        const maybe = e as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  const toggleRead = useCallback(
    async (m: Message) => {
      if (!token) return;

      const next = !m.is_read;
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read: next } : x)));

      try {
        const updated = await updateAdminMessage(token, m.id, { is_read: next });
        setMessages((prev) => prev.map((x) => (x.id === m.id ? updated : x)));
      } catch (e: unknown) {
        setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read: m.is_read } : x)));
        const maybe = e as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
      }
    },
    [token],
  );

  const onDelete = useCallback(
    async (m: Message) => {
      if (!token) return;
      const ok = window.confirm(`Supprimer le message de: ${m.name} ?`);
      if (!ok) return;

      const snapshot = messages;
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
      try {
        await deleteAdminMessage(token, m.id);
      } catch (e: unknown) {
        setMessages(snapshot);
        const maybe = e as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
      }
    },
    [messages, token],
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Messages</h1>
        {loading ? <p>Chargement...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="space-y-2">
          {sortedMessages.map((m) => (
            <div key={m.id} className="rounded border border-black/10 p-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-black/60">{m.email || "-"}</div>
                  <div className="text-sm text-black/60">{m.phone || "-"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded border border-black/20 px-3 py-2 text-sm"
                    onClick={() => toggleRead(m)}
                  >
                    {m.is_read ? "Marquer non lu" : "Marquer lu"}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-red-600/40 px-3 py-2 text-sm text-red-700"
                    onClick={() => onDelete(m)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm">{m.message}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
