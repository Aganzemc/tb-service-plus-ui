"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUser } from "@/types/auth";
import { STORAGE_KEYS } from "@/utils/constants";
import { adminLogin, adminLogout, adminMe, adminRefresh } from "@/services/auth.api";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEYS.adminAccessToken);
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEYS.adminRefreshToken);
  });

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading] = useState(false);

  const refresh = useCallback(async (t?: string | null) => {
    const effective = t ?? token;
    if (!effective) {
      setAdmin(null);
      return;
    }
    const me = await adminMe(effective);
    setAdmin(me);
  }, [token]);

  const refreshTokens = useCallback(async () => {
    if (!refreshToken) throw new Error("Missing refresh token");
    const res = await adminRefresh(refreshToken);
    window.localStorage.setItem(STORAGE_KEYS.adminAccessToken, res.accessToken);
    window.localStorage.setItem(STORAGE_KEYS.adminRefreshToken, res.refreshToken);
    setToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    return res;
  }, [refreshToken]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminLogin(email, password);
    window.localStorage.setItem(STORAGE_KEYS.adminAccessToken, res.accessToken);
    window.localStorage.setItem(STORAGE_KEYS.adminRefreshToken, res.refreshToken);
    setToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    setAdmin(res.admin);
    return res;
  }, []);

  const logout = useCallback(() => {
    const rt = refreshToken;
    if (rt) {
      adminLogout(rt).catch(() => {
        // ignore
      });
    }
    window.localStorage.removeItem(STORAGE_KEYS.adminAccessToken);
    window.localStorage.removeItem(STORAGE_KEYS.adminRefreshToken);
    setToken(null);
    setRefreshToken(null);
    setAdmin(null);
  }, [refreshToken]);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    if (!refreshToken) return;

    const interval = window.setInterval(() => {
      refreshTokens().catch(() => {
        window.localStorage.removeItem(STORAGE_KEYS.adminAccessToken);
        window.localStorage.removeItem(STORAGE_KEYS.adminRefreshToken);
        setToken(null);
        setRefreshToken(null);
        setAdmin(null);
      });
    }, 12 * 60 * 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [refreshToken, refreshTokens]);

  return { token, refreshToken, admin, loading, isAuthenticated, login, logout, refresh, refreshTokens };
}
