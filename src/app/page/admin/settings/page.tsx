"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminStatCard from "@/components/admin/AdminStatCard";
import BrandMark from "@/components/BrandMark";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/layouts/AdminLayout";
import {
  getAdminSettings,
  listAdminSettingsHistory,
  updateAdminSettings,
} from "@/services/settings.api";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
  type SiteSettingsHistoryEntry,
} from "@/types/site-settings";
import { formatPhoneHref, formatWhatsAppHref, getSocialLinks, hasSettingValue } from "@/utils/site-settings";

const MAX_LOGO_BYTES = 220 * 1024;
const MAX_LOGO_DIMENSION = 720;
const MIN_LOGO_DIMENSION = 320;
const MIN_LOGO_QUALITY = 0.52;
const SETTINGS_HISTORY_PAGE_SIZE = 5;
const EMPTY_SETTINGS_HISTORY = {
  history: [] as SiteSettingsHistoryEntry[],
  page: 1,
  pageSize: SETTINGS_HISTORY_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

const SETTING_LABELS: Record<keyof SiteSettings, string> = {
  business_address: "Address",
  contact_phone: "Phone",
  whatsapp_phone: "WhatsApp",
  contact_email: "Email",
  facebook_url: "Facebook",
  instagram_url: "Instagram",
  tiktok_url: "TikTok",
  linkedin_url: "LinkedIn",
  logo_url: "Logo",
};

function countContactFields(settings: SiteSettings) {
  return [settings.business_address, settings.contact_phone, settings.whatsapp_phone, settings.contact_email].filter((value) =>
    hasSettingValue(value),
  ).length;
}

function countSocialFields(settings: SiteSettings) {
  return [settings.facebook_url, settings.instagram_url, settings.tiktok_url, settings.linkedin_url].filter((value) =>
    hasSettingValue(value),
  ).length;
}

function formatHistoryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatHistoryValue(value: string | null | undefined) {
  if (!value) return "Cleared";
  if (value === "[uploaded image data]") return "Uploaded image";
  if (value.length <= 90) return value;
  return `${value.slice(0, 87)}...`;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Unable to generate the image."));
      },
      "image/png",
      quality,
    );
  });
}

function loadImageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read the image file."));
    };

    image.src = objectUrl;
  });
}

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read the processed image."));
    reader.readAsDataURL(blob);
  });
}

