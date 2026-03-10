import { apiFetch } from "@/services/api";
import type {
  AdminNotification,
  AdminNotificationsPage,
  AdminNotificationsSummary,
  AdminPushConfig,
  AdminPushSubscriptionInput,
} from "@/types/admin-notification";

type AdminNotificationsResponse = Partial<AdminNotificationsPage> & {
  notifications?: AdminNotification[];
  summary?: Partial<AdminNotificationsSummary>;
};

type NotificationsPageOptions = {
  page: number;
  pageSize: number;
};

function buildQuery(options: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value == null || value === "") continue;
    params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function normalizeNotificationsPage(response: AdminNotificationsResponse): AdminNotificationsPage {
  const notifications = response.notifications ?? [];

  return {
    notifications,
    page: response.page ?? 1,
    pageSize: response.pageSize ?? Math.max(1, notifications.length || 1),
    total: response.total ?? notifications.length,
    totalPages: response.totalPages ?? 1,
    summary: {
      total: response.summary?.total ?? notifications.length,
      unread: response.summary?.unread ?? notifications.filter((notification) => !notification.is_read).length,
    },
  };
}

export async function listAdminNotificationsPage(
  token: string,
  options: NotificationsPageOptions,
): Promise<AdminNotificationsPage> {
  const res = await apiFetch<AdminNotificationsResponse>(
    `/admin/notifications${buildQuery({ page: options.page, pageSize: options.pageSize })}`,
    {
      method: "GET",
      token,
    },
  );

  return normalizeNotificationsPage(res);
}

export async function markAdminNotificationRead(token: string, id: string): Promise<AdminNotification> {
  const res = await apiFetch<{ notification: AdminNotification }>(`/admin/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
    token,
  });

  return res.notification;
}

export async function markAllAdminNotificationsRead(token: string): Promise<number> {
  const res = await apiFetch<{ updated: number }>("/admin/notifications/read-all", {
    method: "POST",
    token,
  });

  return res.updated;
}

export async function deleteAdminNotification(token: string, id: string): Promise<void> {
  await apiFetch<{ deleted: true }>(`/admin/notifications/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

export async function clearAdminNotifications(token: string): Promise<number> {
  const res = await apiFetch<{ deleted: number }>("/admin/notifications", {
    method: "DELETE",
    token,
  });

  return res.deleted;
}

export async function getAdminPushConfig(token: string): Promise<AdminPushConfig> {
  return apiFetch<AdminPushConfig>("/admin/notifications/push/config", {
    method: "GET",
    token,
  });
}

export async function saveAdminPushSubscription(
  token: string,
  subscription: AdminPushSubscriptionInput,
): Promise<void> {
  await apiFetch<{ subscribed: true; subscriptionId: string }>("/admin/notifications/push/subscriptions", {
    method: "POST",
    token,
    body: JSON.stringify(subscription),
  });
}

export async function deleteAdminPushSubscription(token: string, endpoint: string): Promise<void> {
  await apiFetch<{ deleted: true }>("/admin/notifications/push/subscriptions", {
    method: "DELETE",
    token,
    body: JSON.stringify({ endpoint }),
  });
}
