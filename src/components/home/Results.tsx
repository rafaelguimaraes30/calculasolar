"use client";

import {
  formatAreaM2,
  formatCurrency,
  formatInteger,
  formatKwp,
  formatPaybackYears,
  capitalizeWords,
} from "@/lib/solar/format";
import { AdSlot } from "@/components/ads/AdSlot";
import { CalculationParamsCard } from "./CalculationParamsCard";
import { FinancialResultsCard } from "./FinancialResultsCard";
import { GenerationSeasonChart } from "./GenerationSeasonChart";
import type { SimulationResult } from "@/types/solar";
import {
  Calendar,
  Coins,
  LayoutGrid,
  Loader2,
  MapPin,
  Maximize2,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ResultsProps {
  result: SimulationResult | null;
  loading: boolean;
  hasSimulated: boolean;
  animationKey: number;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  highlight,
  delayMs,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  highlight: boolean;
  delayMs: number;
}) {
  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 opacity-0 animate-fade-up ${
        highlight
          ? "bg-gradient-to-br from-solar-500/20 to-solar-600/5 ring-1 ring-solar-500/40"
          : "glass"
      }`}
      style={{ animationDelay: `${delayMs}ms`, animationFillMode: "forwards" }}
    >
      <Icon
        className={`mb-4 h-6 w-6 ${highlight ? "text-solar-400" : "text-white/50"}`}
      />
      <p className="text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-white tabular-nums">
        {value}
        <span className="ml-1 text-base font-semibold text-white/50">{unit}</span>
      </p>
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-solar-500/30 blur-xl animate-pulse-glow" />
        <Loader2 className="relative h-12 w-12 animate-spin text-solar-400" />
      </div>
      <p className="mt-6 text-lg font-semibold text-white">Dimensionando seu sistema...</p>
      <p className="mt-2 max-w-md text-center text-sm text-white/50">
        Aplicando orientação do telhado · tarifa · módulos selecionados
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-white/20 bg-white/5 px-8 py-12 text-center">
      <Sun className="mx-auto h-10 w-10 text-solar-400/60" />
      <p className="mt-4 font-semibold text-white">Nenhuma simulação ainda</p>
      <p className="mt-2 text-sm text-white/50">
        Preencha o formulário acima e clique em calcular para ver seu dimensionamento
        personalizado.
      </p>
      <a
        href="#simulador"
        className="mt-6 inline-flex rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-6 py-2.5 text-sm font-bold text-navy-900 transition-all hover:scale-105"
      >
        Ir ao simulador
      </a>
    </div>
  );
}

export function Results({
  result,
  loading,
  hasSimulated,
  animationKey,
}: ResultsProps) {
  const tipoLabel =
    result?.input.tipoImovel === "comercial" ? "comércio" : "residência";

  const subtitle = result
    ? `Simulação para ${formatInteger(result.input.consumoMensalKwh)} kWh/mês em ${capitalizeWords(result.input.cidade)} — ${result.input.estado}, ${tipoLabel}, telhado ${result.orientacaoLabel}.`
    : "Resultados calculados com base nos seus dados.";

  const metrics = result
    ? [
        {
          icon: LayoutGrid,
          label: "Módulos necessários",
          value: String(result.quantidadeModulos),
          unit: `× ${result.modulo.potenciaW} W`,
          highlight: false,
        },
        {
          icon: Maximize2,
          label: "Área necessária",
          value: formatAreaM2(result.areaNecessariaM2),
          unit: "m²",
          highlight: false,
        },
        {
          icon: Zap,
          label: "Potência instalada",
          value: formatKwp(result.potenciaInstaladaKwp),
          unit: "kWp",
          highlight: false,
        },
        {
          icon: Coins,
          label: "Economia mensal",
          value: formatCurrency(result.economiaMensalReais),
          unit: "/mês",
          highlight: true,
        },
        {
          icon: Calendar,
          label: "Payback ajustado",
          value: formatPaybackYears(result.financeiro.paybackAjustadoAnos),
          unit: "anos",
          highlight: false,
        },
        {
          icon: TrendingUp,
          label: "Geração estimada",
          value: formatInteger(result.geracaoMensalKwh),
          unit: "kWh/mês",
          highlight: true,
        },
      ]
    : [];

  return (
    <section id="resultados" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-solar-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-solar-400">
            {hasSimulated ? "Seu resultado" : "Resultados"}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {hasSimulated ? "Seu dimensionamento solar" : "Veja como ficam seus números"}
          </h2>
          <p className="mt-4 text-lg text-white/60">{subtitle}</p>
        </div>

        {loading && <LoadingOverlay />}

        {!loading && !hasSimulated && (
          <div className="mt-14">
            <EmptyState />
          </div>
        )}

        {!loading && hasSimulated && result && (
          <div key={animationKey}>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2">
              <div
                className="flex w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 opacity-0 animate-fade-up"
                style={{ animationDelay: "50ms", animationFillMode: "forwards" }}
              >
                <MapPin className="h-4 w-4 text-solar-400" />
                <span className="text-sm text-white/80">
                  <strong className="text-white">
                    {capitalizeWords(result.input.cidade)} — {result.input.estado}
                  </strong>
                </span>
              </div>
              <div
                className="flex w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 opacity-0 animate-fade-up"
                style={{ animationDelay: "120ms", animationFillMode: "forwards" }}
              >
                <Sun className="h-4 w-4 text-solar-400" />
                <span className="text-sm text-white/80">
                  Telhado: <strong className="text-white">{result.orientacaoLabel}</strong>
                </span>
              </div>
            </div>

            <p
              className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/55 opacity-0 animate-fade-in"
              style={{ animationDelay: "180ms", animationFillMode: "forwards" }}
            >
              {result.modulo.fabricante} · {result.modulo.modelo} ({result.modulo.potenciaW} W)
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((m, i) => (
                <MetricCard
                  key={m.label}
                  icon={m.icon}
                  label={m.label}
                  value={m.value}
                  unit={m.unit}
                  highlight={m.highlight}
                  delayMs={i * 80}
                />
              ))}
            </div>

            <CalculationParamsCard result={result} />

            <AdSlot position="after-results" className="mt-8 h-24 sm:h-28" />

            <FinancialResultsCard result={result} delayBaseMs={520} />

            <div
              className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 opacity-0 animate-fade-up backdrop-blur-sm"
              style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
            >
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-solar-500 to-solar-400">
                    <Sun className="h-7 w-7 text-navy-900" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Projeção de geração</p>
                    <p className="text-sm text-white/60">
                      {formatInteger(result.geracaoAnualKwh)} kWh por ano estimados
                    </p>
                  </div>
                </div>
                <a
                  href="#simulador"
                  className="shrink-0 rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-6 py-3 text-center text-sm font-bold text-navy-900 transition-all hover:scale-105"
                >
                  Nova simulação
                </a>
              </div>

              <GenerationSeasonChart
                pontos={result.geracaoMensalDetalhada}
                geracaoMediaMensalKwh={result.geracaoMensalKwh}
                animationDelayMs={620}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
