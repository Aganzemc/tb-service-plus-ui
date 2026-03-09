export type SiteSettings = {
  business_address: string;
  contact_phone: string;
  whatsapp_phone: string;
  contact_email: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  linkedin_url: string;
  logo_url: string;
};

export type SiteSettingKey = keyof SiteSettings;

export type SiteSettingsHistoryValueMap = Partial<Record<SiteSettingKey, string | null>>;

export type SiteSettingsHistoryEntry = {
  id: string;
  changed_at: string;
  changed_by_admin_id: string | null;
  changed_by_email: string | null;
  changed_keys: SiteSettingKey[];
  previous_values: SiteSettingsHistoryValueMap;
  next_values: SiteSettingsHistoryValueMap;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  business_address: "",
  contact_phone: "403-926-4063",
  whatsapp_phone: "403-926-4063",
  contact_email: "TBserviceplus1@gmail.com",
  facebook_url: "",
  instagram_url: "",
  tiktok_url: "",
  linkedin_url: "",
  logo_url: "",
};
