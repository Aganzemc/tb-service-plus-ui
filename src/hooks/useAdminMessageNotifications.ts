"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearAdminNotifications,
  deleteAdminNotification,
  deleteAdminPushSubscription,
  getAdminPushConfig,
  listAdminNotificationsPage,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  saveAdminPushSubscription,
} from "@/services/notifications.api";
import type { AdminNotification, AdminPushSubscriptionInput } from "@/types/admin-notification";

const STORAGE_KEY = "tbsp_admin_latest_notification_id";
const POLL_INTERVAL_MS = 20_000;
const RECENT_NOTIFICATIONS_LIMIT = 6;

type NotificationPermissionState = NotificationPermission | "unsupported";

function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  return window.Notification.permission;
}

function isWebPushSupported() {
  if (typeof window === "undefined") return false;
  return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
}

function sortNotifications(notifications: AdminNotification[]) {
  return [...notifications].sort((first, second) => {
    if (first.is_read !== second.is_read) {
      return first.is_read ? 1 : -1;
    }

    return second.created_at.localeCompare(first.created_at);
  });
}

function toNotificationBody(notification: AdminNotification) {
  return `${notification.message_name}: ${notification.message_preview}`;
}

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const normalized = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(normalized);

  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

function serializePushSubscription(subscription: PushSubscription | null): AdminPushSubscriptionInput | null {
  const json = subscription?.toJSON();

  if (!json?.endpoint || !json.keys?.auth || !json.keys.p256dh) {
    return null;
  }

  return {
    endpoint: json.endpoint,
    expirationTime: json.expirationTime ?? null,
    keys: {
      auth: json.keys.auth,
      p256dh: json.keys.p256dh,
    },
  };
}

