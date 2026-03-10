import { apiFetch } from "@/services/api";
import type { PaginationMeta } from "@/types/pagination";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
  type SiteSettingsHistoryEntry,
} from "@/types/site-settings";

type SettingsResponse = {
  settings?: Partial<Record<keyof SiteSettings, string | null>>;
  updated?: number;
  historyEntry?: SiteSettingsHistoryEntry | null;
};

type SettingsHistoryResponse = Partial<PaginationMeta> & {
  history?: SiteSettingsHistoryEntry[];
};

type SettingsHistoryDeleteResponse = {
  deleted?: number;
};

function normalizeSettings(input?: Partial<Record<keyof SiteSettings, string | null>>): SiteSettings {
  return {
    business_address: input?.business_address?.trim() ?? DEFAULT_SITE_SETTINGS.business_address,
    contact_phone: input?.contact_phone?.trim() ?? DEFAULT_SITE_SETTINGS.contact_phone,
    whatsapp_phone: input?.whatsapp_phone?.trim() ?? DEFAULT_SITE_SETTINGS.whatsapp_phone,
    contact_email: input?.contact_email?.trim() ?? DEFAULT_SITE_SETTINGS.contact_email,
    facebook_url: input?.facebook_url?.trim() ?? DEFAULT_SITE_SETTINGS.facebook_url,
    instagram_url: input?.instagram_url?.trim() ?? DEFAULT_SITE_SETTINGS.instagram_url,
    tiktok_url: input?.tiktok_url?.trim() ?? DEFAULT_SITE_SETTINGS.tiktok_url,
    linkedin_url: input?.linkedin_url?.trim() ?? DEFAULT_SITE_SETTINGS.linkedin_url,
    logo_url: input?.logo_url?.trim() ?? DEFAULT_SITE_SETTINGS.logo_url,
  };
}

function toPayload(input: Partial<SiteSettings>) {
  const entries = Object.entries(input).map(([key, value]) => [key, value?.trim() ? value.trim() : null]);
  return Object.fromEntries(entries);
}

function buildQuery(options: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value == null || value === "") continue;
    params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function listPublicSettings(): Promise<SiteSettings> {
  const res = await apiFetch<SettingsResponse>("/settings", { method: "GET" });
  return normalizeSettings(res.settings);
}

export async function getAdminSettings(token: string): Promise<SiteSettings> {
  const res = await apiFetch<SettingsResponse>("/admin/settings", { method: "GET", token });
  return normalizeSettings(res.settings);
}

export async function updateAdminSettings(token: string, input: Partial<SiteSettings>) {
  const res = await apiFetch<SettingsResponse>("/admin/settings", {
    method: "PUT",
    token,
    body: JSON.stringify(toPayload(input)),
  });

  return {
    settings: normalizeSettings(res.settings),
    updated: res.updated ?? 0,
    historyEntry: res.historyEntry ?? null,
  };
}

export async function listAdminSettingsHistory(
  token: string,
  options: {
    page: number;
    pageSize: number;
  },
) {
  const res = await apiFetch<SettingsHistoryResponse>(
    `/admin/settings/history${buildQuery({ page: options.page, pageSize: options.pageSize })}`,
    {
      method: "GET",
      token,
    },
  );

  const history = res.history ?? [];

  return {
    history,
    page: res.page ?? 1,
    pageSize: res.pageSize ?? Math.max(1, history.length || 1),
    total: res.total ?? history.length,
    totalPages: res.totalPages ?? 1,
  };
}

export async function deleteAdminSettingsHistoryEntry(token: string, id: string) {
  const res = await apiFetch<SettingsHistoryDeleteResponse>(`/admin/settings/history/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });

  return {
    deleted: res.deleted ?? 0,
  };
}

export async function clearAdminSettingsHistory(token: string) {
  const res = await apiFetch<SettingsHistoryDeleteResponse>("/admin/settings/history", {
    method: "DELETE",
    token,
  });

  return {
    deleted: res.deleted ?? 0,
  };
}
