"use client";

import type { TariffLookupResult } from "@/lib/solar/tariffData";
import { Loader2, Receipt } from "lucide-react";

interface TariffPreviewBadgeProps {
  lookup: TariffLookupResult | null;
  loading?: boolean;
}

export function TariffPreviewBadge({ lookup, loading }: TariffPreviewBadgeProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-navy-800/10 bg-white/80 px-4 py-3 text-sm text-navy-700/60 animate-fade-in">
        <Loader2 className="h-4 w-4 animate-spin text-solar-600" />
        Consultando tarifa média do estado...
      </div>
    );
  }

  if (!lookup) return null;

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm animate-fade-in sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-blue-600" />
        <span className="font-semibold text-navy-900">
          Tarifa {lookup.estado}: R${" "}
          {lookup.tarifaKwh.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          /kWh
        </span>
      </div>
      <p className="text-xs text-navy-700/60">{lookup.mensagem}</p>
    </div>
  );
}
