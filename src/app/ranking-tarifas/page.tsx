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
import { getTarifaRanking } from "@/lib/tarifas/tarifasSeoData";

export const metadata = buildPageMetadata({
  title: "Ranking Nacional de Tarifas de Energia",
  description:
    "Consulte concessionárias de energia elétrica do Brasil por região. Valores de referência de TE, TUSD e componentes tarifários.",
  path: "/ranking-tarifas",
  keywords: [
    "ranking tarifas",
    "tarifa energia brasil",
    "concessionárias",
    "TE TUSD",
  ],
});

export default function RankingTarifasPage() {
  const ranking = getTarifaRanking();
  const pageUrl = `${SITE_URL}/ranking-tarifas`;

  return (
    <>
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Ranking Nacional de Tarifas de Energia",
          description:
            "Concessionárias de energia elétrica no Brasil por região.",
          url: pageUrl,
        })}
      />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Início", item: SITE_URL },
          { name: "Tarifas", item: `${SITE_URL}/tarifas` },
          { name: "Ranking", item: pageUrl },
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
                { label: "Ranking Nacional" },
              ]}
            />

            <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Ranking Nacional de Tarifas de Energia
            </h1>
            <p className="mt-4 text-lg text-navy-700/70">
              Concessionárias de energia elétrica no Brasil, organizadas por
              região.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-navy-800/10 bg-white p-6 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-navy-700/50">
                  Total de concessionárias
                </p>
                <p className="mt-2 text-2xl font-bold text-solar-600">
                  {ranking.total}
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-navy-800/20 bg-white p-6 text-sm text-navy-700/60">
                Mapa estatístico regional preparado para futura integração
                visual interativa.
              </div>
            </div>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-navy-800/10 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-navy-800/3 text-xs uppercase tracking-wider text-navy-700/60">
                  <tr>
                    <th className="px-4 py-3">Região</th>
                    <th className="px-4 py-3">Concessionárias</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.countPorRegiao.map((row) => (
                    <tr key={row.regiao} className="border-t border-navy-800/5">
                      <td className="px-4 py-3 font-medium">{row.regiao}</td>
                      <td className="px-4 py-3">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-10 text-xl font-bold text-navy-900">
              Todas as concessionárias
            </h2>
            <div className="mt-4">
              <TarifaListTable pages={ranking.todasConcessionarias} />
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
