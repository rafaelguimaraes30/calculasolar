"use client";

import { formatInteger } from "@/lib/solar/format";
import type { MonthlyGenerationPoint } from "@/lib/solar/seasonality";
import { CloudSun, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const EDUCATION_TEXT =
  "A geração solar varia ao longo do ano devido às condições climáticas e posição do sol.";

export interface MonthlyChartDataPoint {
  mes: string;
  geracaoKwh: number;
  fatorSazonal: number;
  isPico: boolean;
  isVale: boolean;
}

function toMonthlyChartData(
  pontos: MonthlyGenerationPoint[],
): MonthlyChartDataPoint[] {
  return pontos.map((p) => ({
    mes: p.mesLabel,
    geracaoKwh: Number(Number(p.geracaoKwh).toFixed(2)),
    fatorSazonal: Number(p.fatorSazonal),
    isPico: p.isPico,
    isVale: p.isVale,
  }));
}

function getBarFill(entry: MonthlyChartDataPoint): string {
  if (entry.isPico) return "#F5B800";
  if (entry.isVale) return "#5B7CAB";
  return "#E6A800";
}

function getBarFillOpacity(entry: MonthlyChartDataPoint, active: boolean): number {
  if (active) return 1;
  if (entry.isPico) return 0.95;
  if (entry.isVale) return 0.75;
  return 0.85;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: MonthlyChartDataPoint }[];
}) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-xl border border-white/15 bg-navy-900/95 px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-md">
      <p className="text-center text-sm font-bold text-white">{data.mes}</p>
      <p className="mt-1 text-center text-2xl font-extrabold text-solar-400">
        {formatInteger(data.geracaoKwh)}
        <span className="ml-1 text-sm font-semibold text-white/50">kWh</span>
      </p>
      <p className="mt-1 text-center text-[10px] text-white/45">
        Fator sazonal {(data.fatorSazonal * 100).toFixed(0)}% da média
      </p>
      {data.isPico && (
        <p className="mt-2 text-center text-[10px] font-semibold text-solar-400">
          ☀ Maior geração do ano
        </p>
      )}
      {data.isVale && (
        <p className="mt-2 text-center text-[10px] font-semibold text-blue-300">
          ↓ Menor geração do ano
        </p>
      )}
    </div>
  );
}

interface GenerationSeasonChartProps {
  pontos: MonthlyGenerationPoint[];
  geracaoMediaMensalKwh: number;
  animationDelayMs?: number;
}

export function GenerationSeasonChart({
  pontos,
  geracaoMediaMensalKwh,
  animationDelayMs = 0,
}: GenerationSeasonChartProps) {
  const monthlyData = useMemo(() => toMonthlyChartData(pontos), [pontos]);

  const mediaKwh = useMemo(
    () => Number(Number(geracaoMediaMensalKwh).toFixed(2)),
    [geracaoMediaMensalKwh],
  );

  const yMax = useMemo(() => {
    const max = Math.max(...monthlyData.map((d) => d.geracaoKwh), mediaKwh);
    return Math.ceil(max * 1.12);
  }, [monthlyData, mediaKwh]);

  if (monthlyData.length === 0) {
    return null;
  }

  return (
    <div
      className="border-t border-white/10 px-4 py-5 opacity-0 animate-fade-up sm:px-8 sm:py-6"
      style={{
        animationDelay: `${animationDelayMs}ms`,
        animationFillMode: "forwards",
      }}
    >
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2.5">
          <CloudSun className="mt-0.5 h-5 w-5 shrink-0 text-solar-400" />
          <div>
            <p className="text-sm font-semibold text-white">Projeção mês a mês</p>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              {EDUCATION_TEXT}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] sm:gap-3 sm:text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-solar-500/15 px-2.5 py-1 text-solar-300">
            <TrendingUp className="h-3 w-3" />
            Pico do ano
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-white/50">
            <TrendingDown className="h-3 w-3" />
            Menor geração
          </span>
          <span className="text-white/40">
            Média: {formatInteger(mediaKwh)} kWh/mês
          </span>
        </div>
      </div>

      <div className="h-[220px] w-full min-w-0 sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 16, right: 4, left: -8, bottom: 4 }}
            barCategoryGap="18%"
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
              dy={6}
            />
            <YAxis
              domain={[0, yMax]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              tickFormatter={(v) => `${v}`}
              width={36}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(245, 184, 0, 0.08)", radius: 6 }}
            />
            <ReferenceLine
              y={mediaKwh}
              stroke="rgba(255,255,255,0.25)"
              strokeDasharray="5 5"
              label={{
                value: "média",
                position: "insideTopRight",
                fill: "rgba(255,255,255,0.35)",
                fontSize: 10,
              }}
            />
            <Bar
              dataKey="geracaoKwh"
              name="Geração"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
              isAnimationActive
              animationBegin={200}
              animationDuration={900}
              animationEasing="ease-out"
              activeBar={{
                fill: "#FFD54F",
                fillOpacity: 1,
                stroke: "rgba(255,255,255,0.35)",
                strokeWidth: 1,
                radius: 8,
              }}
            >
              {monthlyData.map((entry, index) => (
                <Cell
                  key={`bar-${entry.mes}-${index}`}
                  fill={getBarFill(entry)}
                  fillOpacity={getBarFillOpacity(entry, false)}
                  className="transition-opacity duration-200 hover:opacity-100"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
