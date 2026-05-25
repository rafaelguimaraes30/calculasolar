"use client";

import { MARKET_DISCLAIMER } from "@/lib/solar/financial";
import { formatCurrency, formatPaybackYears } from "@/lib/solar/format";
import type { SimulationResult } from "@/types/solar";
import {
  AlertCircle,
  CalendarClock,
  CircleDollarSign,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

interface FinancialResultsCardProps {
  result: SimulationResult;
  delayBaseMs?: number;
}

export function FinancialResultsCard({
  result,
  delayBaseMs = 480,
}: FinancialResultsCardProps) {
  const { financeiro: f } = result;
  const reajustePct = Math.round(f.reajusteTarifarioAnual * 100);

  return (
    <div
      className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800/80 to-navy-900/90 opacity-0 animate-fade-up"
      style={{ animationDelay: `${delayBaseMs}ms`, animationFillMode: "forwards" }}
    >
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-solar-400">
              Análise financeira
            </p>
            <h3 className="mt-1 text-xl font-bold text-white">
              Quanto custa e quando se paga?
            </h3>
          </div>
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
            Faixa {f.faixaInvestimento.label} · R${" "}
            {f.custoPorKwpAplicado.toLocaleString("pt-BR")}/kWp
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <CircleDollarSign className="mb-3 h-6 w-6 text-solar-400" />
          <p className="text-xs uppercase tracking-wider text-white/50">
            Custo estimado total
          </p>
          <p className="mt-2 text-2xl font-extrabold text-white">
            {formatCurrency(f.investimentoTotalReais)}
          </p>
          <p className="mt-1 text-xs text-white/45">
            Sistema de {result.potenciaInstaladaKwp.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kWp
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-solar-500/15 to-transparent p-4 ring-1 ring-solar-500/25">
          <PiggyBank className="mb-3 h-6 w-6 text-solar-400" />
          <p className="text-xs uppercase tracking-wider text-white/50">
            Economia mensal
          </p>
          <p className="mt-2 text-2xl font-extrabold gradient-text">
            {formatCurrency(f.economiaMensalReais)}
          </p>
          <p className="mt-1 text-xs text-white/45">
            ~{Math.round(f.kwhCompensadosMes)} kWh compensados · {result.input.estado}
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <CalendarClock className="mb-3 h-6 w-6 text-white/50" />
          <p className="text-xs uppercase tracking-wider text-white/50">
            Payback simples
          </p>
          <p className="mt-2 text-2xl font-extrabold text-white">
            {formatPaybackYears(f.paybackSimplesAnos)}
            <span className="ml-1 text-base font-semibold text-white/50">anos</span>
          </p>
          <p className="mt-1 text-xs text-white/45">
            Sem considerar aumento da conta de luz
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-500/10 p-4 ring-1 ring-emerald-500/25">
          <TrendingUp className="mb-3 h-6 w-6 text-emerald-400" />
          <p className="text-xs uppercase tracking-wider text-white/50">
            Payback ajustado
          </p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-300">
            {formatPaybackYears(f.paybackAjustadoAnos)}
            <span className="ml-1 text-base font-semibold text-emerald-400/70">anos</span>
          </p>
          <p className="mt-1 text-xs text-white/45">
            Com tarifa +{reajustePct}% ao ano (média de mercado)
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/5 px-6 py-4 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">
            Economia acumulada em <strong className="text-white">25 anos</strong> (com
            reajuste):{" "}
            <span className="font-bold text-solar-400">
              {formatCurrency(f.economia25AnosReais)}
            </span>
          </p>
          <p className="text-xs text-white/40">{f.tarifaLookup.mensagem}</p>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-100/90">
            {MARKET_DISCLAIMER} Consulte um integrador para orçamento fechado.
          </p>
        </div>
      </div>
    </div>
  );
}
