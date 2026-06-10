"use client";

import {
  ORIENTACOES_TELHADO,
  type OrientacaoTelhadoOption,
} from "@/lib/solar/orientation";
import type { RoofOrientation } from "@/types/solar";
import { Compass, Home } from "lucide-react";

interface RoofOrientationPickerProps {
  value: RoofOrientation;
  onChange: (value: RoofOrientation) => void;
  error?: string;
}

const DESTAQUE_STYLES: Record<
  NonNullable<OrientacaoTelhadoOption["destaque"]>,
  { ring: string; badge: string }
> = {
  melhor: {
    ring: "ring-solar-500/60",
    badge: "bg-solar-500 text-navy-900",
  },
  boa: {
    ring: "ring-emerald-500/40",
    badge: "bg-emerald-500/15 text-emerald-700",
  },
  moderada: {
    ring: "ring-amber-500/40",
    badge: "bg-amber-500/15 text-amber-800",
  },
  baixa: {
    ring: "ring-orange-500/40",
    badge: "bg-orange-500/15 text-orange-800",
  },
};

/** Posição no grid da bússola (linha, coluna) */
const GRID_SLOTS: Record<RoofOrientation, string> = {
  noroeste: "col-start-1 row-start-1",
  norte: "col-start-2 row-start-1",
  nordeste: "col-start-3 row-start-1",
  oeste: "col-start-1 row-start-2",
  leste: "col-start-3 row-start-2",
  sudoeste: "col-start-1 row-start-3",
  sul: "col-start-2 row-start-3",
  sudeste: "col-start-3 row-start-3",
};

function OrientationButton({
  option,
  selected,
  onSelect,
}: {
  option: OrientacaoTelhadoOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const destaque = option.destaque ?? "moderada";
  const styles = DESTAQUE_STYLES[destaque];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex flex-col items-center justify-center rounded-xl border-2 px-2 py-3 text-center transition-all duration-300 sm:px-3 sm:py-3.5 ${
        GRID_SLOTS[option.id]
      } ${
        selected
          ? `border-solar-500 bg-solar-500/15 shadow-md shadow-solar-500/20 ring-2 ${styles.ring}`
          : "border-navy-800/10 bg-white hover:border-solar-500/40 hover:bg-solar-500/5"
      }`}
    >
      <span
        className={`text-xs font-bold sm:text-sm ${selected ? "text-navy-900" : "text-navy-800"}`}
      >
        {option.label}
      </span>
    </button>
  );
}

export function RoofOrientationPicker({
  value,
  onChange,
  error,
}: RoofOrientationPickerProps) {
  return (
    <div id="orientacao" className="sm:col-span-2">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className="flex items-center gap-2 text-sm font-semibold text-navy-900">
            <Compass className="h-4 w-4 text-solar-600" />
            Para onde os painéis ficam voltados?
          </span>
          <p className="mt-1 text-xs text-navy-700/55">
            Olhe para o telhado de frente: é a direção que os painéis &quot;enxergam&quot; o sol.
          </p>
        </div>
      </div>

      <div
        className={`rounded-2xl border bg-gradient-to-b from-slate-50 to-white p-4 sm:p-5 ${
          error ? "border-red-400" : "border-navy-800/10"
        }`}
      >
        <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-2.5">
          {/* Centro: casa + bússola */}
          <div className="col-start-2 row-start-2 flex flex-col items-center justify-center rounded-xl border border-dashed border-navy-800/15 bg-navy-900/5 px-2 py-3">
            <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800/10">
              <Home className="h-4 w-4 text-navy-700/60" />
            </div>
            <span className="text-[10px] font-medium text-navy-700/50">Sua casa</span>
            <span className="mt-0.5 text-[9px] text-navy-700/40">N = ↑</span>
          </div>

          {ORIENTACOES_TELHADO.map((option) => (
            <OrientationButton
              key={option.id}
              option={option}
              selected={value === option.id}
              onSelect={() => onChange(option.id)}
            />
          ))}
        </div>

        <p className="mt-4 text-xs text-navy-700/70">
          A orientação do telhado influencia a geração de energia solar.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
