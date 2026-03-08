"use client";

import { FormEvent, useState } from "react";
import { createPublicMessage } from "@/services/messages.api";

const SERVICE_OPTIONS = [
  "Moving",
  "Cleaning",
  "Delivery",
  "Junk Removal",
  "Snow Removal",
  "Other request",
] as const;

const inputClassName =
  "w-full rounded-[16px] border border-black/10 bg-[#fcfcfa] px-4.5 py-3 text-[16px] leading-[1.35] text-brand-ink outline-none placeholder:text-brand-ink/38 focus:-translate-y-0.5 focus:border-brand-primary/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(95,103,244,0.08)]";

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!phone.trim() && !email.trim()) {
      setStatus("Add at least an email or phone number so we can get back to you.");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const composedMessage = [`Service: ${service}`, message.trim()].filter(Boolean).join("\n\n");

      await createPublicMessage({
        name: fullName,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        message: composedMessage,
      });

      setStatus("Your message has been sent.");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setService("");
      setMessage("");
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setStatus(typeof maybe?.message === "string" ? maybe.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const isSuccess = status === "Your message has been sent.";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.1)] md:p-8"
    >
      <div>
        <p className="text-[13px] font-medium tracking-[-0.01em] text-brand-ink/56">Contact form</p>
        <h2 className="mt-3 text-[clamp(2rem,3vw,2.85rem)] font-medium leading-[1] tracking-[-0.045em] text-brand-ink">
          Send us your request
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-[1.56] text-brand-ink/68 md:text-[16px]">
          Give us as much context as possible about what you need. We will reply as quickly as we can.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="contact-first-name" className="mb-2 block text-[13px] font-medium text-brand-ink">
            First name
          </label>
          <input
            id="contact-first-name"
            name="firstName"
            autoComplete="given-name"
            placeholder="Enter your first name"
            className={inputClassName}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="contact-last-name" className="mb-2 block text-[13px] font-medium text-brand-ink">
            Last name
          </label>
          <input
            id="contact-last-name"
            name="lastName"
            autoComplete="family-name"
            placeholder="Enter your last name"
            className={inputClassName}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-email" className="mb-2 block text-[13px] font-medium text-brand-ink">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            autoComplete="email"
            type="email"
            placeholder="Enter your email"
            className={inputClassName}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-phone" className="mb-2 block text-[13px] font-medium text-brand-ink">
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            autoComplete="tel"
            type="tel"
            placeholder="Enter your phone number"
            className={inputClassName}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-service" className="mb-2 block text-[13px] font-medium text-brand-ink">
            Service
          </label>
          <select
            id="contact-service"
            name="service"
            className={inputClassName}
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-message" className="mb-2 block text-[13px] font-medium text-brand-ink">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Describe the job, address, preferred date, and any useful details"
            className={`${inputClassName} min-h-[160px] resize-y`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
          />
        </div>
      </div>

      <div className="mt-6 border-t border-black/8 pt-5">
        <p className="text-[13px] leading-6 text-brand-ink/54">
          An email or phone number is required so we can contact you after receiving your request.
        </p>

        <button
          disabled={loading}
          className="surface-lift mt-5 inline-flex min-h-[54px] w-full items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#366be8_0%,#2d5dd5_100%)] px-6 py-3 text-[16px] font-semibold text-white shadow-[0_16px_36px_rgba(54,107,232,0.24)] disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {status ? (
        <p
          aria-live="polite"
          className={`mt-4 rounded-[18px] px-4 py-3 text-[14px] leading-6 ${
            isSuccess ? "bg-brand-mint/18 text-brand-ink" : "bg-[#fff1f1] text-[#8f3131]"
          }`}
        >
          {status}
        </p>
      ) : null}
    </form>
  );
}
