import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-12 pt-4 md:px-6 md:pb-16 md:pt-6">
        <div className="page-enter">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
