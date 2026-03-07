"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";

export default function PageLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/page/admin")) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
