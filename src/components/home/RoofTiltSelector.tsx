"use client";

import { ROOF_TILT_OPTIONS } from "@/lib/solar/inclinacao";
import type { RoofTiltChoice } from "@/types/solar";
import { Triangle } from "lucide-react";

interface RoofTiltSelectorProps {
  value: RoofTiltChoice;
  onChange: (value: RoofTiltChoice) => void;
  error?: string;
}

export function RoofTiltSelector({
  value,
  onChange,
  error,
}: RoofTiltSelectorProps) {
  return (
    <div id="inclinacao" className="sm:col-span-2">
      <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-900">
        <Triangle className="h-4 w-4 text-solar-600" />
        Inclinação aproximada do telhado
      </span>

      <div
        className={`rounded-2xl border bg-gradient-to-b from-slate-50 to-white p-4 sm:p-5 ${
          error ? "border-red-400" : "border-navy-800/10"
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {ROOF_TILT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={value === option.value}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                value === option.value
                  ? "border-solar-500 bg-solar-500/15 text-navy-900 shadow-sm shadow-solar-500/20"
                  : "border-navy-800/10 bg-white text-navy-700/70 hover:border-solar-500/40 hover:bg-solar-500/5"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-navy-700/60">
          Se não souber a inclinação, usamos automaticamente o ângulo ideal para a latitude da sua cidade.
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
