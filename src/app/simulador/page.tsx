import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { SimuladorClient } from "@/components/simulador/SimuladorClient";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildSimuladorFaqJsonLd,
  buildSoftwareApplicationJsonLd,
} from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import { toMunicipioSlug } from "@/lib/seo/slug";
import { isMunicipioPageExcluded } from "@/lib/solar/municipiosData";

interface PageProps {
  searchParams: Promise<{
    cidade?: string;
    uf?: string;
    consumo?: string;
  }>;
}

export const metadata = buildPageMetadata({
  title: "Simulador de Energia Solar",
  description:
    "Simule painéis solares para sua casa ou negócio com tarifa e módulos fotovoltaicos da sua região.",
  path: "/simulador",
  keywords: ["simulador solar", "energia solar", "painéis fotovoltaicos"],
});

export default async function SimuladorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cidade = params.cidade?.trim() ?? "";
  const estado = params.uf?.trim().toUpperCase() ?? "SP";
  const consumo = params.consumo?.trim();

  const breadcrumbItems: BreadcrumbItem[] = [{ label: "Início", href: "/" }];
  if (cidade && estado) {
    const municipioSlug = toMunicipioSlug(cidade, estado);
    breadcrumbItems.push({
      label: `Energia Solar em ${cidade}`,
      href: isMunicipioPageExcluded(municipioSlug)
        ? undefined
        : `/energia-solar-em/${municipioSlug}`,
    });
  }
  breadcrumbItems.push({ label: "Simulador" });

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Início", item: SITE_URL },
    ...(cidade && estado
      ? [{ name: `Energia Solar em ${cidade}` }]
      : []),
    { name: "Simulador", item: `${SITE_URL}/simulador` },
  ]);

  return (
    <>
      <JsonLd data={buildSoftwareApplicationJsonLd()} />
      <JsonLd data={buildSimuladorFaqJsonLd()} />
      <JsonLd data={breadcrumbLd} />
      <Navbar />
      <main>
        <div className="bg-background pt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs className="mb-4" items={breadcrumbItems} />
          </div>
        </div>
        <SimuladorClient
          initial={{
            cidade,
            estado,
            consumo,
          }}
        />
      </main>
      <Footer />
    </>
  );
}
