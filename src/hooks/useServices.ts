"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/types/service";
import { listPublicServices } from "@/services/services.api";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listPublicServices()
      .then((data) => {
        if (!mounted) return;
        setServices(data);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        const maybe = e as { message?: unknown } | null;
        const msg = typeof maybe?.message === "string" ? maybe.message : "Error";
        setError(msg);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { services, loading, error };
}
