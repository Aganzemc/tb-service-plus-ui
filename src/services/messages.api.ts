import { apiFetch } from "@/services/api";
import type { Message } from "@/types/message";
import type { PaginationMeta } from "@/types/pagination";

export type CreateMessageInput = {
  name: string;
  phone?: string;
  email?: string;
  message: string;
};

export type AdminMessagesSummary = {
  total: number;
  read: number;
  unread: number;
};

export type AdminMessagesPage = PaginationMeta & {
  messages: Message[];
  summary: AdminMessagesSummary;
};

type AdminMessagesResponse = Partial<PaginationMeta> & {
  messages?: Message[];
  summary?: Partial<AdminMessagesSummary>;
};

type AdminMessagesPageOptions = {
  page: number;
  pageSize: number;
  search?: string;
  filter?: "all" | "read" | "unread";
};

function buildMessagesQuery(options: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value == null || value === "") continue;
    params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function normalizeMessagesPage(response: AdminMessagesResponse): AdminMessagesPage {
  const messages = response.messages ?? [];

  return {
    messages,
    page: response.page ?? 1,
    pageSize: response.pageSize ?? Math.max(1, messages.length || 1),
    total: response.total ?? messages.length,
    totalPages: response.totalPages ?? 1,
    summary: {
      total: response.summary?.total ?? messages.length,
      read: response.summary?.read ?? messages.filter((message) => message.is_read).length,
      unread: response.summary?.unread ?? messages.filter((message) => !message.is_read).length,
    },
  };
}

export async function createPublicMessage(input: CreateMessageInput): Promise<Message> {
  const res = await apiFetch<{ message: Message }>("/messages", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.message;
}

export async function listAdminMessages(token: string): Promise<Message[]> {
  const res = await apiFetch<AdminMessagesResponse>(`/admin/messages${buildMessagesQuery({ all: "true" })}`, {
    method: "GET",
    token,
  });
  return normalizeMessagesPage(res).messages;
}

export async function listAdminMessagesPage(token: string, options: AdminMessagesPageOptions): Promise<AdminMessagesPage> {
  const res = await apiFetch<AdminMessagesResponse>(
    `/admin/messages${buildMessagesQuery({
      page: options.page,
      pageSize: options.pageSize,
      search: options.search?.trim(),
      filter: options.filter,
    })}`,
    {
      method: "GET",
      token,
    },
  );

  return normalizeMessagesPage(res);
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
