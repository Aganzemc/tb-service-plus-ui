"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/layouts/AdminLayout";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboardPage() {
  const { token, refresh } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/page/admin/login");
      return;
    }

    refresh(token).catch((e: unknown) => {
      const maybe = e as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Error");
    });
  }, [token, refresh, router]);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <p className="text-black/70">Welcome to the admin area.</p>
      </div>
    </AdminLayout>
  );
}
