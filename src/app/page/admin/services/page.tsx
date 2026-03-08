"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  createAdminService,
  deleteAdminService,
  listAdminServices,
  updateAdminService,
} from "@/services/services.api";
import type { Service } from "@/types/service";

type ServiceFormState = {
  slug: string;
  title: string;
  short_description: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: string;
};

type ServiceTemplate = {
  title: string;
  slug: string;
  short_description: string;
  description: string;
};

type InputMode = "text" | "numeric" | "decimal" | "tel" | "search" | "email" | "url" | "none";

const MAX_MEDIA_BYTES = 320 * 1024;
const MAX_MEDIA_DIMENSION = 1280;
const MIN_MEDIA_DIMENSION = 720;
const MIN_MEDIA_QUALITY = 0.52;

const serviceTemplates: ServiceTemplate[] = [
  {
    title: "Moving Services",
    slug: "moving-services",
    short_description: "Help for houses, apartments, boxes, and furniture moves.",
    description: "Local moving support for loading, transport help, unloading, and practical day-of assistance.",
  },
  {
    title: "Cleaning Services",
    slug: "cleaning-services",
    short_description: "Routine cleaning, deep cleaning, and move-in or move-out support.",
    description: "Cleaning help for kitchens, bathrooms, floors, shared rooms, and reset cleaning before or after a move.",
  },
  {
    title: "Delivery Services",
    slug: "delivery-services",
    short_description: "Fast local delivery for boxes, supplies, and small furniture.",
    description: "Reliable pickup and drop-off support for local errands, supplies, and scheduled delivery runs.",
  },
  {
    title: "Junk Removal",
    slug: "junk-removal",
    short_description: "Quick pickup for unwanted furniture, bags, and bulky items.",
    description: "Clean-out support for homes and small businesses, including haul-away of clutter and light debris.",
  },
  {
    title: "Snow Removal",
    slug: "snow-removal",
    short_description: "Clearing for driveways, walkways, and property access in winter.",
    description: "Snow clearing for entrances, paths, and key access areas to keep the property safer and easier to use.",
  },
];

function slugifyTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toFormState(service?: Service): ServiceFormState {
  return {
    slug: service?.slug ?? slugifyTitle(service?.title ?? ""),
    title: service?.title ?? "",
    short_description: service?.short_description ?? "",
    description: service?.description ?? "",
    image_url: service?.image_url ?? "",
    is_active: service?.is_active ?? true,
    sort_order: service?.sort_order != null ? String(service.sort_order) : "",
  };
}

function parseSortOrder(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function countCompletedFields(state: ServiceFormState) {
  return [state.title, state.slug, state.short_description, state.description, state.image_url, state.sort_order].filter(
    (value) => value.trim() !== "",
  ).length;
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
      "image/jpeg",
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
      reject(new Error("Unable to read the media file."));
    };

    image.src = objectUrl;
  });
}

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read the media file."));
    reader.readAsDataURL(blob);
  });
}

async function optimizeImageFile(file: File) {
  const image = await loadImageFromFile(file);
  const longestSide = Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height);
  const initialScale = longestSide > MAX_MEDIA_DIMENSION ? MAX_MEDIA_DIMENSION / longestSide : 1;

  let width = Math.max(1, Math.round((image.naturalWidth || image.width) * initialScale));
  let height = Math.max(1, Math.round((image.naturalHeight || image.height) * initialScale));

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to prepare the media file.");
  }

  const render = (nextWidth: number, nextHeight: number) => {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
    context.clearRect(0, 0, nextWidth, nextHeight);
    context.drawImage(image, 0, 0, nextWidth, nextHeight);
  };

  render(width, height);

  let quality = 0.82;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_MEDIA_BYTES && quality > MIN_MEDIA_QUALITY) {
    quality = Math.max(MIN_MEDIA_QUALITY, quality - 0.08);
    blob = await canvasToBlob(canvas, quality);
  }

  while (blob.size > MAX_MEDIA_BYTES && Math.max(width, height) > MIN_MEDIA_DIMENSION) {
    width = Math.max(1, Math.round(width * 0.85));
    height = Math.max(1, Math.round(height * 0.85));
    render(width, height);
    quality = 0.78;
    blob = await canvasToBlob(canvas, quality);

    while (blob.size > MAX_MEDIA_BYTES && quality > MIN_MEDIA_QUALITY) {
      quality = Math.max(MIN_MEDIA_QUALITY, quality - 0.08);
      blob = await canvasToBlob(canvas, quality);
    }
  }

  if (blob.size > MAX_MEDIA_BYTES) {
    throw new Error("Image is too large. Choose a lighter image.");
  }

  return readBlobAsDataUrl(blob);
}

