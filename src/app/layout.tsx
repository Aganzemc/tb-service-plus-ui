import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const publicBodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-public-body",
  display: "swap",
});

const publicDisplayFont = Manrope({
  subsets: ["latin"],
  variable: "--font-public-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TB Service Plus",
  description: "TB Service Plus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${publicBodyFont.variable} ${publicDisplayFont.variable}`}>{children}</body>
    </html>
  );
}
