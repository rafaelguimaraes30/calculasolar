import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { MunicipioSeoContent } from "@/components/municipio/MunicipioSeoContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildMunicipioArticleJsonLd,
} from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import {
  calculateMunicipioSolarPreview,
  formatMunicipioPreview,
} from "@/lib/solar/municipioPreview";
import {
  findMunicipioBySlug,
  getPriorityMunicipioSlugs,
  isMunicipioPageExcluded,
} from "@/lib/solar/municipiosData";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** ISR: páginas geradas sob demanda e mantidas em cache (24 h) */
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getPriorityMunicipioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (isMunicipioPageExcluded(slug)) return {};
  const municipio = findMunicipioBySlug(slug);
  if (!municipio) return {};

  const preview = calculateMunicipioSolarPreview(municipio.nome, municipio.uf);
  const fmt = formatMunicipioPreview(preview);

  return buildPageMetadata({
    title: `Energia Solar em ${municipio.nome} — ${municipio.uf}`,
    description: `Potencial solar em ${municipio.nome}-${municipio.uf}. Geração de ${fmt.geracaoAnual} com 5 kWp e economia de ${fmt.economiaAnual}. Simule grátis.`,
    path: `/energia-solar-em/${slug}`,
    keywords: [
      "energia solar",
      municipio.nome,
      municipio.uf,
      "painéis solares",
      "fotovoltaico",
      "simulador solar",
    ],
  });
}

export default async function MunicipioSolarPage({ params }: PageProps) {
  const { slug } = await params;
  if (isMunicipioPageExcluded(slug)) notFound();
  const municipio = findMunicipioBySlug(slug);
  if (!municipio) notFound();

  const preview = calculateMunicipioSolarPreview(municipio.nome, municipio.uf);
  const fmt = formatMunicipioPreview(preview);
  const pageUrl = `${SITE_URL}/energia-solar-em/${slug}`;

  const description = `Potencial solar em ${municipio.nome}-${municipio.uf}. Geração estimada de ${fmt.geracaoAnual} com 5 kWp.`;

  const jsonLd = buildMunicipioArticleJsonLd({
    nome: municipio.nome,
    uf: municipio.uf,
    pageUrl,
    description,
    latitude: municipio.latitude,
    longitude: municipio.longitude,
  });

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Início", item: SITE_URL },
    { name: `Energia Solar em ${municipio.nome}`, item: pageUrl },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      <Navbar />
      <main>
        <MunicipioSeoContent municipio={municipio} />
      </main>
      <Footer />
    </>
  );
}
