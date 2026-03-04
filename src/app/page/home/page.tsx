import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Le meilleur service
            <br />
            de nettoyage à Tunis
          </h1>
          <p className="max-w-xl text-black/70">
            Nettoyage à domicile, bureaux, fin de chantier. Simple, rapide, et suivi
            professionnel.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-black/70">
          <div className="flex items-center gap-1 text-amber-500">
            <span aria-hidden>★</span>
            <span aria-hidden>★</span>
            <span aria-hidden>★</span>
            <span aria-hidden>★</span>
            <span aria-hidden>★</span>
          </div>
          <span className="text-black/60">4.9/5</span>
          <span className="text-black/40">·</span>
          <span>+1 200 avis vérifiés</span>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
            <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm">
              <span className="text-black/40" aria-hidden>
                ⌂
              </span>
              <input
                className="w-full bg-transparent outline-none placeholder:text-black/40"
                placeholder="Votre espace (maison, bureau…)"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm">
              <span className="text-black/40" aria-hidden>
                ⦿
              </span>
              <input
                className="w-full bg-transparent outline-none placeholder:text-black/40"
                placeholder="Ville / code postal"
              />
            </label>
            <Link
              href="/page/contact"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Réserver
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-black/60">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Devis rapide
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Paiement flexible
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Équipe vérifiée
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link className="text-sm font-medium underline" href="/page/services">
            Voir nos services
          </Link>
          <Link className="text-sm text-black/70 hover:text-black" href="/page/contact">
            Demander un devis
          </Link>
        </div>
      </section>

      <section className="relative">
        <div className="absolute -right-6 top-6 hidden h-[88%] w-[70%] rounded-[40px] bg-blue-600 md:block" />
        <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-slate-100 to-slate-200" />
        </div>
      </section>
    </div>
  );
}
