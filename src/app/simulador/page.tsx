import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { SimuladorClient } from "@/components/simulador/SimuladorClient";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/seo/Breadcrumbs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { toMunicipioSlug } from "@/lib/seo/slug";

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
    "Simule painéis solares para sua casa ou negócio com dados reais de GHI, tarifa e módulos fotovoltaicos.",
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
    breadcrumbItems.push({
      label: `Energia Solar em ${cidade}`,
      href: `/energia-solar-em/${toMunicipioSlug(cidade, estado)}`,
    });
  }
  breadcrumbItems.push({ label: "Simulador" });

  return (
    <>
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
