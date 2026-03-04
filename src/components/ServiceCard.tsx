import Link from "next/link";
import type { Service } from "@/types/service";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded-lg border border-black/10 p-4">
      <h3 className="text-lg font-semibold">{service.title}</h3>
      {service.description ? <p className="mt-2 text-sm text-black/70">{service.description}</p> : null}
      <div className="mt-4">
        <Link className="text-sm underline" href={`/page/services/${service.slug}`}>
          Voir détails
        </Link>
      </div>
    </div>
  );
}
