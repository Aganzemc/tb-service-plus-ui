"use client";

import { FormEvent, useState } from "react";
import { createPublicMessage } from "@/services/messages.api";

const inputClassName =
  "w-full rounded-[16px] border border-[#d6dced] bg-[#f8faff] px-4 py-3 text-[16px] leading-[1.4] text-brand-ink outline-none placeholder:text-brand-ink/34 focus:border-brand-primary/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(95,103,244,0.08)]";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus(null);

    if (!name.trim()) {
      setStatus("Add your name so we know who to contact.");
      return;
    }

    if (!phone.trim() && !email.trim()) {
      setStatus("Add at least an email or phone number so we can get back to you.");
      return;
    }

    setLoading(true);

    try {
      const composedMessage = [subject.trim() ? `Subject: ${subject.trim()}` : "", message.trim()].filter(Boolean).join("\n\n");

      await createPublicMessage({
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        message: composedMessage,
      });

      setStatus("Your message has been sent.");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error: unknown) {
      const maybe = error as { message?: unknown } | null;
      setStatus(typeof maybe?.message === "string" ? maybe.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const isSuccess = status === "Your message has been sent.";

  return (
    <form onSubmit={onSubmit} className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,52,0.08)] md:p-7">
      <div className="flex items-center gap-4">
        <span className="flex h-13 w-13 items-center justify-center rounded-full border border-brand-primary/18 bg-brand-primary/8 text-brand-primary">
          <MailIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-brand-primary/72">Write to us</p>
          <h2 className="public-subtitle mt-2 text-brand-ink">Send your message</h2>
        </div>
      </div>

      <p className="public-copy mt-4 text-brand-ink/68">
        Share the job details, address context, and timing. We will respond with the next step as quickly as possible.
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-[13px] font-semibold text-brand-ink/78">
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
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contact-name" className="mb-2 block text-[13px] font-semibold text-brand-ink/78">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Enter your name"
            className={inputClassName}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="mb-2 block text-[13px] font-semibold text-brand-ink/78">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            placeholder="Service or request topic"
            className={inputClassName}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-2 block text-[13px] font-semibold text-brand-ink/78">
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
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-message" className="mb-2 block text-[13px] font-semibold text-brand-ink/78">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Describe the service, address, preferred date, and any useful details"
            className={`${inputClassName} min-h-[210px] resize-y py-3`}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={8}
            required
          />
        </div>
      </div>

      <div className="mt-6 border-t border-black/8 pt-5">
        <p className="text-[13px] leading-6 text-brand-ink/56">
          An email or phone number is required so we can contact you after receiving your request.
        </p>

        <button
          disabled={loading}
          className="mt-5 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-[18px] bg-brand-primary px-6 py-3 text-[16px] font-semibold text-white shadow-[0_16px_34px_rgba(36,81,209,0.24)] disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          <SendIcon className="h-4 w-4" />
          {loading ? "Sending..." : "Send the message"}
        </button>
      </div>

      {status ? (
        <p
          aria-live="polite"
          className={`mt-4 rounded-[18px] px-4 py-3 text-[14px] leading-6 ${
            isSuccess ? "bg-brand-primary/10 text-brand-ink" : "bg-[#eef3ff] text-brand-ink"
          }`}
        >
          {status}
        </p>
      ) : null}
    </form>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4.5 7l7.5 5.7L19.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M17 3L9.2 10.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 3l-5 14-2.8-6.2L3 8l14-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
