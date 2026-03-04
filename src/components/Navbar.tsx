import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/page/home" className="text-lg font-semibold tracking-tight">
            TB Service Plus
          </Link>
          <span className="hidden h-7 w-px bg-black/10 sm:block" />
          <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Disponible à Tunis</span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-black/70 md:flex">
          <Link className="hover:text-black" href="/page/services">
            Services
          </Link>
          <Link className="hover:text-black" href="/page/about">
            À propos
          </Link>
          <Link className="hover:text-black" href="/page/contact">
            Contact
          </Link>
          <Link className="hover:text-black" href="/page/faq">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/page/contact"
            className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black hover:bg-black/5 sm:inline-flex"
          >
            Réserver
          </Link>
          <Link
            href="/page/admin/login"
            className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </header>
  );
}
