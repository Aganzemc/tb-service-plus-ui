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
