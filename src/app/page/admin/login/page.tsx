"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/page/admin/dashboard");
    } catch (err: unknown) {
      const maybe = err as { message?: unknown } | null;
      setError(typeof maybe?.message === "string" ? maybe.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Admin - Connexion</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input className="w-full rounded border border-black/20 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="block text-sm">Mot de passe</label>
          <input className="w-full rounded border border-black/20 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50" type="submit">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}
