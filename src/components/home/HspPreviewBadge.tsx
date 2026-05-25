"use client";

import { getHspSourceLabel, type HspLookupResult } from "@/lib/solar/solarData";
import { Loader2, Sun } from "lucide-react";

interface HspPreviewBadgeProps {
  lookup: HspLookupResult | null;
  loading?: boolean;
}

export function HspPreviewBadge({ lookup, loading }: HspPreviewBadgeProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-navy-800/10 bg-white/80 px-4 py-3 text-sm text-navy-700/60 animate-fade-in">
        <Loader2 className="h-4 w-4 animate-spin text-solar-600" />
        Buscando irradiação solar da região...
      </div>
    );
  }

  if (!lookup) return null;

  const sourceColors: Record<HspLookupResult["source"], string> = {
    cidade: "border-emerald-500/30 bg-emerald-500/8",
    estado: "border-amber-500/30 bg-amber-500/8",
    nacional: "border-navy-800/15 bg-slate-50",
  };

  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border px-4 py-3 text-sm animate-fade-in sm:flex-row sm:items-center sm:justify-between ${sourceColors[lookup.source]}`}
    >
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-solar-600" />
        <span className="font-semibold text-navy-900">
          HSP:{" "}
          {lookup.hsp.toLocaleString("pt-BR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}{" "}
          h/dia
        </span>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-navy-700/70">
          {getHspSourceLabel(lookup.source)}
        </span>
      </div>
      <p className="text-xs text-navy-700/65 sm:max-w-[55%] sm:text-right">{lookup.mensagem}</p>
    </div>
  );
}
