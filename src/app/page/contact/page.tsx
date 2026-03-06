import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-brand-ink p-6 text-white shadow-[0_18px_40px_rgba(5,3,47,0.16)]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">Contact TB Service Plus</p>
        <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em]">Tell us what job you need help with.</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/75 md:text-[17px]">
          Moving services, cleaning services, delivery services, junk removal, and snow removal. Call, email, or send
          the form below with the job details.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="tel:4039264063"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-[15px] font-semibold text-brand-primary"
          >
            403-926-4063
          </a>
          <a
            href="mailto:TBserviceplus1@gmail.com"
            className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-[15px] font-semibold text-white"
          >
            TBserviceplus1@gmail.com
          </a>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}

