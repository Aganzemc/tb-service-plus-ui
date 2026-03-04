import { apiFetch } from "@/services/api";
import type { Message } from "@/types/message";

export type CreateMessageInput = {
  name: string;
  phone?: string;
  email?: string;
  message: string;
};

export async function createPublicMessage(input: CreateMessageInput): Promise<Message> {
  const res = await apiFetch<{ message: Message }>("/messages", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.message;
}

export async function listAdminMessages(token: string): Promise<Message[]> {
  const res = await apiFetch<{ messages: Message[] }>("/admin/messages", { method: "GET", token });
  return res.messages;
}

export async function updateAdminMessage(token: string, id: string, input: { is_read: boolean }): Promise<Message> {
  const res = await apiFetch<{ message: Message }>(`/admin/messages/${encodeURIComponent(id)}` as const, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
  return res.message;
}

export async function deleteAdminMessage(token: string, id: string): Promise<void> {
  await apiFetch<{ deleted: true }>(`/admin/messages/${encodeURIComponent(id)}` as const, {
    method: "DELETE",
    token,
  });
}
