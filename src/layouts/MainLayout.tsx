"use client";

import { useEffect, useState, type ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { listPublicSettings } from "@/services/settings.api";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/types/site-settings";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let mounted = true;

    listPublicSettings()
      .then((data) => {
        if (!mounted) return;
        setSettings(data);
      })
      .catch(() => {
        if (!mounted) return;
        setSettings(DEFAULT_SITE_SETTINGS);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="public-site min-h-screen">
      <Navbar settings={settings} />
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-12 pt-[104px] md:px-6 md:pb-16 md:pt-[112px]">
        <div className="page-enter">{children}</div>
      </div>
      <Footer settings={settings} />
    </div>
  );
}
