import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CalculaSolar — Simule painéis solares para sua casa ou negócio",
  description:
    "Descubra quantos painéis solares você precisa. Simule gratuitamente a geração de energia solar com dados reais de irradiação do Brasil.",
  keywords: [
    "energia solar",
    "painéis solares",
    "simulador solar",
    "economia de energia",
    "fotovoltaico",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
