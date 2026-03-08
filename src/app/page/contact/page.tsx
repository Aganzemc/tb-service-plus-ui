import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import GoogleMapCard from "@/components/GoogleMapCard";

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <Reveal className="relative overflow-hidden rounded-[36px] border border-black/8 bg-[linear-gradient(135deg,#05032f_0%,#22206a_48%,#5f67f4_100%)] p-6 text-white shadow-[0_24px_60px_rgba(5,3,47,0.2)] md:p-8 lg:p-10">
        <div className="hero-shimmer absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,130,92,0.18),transparent_24%)]" />
        <div className="absolute -left-8 top-8 h-36 w-36 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-brand-coral/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/58">Contact TB Service Plus</p>
            <h1 className="mt-4 max-w-[12ch] text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
              Tell us what job you need help with.
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-8 text-white/78 md:text-[18px]">
              Moving, cleaning, delivery, junk removal, and snow removal. Share the job details and we will help you with the next step quickly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:4039264063"
                className="surface-lift inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-[15px] font-semibold text-brand-primary shadow-[0_18px_40px_rgba(255,255,255,0.15)]"
              >
                Call 403-926-4063
              </a>
              <a
                href="mailto:TBserviceplus1@gmail.com"
                className="surface-lift inline-flex items-center justify-center rounded-2xl border border-white/16 bg-white/10 px-6 py-3.5 text-[15px] font-semibold text-white backdrop-blur"
              >
                Email us
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard label="Response" title="Fast answers" text="We respond by phone or email with a clear next step and quote context." />
            <InfoCard label="Coverage" title="Practical local help" text="Good for homes, small businesses, and day-to-day service coordination." />
            <InfoCard label="Best for" title="Clear job details" text="Share timing, access, location, and the type of help you need." />
            <InfoCard label="Availability" title="Direct contact" text="Use the form, call us directly, or send an email with your request." />
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <Reveal delay={90}>
          <ContactForm />
        </Reveal>

        <Reveal delay={180} variant="left" className="space-y-4">
          <div className="surface-lift rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/45">Direct line</p>
            <p className="mt-3 text-[1.9rem] font-semibold tracking-[-0.05em] text-brand-ink">Fast answers, clear quote.</p>
            <p className="mt-3 text-[15px] leading-7 text-brand-ink/68">
              Leave the main details of your job and we can confirm the next step by phone or email.
            </p>
            <div className="mt-5 space-y-3">
              <ContactLine label="Phone" value="403-926-4063" href="tel:4039264063" />
              <ContactLine label="Email" value="TBserviceplus1@gmail.com" href="mailto:TBserviceplus1@gmail.com" />
            </div>
          </div>

          <div className="surface-lift rounded-[30px] border border-black/8 bg-brand-sand/45 p-6 shadow-[0_18px_40px_rgba(5,3,47,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/45">Best for</p>
            <ul className="mt-4 space-y-3 text-[15px] text-brand-ink/78">
              <li>Moving jobs that need timing and access details</li>
              <li>Cleaning requests with square footage or room count</li>
              <li>Delivery, junk removal, and snow service coordination</li>
            </ul>
          </div>

          <GoogleMapCard
            title="Business location"
            description="View the business location on Google Maps using the configured address query."
          />
        </Reveal>
      </div>
    </div>
  );
}

function InfoCard({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="surface-lift rounded-[24px] border border-white/14 bg-white/10 p-5 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/56">{label}</p>
      <p className="mt-3 text-[1.15rem] font-semibold text-white">{title}</p>
      <p className="mt-2 text-[14px] leading-6 text-white/74">{text}</p>
    </div>
  );
}

function ContactLine({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} className="flex items-center justify-between rounded-[18px] border border-black/8 bg-[#f8f9fb] px-4 py-3 text-[14px] text-brand-ink">
      <span className="font-medium text-brand-ink/66">{label}</span>
      <span className="font-semibold">{value}</span>
    </a>
  );
}
