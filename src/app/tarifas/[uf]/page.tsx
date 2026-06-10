import { AdSlot } from "@/components/ads/AdSlot";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarifaInternalLinks } from "@/components/tarifas/TarifaInternalLinks";
import { TarifaListTable } from "@/components/tarifas/TarifaDataTable";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOrganizationJsonLd,
} from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import { parseUfSlug, toUfSlug } from "@/lib/tarifas/tarifasSlug";
import {
  getAllUfSlugs,
  getTarifaPagesByUf,
  getUfTarifaStats,
} from "@/lib/tarifas/tarifasSeoData";
import { getUfLabel } from "@/lib/tarifas/ufLabels";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ uf: string }>;
}

export async function generateStaticParams() {
  return getAllUfSlugs().map((uf) => ({ uf }));
}

export async function generateMetadata({ params }: PageProps) {
  const { uf: ufSlug } = await params;
  const uf = parseUfSlug(ufSlug);
  if (!uf) return {};

  const label = getUfLabel(uf);
  return buildPageMetadata({
    title: `Tarifas de Energia em ${label}`,
    description: `Confira os componentes tarifários das concessionárias de ${label}. Valores de referência de TE, TUSD, ICMS e PIS/COFINS.`,
    path: `/tarifas/${toUfSlug(uf)}`,
    keywords: ["tarifas energia", label, uf, "concessionárias"],
  });
}

export default async function TarifasUfPage({ params }: PageProps) {
  const { uf: ufSlug } = await params;
  const uf = parseUfSlug(ufSlug);
  if (!uf) notFound();

  const pages = getTarifaPagesByUf(uf);
  if (pages.length === 0) notFound();

  const stats = getUfTarifaStats(uf)!;
  const label = getUfLabel(uf);
  const pageUrl = `${SITE_URL}/tarifas/${toUfSlug(uf)}`;

  return (
    <>
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: `Tarifas de Energia em ${label}`,
          description: `Tarifas de energia elétrica das concessionárias de ${label}.`,
          url: pageUrl,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Início", item: SITE_URL },
          { name: "Tarifas", item: `${SITE_URL}/tarifas` },
          { name: label, item: pageUrl },
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
              items={[
                { label: "Início", href: "/" },
                { label: "Tarifas", href: "/tarifas" },
                { label: label },
              ]}
            />

            <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Tarifas de Energia em {label}
            </h1>
            <p className="mt-4 text-lg text-navy-700/70">
              {stats.count} concessionária(s) cadastradas em {uf}. Valores de
              referência com componentes tarifários da base oficial.
            </p>

            <div className="mt-8">
              <TarifaListTable pages={pages} />
            </div>

            <div className="mt-10">
              <TarifaInternalLinks uf={uf} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
