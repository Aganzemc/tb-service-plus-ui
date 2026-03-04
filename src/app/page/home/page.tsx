import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <section className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Best Service
            <br />
            For Your Home
          </h1>

          <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-base">
            Moving, cleaning, delivery, junk removal, snow removal. Une équipe fiable
            et réactive.
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-1 text-amber-500">
              <span aria-hidden>★</span>
              <span aria-hidden>★</span>
              <span aria-hidden>★</span>
              <span aria-hidden>★</span>
              <span aria-hidden>★</span>
            </div>
            <span className="font-medium text-slate-800">3,652</span>
            <span className="text-slate-500">verified 5-star reviews</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <span className="text-slate-400" aria-hidden>
                  ⌂
                </span>
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="Your Space"
                />
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <span className="text-slate-400" aria-hidden>
                  ⦿
                </span>
                <input
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="ZIP Code"
                />
              </label>
              <Link
                href="/page/contact"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Book From $92
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link className="text-sm font-semibold text-slate-900 underline" href="/page/services">
              Voir nos services
            </Link>
            <Link className="text-sm text-slate-600 hover:text-slate-900" href="/page/contact">
              Demander un devis
            </Link>
          </div>
        </section>

        <section className="relative">
          <div className="absolute -right-6 top-6 hidden h-[88%] w-[70%] rounded-[44px] bg-blue-600 md:block" />
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="aspect-16/10 w-full bg-linear-to-br from-slate-100 to-slate-200" />
          </div>
        </section>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">MOVING</p>
          <p className="mt-1 font-semibold text-slate-900">Moving Services</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">CLEANING</p>
          <p className="mt-1 font-semibold text-slate-900">Cleaning Services</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">DELIVERY</p>
          <p className="mt-1 font-semibold text-slate-900">Delivery Services</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">JUNK</p>
          <p className="mt-1 font-semibold text-slate-900">Junk Removal</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">WINTER</p>
          <p className="mt-1 font-semibold text-slate-900">Snow Removal</p>
        </div>
      </div>
    </div>
  );
}
