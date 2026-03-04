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
      setStatus("Message envoyé");
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
    <form onSubmit={onSubmit} className="max-w-lg space-y-3">
      <div>
        <label className="block text-sm">Nom</label>
        <input className="w-full rounded border border-black/20 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Téléphone</label>
        <input className="w-full rounded border border-black/20 px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Email</label>
        <input className="w-full rounded border border-black/20 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      </div>
      <div>
        <label className="block text-sm">Message</label>
        <textarea className="w-full rounded border border-black/20 px-3 py-2" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
      </div>
      <button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50" type="submit">
        {loading ? "Envoi..." : "Envoyer"}
      </button>
      {status ? <p className="text-sm">{status}</p> : null}
    </form>
  );
}
