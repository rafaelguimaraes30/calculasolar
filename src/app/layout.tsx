import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { defaultSiteMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
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
    <html
      lang="pt-BR"
      className={`${plusJakarta.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen antialiased">
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
