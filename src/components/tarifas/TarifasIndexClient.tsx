"use client";

import { TarifaCard } from "./TarifaCard";
import { TarifaListTable } from "./TarifaDataTable";
import { useMemo, useState } from "react";

export interface TarifaIndexItem {
  slug: string;
  distribuidora: string;
  uf: string;
  regiao: string;
  tarifa: number;
}

interface TarifasIndexClientProps {
  items: TarifaIndexItem[];
  ufs: string[];
  regioes: string[];
}

type SortMode = "az" | "tarifa-asc" | "tarifa-desc";

export function TarifasIndexClient({
  items,
  ufs,
  regioes,
}: TarifasIndexClientProps) {
  const [query, setQuery] = useState("");
  const [uf, setUf] = useState("");
  const [regiao, setRegiao] = useState("");
  const [sort, setSort] = useState<SortMode>("az");
  const [view, setView] = useState<"cards" | "table">("cards");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((item) => {
      if (uf && item.uf !== uf) return false;
      if (regiao && item.regiao !== regiao) return false;
      if (!q) return true;
      return (
        item.distribuidora.toLowerCase().includes(q) ||
        item.uf.toLowerCase().includes(q) ||
        item.regiao.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      if (sort === "tarifa-asc") return a.tarifa - b.tarifa;
      if (sort === "tarifa-desc") return b.tarifa - a.tarifa;
      return a.distribuidora.localeCompare(b.distribuidora, "pt-BR");
    });

    return list;
  }, [items, query, uf, regiao, sort]);

  const cardPages = filtered.map((item) => ({
    slug: item.slug,
    distribuidora: item.distribuidora,
    uf: item.uf,
    regiao: item.regiao,
    sourceKey: "",
    record: {
      distribuidora: item.distribuidora,
      uf: item.uf,
      regiao: item.regiao,
      subgrupo: "",
      classe: "",
      vigencia: "",
      te_rs_kwh: 0,
      tusd_rs_kwh: 0,
      tarifa_base_rs_kwh: 0,
      icms: 0,
      pis_cofins: 0,
      tarifa_estimada_final_rs_kwh: item.tarifa,
    },
    variants: [],
  }));

  return (
    <div>
      <div className="grid gap-4 rounded-2xl border border-navy-800/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar concessionária..."
          className="rounded-xl border border-navy-800/10 px-4 py-2.5 text-sm outline-none focus:border-solar-500/50"
        />
        <select
          value={uf}
          onChange={(e) => setUf(e.target.value)}
          className="rounded-xl border border-navy-800/10 px-4 py-2.5 text-sm outline-none focus:border-solar-500/50"
        >
          <option value="">Todas as UFs</option>
          {ufs.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <select
          value={regiao}
          onChange={(e) => setRegiao(e.target.value)}
          className="rounded-xl border border-navy-800/10 px-4 py-2.5 text-sm outline-none focus:border-solar-500/50"
        >
          <option value="">Todas as regiões</option>
          {regioes.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="rounded-xl border border-navy-800/10 px-4 py-2.5 text-sm outline-none focus:border-solar-500/50"
        >
          <option value="az">Ordem alfabética</option>
          <option value="tarifa-asc">Menor tarifa</option>
          <option value="tarifa-desc">Maior tarifa</option>
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-navy-700/60">
        <span>{filtered.length} concessionária(s) encontrada(s)</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("cards")}
            className={`rounded-full px-3 py-1 ${view === "cards" ? "bg-solar-500/20 text-navy-900" : ""}`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            className={`rounded-full px-3 py-1 ${view === "table" ? "bg-solar-500/20 text-navy-900" : ""}`}
          >
            Tabela
          </button>
        </div>
      </div>

      <div className="mt-6">
        {view === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {cardPages.map((page) => (
              <TarifaCard key={page.slug} page={page} />
            ))}
          </div>
        ) : (
          <TarifaListTable pages={cardPages} />
        )}
      </div>
    </div>
  );
}
