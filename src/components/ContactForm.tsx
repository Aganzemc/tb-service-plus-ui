"use client";

import { FormEvent, useState } from "react";
import { createPublicMessage } from "@/services/messages.api";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await createPublicMessage({
        name,
        phone: phone || undefined,
        email: email || undefined,
        message,
      });
      setStatus("Message sent");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setStatus(typeof maybe?.message === "string" ? maybe.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-none space-y-5 rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)] md:p-7"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink/45">Contact form</p>
        <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.05em] text-brand-ink">Request a quote</h2>
        <p className="mt-2 text-[15px] leading-7 text-brand-ink/68">
          Send the key job details and we can follow up with the right next step.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-[15px] font-medium text-brand-ink">Name</label>
        <input
          placeholder="Your full name"
          className="w-full rounded-2xl border border-black/15 bg-brand-sand/25 px-4 py-3 text-[15px] text-brand-ink outline-none focus:-translate-y-0.5 focus:border-brand-primary/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(95,103,244,0.08)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-[15px] font-medium text-brand-ink">Phone</label>
        <input
          placeholder="Phone number"
          className="w-full rounded-2xl border border-black/15 bg-brand-sand/25 px-4 py-3 text-[15px] text-brand-ink outline-none focus:-translate-y-0.5 focus:border-brand-primary/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(95,103,244,0.08)]"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-2 block text-[15px] font-medium text-brand-ink">Email</label>
        <input
          placeholder="Email address"
          className="w-full rounded-2xl border border-black/15 bg-brand-sand/25 px-4 py-3 text-[15px] text-brand-ink outline-none focus:-translate-y-0.5 focus:border-brand-primary/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(95,103,244,0.08)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </div>
      <div>
        <label className="mb-2 block text-[15px] font-medium text-brand-ink">Message</label>
        <textarea
          placeholder="Tell us about the job, timing, location, and any useful details"
          className="w-full rounded-2xl border border-black/15 bg-brand-sand/25 px-4 py-3 text-[15px] text-brand-ink outline-none focus:-translate-y-0.5 focus:border-brand-primary/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(95,103,244,0.08)]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-black/8 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-brand-ink/55">We usually reply with the next step as quickly as possible.</p>
        <button
          disabled={loading}
          className="surface-lift rounded-2xl bg-brand-ink px-6 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(5,3,47,0.14)] disabled:opacity-50"
          type="submit"
        >
          {loading ? "Sending..." : "Send request"}
        </button>
      </div>

      {status ? <p className="text-[14px] text-brand-ink/75">{status}</p> : null}
    </form>
  );
}
