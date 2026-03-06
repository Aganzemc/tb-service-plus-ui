import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 text-white shadow-sm">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-linear-to-br from-blue-700 via-slate-900 to-orange-500 opacity-70" />
      </div>

      <div className="relative px-6 py-12 sm:px-10 md:px-12 md:py-16">
        <div className="max-w-2xl space-y-5">
          <div className="inline-flex items-center rounded-full bg-white bg-opacity-10 px-4 py-2 text-xs font-semibold tracking-wide">
            TB SERVICE PLUS
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            TB SERVICE PLUS
          </h1>

          <p className="text-sm leading-6 text-white text-opacity-85 sm:text-base">
            Moving • Cleaning • Delivery • Junk Removal • Snow Removal
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-orange-400"
            >
              Call Us Today
            </Link>
            <Link
              href="/page/services"
              className="inline-flex items-center justify-center rounded-xl border border-white border-opacity-30 bg-white bg-opacity-10 px-6 py-3 text-sm font-semibold text-white hover:bg-opacity-15"
            >
              View Services
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white border-opacity-15 bg-white bg-opacity-10 p-4">
            <p className="text-xs font-semibold text-white text-opacity-70">MOVING</p>
            <p className="mt-1 font-semibold">Moving Services</p>
          </div>
          <div className="rounded-2xl border border-white border-opacity-15 bg-white bg-opacity-10 p-4">
            <p className="text-xs font-semibold text-white text-opacity-70">CLEANING</p>
            <p className="mt-1 font-semibold">Cleaning Services</p>
          </div>
          <div className="rounded-2xl border border-white border-opacity-15 bg-white bg-opacity-10 p-4">
            <p className="text-xs font-semibold text-white text-opacity-70">DELIVERY</p>
            <p className="mt-1 font-semibold">Delivery Services</p>
          </div>
          <div className="rounded-2xl border border-white border-opacity-15 bg-white bg-opacity-10 p-4">
            <p className="text-xs font-semibold text-white text-opacity-70">JUNK & WINTER</p>
            <p className="mt-1 font-semibold">Removal Services</p>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-24 -right-24 hidden h-96 w-96 rounded-full bg-white bg-opacity-10 blur-2xl md:block" />
      </div>
    </section>
  );
}
