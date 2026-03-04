import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/page/home" className="text-xl font-semibold tracking-tight text-slate-900">
            <span className="text-slate-900">TB</span>
            <span className="text-blue-600">Service</span>
            <span className="text-slate-900">Plus</span>
          </Link>

          <button
            type="button"
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm sm:inline-flex"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Tunis</span>
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-slate-400"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link className="hover:text-slate-900" href="/page/services">
            Services
          </Link>
          <Link className="hover:text-slate-900" href="/page/about">
            À propos
          </Link>
          <Link className="hover:text-slate-900" href="/page/contact">
            Contact
          </Link>
          <Link className="hover:text-slate-900" href="/page/faq">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/page/contact"
            className="hidden items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 sm:inline-flex"
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M8 7V6a4 4 0 118 0v1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 7h12l-1 14H7L6 7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Book Now
          </Link>
          <Link
            href="/page/admin/login"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M15 3H7a2 2 0 00-2 2v14a2 2 0 002 2h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M10 12h10m0 0l-3-3m3 3l-3 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
