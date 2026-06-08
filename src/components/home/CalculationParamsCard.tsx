"use client";

import { PERFORMANCE_RATIO } from "@/lib/solar/constants";
import { MESES_LABEL } from "@/lib/solar/constants";
import { formatDecimal, formatInteger } from "@/lib/solar/format";
import type { SimulationResult } from "@/types/solar";
import { Calculator } from "lucide-react";

interface CalculationParamsCardProps {
  result: SimulationResult;
  delayBaseMs?: number;
}

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export function CalculationParamsCard({
  result,
  delayBaseMs = 400,
}: CalculationParamsCardProps) {
  const fmt = (n: number, digits = 1) => formatDecimal(n, digits);
  const inclinacaoLabel = result.inclinacaoAutomatica
    ? `${fmt(result.inclinacaoUtilizada, 1)}° (automática)`
    : `${fmt(result.inclinacaoUtilizada, 0)}°`;

  const localizacao = `${result.input.cidade} — ${result.input.estado}`;

  return (
    <div
      className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 opacity-0 animate-fade-up backdrop-blur-sm"
      style={{ animationDelay: `${delayBaseMs}ms`, animationFillMode: "forwards" }}
    >
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-500/20">
            <Calculator className="h-5 w-5 text-solar-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-solar-400">
              Detalhes técnicos
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-white">
              Parâmetros utilizados no cálculo
            </h3>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
        <ParamRow label="Localização" value={localizacao} />
        <ParamRow label="Inclinação ideal" value={`${fmt(result.tiltIdeal, 1)}°`} />
        <ParamRow label="Inclinação utilizada" value={inclinacaoLabel} />
        <ParamRow label="Orientação do telhado" value={result.orientacaoLabel} />
        <ParamRow
          label="PR utilizado"
          value={fmt(result.performanceRatio ?? PERFORMANCE_RATIO, 2)}
        />
      </div>

      {result.geracaoMensalDetalhada.length === 12 && (
        <div className="border-t border-white/10 px-6 pb-6 sm:px-8 sm:pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-solar-400">
            Geração mensal estimada
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {result.geracaoMensalDetalhada.map((p) => (
              <div
                key={p.mesIndex}
                className="rounded-lg bg-white/5 px-3 py-2 text-center ring-1 ring-white/8"
              >
                <p className="text-[10px] font-medium text-white/45">
                  {MESES_LABEL[p.mesIndex]}
                </p>
                <p className="text-sm font-bold text-white">
                  {formatInteger(p.geracaoKwh)}
                  <span className="ml-0.5 text-[10px] font-medium text-white/40">kWh</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
            <span>
              Média mensal:{" "}
              <strong className="text-white">
                {formatInteger(result.geracaoMensalKwh)} kWh
              </strong>
            </span>
            <span>
              Geração anual:{" "}
              <strong className="text-white">
                {formatInteger(result.geracaoAnualKwh)} kWh
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
