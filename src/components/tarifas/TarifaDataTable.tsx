import {
  formatPercent,
  formatTarifaRsKwh,
  type TarifaPageData,
} from "@/lib/tarifas/tarifasSeoData";
import Link from "next/link";

interface TarifaDataTableProps {
  page: TarifaPageData;
}

export function TarifaDataTable({ page }: TarifaDataTableProps) {
  const { record } = page;
  const rows = [
    ["Distribuidora", page.distribuidora],
    ["UF", page.uf],
    ["Região", page.regiao],
    ["Classe", record.classe],
    ["Subgrupo", record.subgrupo],
    ["TE", formatTarifaRsKwh(record.te_rs_kwh)],
    ["TUSD", formatTarifaRsKwh(record.tusd_rs_kwh)],
    ["Tarifa Base", formatTarifaRsKwh(record.tarifa_base_rs_kwh)],
    ["ICMS", formatPercent(record.icms)],
    ["PIS/COFINS", formatPercent(record.pis_cofins)],
    [
      "Tarifa Estimada Final",
      formatTarifaRsKwh(record.tarifa_estimada_final_rs_kwh),
    ],
    ["Vigência", record.vigencia],
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-800/10 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-navy-800/5 last:border-0">
              <th className="whitespace-nowrap bg-navy-800/3 px-4 py-3 font-semibold text-navy-900">
                {label}
              </th>
              <td className="px-4 py-3 text-navy-700/80">
                {label === "Distribuidora" ? (
                  <Link
                    href={`/tarifa/${page.slug}`}
                    className="font-medium text-solar-600 hover:text-solar-600/80"
                  >
                    {value}
                  </Link>
                ) : (
                  value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TarifaListTableProps {
  pages: TarifaPageData[];
}

export function TarifaListTable({ pages }: TarifaListTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-navy-800/10 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-navy-800/3 text-xs uppercase tracking-wider text-navy-700/60">
          <tr>
            <th className="px-4 py-3">Distribuidora</th>
            <th className="px-4 py-3">UF</th>
            <th className="px-4 py-3">Região</th>
            <th className="px-4 py-3">Tarifa estimada</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.slug} className="border-t border-navy-800/5">
              <td className="px-4 py-3 font-medium text-navy-900">
                {page.distribuidora}
              </td>
              <td className="px-4 py-3">{page.uf}</td>
              <td className="px-4 py-3">{page.regiao}</td>
              <td className="px-4 py-3 font-semibold text-solar-600">
                {formatTarifaRsKwh(page.record.tarifa_estimada_final_rs_kwh)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/tarifa/${page.slug}`}
                  className="font-medium text-solar-600 hover:text-solar-600/80"
                >
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
