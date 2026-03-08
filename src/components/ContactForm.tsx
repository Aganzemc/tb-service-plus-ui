"use client";

import { FormEvent, useState } from "react";
import { createPublicMessage } from "@/services/messages.api";

const SERVICE_OPTIONS = [
  "Demenagement",
  "Nettoyage",
  "Livraison",
  "Debarras",
  "Deneigement",
  "Autre demande",
] as const;

const inputClassName =
  "w-full rounded-[16px] border border-black/10 bg-[#fcfcfa] px-5 py-3.5 text-[18px] leading-[1.35] text-brand-ink outline-none placeholder:text-brand-ink/38 focus:-translate-y-0.5 focus:border-brand-primary/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(95,103,244,0.08)]";

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
      setStatus("Ajoutez au moins un email ou un telephone pour que nous puissions vous recontacter.");
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

      setStatus("Votre message a bien ete envoye.");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setService("");
      setMessage("");
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setStatus(typeof maybe?.message === "string" ? maybe.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const isSuccess = status === "Votre message a bien ete envoye.";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.1)] md:p-8"
    >
      <div>
        <p className="text-[15px] font-medium tracking-[-0.01em] text-brand-ink/56">Formulaire de contact</p>
        <h2 className="mt-4 text-[clamp(2.4rem,3.5vw,3.4rem)] font-medium leading-[0.97] tracking-[-0.05em] text-brand-ink">
          Envoyez-nous votre demande
        </h2>
        <p className="mt-4 max-w-2xl text-[18px] leading-[1.58] text-brand-ink/68">
          Donnez-nous un maximum de contexte sur votre besoin. Nous vous repondrons dans les plus brefs delais.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="contact-first-name" className="mb-2 block text-[15px] font-medium text-brand-ink">
            Prenom
          </label>
          <input
            id="contact-first-name"
            name="firstName"
            autoComplete="given-name"
            placeholder="Entrez votre prenom"
            className={inputClassName}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="contact-last-name" className="mb-2 block text-[15px] font-medium text-brand-ink">
            Nom
          </label>
          <input
            id="contact-last-name"
            name="lastName"
            autoComplete="family-name"
            placeholder="Entrez votre nom"
            className={inputClassName}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-email" className="mb-2 block text-[15px] font-medium text-brand-ink">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            autoComplete="email"
            type="email"
            placeholder="Entrez votre email"
            className={inputClassName}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-phone" className="mb-2 block text-[15px] font-medium text-brand-ink">
            Telephone
          </label>
          <input
            id="contact-phone"
            name="phone"
            autoComplete="tel"
            type="tel"
            placeholder="Entrez votre numero de telephone"
            className={inputClassName}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-service" className="mb-2 block text-[15px] font-medium text-brand-ink">
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
            <option value="">Selectionnez un service</option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contact-message" className="mb-2 block text-[15px] font-medium text-brand-ink">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Precisez le besoin, l'adresse, la date souhaitee et tout detail utile"
            className={`${inputClassName} min-h-[160px] resize-y`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
          />
        </div>
      </div>

      <div className="mt-6 border-t border-black/8 pt-5">
        <p className="text-[14px] leading-6 text-brand-ink/54">
          L&apos;email ou le telephone est necessaire pour que nous puissions vous recontacter apres reception de votre
          demande.
        </p>

        <button
          disabled={loading}
          className="surface-lift mt-5 inline-flex min-h-[56px] w-full items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#366be8_0%,#2d5dd5_100%)] px-6 py-3 text-[18px] font-semibold text-white shadow-[0_16px_36px_rgba(54,107,232,0.24)] disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          {loading ? "Envoi en cours..." : "Envoyer"}
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
