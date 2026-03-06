import Link from "next/link";

const services = [
  {
    title: "Moving Services",
    description: "Safe and efficient moving for homes and businesses.",
    tag: "MOVING",
  },
  {
    title: "Cleaning Services",
    description: "Professional cleaning for apartments, offices, and more.",
    tag: "CLEANING",
  },
  {
    title: "Delivery Services",
    description: "Fast pickup and delivery for your items and packages.",
    tag: "DELIVERY",
  },
  {
    title: "Junk Removal",
    description: "We remove unwanted items and keep your space clean.",
    tag: "JUNK",
  },
  {
    title: "Snow Removal",
    description: "Seasonal snow removal to keep your property accessible.",
    tag: "WINTER",
  },
] as const;

export default function ServicesSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Services</h2>
        <p className="text-sm text-slate-600">
          Choose the service you need. Modern, reliable, and affordable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500">{service.tag}</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{service.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
            <Link href="/page/services" className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline">
              View details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