export default function AdminServicesPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createState, setCreateState] = useState<ServiceFormState>(() => toFormState());
  const [createLoading, setCreateLoading] = useState(false);
  const [createMediaName, setCreateMediaName] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<ServiceFormState>(() => toFormState());
  const [editLoading, setEditLoading] = useState(false);
  const [editMediaName, setEditMediaName] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      const aOrder = a.sort_order ?? 999999;
      const bOrder = b.sort_order ?? 999999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.created_at.localeCompare(b.created_at);
    });
  }, [services]);

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return sortedServices.filter((service) => {
      if (statusFilter === "active" && !service.is_active) return false;
      if (statusFilter === "hidden" && service.is_active) return false;

      if (!normalizedSearch) return true;

      return [service.title, service.slug, service.short_description ?? "", service.description ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [search, sortedServices, statusFilter]);

  const reload = useCallback(async () => {
    if (!token) return;

    try {
      const data = await listAdminServices(token);
      setServices(data);
      setError(null);
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Error");
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    setLoading(true);
    reload().finally(() => setLoading(false));
  }, [reload, router, token]);

  const applyTemplate = useCallback((template: ServiceTemplate) => {
    setCreateState((prev) => ({
      ...prev,
      title: template.title,
      slug: slugifyTitle(template.title),
      short_description: template.short_description,
      description: template.description,
    }));
  }, []);

  const resetCreateForm = useCallback(() => {
    setCreateState(toFormState());
    setCreateMediaName("");
  }, []);

  const onCreateMediaChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Select a valid image.");
      event.target.value = "";
      return;
    }

    try {
      const media = await optimizeImageFile(file);
      setCreateState((prev) => ({ ...prev, image_url: media }));
      setCreateMediaName(file.name);
      setError(null);
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Unable to process this image.");
    } finally {
      event.target.value = "";
    }
  }, []);

  const onEditMediaChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Select a valid image.");
      event.target.value = "";
      return;
    }

    try {
      const media = await optimizeImageFile(file);
      setEditState((prev) => ({ ...prev, image_url: media }));
      setEditMediaName(file.name);
      setError(null);
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Unable to process this image.");
    } finally {
      event.target.value = "";
    }
  }, []);

  const onCreate = useCallback(async () => {
    if (!token) return;

    const computedSlug = slugifyTitle(createState.title);
    if (!computedSlug) {
      setError("A title is required to generate the slug.");
      return;
    }

    setCreateLoading(true);
    setError(null);

    try {
      await createAdminService(token, {
        slug: computedSlug,
        title: createState.title.trim(),
        short_description: createState.short_description.trim() || null,
        description: createState.description.trim() || null,
        image_url: createState.image_url.trim() || null,
        is_active: createState.is_active,
        sort_order: parseSortOrder(createState.sort_order),
      });

      resetCreateForm();
      await reload();
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Error");
    } finally {
      setCreateLoading(false);
    }
  }, [createState, reload, resetCreateForm, token]);

  const startEdit = useCallback((service: Service) => {
    setEditingId(service.id);
    setEditState(toFormState(service));
    setEditMediaName(service.image_url ? "Media ready" : "");
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditState(toFormState());
    setEditMediaName("");
  }, []);

  const onUpdate = useCallback(async () => {
    if (!token || !editingId) return;

    const computedSlug = slugifyTitle(editState.title);
    if (!computedSlug) {
      setError("A title is required to generate the slug.");
      return;
    }

    setEditLoading(true);
    setError(null);

    try {
      const updated = await updateAdminService(token, editingId, {
        slug: computedSlug,
        title: editState.title.trim() || undefined,
        short_description: editState.short_description.trim() || null,
        description: editState.description.trim() || null,
        image_url: editState.image_url.trim() || null,
        is_active: editState.is_active,
        sort_order: parseSortOrder(editState.sort_order),
      });

      setServices((prev) => prev.map((service) => (service.id === updated.id ? updated : service)));
      cancelEdit();
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Error");
    } finally {
      setEditLoading(false);
    }
  }, [cancelEdit, editState, editingId, token]);

  const onDelete = useCallback(
    async (service: Service) => {
      if (!token) return;
      const ok = window.confirm(`Delete the service ${service.title} ?`);
      if (!ok) return;

      try {
        await deleteAdminService(token, service.id);
        setServices((prev) => prev.filter((item) => item.id !== service.id));
        if (editingId === service.id) cancelEdit();
      } catch (err: unknown) {
        const maybe = err as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Error");
      }
    },
    [cancelEdit, editingId, token],
  );
  return (
    <AdminLayout
      title="Services Library"
      description="Manage the service catalog in a denser admin layout inspired by the reference dashboard."
      actions={
        <>
          <Link
            href="/page/admin/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-[12px] border border-black/8 bg-[#fafafa] px-4 text-[13px] font-medium text-brand-ink"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={resetCreateForm}
            className="inline-flex h-10 items-center justify-center rounded-[12px] bg-brand-ink px-4 text-[13px] font-medium text-white"
          >
            New Service
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Total services"
            value={loading ? "--" : String(sortedServices.length)}
            hint="All services configured in the admin."
            tone="dark"
          />
          <AdminStatCard
            label="Active"
            value={loading ? "--" : String(sortedServices.filter((service) => service.is_active).length)}
            hint="Services currently visible on the website."
            tone="mint"
          />
          <AdminStatCard
            label="Hidden"
            value={loading ? "--" : String(sortedServices.filter((service) => !service.is_active).length)}
            hint="Services currently hidden from the website."
            tone="coral"
          />
          <AdminStatCard
            label="Filtered"
            value={loading ? "--" : String(filteredServices.length)}
            hint="Rows currently visible in the library."
            tone="primary"
          />
        </section>

        <section className="admin-card admin-fade-up overflow-hidden rounded-[26px]">
          <div className="border-b border-black/6 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/35">Service Composer</p>
              <h1 className="mt-3 text-[clamp(1.55rem,2.8vw,2.2rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-brand-ink">
                Create and publish a polished service entry.
              </h1>
              <p className="mt-3 max-w-2xl text-[14px] leading-7 text-muted md:text-[15px]">
                Prepare the content, upload a cover visual, and publish each service with a cleaner workflow.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-black/8 bg-[#f8f9fb] px-4 py-2 text-[13px] font-semibold text-brand-ink">
              {sortedServices.length} services in library
            </div>
          </div>
          </div>

          {error ? (
            <div className="mx-5 mt-5 rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-600 md:mx-6">{error}</div>
          ) : null}

          <div className="px-5 py-5 md:px-6 md:py-6">
          <div className="overflow-hidden rounded-[24px] border border-black/6 bg-[#fcfcfd]">
            <div className="flex flex-col gap-4 border-b border-black/6 px-5 py-5 md:flex-row md:items-start md:justify-between md:px-6">
              <div>
                <h2 className="text-[1.2rem] font-semibold tracking-[-0.04em] text-brand-ink md:text-[1.35rem]">Service details</h2>
                <p className="mt-2 text-[13px] leading-6 text-muted md:text-[14px]">
                  Build a complete service card with media, content, visibility, and sorting.
                </p>
              </div>

              <button
                type="button"
                onClick={resetCreateForm}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-muted shadow-[0_8px_18px_rgba(15,23,52,0.04)] hover:text-brand-ink"
                aria-label="Reset the form"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-5 md:px-6 md:py-6">
              <div className="rounded-[24px] border border-dashed border-black/12 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,52,0.04)] md:p-6">
                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                  <label
                    htmlFor="create-media-input"
                    className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-black/10 bg-[#fafbff] px-6 py-8 text-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-black/8 bg-white text-brand-ink shadow-[0_10px_24px_rgba(15,23,52,0.05)]">
                      <UploadIcon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 text-[1.25rem] font-semibold tracking-[-0.03em] text-brand-ink">Upload a service image</h3>
                    <p className="mt-2 max-w-md text-[14px] leading-6 text-muted">
                      Choose a cover image from your device. The file is optimized automatically before upload.
                    </p>
                  </label>

                  <ServicePreviewPanel state={createState} />
                </div>

                <div className="mt-6">
                  <MediaField
                    inputId="create-media-input"
                    title="Attached media"
                    hint="Use the media picker instead of writing an image URL."
                    selectedName={createMediaName}
                    imageUrl={createState.image_url}
                    onChange={onCreateMediaChange}
                    onClear={() => {
                      setCreateState((prev) => ({ ...prev, image_url: "" }));
                      setCreateMediaName("");
                    }}
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-brand-ink">Quick templates</p>
                    <p className="mt-1 text-[13px] text-muted">Start from a preset and customize the content faster.</p>
                  </div>
                  <p className="text-[13px] font-medium text-muted">{countCompletedFields(createState)}/6 fields ready</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {serviceTemplates.map((template) => (
                    <button
                      key={template.slug}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-[14px] font-medium text-brand-ink hover:border-brand-primary hover:text-brand-primary"
                    >
                      + {template.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <TextField
                  id="create-title"
                  label="Title"
                  placeholder="Moving Services"
                  value={createState.title}
                  onChange={(value) =>
                    setCreateState((prev) => ({
                      ...prev,
                      title: value,
                      slug: slugifyTitle(value),
                    }))
                  }
                />
                <TextField
                  id="create-slug"
                  label="Slug"
                  placeholder="moving-services"
                  value={createState.slug}
                  readOnly
                  helperText="Generated automatically from the title."
                  onChange={() => {}}
                />
                <TextAreaField
                  id="create-short-description"
                  label="Short description"
                  placeholder="Short summary for cards and quick previews"
                  value={createState.short_description}
                  rows={3}
                  onChange={(value) => setCreateState((prev) => ({ ...prev, short_description: value }))}
                  className="lg:col-span-2"
                />
                <TextAreaField
                  id="create-description"
                  label="Full description"
                  placeholder="Longer description for the service page"
                  value={createState.description}
                  rows={5}
                  onChange={(value) => setCreateState((prev) => ({ ...prev, description: value }))}
                  className="lg:col-span-2"
                />
                <TextField
                  id="create-sort-order"
                  label="Sort order"
                  placeholder="1"
                  value={createState.sort_order}
                  inputMode="numeric"
                  onChange={(value) => setCreateState((prev) => ({ ...prev, sort_order: value }))}
                />
                <StatusCard
                  label="Visibility"
                  title={createState.is_active ? "Active on the website" : "Hidden from the website"}
                  description="Toggle the service status before publishing."
                  active={createState.is_active}
                  onToggle={() => setCreateState((prev) => ({ ...prev, is_active: !prev.is_active }))}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-black/6 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
              <button
                type="button"
                onClick={resetCreateForm}
                className="inline-flex h-12 items-center justify-center rounded-[14px] border border-black/10 bg-white px-5 text-[14px] font-semibold text-brand-ink"
              >
                Clear form
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCreateState((prev) => ({ ...prev, is_active: !prev.is_active }))}
                  className="inline-flex h-12 items-center justify-center rounded-[14px] border border-black/10 bg-white px-5 text-[14px] font-semibold text-brand-ink"
                >
                  {createState.is_active ? "Mark as inactive" : "Mark as active"}
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-[14px] bg-brand-ink px-6 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(5,3,47,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={onCreate}
                  disabled={createLoading || !createState.title.trim() || !createState.slug.trim()}
                >
                  {createLoading ? "Publishing..." : "Publish service"}
                </button>
              </div>
            </div>
          </div>
          </div>
        </section>

        <section className="admin-card admin-fade-up overflow-hidden rounded-[26px]">
          <div className="border-b border-black/6 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[clamp(1.3rem,2.4vw,1.9rem)] font-semibold tracking-[-0.04em] text-brand-ink">Service library</h2>
              <p className="mt-2 max-w-2xl text-[14px] leading-6 text-muted md:text-[15px]">
                Review, refine, and manage every published service from one cleaner grid.
              </p>
            </div>
            <div className="inline-flex items-center rounded-full bg-[#f8f9fb] px-4 py-2 text-[13px] font-semibold text-brand-ink">
              Total {sortedServices.length}
            </div>
          </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-black/6 px-5 py-5 lg:flex-row lg:items-center lg:justify-between md:px-6">
            <div className="relative min-w-[240px] flex-1 lg:max-w-sm">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services"
                className="h-11 w-full rounded-[14px] border border-black/8 bg-[#fafafa] pl-9 pr-3 text-[13px] text-brand-ink outline-none focus:border-brand-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "hidden", label: "Hidden" },
              ].map((item) => {
                const active = statusFilter === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatusFilter(item.value as "all" | "active" | "hidden")}
                    className={`inline-flex h-11 items-center justify-center rounded-[14px] px-4 text-[13px] font-semibold ${
                      active ? "bg-brand-ink text-white shadow-[0_10px_24px_rgba(5,3,47,0.14)]" : "border border-black/8 bg-white text-brand-ink"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="mx-5 my-5 rounded-[24px] border border-black/8 bg-[#fafbff] px-5 py-12 text-center text-[15px] text-muted md:mx-6">
              Loading services...
            </div>
          ) : null}

          {!loading && filteredServices.length === 0 ? (
            <div className="mx-5 my-5 rounded-[24px] border border-dashed border-black/12 bg-[#fafbff] px-5 py-12 text-center md:mx-6">
              <p className="text-[1.2rem] font-semibold text-brand-ink">No services found</p>
              <p className="mt-2 text-[15px] text-muted">Adjust the filters or publish a new service from the composer above.</p>
            </div>
          ) : null}

          {!loading && filteredServices.length > 0 ? (
            <div className="grid gap-4 px-5 py-5 xl:grid-cols-2 md:px-6 md:py-6">
              {filteredServices.map((service) => (
                <article key={service.id} className="admin-card overflow-hidden rounded-[24px] p-4 transition hover:-translate-y-0.5 md:p-5">
                  {editingId === service.id ? (
                    <div className="space-y-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-brand-primary">Editing</p>
                          <h3 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.04em] text-brand-ink">{service.title}</h3>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-muted hover:text-brand-ink"
                          onClick={cancelEdit}
                          aria-label="Cancel editing"
                        >
                          <CloseIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <ServicePreviewPanel state={editState} compact />

                      <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                          id={`edit-title-${service.id}`}
                          label="Title"
                          value={editState.title}
                          onChange={(value) =>
                            setEditState((prev) => ({
                              ...prev,
                              title: value,
                              slug: slugifyTitle(value),
                            }))
                          }
                        />
                        <TextField
                          id={`edit-slug-${service.id}`}
                          label="Slug"
                          value={editState.slug}
                          readOnly
                          helperText="Generated automatically from the title."
                          onChange={() => {}}
                        />
                        <TextAreaField
                          id={`edit-short-${service.id}`}
                          label="Short description"
                          value={editState.short_description}
                          rows={3}
                          onChange={(value) => setEditState((prev) => ({ ...prev, short_description: value }))}
                          className="md:col-span-2"
                        />
                        <TextAreaField
                          id={`edit-description-${service.id}`}
                          label="Full description"
                          value={editState.description}
                          rows={5}
                          onChange={(value) => setEditState((prev) => ({ ...prev, description: value }))}
                          className="md:col-span-2"
                        />                        <div className="md:col-span-2">
                          <MediaField
                            inputId={`edit-media-${service.id}`}
                            title="Attached media"
                            hint="Join an image from your device for this service."
                            selectedName={editMediaName}
                            imageUrl={editState.image_url}
                            onChange={onEditMediaChange}
                            onClear={() => {
                              setEditState((prev) => ({ ...prev, image_url: "" }));
                              setEditMediaName("");
                            }}
                          />
                        </div>
                        <TextField
                          id={`edit-order-${service.id}`}
                          label="Sort order"
                          value={editState.sort_order}
                          inputMode="numeric"
                          onChange={(value) => setEditState((prev) => ({ ...prev, sort_order: value }))}
                        />
                        <div className="md:col-span-2">
                          <StatusCard
                            label="Visibility"
                            title={editState.is_active ? "Active on the website" : "Hidden from the website"}
                            description="Save the service after changing its visibility."
                            active={editState.is_active}
                            onToggle={() => setEditState((prev) => ({ ...prev, is_active: !prev.is_active }))}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          className="inline-flex h-12 items-center justify-center rounded-[14px] bg-brand-ink px-5 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={onUpdate}
                          disabled={editLoading || !editState.title.trim() || !editState.slug.trim()}
                        >
                          {editLoading ? "Saving..." : "Save changes"}
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-12 items-center justify-center rounded-[14px] border border-black/10 bg-white px-5 text-[15px] font-semibold text-brand-ink"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-4">
                        <ServiceThumb service={service} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge active={service.is_active} />
                            <MetaBadge>{service.sort_order != null ? `Order ${service.sort_order}` : "No order"}</MetaBadge>
                          </div>
                          <h3 className="mt-3 text-[1.2rem] font-semibold tracking-[-0.03em] text-brand-ink">{service.title}</h3>
                          <p className="mt-1 text-[13px] font-medium text-muted">/{service.slug}</p>
                          <p className="mt-3 text-[14px] leading-6 text-muted">
                            {service.short_description || service.description || "No description added yet."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 border-t border-black/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[13px] text-muted">Created {formatDate(service.created_at)}</p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] border border-black/10 bg-[#fafafa] px-4 text-[13px] font-semibold text-brand-ink"
                            onClick={() => startEdit(service)}
                          >
                            <EditIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] border border-red-200 bg-red-50 px-4 text-[13px] font-semibold text-red-700"
                            onClick={() => onDelete(service)}
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}

function MediaField({
  inputId,
  title,
  hint,
  selectedName,
  imageUrl,
  onChange,
  onClear,
}: {
  inputId: string;
  title: string;
  hint: string;
  selectedName: string;
  imageUrl: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  const status = selectedName || (imageUrl.trim() ? "Media ready" : "No image selected");

  return (
    <div className="rounded-[20px] border border-black/10 bg-[#fafbff] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-muted">Media</p>
          <p className="mt-2 text-[16px] font-semibold text-brand-ink">{title}</p>
          <p className="mt-1 text-[14px] leading-6 text-muted">{hint}</p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <label
            htmlFor={inputId}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[14px] border border-black/10 bg-white px-4 text-[14px] font-semibold text-brand-ink"
          >
            Attach an image
          </label>
          {imageUrl.trim() ? (
            <button type="button" onClick={onClear} className="text-[13px] font-semibold text-red-600">
              Remove media
            </button>
          ) : null}
        </div>
      </div>

      <input id={inputId} type="file" accept="image/*" className="hidden" onChange={onChange} />

      <div className="mt-4 rounded-[16px] border border-dashed border-black/10 bg-white px-4 py-3 text-[14px] text-muted">
        {status}
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  readOnly = false,
  helperText,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: InputMode;
  readOnly?: boolean;
  helperText?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        className={`mt-2 h-14 w-full rounded-[16px] border border-black/10 px-4 text-[15px] outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/12 ${
          readOnly ? "bg-[#f7f8fc] text-muted" : "bg-white text-brand-ink"
        }`}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
      />
      {helperText ? <p className="mt-2 text-[13px] leading-6 text-muted">{helperText}</p> : null}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  rows,
  placeholder,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        rows={rows}
        className="mt-2 w-full rounded-[16px] border border-black/10 bg-white px-4 py-3 text-[15px] leading-7 text-brand-ink outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/12"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function FieldLabel({ children, htmlFor }: { children: string; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[14px] font-semibold text-brand-ink/78">
      {children}
    </label>
  );
}

function StatusCard({
  label,
  title,
  description,
  active,
  onToggle,
}: {
  label: string;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-black/10 bg-[#fafbff] p-4">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[16px] font-semibold text-brand-ink">{title}</p>
          <p className="mt-1 text-[14px] leading-6 text-muted">{description}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex h-11 items-center rounded-full px-4 text-[14px] font-semibold ${
            active ? "bg-[#e9fff0] text-[#178d47]" : "bg-[#fff2f2] text-[#b84c4c]"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${
        active ? "bg-[#e9fff0] text-[#178d47]" : "bg-[#fff2f2] text-[#b84c4c]"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function MetaBadge({ children }: { children: string }) {
  return <span className="inline-flex items-center rounded-full bg-brand-sand px-3 py-1 text-[12px] font-semibold text-brand-ink">{children}</span>;
}

function ServicePreviewPanel({ state, compact = false }: { state: ServiceFormState; compact?: boolean }) {
  const title = state.title.trim() || "Service title";
  const text = state.short_description.trim() || "Short service summary will appear here.";
  const slug = state.slug.trim() || "service-slug";

  return (
    <div className={`relative overflow-hidden rounded-[26px] border border-black/10 bg-brand-ink text-white ${compact ? "min-h-[220px]" : "min-h-[260px]"}`}>
      {state.image_url.trim() ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(5,3,47,0.18) 0%, rgba(5,3,47,0.78) 100%), url(${state.image_url.trim()})`,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.26),transparent_36%),linear-gradient(135deg,#0f1538_0%,#161c54_100%)]" />
      )}

      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <StatusBadge active={state.is_active} />
          <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/86">
            {state.sort_order.trim() ? `Order ${state.sort_order.trim()}` : "Draft order"}
          </span>
        </div>

        <div className="mt-8">
          <h3 className="text-[1.6rem] font-semibold tracking-[-0.04em]">{title}</h3>
          <p className="mt-3 max-w-sm text-[14px] leading-7 text-white/78">{text}</p>
        </div>

        <div className="mt-6 rounded-[18px] border border-white/12 bg-white/10 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/68">
          {slug}
        </div>
      </div>
    </div>
  );
}

function ServiceThumb({ service }: { service: Service }) {
  const imageUrl = service.image_url?.trim();

  return (
    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[20px] border border-black/8 bg-brand-sand">
      {imageUrl ? (
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.2),transparent_45%),linear-gradient(135deg,#f7f5ef_0%,#ebe7ff_100%)] text-brand-primary">
          <PhotoIcon className="h-8 w-8" />
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M11 18a7 7 0 100-14 7 7 0 000 14z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 16V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 10.5L12 7l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 16.5v.5A2.5 2.5 0 008.5 19.5h7A2.5 2.5 0 0018 17v-.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="6" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="M6.5 16l4.5-4.5 2.5 2.5 2-2 2 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 14.5V16h1.5l8.1-8.1-1.5-1.5L4 14.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11.8 6.3l1.5 1.5 1.7-1.7a1 1 0 000-1.5l-.2-.2a1 1 0 00-1.5 0l-1.5 1.9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5.5 6.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 6.5l.6 8h4.8l.6-8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 4.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
