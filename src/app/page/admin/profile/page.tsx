"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { broadcastAuthUpdate, useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/layouts/AdminLayout";
import { getAdminProfile, updateAdminProfile } from "@/services/auth.api";
import type { AdminUser } from "@/types/auth";
import { STORAGE_KEYS } from "@/utils/constants";

function formatProfileDate(value: string | null | undefined) {
  if (!value) return "Unavailable";

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

export default function AdminProfilePage() {
  const router = useRouter();
  const { token, admin } = useAuth();

  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailChanged = useMemo(() => email.trim() !== (profile?.email ?? ""), [email, profile?.email]);
  const passwordChanged = newPassword.trim().length > 0;

  const loadProfile = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getAdminProfile(token);
      setProfile(data);
      setEmail(data.email ?? "");
      setError(null);
    } catch (loadError: unknown) {
      const maybe = loadError as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Unable to load profile");
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    loadProfile().finally(() => setLoading(false));
  }, [loadProfile, router, token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || saving) return;

    setError(null);
    setSuccess(null);

    if (!emailChanged && !passwordChanged) {
      setError("No profile changes detected.");
      return;
    }

    if ((emailChanged || passwordChanged) && !currentPassword.trim()) {
      setError("Current password is required to save your profile.");
      return;
    }

    if (emailChanged && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid admin email address.");
      return;
    }

    if (passwordChanged && newPassword.trim().length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (passwordChanged && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);

    try {
      const result = await updateAdminProfile(token, {
        email: emailChanged ? email.trim() : undefined,
        currentPassword: currentPassword.trim(),
        newPassword: passwordChanged ? newPassword : undefined,
      });

      window.localStorage.setItem(STORAGE_KEYS.adminAccessToken, result.accessToken);
      broadcastAuthUpdate({
        accessToken: result.accessToken,
        admin: result.admin,
      });

      setProfile(result.admin);
      setEmail(result.admin.email ?? "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(passwordChanged ? "Profile and password updated." : "Profile updated.");
    } catch (saveError: unknown) {
      const maybe = saveError as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Unable to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout
      title="Profile"
      description="Manage your admin identity, email, and password from one place."
      eyebrow="Admin profile"
      titleClassName="public-title mt-2 text-[3rem] leading-[1.08] tracking-[-0.06em] md:text-[3rem]"
      descriptionClassName="public-copy mt-4 max-w-3xl text-[1.125rem] leading-[1.75] text-muted"
    >
      <div className="page-stage page-stage-sharp page-stage-admin space-y-6">
        {error ? (
          <div className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
        ) : null}

        {success ? (
          <div className="rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">{success}</div>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="admin-card admin-fade-up rounded-[26px] p-5 md:p-6">
            <div className="border-b border-black/6 pb-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Profile settings</p>
              <h2 className="public-subtitle mt-3 text-brand-ink">
                Update your login identity securely.
              </h2>
              <p className="public-copy mt-4 max-w-2xl text-muted">
                Change your admin email or password. The current password is required before any profile update is accepted.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
              <section className="rounded-[22px] border border-black/8 bg-[#fafbff] p-4 md:p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Identity</p>
                <div className="mt-4 grid gap-4">
                  <div>
                    <FieldLabel htmlFor="profile-email">Admin email</FieldLabel>
                    <input
                      id="profile-email"
                      type="email"
                      className={fieldClassName}
                      value={email}
                      placeholder="admin@example.com"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[22px] border border-black/8 bg-[#fafbff] p-4 md:p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Security</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <FieldLabel htmlFor="current-password">Current password</FieldLabel>
                    <input
                      id="current-password"
                      type="password"
                      className={fieldClassName}
                      value={currentPassword}
                      placeholder="Enter your current password"
                      onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="new-password">New password</FieldLabel>
                    <input
                      id="new-password"
                      type="password"
                      className={fieldClassName}
                      value={newPassword}
                      placeholder="Leave empty to keep current password"
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
                    <input
                      id="confirm-password"
                      type="password"
                      className={fieldClassName}
                      value={confirmPassword}
                      placeholder="Repeat the new password"
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] bg-brand-ink px-4 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(5,3,47,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save profile"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail(profile?.email ?? "");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError(null);
                    setSuccess(null);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] border border-black/8 bg-[#fafafa] px-4 text-[13px] font-semibold text-brand-ink"
                >
                  Reset form
                </button>
              </div>
            </form>
          </article>

          <article className="admin-card admin-fade-up rounded-[26px] p-5 md:p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Current account</p>
            <h2 className="public-subtitle mt-3 text-brand-ink">Session summary</h2>
            <p className="public-copy mt-4 text-muted">A quick snapshot of the account currently connected to the admin panel.</p>

            <div className="mt-6 rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,#0f1538_0%,#181e56_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,52,0.16)]">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white/10 text-[1.1rem] font-semibold text-white">
                  {(profile?.email ?? admin?.email ?? "A").slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[1.05rem] font-semibold text-white">{profile?.email || admin?.email || "Administrator"}</p>
                  <p className="mt-1 truncate text-[13px] text-white/64">{profile?.role || admin?.role || "Admin access"}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <PreviewRow label="Email" value={profile?.email || "No email loaded"} />
                <PreviewRow label="Role" value={profile?.role || "No role loaded"} />
                <PreviewRow label="Created at" value={formatProfileDate(profile?.created_at)} />
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-black/8 bg-[#fafbff] p-4">
              <p className="public-subtitle text-[2rem] text-brand-ink">Notes</p>
              <ul className="public-copy mt-4 space-y-2 text-muted">
                <li>Changing the email updates the active access token immediately.</li>
                <li>The current password is required before any profile change is saved.</li>
                <li>Leave the new password fields empty if you only want to change the email.</li>
              </ul>
            </div>
          </article>
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

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/12 bg-white/8 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/52">{label}</p>
      <p className="mt-1 text-[14px] leading-6 text-white">{value}</p>
    </div>
  );
}