export function useAdminMessageNotifications(token: string | null) {
  const [permission, setPermission] = useState<NotificationPermissionState>(getNotificationPermission);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<AdminNotification | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<AdminNotification[]>([]);
  const [markingIds, setMarkingIds] = useState<string[]>([]);
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [clearingAll, setClearingAll] = useState(false);
  const [pushConfigured, setPushConfigured] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const notificationsRef = useRef<AdminNotification[]>([]);
  const unreadCountRef = useRef(0);
  const pushPublicKeyRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  const commitNotifications = useCallback((notifications: AdminNotification[], nextUnreadCount: number) => {
    const sorted = sortNotifications(notifications);
    notificationsRef.current = sorted;
    unreadCountRef.current = Math.max(0, nextUnreadCount);
    setRecentNotifications(sorted);
    setLatestNotification(sorted[0] ?? null);
    setUnreadCount(Math.max(0, nextUnreadCount));
  }, []);

  const pollLatestNotification = useCallback(async () => {
    if (!token) {
      commitNotifications([], 0);
      pushPublicKeyRef.current = null;
      initializedRef.current = false;

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }

      return;
    }

    const data = await listAdminNotificationsPage(token, {
      page: 1,
      pageSize: RECENT_NOTIFICATIONS_LIMIT,
    });

    const latest = data.notifications[0] ?? null;
    commitNotifications(data.notifications, data.summary.unread);

    if (typeof window === "undefined" || !latest) {
      initializedRef.current = true;
      return;
    }

    if (!initializedRef.current) {
      window.localStorage.setItem(STORAGE_KEY, latest.id);
      initializedRef.current = true;
      return;
    }

    const previousLatestId = window.localStorage.getItem(STORAGE_KEY);

    if (!previousLatestId) {
      window.localStorage.setItem(STORAGE_KEY, latest.id);
      return;
    }

    if (previousLatestId === latest.id) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, latest.id);

    if (permission !== "granted" || document.visibilityState === "visible" || pushSubscribed) {
      return;
    }

    const notification = new window.Notification("New contact message", {
      body: toNotificationBody(latest),
      tag: `admin-notification-${latest.id}`,
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = "/page/admin/messages";
    };
  }, [commitNotifications, permission, pushSubscribed, token]);

  useEffect(() => {
    if (!token) return;

    let active = true;

    const run = async () => {
      try {
        await pollLatestNotification();
      } catch {
        if (!active) return;
      }
    };

    run();

    const interval = window.setInterval(run, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [pollLatestNotification, token]);

  useEffect(() => {
    if (!token || !isWebPushSupported()) {
      setPushConfigured(false);
      setPushSubscribed(false);
      pushPublicKeyRef.current = null;
      return;
    }

    let active = true;

    const syncPushState = async () => {
      try {
        const config = await getAdminPushConfig(token);
        if (!active) return;

        setPushConfigured(config.enabled);
        pushPublicKeyRef.current = config.publicKey;

        if (!config.enabled) {
          setPushSubscribed(false);
          return;
        }

        const registration = await navigator.serviceWorker.register("/admin-message-sw.js");
        const existingSubscription = await registration.pushManager.getSubscription();
        if (!active) return;

        const payload = serializePushSubscription(existingSubscription);
        if (!payload) {
          setPushSubscribed(false);
          return;
        }

        await saveAdminPushSubscription(token, payload);
        if (!active) return;

        setPushSubscribed(true);
        setPermission(getNotificationPermission());
      } catch {
        if (!active) return;
        setPushConfigured(false);
        setPushSubscribed(false);
        pushPublicKeyRef.current = null;
      }
    };

    syncPushState();

    return () => {
      active = false;
    };
  }, [token]);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return "unsupported" as const;
    }

    const nextPermission = await window.Notification.requestPermission();
    setPermission(nextPermission);
    return nextPermission;
  }, []);

  const enableWebPush = useCallback(async () => {
    if (!token || !pushPublicKeyRef.current || !isWebPushSupported()) {
      return false;
    }

    setPushLoading(true);

    try {
      const nextPermission = permission === "granted" ? permission : await requestPermission();
      if (nextPermission !== "granted") {
        return false;
      }

      const registration = await navigator.serviceWorker.register("/admin-message-sw.js");
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(pushPublicKeyRef.current),
        }));

      const payload = serializePushSubscription(subscription);
      if (!payload) {
        return false;
      }

      await saveAdminPushSubscription(token, payload);
      setPushSubscribed(true);
      setPermission(getNotificationPermission());
      return true;
    } finally {
      setPushLoading(false);
    }
  }, [permission, requestPermission, token]);

  const disableWebPush = useCallback(async () => {
    if (!token || !isWebPushSupported()) {
      return false;
    }

    setPushLoading(true);

    try {
      const registration = await navigator.serviceWorker.register("/admin-message-sw.js");
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setPushSubscribed(false);
        return true;
      }

      await deleteAdminPushSubscription(token, subscription.endpoint);
      await subscription.unsubscribe();
      setPushSubscribed(false);
      return true;
    } finally {
      setPushLoading(false);
    }
  }, [token]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!token) return;

      const target = notificationsRef.current.find((notification) => notification.id === id);
      if (!target || target.is_read) return;

      setMarkingIds((current) => (current.includes(id) ? current : [...current, id]));

      try {
        const updated = await markAdminNotificationRead(token, id);
        const nextNotifications = notificationsRef.current.map((notification) =>
          notification.id === id ? updated : notification,
        );

        commitNotifications(nextNotifications, Math.max(0, unreadCountRef.current - 1));
      } finally {
        setMarkingIds((current) => current.filter((item) => item !== id));
      }
    },
    [commitNotifications, token],
  );

  const markAllAsRead = useCallback(async () => {
    if (!token || unreadCountRef.current === 0) return;

    setMarkingAll(true);
    setMarkingIds((current) => [...new Set([...current, ...notificationsRef.current.map((notification) => notification.id)])]);

    try {
      await markAllAdminNotificationsRead(token);
      const changedAt = new Date().toISOString();
      const nextNotifications = notificationsRef.current.map((notification) => ({
        ...notification,
        is_read: true,
        read_at: notification.read_at ?? changedAt,
      }));

      commitNotifications(nextNotifications, 0);
    } finally {
      setMarkingAll(false);
      setMarkingIds([]);
    }
  }, [commitNotifications, token]);

  const removeNotification = useCallback(
    async (id: string) => {
      if (!token) return;

      const target = notificationsRef.current.find((notification) => notification.id === id);
      if (!target) return;

      setDeletingIds((current) => (current.includes(id) ? current : [...current, id]));

      try {
        await deleteAdminNotification(token, id);

        const nextNotifications = notificationsRef.current.filter((notification) => notification.id !== id);
        const nextUnreadCount = target.is_read ? unreadCountRef.current : Math.max(0, unreadCountRef.current - 1);

        commitNotifications(nextNotifications, nextUnreadCount);
      } finally {
        setDeletingIds((current) => current.filter((item) => item !== id));
      }
    },
    [commitNotifications, token],
  );

  const clearAll = useCallback(async () => {
    if (!token || notificationsRef.current.length === 0) return;

    setClearingAll(true);

    try {
      await clearAdminNotifications(token);
      commitNotifications([], 0);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } finally {
      setClearingAll(false);
    }
  }, [commitNotifications, token]);

  const newCount = recentNotifications.filter((notification) => !notification.is_read).length;

  return {
    supported: permission !== "unsupported",
    permission,
    unreadCount,
    newCount,
    latestNotification,
    recentNotifications,
    markingIds,
    markingAll,
    deletingIds,
    clearingAll,
    pushSupported: isWebPushSupported(),
    pushConfigured,
    pushSubscribed,
    pushLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestPermission,
    enableWebPush,
    disableWebPush,
  };
}
