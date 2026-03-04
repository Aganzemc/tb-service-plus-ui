import { getPublicServiceBySlug } from "@/services/services.api";

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublicServiceBySlug(slug);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{service.title}</h1>
      {service.description ? <p className="text-black/70">{service.description}</p> : null}
    </div>
  );
}
