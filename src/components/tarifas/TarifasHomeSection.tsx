import { getFeaturedTarifaPages } from "@/lib/tarifas/tarifasSeoData";
import { TarifaCard } from "./TarifaCard";
import Link from "next/link";

export function TarifasHomeSection() {
  const featured = getFeaturedTarifaPages(8);

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
              Concessionárias de Energia
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-navy-700/70">
              Conheça as principais concessionárias de energia elétrica do Brasil.
            </p>
          </div>
          <Link
            href="/tarifas"
            className="inline-flex rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-6 py-2.5 text-sm font-bold text-navy-900 transition-all hover:scale-105"
          >
            Ver todas as concessionárias
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((page) => (
            <TarifaCard key={page.slug} page={page} />
          ))}
        </div>
      </div>
    </section>
  );
}
