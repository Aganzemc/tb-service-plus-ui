import type { PaginationMeta } from "@/types/pagination";

export type AdminNotification = {
  id: string;
  kind: "message_created";
  created_at: string;
  message_id: string;
  message_name: string;
  message_email: string | null;
  message_phone: string | null;
  message_preview: string;
  is_read: boolean;
  read_at: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
};

export type AdminNotificationsSummary = {
  total: number;
  unread: number;
};

export type AdminNotificationsPage = PaginationMeta & {
  notifications: AdminNotification[];
  summary: AdminNotificationsSummary;
};

export type AdminPushSubscriptionInput = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type AdminPushConfig = {
  enabled: boolean;
  publicKey: string | null;
};
