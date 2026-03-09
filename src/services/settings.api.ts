import { apiFetch } from "@/services/api";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/types/site-settings";

type SettingsResponse = {
  settings?: Partial<Record<keyof SiteSettings, string | null>>;
  updated?: number;
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
  };
}
