import { getTarifaPagesByUf } from "@/lib/tarifas/tarifasSeoData";
import Link from "next/link";

interface MunicipioTarifaBlockProps {
  uf: string;
  cidade: string;
}

export function MunicipioTarifaBlock({ uf, cidade }: MunicipioTarifaBlockProps) {
  const pages = getTarifaPagesByUf(uf);
  if (pages.length === 0) return null;

  const featured = pages[0];

  return (
    <section className="mt-8 rounded-2xl border border-navy-800/10 bg-white p-6">
      <h2 className="text-lg font-bold text-navy-900">
        Concessionária da região — {cidade}, {uf}
      </h2>
      <p className="mt-2 text-sm text-navy-700/70">
        Distribuidora de energia: <strong>{featured.distribuidora}</strong>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/tarifa/${featured.slug}`}
          className="inline-flex rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-5 py-2 text-sm font-bold text-navy-900 transition-all hover:scale-105"
        >
          Ver detalhes
        </Link>
        <Link
          href={`/tarifas/${uf.toLowerCase()}`}
          className="inline-flex rounded-full border border-navy-800/15 px-5 py-2 text-sm font-semibold text-navy-800 hover:border-solar-500/40"
        >
          Todas as concessionárias em {uf}
        </Link>
      </div>
    </section>
  );
}
