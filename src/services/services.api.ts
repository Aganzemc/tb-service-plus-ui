import { apiFetch } from "@/services/api";
import type { Service } from "@/types/service";
import type { PaginationMeta } from "@/types/pagination";

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

export type AdminServicesSummary = {
  total: number;
  active: number;
  hidden: number;
};

export type AdminServicesPage = PaginationMeta & {
  services: Service[];
  summary: AdminServicesSummary;
};

type AdminServicesResponse = Partial<PaginationMeta> & {
  services?: Service[];
  summary?: Partial<AdminServicesSummary>;
};

type AdminServicesPageOptions = {
  page: number;
  pageSize: number;
  search?: string;
  status?: "all" | "active" | "hidden";
};

function buildServicesQuery(options: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(options)) {
    if (value == null || value === "") continue;
    params.set(key, String(value));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function normalizeServicesPage(response: AdminServicesResponse): AdminServicesPage {
  const services = response.services ?? [];

  return {
    services,
    page: response.page ?? 1,
    pageSize: response.pageSize ?? Math.max(1, services.length || 1),
    total: response.total ?? services.length,
    totalPages: response.totalPages ?? 1,
    summary: {
      total: response.summary?.total ?? services.length,
      active: response.summary?.active ?? services.filter((service) => service.is_active).length,
      hidden: response.summary?.hidden ?? services.filter((service) => !service.is_active).length,
    },
  };
}

export async function listPublicServices(): Promise<Service[]> {
  const res = await apiFetch<{ services: Service[] }>("/services", { method: "GET" });
  return res.services;
}

export async function getPublicServiceBySlug(slug: string): Promise<Service> {
  const res = await apiFetch<{ service: Service }>(`/services/${encodeURIComponent(slug)}`, { method: "GET" });
  return res.service;
}

export async function listAdminServices(token: string): Promise<Service[]> {
  const res = await apiFetch<AdminServicesResponse>(`/admin/services${buildServicesQuery({ all: "true" })}`, {
    method: "GET",
    token,
  });
  return normalizeServicesPage(res).services;
}

export async function listAdminServicesPage(token: string, options: AdminServicesPageOptions): Promise<AdminServicesPage> {
  const res = await apiFetch<AdminServicesResponse>(
    `/admin/services${buildServicesQuery({
      page: options.page,
      pageSize: options.pageSize,
      search: options.search?.trim(),
      status: options.status,
    })}`,
    {
      method: "GET",
      token,
    },
  );

  return normalizeServicesPage(res);
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
