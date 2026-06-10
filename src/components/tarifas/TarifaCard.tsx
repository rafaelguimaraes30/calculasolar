import type { TarifaPageData } from "@/lib/tarifas/tarifasSeoData";
import Link from "next/link";

interface TarifaCardProps {
  page: TarifaPageData;
}

export function TarifaCard({ page }: TarifaCardProps) {
  return (
    <article className="rounded-2xl border border-navy-800/10 bg-white p-6 shadow-sm transition-all hover:border-solar-500/30 hover:shadow-md">
      <div>
        <h2 className="text-lg font-bold text-navy-900">{page.distribuidora}</h2>
        <p className="mt-1 text-sm text-navy-700/60">
          {page.uf} · {page.regiao}
        </p>
      </div>
      <Link
        href={`/tarifa/${page.slug}`}
        className="mt-4 inline-flex rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-5 py-2 text-sm font-bold text-navy-900 transition-all hover:scale-105"
      >
        Ver detalhes
      </Link>
    </article>
  );
}
