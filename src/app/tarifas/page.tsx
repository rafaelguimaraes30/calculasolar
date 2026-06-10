import { AdSlot } from "@/components/ads/AdSlot";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarifasIndexClient } from "@/components/tarifas/TarifasIndexClient";
import { TarifaInternalLinks } from "@/components/tarifas/TarifaInternalLinks";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOrganizationJsonLd,
} from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import { getAllTarifaPages } from "@/lib/tarifas/tarifasSeoData";

export const metadata = buildPageMetadata({
  title: "Concessionárias de Energia do Brasil",
  description:
    "Conheça as concessionárias de energia elétrica brasileiras e acesse informações institucionais sobre cada distribuidora.",
  path: "/tarifas",
  keywords: [
    "concessionárias de energia",
    "distribuidoras",
    "energia elétrica",
    "ANEEL",
  ],
});

export default function TarifasIndexPage() {
  const pages = getAllTarifaPages();
  const pageUrl = `${SITE_URL}/tarifas`;

  const ufs = [...new Set(pages.map((p) => p.uf))].sort();
  const regioes = [...new Set(pages.map((p) => p.regiao))].sort();

  return (
    <>
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Tarifas de Energia Elétrica no Brasil",
          description:
            "Tarifas de energia elétrica por concessionária, UF e região no Brasil.",
          url: pageUrl,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Início", item: SITE_URL },
          { name: "Tarifas", item: pageUrl },
        ])}
      />
      <JsonLd data={buildOrganizationJsonLd()} />
      <Navbar />
      <main className="bg-background">
        <AdSlot position="top-banner" className="mx-auto mt-4 max-w-7xl px-4 h-20 sm:h-24" />
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              className="mb-6"
              items={[{ label: "Início", href: "/" }, { label: "Concessionárias" }]}
            />
            <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Concessionárias de Energia Elétrica do Brasil
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-navy-700/70">
              Consulte as concessionárias de energia elétrica do Brasil. Filtre
              por UF, região ou nome e acesse informações institucionais sobre
              cada distribuidora.
            </p>

            <div className="mt-8">
              <TarifasIndexClient pages={pages} ufs={ufs} regioes={regioes} />
            </div>

            <div className="mt-10">
              <TarifaInternalLinks />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
