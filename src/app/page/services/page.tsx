"use client";

import ServiceCard from "@/components/ServiceCard";
import { useServices } from "@/hooks/useServices";

export default function ServicesPage() {
  const { services, loading, error } = useServices();

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Services</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
