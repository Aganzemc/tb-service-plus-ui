import AdminLoginCard from "@/components/AdminLoginCard";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f6ff] px-4 py-10 md:px-6 md:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,130,92,0.14),transparent_24%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f1734_0%,#5f67f4_100%)] p-7 text-white shadow-[0_28px_80px_rgba(47,56,140,0.34)] md:p-10">
          <div className="inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/86">
            Admin portal
          </div>

          <h1 className="mt-6 text-[clamp(2.5rem,5vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.07em]">
            Gérez TB Service Plus dans un espace élégant.
          </h1>

          <p className="mt-5 max-w-xl text-[16px] leading-8 text-white/80 md:text-[18px]">
            Accédez au tableau de bord, publiez vos services et traitez les demandes clients dans une interface plus fluide.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <FeatureCard title="Vue claire" description="Une navigation plus nette entre dashboard, services et messages." />
            <FeatureCard title="Actions rapides" description="Les tâches fréquentes restent accessibles dès l'ouverture de session." />
            <FeatureCard title="Suivi client" description="Repérez rapidement les nouveaux messages et les échanges en attente." />
            <FeatureCard title="Catalogue piloté" description="Gardez le contrôle sur les services actifs et leur ordre d'affichage." />
          </div>
        </section>

        <div className="mx-auto w-full max-w-[560px]">
          <AdminLoginCard
            title="Connexion administrateur"
            subtitle="Entrez vos identifiants pour accéder au back-office et gérer le contenu du site."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur">
      <p className="text-[15px] font-semibold text-white">{title}</p>
      <p className="mt-2 text-[14px] leading-7 text-white/74">{description}</p>
    </div>
  );
}
