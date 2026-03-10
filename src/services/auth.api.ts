import { apiFetch } from "@/services/api";
import type {
  AdminLoginResponse,
  AdminProfileUpdateInput,
  AdminProfileUpdateResponse,
  AdminRefreshResponse,
  AdminUser,
} from "@/types/auth";

export async function adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
  return apiFetch<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function adminRefresh(refreshToken: string): Promise<AdminRefreshResponse> {
  return apiFetch<AdminRefreshResponse>("/admin/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function adminLogout(refreshToken: string): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>("/admin/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function adminMe(token: string): Promise<AdminUser> {
  const res = await apiFetch<{ admin: AdminUser }>("/admin/me", { method: "GET", token });
  return res.admin;
}

export async function getAdminProfile(token: string): Promise<AdminUser> {
  const res = await apiFetch<{ admin: AdminUser }>("/admin/profile", { method: "GET", token });
  return res.admin;
}

export async function updateAdminProfile(token: string, input: AdminProfileUpdateInput): Promise<AdminProfileUpdateResponse> {
  return apiFetch<AdminProfileUpdateResponse>("/admin/profile", {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
}
