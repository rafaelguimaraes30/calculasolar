"use client";

import type { TarifaPageData } from "@/lib/tarifas/tarifasSeoData";
import { TarifaCard } from "./TarifaCard";
import { TarifaListTable } from "./TarifaDataTable";
import { useMemo, useState } from "react";

interface TarifasIndexClientProps {
  pages: TarifaPageData[];
  ufs: string[];
  regioes: string[];
}

export function TarifasIndexClient({
  pages,
  ufs,
  regioes,
}: TarifasIndexClientProps) {
  const [query, setQuery] = useState("");
  const [uf, setUf] = useState("");
  const [regiao, setRegiao] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = pages.filter((page) => {
      if (uf && page.uf !== uf) return false;
      if (regiao && page.regiao !== regiao) return false;
      if (!q) return true;
      return (
        page.distribuidora.toLowerCase().includes(q) ||
        page.uf.toLowerCase().includes(q) ||
        page.regiao.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) =>
      a.distribuidora.localeCompare(b.distribuidora, "pt-BR"),
    );
  }, [pages, query, uf, regiao]);

  return (
    <div>
      <div className="grid gap-4 rounded-2xl border border-navy-800/10 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
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
            {filtered.map((page) => (
              <TarifaCard key={page.slug} page={page} />
            ))}
          </div>
        ) : (
          <TarifaListTable pages={filtered} />
        )}
      </div>
    </div>
  );
}
