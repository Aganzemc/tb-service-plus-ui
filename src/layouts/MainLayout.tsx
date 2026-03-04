import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
      <Footer />
    </div>
  );
}
