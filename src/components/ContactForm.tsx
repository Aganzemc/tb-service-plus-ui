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
      setStatus("Message envoye");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setStatus(typeof maybe?.message === "string" ? maybe.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_18px_40px_rgba(5,3,47,0.06)]">
      <div>
        <label className="mb-2 block text-[15px] font-medium text-brand-ink">Nom</label>
        <input
          className="w-full rounded-2xl border border-black/15 px-4 py-3 text-[15px] text-brand-ink outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-[15px] font-medium text-brand-ink">Telephone</label>
        <input
          className="w-full rounded-2xl border border-black/15 px-4 py-3 text-[15px] text-brand-ink outline-none"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-2 block text-[15px] font-medium text-brand-ink">Email</label>
        <input
          className="w-full rounded-2xl border border-black/15 px-4 py-3 text-[15px] text-brand-ink outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </div>
      <div>
        <label className="mb-2 block text-[15px] font-medium text-brand-ink">Message</label>
        <textarea
          className="w-full rounded-2xl border border-black/15 px-4 py-3 text-[15px] text-brand-ink outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
        />
      </div>
      <button
        disabled={loading}
        className="rounded-2xl bg-brand-ink px-5 py-3 text-[15px] font-semibold text-white disabled:opacity-50"
        type="submit"
      >
        {loading ? "Envoi..." : "Envoyer"}
      </button>
      {status ? <p className="text-[14px] text-brand-ink/75">{status}</p> : null}
    </form>
  );
}
