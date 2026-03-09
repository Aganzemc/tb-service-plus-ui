import type { SiteSettings } from "@/types/site-settings";

export function hasSettingValue(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export function formatPhoneHref(phone: string) {
  const sanitized = phone.trim().replace(/[^\d+]/g, "");
  return sanitized ? `tel:${sanitized}` : null;
}

export function formatWhatsAppHref(phone: string) {
  const sanitized = phone.trim().replace(/\D/g, "");
  return sanitized ? `https://wa.me/${sanitized}` : null;
}

export function getSocialLinks(settings: SiteSettings) {
  return [
    { key: "facebook", label: "Facebook", href: settings.facebook_url },
    { key: "instagram", label: "Instagram", href: settings.instagram_url },
    { key: "tiktok", label: "TikTok", href: settings.tiktok_url },
    { key: "linkedin", label: "LinkedIn", href: settings.linkedin_url },
  ].filter((item) => hasSettingValue(item.href));
}
