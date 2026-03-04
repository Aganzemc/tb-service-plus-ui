import { apiFetch } from "@/services/api";
import type { Service } from "@/types/service";

export type AdminServiceCreateInput = {
  slug: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  image_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

export type AdminServiceUpdateInput = Partial<AdminServiceCreateInput>;

export async function listPublicServices(): Promise<Service[]> {
  const res = await apiFetch<{ services: Service[] }>("/services", { method: "GET" });
  return res.services;
}

export async function getPublicServiceBySlug(slug: string): Promise<Service> {
  const res = await apiFetch<{ service: Service }>(`/services/${encodeURIComponent(slug)}`, { method: "GET" });
  return res.service;
}

export async function listAdminServices(token: string): Promise<Service[]> {
  const res = await apiFetch<{ services: Service[] }>("/admin/services", { method: "GET", token });
  return res.services;
}

export async function createAdminService(token: string, input: AdminServiceCreateInput): Promise<Service> {
  const res = await apiFetch<{ service: Service }>("/admin/services", {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return res.service;
}

export async function updateAdminService(
  token: string,
  id: string,
  input: AdminServiceUpdateInput,
): Promise<Service> {
  const res = await apiFetch<{ service: Service }>(`/admin/services/${encodeURIComponent(id)}` as const, {
    method: "PATCH",
    token,
    body: JSON.stringify(input),
  });
  return res.service;
}

export async function deleteAdminService(token: string, id: string): Promise<void> {
  await apiFetch<{ deleted: true }>(`/admin/services/${encodeURIComponent(id)}` as const, {
    method: "DELETE",
    token,
  });
}
