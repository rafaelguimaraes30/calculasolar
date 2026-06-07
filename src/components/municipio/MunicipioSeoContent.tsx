import { AdSlot } from "@/components/ads/AdSlot";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildMunicipioSeoSections } from "@/lib/seo/municipioContent";
import { buildSimuladorUrl } from "@/lib/seo/simuladorUrl";
import {
  calculateMunicipioSolarPreview,
  formatMunicipioPreview,
} from "@/lib/solar/municipioPreview";
import type { MunicipioSearchResult } from "@/lib/solar/municipiosData";
import Link from "next/link";

interface MunicipioSeoContentProps {
  municipio: MunicipioSearchResult;
}

export function MunicipioSeoContent({ municipio }: MunicipioSeoContentProps) {
  const preview = calculateMunicipioSolarPreview(municipio.nome, municipio.uf);
  const fmt = formatMunicipioPreview(preview);
  const sections = buildMunicipioSeoSections(municipio, preview, fmt);
  const simuladorUrl = buildSimuladorUrl(municipio.nome, municipio.uf);

  const stats = [
    { label: "GHI médio local", value: fmt.ghi },
    { label: "Geração 5 kWp/ano", value: fmt.geracaoAnual },
    { label: "Geração 5 kWp/mês", value: fmt.geracaoMensal },
    { label: "Economia anual est.", value: fmt.economiaAnual },
    { label: "Inclinação ideal", value: `${preview.tiltIdeal.toFixed(1)}°` },
    { label: "Orientação recomendada", value: "Norte" },
  ];

  return (
    <>
      <AdSlot
        position="top-banner"
        className="mx-auto mt-4 max-w-7xl px-4 h-20 sm:h-24"
      />

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <Breadcrumbs
                className="mb-6"
                items={[
                  { label: "Início", href: "/" },
                  { label: `Energia Solar em ${municipio.nome}` },
                ]}
              />

              <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                Energia Solar em {municipio.nome} — {municipio.uf}
              </h1>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-navy-800/10 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-navy-700/50">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-bold text-navy-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <AdSlot
                position="inline-content"
                className="my-8 h-20 sm:h-24"
              />

              <div className="space-y-8">
                {sections.map((section, i) => (
                  <section key={i}>
                    {section.heading && (
                      <h2 className="text-xl font-bold text-navy-900">
                        {section.heading}
                      </h2>
                    )}
                    {section.paragraphs.map((p, j) => (
                      <p
                        key={j}
                        className="mt-3 text-base leading-relaxed text-navy-700/80"
                      >
                        {p}
                      </p>
                    ))}
                  </section>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-solar-500/20 bg-solar-500/8 p-8 text-center">
                <p className="text-lg font-bold text-navy-900">
                  Simule para {municipio.nome}
                </p>
                <p className="mt-2 text-sm text-navy-700/70">
                  Dimensione seu sistema com consumo real, módulos e orientação do
                  telhado.
                </p>
                <Link
                  href={simuladorUrl}
                  className="mt-5 inline-flex rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-8 py-3 text-sm font-bold text-navy-900 shadow-lg shadow-solar-500/25 transition-all hover:scale-105"
                >
                  Simular Agora
                </Link>
              </div>

              <AdSlot
                position="after-results"
                className="mt-8 h-20 sm:h-24"
              />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <AdSlot position="sidebar" className="h-80" />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
