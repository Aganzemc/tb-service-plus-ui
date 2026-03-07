import ServicesShowcase from "@/components/ServicesShowcase";

export default function ServicesPage() {
  return (
    <ServicesShowcase
      badge="Service catalog"
      heading="Useful services for the home and the practical jobs people need every day"
      description="Browse the active TB Service Plus offers, open the detail page for each service, and move quickly to contact when you are ready to book or request a quote."
      ctaHref="/page/contact"
      ctaLabel="Get a quote"
      showDescription
    />
  );
}
