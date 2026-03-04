"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

function toFormState(service?: Service): ServiceFormState {
  return {
    slug: service?.slug ?? "",
    title: service?.title ?? "",
    short_description: service?.short_description ?? "",
    description: service?.description ?? "",
    image_url: service?.image_url ?? "",
    is_active: service?.is_active ?? true,
    sort_order: service?.sort_order != null ? String(service.sort_order) : "",
  };
}

export default function AdminServicesPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createState, setCreateState] = useState<ServiceFormState>(() => toFormState());
  const [createLoading, setCreateLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<ServiceFormState>(() => toFormState());
  const [editLoading, setEditLoading] = useState(false);

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      const ao = a.sort_order ?? 999999;
      const bo = b.sort_order ?? 999999;
      if (ao !== bo) return ao - bo;
      return a.created_at.localeCompare(b.created_at);
    });
  }, [services]);

  const reload = useCallback(async () => {
    if (!token) return;
    try {
      const data = await listAdminServices(token);
      setServices(data);
      setError(null);
    } catch (e: unknown) {
      const maybe = e as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    listAdminServices(token)
      .then((data) => setServices(data))
      .catch((e: unknown) => {
        const maybe = e as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  const onCreate = useCallback(async () => {
    if (!token) return;
    setCreateLoading(true);
    try {
      const sort_order = createState.sort_order.trim() === "" ? undefined : Number(createState.sort_order);

      await createAdminService(token, {
        slug: createState.slug.trim(),
        title: createState.title.trim(),
        short_description: createState.short_description.trim() || null,
        description: createState.description.trim() || null,
        image_url: createState.image_url.trim() || null,
        is_active: createState.is_active,
        sort_order,
      });

      setCreateState(toFormState());
      await reload();
    } catch (e: unknown) {
      const maybe = e as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
    } finally {
      setCreateLoading(false);
    }
  }, [createState, reload, token]);

  const startEdit = useCallback((service: Service) => {
    setEditingId(service.id);
    setEditState(toFormState(service));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditState(toFormState());
  }, []);

  const onUpdate = useCallback(async () => {
    if (!token || !editingId) return;
    setEditLoading(true);
    try {
      const sort_order = editState.sort_order.trim() === "" ? undefined : Number(editState.sort_order);

      const updated = await updateAdminService(token, editingId, {
        slug: editState.slug.trim() || undefined,
        title: editState.title.trim() || undefined,
        short_description: editState.short_description.trim() || null,
        description: editState.description.trim() || null,
        image_url: editState.image_url.trim() || null,
        is_active: editState.is_active,
        sort_order,
      });

      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      cancelEdit();
    } catch (e: unknown) {
      const maybe = e as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
    } finally {
      setEditLoading(false);
    }
  }, [cancelEdit, editState, editingId, token]);

  const onDelete = useCallback(
    async (service: Service) => {
      if (!token) return;
      const ok = window.confirm(`Supprimer le service: ${service.title} ?`);
      if (!ok) return;

      try {
        await deleteAdminService(token, service.id);
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        if (editingId === service.id) cancelEdit();
      } catch (e: unknown) {
        const maybe = e as { message?: unknown } | null;
        setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
      }
    },
    [cancelEdit, editingId, token],
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Services</h1>
        {loading ? <p>Chargement...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="rounded border border-black/10 p-4">
          <h2 className="text-lg font-semibold">Créer un service</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="block text-sm">Titre</label>
              <input
                className="w-full rounded border border-black/20 px-3 py-2"
                value={createState.title}
                onChange={(e) => setCreateState((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm">Slug</label>
              <input
                className="w-full rounded border border-black/20 px-3 py-2"
                value={createState.slug}
                onChange={(e) => setCreateState((p) => ({ ...p, slug: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm">Courte description</label>
              <input
                className="w-full rounded border border-black/20 px-3 py-2"
                value={createState.short_description}
                onChange={(e) => setCreateState((p) => ({ ...p, short_description: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm">Description</label>
              <textarea
                className="w-full rounded border border-black/20 px-3 py-2"
                value={createState.description}
                onChange={(e) => setCreateState((p) => ({ ...p, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm">Image URL</label>
              <input
                className="w-full rounded border border-black/20 px-3 py-2"
                value={createState.image_url}
                onChange={(e) => setCreateState((p) => ({ ...p, image_url: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm">Ordre</label>
              <input
                className="w-full rounded border border-black/20 px-3 py-2"
                value={createState.sort_order}
                onChange={(e) => setCreateState((p) => ({ ...p, sort_order: e.target.value }))}
                inputMode="numeric"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={createState.is_active}
                onChange={(e) => setCreateState((p) => ({ ...p, is_active: e.target.checked }))}
              />
              Actif
            </label>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
              onClick={onCreate}
              disabled={createLoading || !createState.title.trim() || !createState.slug.trim()}
            >
              {createLoading ? "Création..." : "Créer"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {sortedServices.map((s) => (
            <div key={s.id} className="rounded border border-black/10 p-3">
              {editingId === s.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-sm">Titre</label>
                      <input
                        className="w-full rounded border border-black/20 px-3 py-2"
                        value={editState.title}
                        onChange={(e) => setEditState((p) => ({ ...p, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Slug</label>
                      <input
                        className="w-full rounded border border-black/20 px-3 py-2"
                        value={editState.slug}
                        onChange={(e) => setEditState((p) => ({ ...p, slug: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm">Courte description</label>
                      <input
                        className="w-full rounded border border-black/20 px-3 py-2"
                        value={editState.short_description}
                        onChange={(e) => setEditState((p) => ({ ...p, short_description: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm">Description</label>
                      <textarea
                        className="w-full rounded border border-black/20 px-3 py-2"
                        value={editState.description}
                        onChange={(e) => setEditState((p) => ({ ...p, description: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Image URL</label>
                      <input
                        className="w-full rounded border border-black/20 px-3 py-2"
                        value={editState.image_url}
                        onChange={(e) => setEditState((p) => ({ ...p, image_url: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Ordre</label>
                      <input
                        className="w-full rounded border border-black/20 px-3 py-2"
                        value={editState.sort_order}
                        onChange={(e) => setEditState((p) => ({ ...p, sort_order: e.target.value }))}
                        inputMode="numeric"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editState.is_active}
                        onChange={(e) => setEditState((p) => ({ ...p, is_active: e.target.checked }))}
                      />
                      Actif
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
                      onClick={onUpdate}
                      disabled={editLoading || !editState.title.trim() || !editState.slug.trim()}
                    >
                      {editLoading ? "Enregistrement..." : "Enregistrer"}
                    </button>
                    <button type="button" className="rounded border border-black/20 px-3 py-2 text-sm" onClick={cancelEdit}>
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-black/60">{s.slug}</div>
                    <div className="mt-1 text-sm text-black/60">
                      {s.is_active ? "Actif" : "Inactif"}
                      {s.sort_order != null ? ` • ordre ${s.sort_order}` : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded border border-black/20 px-3 py-2 text-sm"
                      onClick={() => startEdit(s)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="rounded border border-red-600/40 px-3 py-2 text-sm text-red-700"
                      onClick={() => onDelete(s)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
