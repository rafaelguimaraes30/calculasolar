import type { FinancialCalculationResult } from "@/lib/solar/financial";
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

export interface SimulationInput {
  cidade: string;
  estado: string;
  consumoMensalKwh: number;
  tipoImovel: PropertyType;
  orientacaoTelhado: RoofOrientation;
  moduloId: string;
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
  hsp: number;
  hspLookup: HspLookupResult;
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
}

export type SimulationFormErrors = Partial<
  Record<keyof SimulationFormData, string>
>;
