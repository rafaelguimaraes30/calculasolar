/**
 * Modelo simplificado de sazonalidade solar (hemisfério sul).
 * Substituível via `setSeasonalityDataProvider()` por dados meteorológicos reais.
 */

import type { RoofOrientation } from "@/types/solar";
import { MESES_LABEL } from "./constants";
import { getEffectiveHSP } from "./transposition";

/** Fatores mensais de irradiação relativa (jan–dez) */
export const FATORES_SAZONALIDADE = [
  1.08, 1.06, 1.02, 0.98, 0.94, 0.9, 0.91, 0.96, 1.0, 1.03, 1.06, 1.09,
] as const;

export interface MonthlyGenerationPoint {
  mesIndex: number;
  mesLabel: string;
  fatorSazonal: number;
  geracaoKwh: number;
  /** Maior geração do ano */
  isPico: boolean;
  /** Menor geração do ano */
  isVale: boolean;
}

export interface SeasonalityDataProvider {
  getMonthlyFactors(): readonly number[];
  distributeMonthlyGeneration(
    geracaoMediaMensalKwh: number,
  ): MonthlyGenerationPoint[];
}

function mediaFatores(fatores: readonly number[]): number {
  return fatores.reduce((a, b) => a + b, 0) / fatores.length;
}

function buildMonthlyPoints(
  geracaoMediaMensalKwh: number,
  fatores: readonly number[],
): MonthlyGenerationPoint[] {
  const media = mediaFatores(fatores);

  const pontos = fatores.map((fator, mesIndex) => ({
    mesIndex,
    mesLabel: MESES_LABEL[mesIndex] ?? `M${mesIndex + 1}`,
    fatorSazonal: fator,
    geracaoKwh: geracaoMediaMensalKwh * (fator / media),
    isPico: false,
    isVale: false,
  }));

  const maxKwh = Math.max(...pontos.map((p) => p.geracaoKwh));
  const minKwh = Math.min(...pontos.map((p) => p.geracaoKwh));

  return pontos.map((p) => ({
    ...p,
    isPico: p.geracaoKwh === maxKwh,
    isVale: p.geracaoKwh === minKwh,
  }));
}

class LocalSeasonalityProvider implements SeasonalityDataProvider {
  constructor(private readonly fatores: readonly number[]) {}

  getMonthlyFactors(): readonly number[] {
    return this.fatores;
  }

  distributeMonthlyGeneration(
    geracaoMediaMensalKwh: number,
  ): MonthlyGenerationPoint[] {
    return buildMonthlyPoints(geracaoMediaMensalKwh, this.fatores);
  }
}

let activeProvider: SeasonalityDataProvider = new LocalSeasonalityProvider(
  FATORES_SAZONALIDADE,
);

export function setSeasonalityDataProvider(
  provider: SeasonalityDataProvider,
): void {
  activeProvider = provider;
}

export function getSeasonalityDataProvider(): SeasonalityDataProvider {
  return activeProvider;
}

/**
 * Distribui a geração média mensal pelos 12 meses usando fatores sazonais.
 * A soma anual ≈ geracaoMediaMensal × 12.
 */
export function distributeMonthlyGeneration(
  geracaoMediaMensalKwh: number,
): MonthlyGenerationPoint[] {
  return activeProvider.distributeMonthlyGeneration(geracaoMediaMensalKwh);
}

/** Apenas valores kWh por mês (compatibilidade com resultado legado) */
export function distributeMonthlyGenerationKwh(
  geracaoMediaMensalKwh: number,
): number[] {
  return distributeMonthlyGeneration(geracaoMediaMensalKwh).map(
    (p) => p.geracaoKwh,
  );
}

/**
 * Distribui geração mensal a partir de GHI mensal real (jan–dez).
 * Preparado para alimentar gráficos com dados de irradiação por mês.
 */
export function distributeMonthlyGenerationFromGhi(
  potenciaInstaladaKwp: number,
  ghiMensal: readonly number[],
  latitude: number,
  tilt: number,
  orientation: RoofOrientation,
  performanceRatio: number,
): MonthlyGenerationPoint[] {
  const mediaGhi =
    ghiMensal.reduce((acc, v) => acc + v, 0) / ghiMensal.length;

  const pontos = ghiMensal.map((ghiMes, mesIndex) => {
    const hspEfetivoMes = getEffectiveHSP(ghiMes, latitude, tilt, orientation);
    const geracaoKwh =
      potenciaInstaladaKwp * 30 * hspEfetivoMes * performanceRatio;

    return {
      mesIndex,
      mesLabel: MESES_LABEL[mesIndex] ?? `M${mesIndex + 1}`,
      fatorSazonal: mediaGhi > 0 ? ghiMes / mediaGhi : 1,
      geracaoKwh,
      isPico: false,
      isVale: false,
    };
  });

  const maxKwh = Math.max(...pontos.map((p) => p.geracaoKwh));
  const minKwh = Math.min(...pontos.map((p) => p.geracaoKwh));

  return pontos.map((p) => ({
    ...p,
    isPico: p.geracaoKwh === maxKwh,
    isVale: p.geracaoKwh === minKwh,
  }));
}
