import ServicesShowcase from "@/components/ServicesShowcase";

export default function ServicesPage() {
  return (
    <ServicesShowcase
      badge="Catalogue services"
      heading="Des services utiles pour la maison et les petits besoins du quotidien"
      description="Parcours les prestations actives de TB Service Plus, ouvre la fiche detail de chaque service, puis passe rapidement a la prise de contact pour reserver ou demander un devis."
      ctaHref="/page/contact"
      ctaLabel="Demander un devis"
      showDescription
    />
  );
}