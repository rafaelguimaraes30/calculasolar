"use client";

import { capitalizeWords } from "@/lib/solar/format";
import { MapPin } from "lucide-react";

interface CityPreviewBadgeProps {
  cidade: string;
  estado: string;
}

export function CityPreviewBadge({ cidade, estado }: CityPreviewBadgeProps) {
  const trimmed = cidade.trim();
  if (!trimmed) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-solar-500/25 bg-solar-500/8 px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-solar-500/20">
        <MapPin className="h-4 w-4 text-solar-600" />
      </span>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-navy-700/50">
          Localização selecionada
        </p>
        <p className="text-sm font-semibold text-navy-900">
          {capitalizeWords(trimmed)} — {estado}
        </p>
      </div>
    </div>
  );
}
