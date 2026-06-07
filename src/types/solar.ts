import type { FinancialCalculationResult } from "@/lib/solar/financial";
import type { GhiLookupResult } from "@/lib/solar/ghiData";
import type { MonthlyGenerationPoint } from "@/lib/solar/seasonality";
import type { HspLookupResult } from "@/lib/solar/solarData";
import type { SolarModuleRecord } from "@/lib/solar/modulesData";

export type PropertyType = "residencial" | "comercial";

export type RoofOrientation =
  | "norte"
  | "nordeste"
  | "noroeste"
  | "leste"
  | "oeste"
  | "sudeste"
  | "sudoeste"
  | "sul";

/** Escolha de inclinação no formulário */
export type RoofTiltChoice =
  | "nao_sei"
  | "5"
  | "10"
  | "15"
  | "20"
  | "25"
  | "30"
  | "35";

export interface SimulationInput {
  cidade: string;
  estado: string;
  consumoMensalKwh: number;
  tipoImovel: PropertyType;
  orientacaoTelhado: RoofOrientation;
  moduloId: string;
  /** Escolha do formulário; resolvida em graus no motor de cálculo */
  inclinacaoEscolha?: RoofTiltChoice;
}

export interface SimulationResult {
  potenciaSistemaKwp: number;
  potenciaInstaladaKwp: number;
  quantidadeModulos: number;
  geracaoMensalKwh: number;
  geracaoAnualKwh: number;
  economiaMensalReais: number;
  economia25AnosReais: number;
  investimentoEstimadoReais: number;
  /** @deprecated Use financeiro.paybackSimplesAnos */
  paybackAnos: number;
  geracaoMensalPorMes: number[];
  geracaoMensalDetalhada: MonthlyGenerationPoint[];
  orientacaoLabel: string;
  /** HSP efetivo usado no cálculo (compatibilidade com UI existente) */
  hsp: number;
  hspLookup: HspLookupResult;
  ghiLookup: GhiLookupResult;
  latitude: number;
  longitude: number;
  /** GHI base antes da transposição (kWh/m².dia) */
  ghi: number;
  /** GHI mensal (jan–dez), quando disponível no banco */
  ghiMensal?: number[];
  hspEfetivo: number;
  tiltIdeal: number;
  /** Inclinação efetivamente aplicada no cálculo (graus) */
  inclinacaoUtilizada: number;
  /** true quando foi usada inclinação automática (getOptimalTilt) */
  inclinacaoAutomatica: boolean;
  performanceRatio: number;
  modulo: SolarModuleRecord;
  areaNecessariaM2: number;
  financeiro: FinancialCalculationResult;
  input: SimulationInput;
  calculadoEm: number;
}

export interface SimulationFormData {
  cidade: string;
  estado: string;
  consumo: string;
  tipo: PropertyType;
  orientacao: RoofOrientation;
  moduloId: string;
  inclinacao: RoofTiltChoice;
}

export type SimulationFormErrors = Partial<
  Record<keyof SimulationFormData, string>
>;
