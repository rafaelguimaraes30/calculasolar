import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { defaultSiteMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...defaultSiteMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
