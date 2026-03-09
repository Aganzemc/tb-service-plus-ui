import { cache } from "react";
import { API_BASE_URL } from "@/utils/constants";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/types/site-settings";

type SettingsResponse = {
  settings?: Partial<Record<keyof SiteSettings, string | null>>;
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

export const getPublicSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return DEFAULT_SITE_SETTINGS;
    }

    const json = (await response.json()) as SettingsResponse;
    return normalizeSettings(json.settings);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
});
