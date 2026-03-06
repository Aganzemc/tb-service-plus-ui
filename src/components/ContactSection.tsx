export default function ContactSection() {
  return (
    <section id="contact" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Call Us Today!</h2>
          <p className="text-sm text-slate-600">
            Get a quick quote or schedule a service. We respond fast.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="tel:403-926-4063"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 hover:bg-slate-100"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.08 4.18 2 2 0 014.06 2h3a2 2 0 012 1.72c.12.86.3 1.7.54 2.5a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.58-1.6a2 2 0 012.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0122 16.92z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-500">Phone</p>
              <p className="font-semibold">403-926-4063</p>
            </div>
          </a>

          <a
            href="mailto:TBserviceplus1@gmail.com"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 hover:bg-slate-100"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-slate-900">
              <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M4 6h16v12H4V6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 6l-10 7L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-500">Email</p>
              <p className="font-semibold">TBserviceplus1@gmail.com</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
