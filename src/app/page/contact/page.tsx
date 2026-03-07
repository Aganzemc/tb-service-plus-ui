import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <Reveal className="relative overflow-hidden rounded-[28px] bg-brand-ink p-6 text-white shadow-[0_18px_40px_rgba(5,3,47,0.16)]">
        <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,130,92,0.16),transparent_28%)]" />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">Contact TB Service Plus</p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em]">
            Tell us what job you need help with.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/75 md:text-[17px]">
            Moving services, cleaning services, delivery services, junk removal, and snow removal. Call, email, or
            send the form below with the job details.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:4039264063"
              className="surface-lift inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-[15px] font-semibold text-brand-primary"
            >
              403-926-4063
            </a>
            <a
              href="mailto:TBserviceplus1@gmail.com"
              className="surface-lift inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-[15px] font-semibold text-white"
            >
              TBserviceplus1@gmail.com
            </a>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <Reveal delay={90}>
          <ContactForm />
        </Reveal>

        <Reveal delay={180} variant="left" className="space-y-4">
          <div className="surface-lift rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/45">Direct line</p>
            <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-brand-ink">Fast answers, clear quote.</p>
            <p className="mt-3 text-[15px] leading-7 text-brand-ink/68">
              Leave the main details of your job and we can confirm the next step by phone or email.
            </p>
          </div>

          <div className="surface-lift rounded-[28px] border border-black/8 bg-brand-sand/45 p-6 shadow-[0_18px_40px_rgba(5,3,47,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/45">Best for</p>
            <ul className="mt-4 space-y-3 text-[15px] text-brand-ink/78">
              <li>Moving jobs that need timing and access details</li>
              <li>Cleaning requests with square footage or room count</li>
              <li>Delivery, junk removal, and snow service coordination</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
