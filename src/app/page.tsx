import { AdSlot } from "@/components/ads/AdSlot";
import { Benefits } from "@/components/home/Benefits";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Navbar } from "@/components/home/Navbar";
import { SolarSimulation } from "@/components/home/SolarSimulation";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    description:
      "Simulador gratuito de energia solar com dados reais para todo o Brasil.",
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <main>
        <AdSlot position="top-banner" className="mx-auto max-w-7xl px-4 pt-4 h-20 sm:h-24" />
        <Hero />
        <Benefits />
        <AdSlot position="inline-content" className="mx-auto max-w-7xl px-4 h-20 sm:h-24" />
        <HowItWorks />
        <SolarSimulation />
      </main>
      <Footer />
    </>
  );
}