async function optimizeLogoFile(file: File) {
  const image = await loadImageFromFile(file);
  const longestSide = Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height);
  const initialScale = longestSide > MAX_LOGO_DIMENSION ? MAX_LOGO_DIMENSION / longestSide : 1;

  let width = Math.max(1, Math.round((image.naturalWidth || image.width) * initialScale));
  let height = Math.max(1, Math.round((image.naturalHeight || image.height) * initialScale));

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to prepare the image.");
  }

  const render = (nextWidth: number, nextHeight: number) => {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
    context.clearRect(0, 0, nextWidth, nextHeight);
    context.drawImage(image, 0, 0, nextWidth, nextHeight);
  };

  render(width, height);

  let quality = 0.84;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_LOGO_BYTES && quality > MIN_LOGO_QUALITY) {
    quality = Math.max(MIN_LOGO_QUALITY, quality - 0.08);
    blob = await canvasToBlob(canvas, quality);
  }

  while (blob.size > MAX_LOGO_BYTES && Math.max(width, height) > MIN_LOGO_DIMENSION) {
    width = Math.max(1, Math.round(width * 0.88));
    height = Math.max(1, Math.round(height * 0.88));
    render(width, height);
    quality = 0.8;
    blob = await canvasToBlob(canvas, quality);

    while (blob.size > MAX_LOGO_BYTES && quality > MIN_LOGO_QUALITY) {
      quality = Math.max(MIN_LOGO_QUALITY, quality - 0.08);
      blob = await canvasToBlob(canvas, quality);
    }
  }

  if (blob.size > MAX_LOGO_BYTES) {
    throw new Error("Image is too large. Choose a lighter logo.");
  }

  return readBlobAsDataUrl(blob);
}

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [historyState, setHistoryState] = useState(EMPTY_SETTINGS_HISTORY);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyReloadKey, setHistoryReloadKey] = useState(0);

  const phoneHref = formatPhoneHref(settings.contact_phone);
  const whatsappHref = formatWhatsAppHref(settings.whatsapp_phone);
  const socialLinks = useMemo(() => getSocialLinks(settings), [settings]);
  const contactFieldsCount = useMemo(() => countContactFields(settings), [settings]);
  const socialFieldsCount = useMemo(() => countSocialFields(settings), [settings]);

  const loadSettings = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getAdminSettings(token);
      setSettings(data);
      setLogoName(data.logo_url ? "Logo ready" : "");
      setError(null);
    } catch (loadError: unknown) {
      const maybe = loadError as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Loading error");
    }
  }, [token]);

  const loadHistory = useCallback(async () => {
    if (!token) return;

    try {
      const data = await listAdminSettingsHistory(token, {
        page: historyPage,
        pageSize: SETTINGS_HISTORY_PAGE_SIZE,
      });

      if (data.page !== historyPage) {
        setHistoryPage(data.page);
        return;
      }

      setHistoryState(data);
      setHistoryError(null);
    } catch (loadError: unknown) {
      const maybe = loadError as { message?: unknown } | null;
      setHistoryError(typeof maybe?.message === "string" ? maybe.message : "History loading error");
    }
  }, [historyPage, token]);

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    loadSettings().finally(() => setLoading(false));
  }, [loadSettings, router, token]);

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    loadHistory().finally(() => setHistoryLoading(false));
  }, [historyReloadKey, historyPage, loadHistory, router, token]);

  const setField = useCallback((key: keyof SiteSettings, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSuccess(null);
  }, []);

  const onLogoChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Select a valid image file.");
      event.target.value = "";
      return;
    }

    try {
      const logo = await optimizeLogoFile(file);
      setSettings((current) => ({ ...current, logo_url: logo }));
      setLogoName(file.name);
      setError(null);
      setSuccess(null);
    } catch (uploadError: unknown) {
      const maybe = uploadError as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Unable to process this logo.");
    } finally {
      event.target.value = "";
    }
  }, []);

  const onSave = useCallback(async () => {
    if (!token) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateAdminSettings(token, settings);
      setSettings(result.settings);
      setLogoName(result.settings.logo_url ? logoName || "Logo ready" : "");
      setSuccess("Settings saved successfully.");
      setHistoryLoading(true);
      setHistoryPage(1);
      setHistoryReloadKey((current) => current + 1);
    } catch (saveError: unknown) {
      const maybe = saveError as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }, [logoName, settings, token]);

  return (
    <AdminLayout
      title="Contact & Brand Settings"
      description="Configure the contact page, direct contact channels, social links, and the public logo from one admin view."
      actions={
        <>
          <Link
            href="/page/contact"
            className="inline-flex h-11 items-center justify-center rounded-[14px] border border-black/8 bg-white px-4 text-[13px] font-semibold text-brand-ink shadow-[0_8px_18px_rgba(15,23,52,0.04)]"
          >
            Open Contact Page
          </Link>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || loading}
            className="inline-flex h-11 items-center justify-center rounded-[14px] bg-brand-ink px-4 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(5,3,47,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </>
      }
    >
      <div className="page-stage page-stage-sharp page-stage-admin space-y-6">
        {error ? (
          <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
        ) : null}

        {success ? (
          <div className="rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">{success}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Contact fields"
            value={loading ? "--" : `${contactFieldsCount}/4`}
            hint="Address, phone, WhatsApp, and email completion."
            tone="primary"
          />
          <AdminStatCard
            label="Social links"
            value={loading ? "--" : `${socialFieldsCount}/4`}
            hint="Facebook, Instagram, TikTok, and LinkedIn."
            tone="mint"
          />
          <AdminStatCard
            label="Logo"
            value={loading ? "--" : hasSettingValue(settings.logo_url) ? "Ready" : "Missing"}
            hint="Public brand asset shown in the navbar and footer."
            tone="coral"
          />
          <AdminStatCard
            label="Public status"
            value={loading ? "--" : contactFieldsCount >= 2 ? "Ready" : "Partial"}
            hint="Enough data to present a stronger public contact page."
            tone="dark"
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="admin-card admin-fade-up rounded-[26px] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-black/6 pb-5">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Public contact setup</p>
                <h2 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.04em] text-brand-ink md:text-[1.55rem]">
                  Control the contact details shown on the website.
                </h2>
                <p className="mt-2 max-w-2xl text-[14px] leading-7 text-muted">
                  Update the address, phone channels, public email, social links, and logo used across the contact page, navbar, footer, and booking callouts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSettings(DEFAULT_SITE_SETTINGS);
                  setLogoName("");
                  setSuccess(null);
                }}
                className="inline-flex h-11 items-center justify-center rounded-[14px] border border-black/8 bg-[#fafafa] px-4 text-[13px] font-semibold text-brand-ink"
              >
                Clear draft
              </button>
            </div>

            <div className="mt-6 grid gap-6">
              <section className="rounded-[22px] border border-black/8 bg-[#fafbff] p-4 md:p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Brand</p>
                <div className="mt-4 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-[22px] border border-dashed border-black/12 bg-white p-5">
                    <div className="flex items-center gap-4">
                      <BrandMark
                        logoUrl={settings.logo_url}
                        className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-[22px] bg-[#eef1f6]"
                        imageClassName="h-full w-full object-cover"
                        fallbackClassName="bg-brand-primary/10 text-[1.1rem] font-semibold text-brand-primary"
                      />
                      <div>
                        <p className="text-[16px] font-semibold text-brand-ink">Current logo</p>
                        <p className="mt-1 text-[13px] leading-6 text-muted">{logoName || "Upload a PNG, JPG, or WEBP logo."}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-dashed border-black/12 bg-white p-5">
                    <p className="text-[14px] font-semibold text-brand-ink">Logo asset</p>
                    <p className="mt-2 text-[13px] leading-6 text-muted">
                      Upload a brand image or paste a public logo URL. The uploaded image is optimized before saving.
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[14px] border border-black/10 bg-[#fafafa] px-4 text-[13px] font-semibold text-brand-ink"
                      >
                        Upload logo
                      </label>
                      {hasSettingValue(settings.logo_url) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setField("logo_url", "");
                            setLogoName("");
                          }}
                          className="text-[13px] font-semibold text-red-600"
                        >
                          Remove logo
                        </button>
                      ) : null}
                    </div>

                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={onLogoChange} />

                    <div className="mt-4">
                      <FieldLabel htmlFor="logo-url">Logo URL</FieldLabel>
                      <input
                        id="logo-url"
                        className={fieldClassName}
                        value={settings.logo_url}
                        placeholder="https://..."
                        onChange={(event) => setField("logo_url", event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[22px] border border-black/8 bg-[#fafbff] p-4 md:p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Direct contact</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <FieldLabel htmlFor="business-address">Address</FieldLabel>
                    <textarea
                      id="business-address"
                      rows={3}
                      className={`${fieldClassName} min-h-[110px] resize-y py-3`}
                      value={settings.business_address}
                      placeholder="Business address used on the contact page and the map."
                      onChange={(event) => setField("business_address", event.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="contact-phone">Phone</FieldLabel>
                    <input
                      id="contact-phone"
                      className={fieldClassName}
                      value={settings.contact_phone}
                      placeholder="+1 403 926 4063"
                      onChange={(event) => setField("contact_phone", event.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="whatsapp-phone">WhatsApp</FieldLabel>
                    <input
                      id="whatsapp-phone"
                      className={fieldClassName}
                      value={settings.whatsapp_phone}
                      placeholder="+1 403 926 4063"
                      onChange={(event) => setField("whatsapp_phone", event.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                    <input
                      id="contact-email"
                      type="email"
                      className={fieldClassName}
                      value={settings.contact_email}
                      placeholder="name@example.com"
                      onChange={(event) => setField("contact_email", event.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[22px] border border-black/8 bg-[#fafbff] p-4 md:p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Social links</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <SocialField
                    id="facebook-url"
                    label="Facebook"
                    value={settings.facebook_url}
                    placeholder="https://facebook.com/..."
                    onChange={(value) => setField("facebook_url", value)}
                  />
                  <SocialField
                    id="instagram-url"
                    label="Instagram"
                    value={settings.instagram_url}
                    placeholder="https://instagram.com/..."
                    onChange={(value) => setField("instagram_url", value)}
                  />
                  <SocialField
                    id="tiktok-url"
                    label="TikTok"
                    value={settings.tiktok_url}
                    placeholder="https://tiktok.com/@..."
                    onChange={(value) => setField("tiktok_url", value)}
                  />
                  <SocialField
                    id="linkedin-url"
                    label="LinkedIn"
                    value={settings.linkedin_url}
                    placeholder="https://linkedin.com/company/..."
                    onChange={(value) => setField("linkedin_url", value)}
                  />
                </div>
              </section>
            </div>
          </article>

          <article className="admin-card admin-fade-up rounded-[26px] p-5 md:p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Preview</p>
            <h2 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.04em] text-brand-ink">Public contact snapshot</h2>
            <p className="mt-2 text-[14px] leading-7 text-muted">A quick view of the main information that will appear on the website.</p>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,#0f1538_0%,#181e56_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,52,0.16)]">
              <div className="flex items-center gap-4">
                <BrandMark
                  logoUrl={settings.logo_url}
                  className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] bg-white/10"
                  imageClassName="h-full w-full object-cover"
                  fallbackClassName="bg-white/10 text-[1rem] font-semibold text-white"
                />
                <div>
                  <p className="text-[1.05rem] font-semibold text-white">TB Service Plus</p>
                  <p className="text-[13px] text-white/64">Contact and brand preview</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <PreviewRow label="Address" value={settings.business_address || "No address configured yet."} />
                <PreviewRow label="Phone" value={settings.contact_phone || "No phone configured yet."} href={phoneHref ?? undefined} />
                <PreviewRow label="WhatsApp" value={settings.whatsapp_phone || "No WhatsApp configured yet."} href={whatsappHref ?? undefined} />
                <PreviewRow
                  label="Email"
                  value={settings.contact_email || "No public email configured yet."}
                  href={hasSettingValue(settings.contact_email) ? `mailto:${settings.contact_email}` : undefined}
                />
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/52">Social presence</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((item) => (
                      <a
                        key={item.key}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-white/14 bg-white/8 px-3 py-2 text-[12px] font-semibold text-white/88"
                      >
                        {item.label}
                      </a>
                    ))
                  ) : (
                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-[12px] text-white/56">No social links configured yet.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-black/8 bg-[#fafbff] p-4">
              <p className="text-[13px] font-semibold text-brand-ink">Notes</p>
              <ul className="mt-3 space-y-2 text-[13px] leading-6 text-muted">
                <li>Use full public URLs for social links.</li>
                <li>Phone values are reused to build `tel:` and WhatsApp links automatically.</li>
                <li>The same logo is used in the public navbar and footer.</li>
              </ul>
            </div>
          </article>
        </section>

        <section className="admin-card admin-fade-up overflow-hidden rounded-[26px]">
          <div className="flex flex-col gap-4 border-b border-black/6 px-5 py-5 md:flex-row md:items-end md:justify-between md:px-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">History</p>
              <h2 className="mt-3 text-[1.2rem] font-semibold tracking-[-0.04em] text-brand-ink md:text-[1.35rem]">
                Settings change log
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-7 text-muted">
                Track who changed the public contact settings, when the update happened, and which fields were affected.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full bg-[#f8f9fb] px-4 py-2 text-[13px] font-semibold text-brand-ink">
              {historyState.total} changes logged
            </div>
          </div>

          {historyError ? (
            <div className="mx-5 mt-5 rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700 md:mx-6">
              {historyError}
            </div>
          ) : null}

          {historyLoading ? (
            <div className="px-5 py-10 text-center text-[14px] text-muted md:px-6">Loading history...</div>
          ) : historyState.history.length === 0 ? (
            <div className="px-5 py-10 text-center md:px-6">
              <p className="text-[1.05rem] font-semibold text-brand-ink">No settings history yet</p>
              <p className="mt-2 text-[14px] text-muted">The first successful save will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4 px-5 py-5 md:px-6 md:py-6">
              {historyState.history.map((entry) => (
                <article key={entry.id} className="rounded-[24px] border border-black/8 bg-[#fcfcfd] p-4 shadow-[0_12px_30px_rgba(15,23,52,0.05)]">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[15px] font-semibold text-brand-ink">
                        {entry.changed_by_email || entry.changed_by_admin_id || "Unknown admin"}
                      </p>
                      <p className="mt-1 text-[13px] text-muted">{formatHistoryDate(entry.changed_at)}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {entry.changed_keys.map((key) => (
                        <span
                          key={`${entry.id}-${key}`}
                          className="inline-flex items-center rounded-full bg-brand-sand px-3 py-1 text-[12px] font-semibold text-brand-ink"
                        >
                          {SETTING_LABELS[key]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {entry.changed_keys.map((key) => (
                      <div key={key} className="rounded-[18px] border border-black/8 bg-white p-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-black/35">{SETTING_LABELS[key]}</p>
                        <div className="mt-3 space-y-2 text-[13px] text-muted">
                          <p>
                            <span className="font-semibold text-brand-ink">Before:</span> {formatHistoryValue(entry.previous_values[key])}
                          </p>
                          <p>
                            <span className="font-semibold text-brand-ink">After:</span> {formatHistoryValue(entry.next_values[key])}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          <AdminPagination
            page={historyState.page}
            totalPages={historyState.totalPages}
            totalItems={historyState.total}
            pageSize={historyState.pageSize}
            itemLabel="changes"
            onPageChange={(nextPage) => {
              setHistoryLoading(true);
              setHistoryPage(nextPage);
            }}
          />
        </section>
      </div>
    </AdminLayout>
  );
}

const fieldClassName =
  "mt-2 h-14 w-full rounded-[16px] border border-black/10 bg-white px-4 text-[15px] text-brand-ink outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/12";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[14px] font-semibold text-brand-ink/78">
      {children}
    </label>
  );
}

function SocialField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input id={id} className={fieldClassName} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function PreviewRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-[18px] border border-white/12 bg-white/8 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/52">{label}</p>
      <p className="mt-1 text-[14px] leading-6 text-white">{value}</p>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
      {content}
    </a>
  );
}
