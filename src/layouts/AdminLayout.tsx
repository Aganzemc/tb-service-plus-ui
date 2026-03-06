"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="w-full border-b border-black/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/page/admin/dashboard" className="font-semibold">
            Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/page/admin/services">Services</Link>
            <Link href="/page/admin/messages">Messages</Link>
            <button className="underline" onClick={logout} type="button">
              Deconnexion
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
    </div>
  );
}
