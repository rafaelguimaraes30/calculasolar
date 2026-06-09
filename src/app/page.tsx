import { AdSlot } from "@/components/ads/AdSlot";
import { Benefits } from "@/components/home/Benefits";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Navbar } from "@/components/home/Navbar";
import { RecentNews } from "@/components/home/RecentNews";
import { SimuladorClient } from "@/components/simulador/SimuladorClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonLd";
import { defaultSiteMetadata } from "@/lib/seo/metadata";

export const metadata = defaultSiteMetadata();

export default function Home() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildOrganizationJsonLd()} />
      <Navbar />
      <main>
        <AdSlot position="top-banner" className="mx-auto max-w-7xl px-4 pt-4 h-20 sm:h-24" />
        <Hero />
        <Benefits />
        <AdSlot position="inline-content" className="mx-auto max-w-7xl px-4 h-20 sm:h-24" />
        <HowItWorks />
        <SimuladorClient initial={{}} />
        <RecentNews />
      </main>
      <Footer />
    </>
  );
}
