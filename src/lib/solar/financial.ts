import {
  resolveTarifaParaSimulacao,
  type TarifaFonte,
  type TarifaConcessionariaRecord,
} from "./tarifasCursorData";
import type { TipoLigacaoEletrica } from "@/types/solar";
import { getCustoDisponibilidadeKwh } from "./disponibilidade";
import type { TariffLookupResult } from "./tariffData";

/** Reajuste médio anual da tarifa de energia (mercado brasileiro) */
export const REAJUSTE_TARIFARIO_ANUAL = 0.06;

export const MARKET_DISCLAIMER =
  "Valores estimados com base em médias de mercado brasileiro.";

export type InvestmentTierId = "ate_3" | "de_4_a_8" | "acima_8";

export interface InvestmentTier {
  id: InvestmentTierId;
  label: string;
  custoPorKwp: number;
}

const INVESTMENT_TIERS: InvestmentTier[] = [
  { id: "ate_3", label: "Até 3 kWp", custoPorKwp: 4_800 },
  { id: "de_4_a_8", label: "4 a 8 kWp", custoPorKwp: 4_200 },
  { id: "acima_8", label: "Acima de 8 kWp", custoPorKwp: 3_700 },
];

export interface FinancialCalculationInput {
  potenciaInstaladaKwp: number;
  geracaoMensalKwh: number;
  consumoMensalKwh: number;
  estado: string;
  tipoLigacao?: TipoLigacaoEletrica;
  tarifaModo?: "concessionaria" | "manual";
  tarifaConcessionariaKey?: string;
  tarifaManualKwh?: number;
}

export interface FinancialCalculationResult {
  investimentoTotalReais: number;
  custoPorKwpAplicado: number;
  faixaInvestimento: InvestmentTier;
  tarifaLookup: TariffLookupResult;
  tarifaKwh: number;
  tarifaFonte: TarifaFonte;
  tarifaConcessionariaKey?: string;
  tarifaConcessionaria?: TarifaConcessionariaRecord;
  economiaMensalReais: number;
  economiaAnualReais: number;
  paybackSimplesAnos: number;
  paybackAjustadoAnos: number;
  reajusteTarifarioAnual: number;
  economia25AnosReais: number;
  kwhCompensadosMes: number;
  kwhFaturadosMes: number;
  custoDisponibilidadeKwh: number;
}

export interface FinancialDataProvider {
  calculate(input: FinancialCalculationInput): FinancialCalculationResult;
}

/** Faixa de custo por kWp conforme porte do sistema */
export function getInvestmentTier(
  potenciaInstaladaKwp: number,
): InvestmentTier {
  if (potenciaInstaladaKwp <= 3) {
    return INVESTMENT_TIERS[0];
  }
  if (potenciaInstaladaKwp <= 8) {
    return INVESTMENT_TIERS[1];
  }
  return INVESTMENT_TIERS[2];
}

export function calculateInvestmentTotal(
  potenciaInstaladaKwp: number,
): { total: number; tier: InvestmentTier } {
  const tier = getInvestmentTier(potenciaInstaladaKwp);
  return {
    total: potenciaInstaladaKwp * tier.custoPorKwp,
    tier,
  };
}

/** Economia considerando compensação e custo mínimo de disponibilidade (ANEEL) */
export function calculateMonthlySavings(
  geracaoMensalKwh: number,
  consumoMensalKwh: number,
  tarifaKwh: number,
  tipoLigacao: TipoLigacaoEletrica = "monofasica",
): {
  economiaMensalReais: number;
  kwhCompensadosMes: number;
  kwhFaturadosMes: number;
  custoDisponibilidadeKwh: number;
} {
  const custoDisponibilidadeKwh = getCustoDisponibilidadeKwh(tipoLigacao);
  const contaSemSolar = consumoMensalKwh * tarifaKwh;
  const consumoLiquido = consumoMensalKwh - geracaoMensalKwh;

  const kwhFaturadosMes =
    consumoLiquido <= 0
      ? custoDisponibilidadeKwh
      : Math.max(consumoLiquido, custoDisponibilidadeKwh);

  const contaComSolar = kwhFaturadosMes * tarifaKwh;
  const economiaMensalReais = Math.max(0, contaSemSolar - contaComSolar);
  const kwhCompensadosMes = Math.max(0, consumoMensalKwh - kwhFaturadosMes);

  return {
    economiaMensalReais,
    kwhCompensadosMes,
    kwhFaturadosMes,
    custoDisponibilidadeKwh,
  };
}

/** Payback simples: investimento ÷ economia anual inicial */
export function calculateSimplePayback(
  investimento: number,
  economiaAnual: number,
): number {
  if (economiaAnual <= 0) return 0;
  return investimento / economiaAnual;
}

/**
 * Payback ajustado: acumula economia ano a ano com reajuste tarifário.
 * Retorna anos (pode ser fracionado).
 */
export function calculateAdjustedPayback(
  investimento: number,
  economiaMensalInicial: number,
  reajusteAnual: number = REAJUSTE_TARIFARIO_ANUAL,
  maxAnos = 40,
): number {
  if (economiaMensalInicial <= 0 || investimento <= 0) return 0;

  let acumulado = 0;

  for (let ano = 1; ano <= maxAnos; ano++) {
    const economiaAno =
      economiaMensalInicial * 12 * Math.pow(1 + reajusteAnual, ano - 1);
    const acumuladoAnterior = acumulado;
    acumulado += economiaAno;

    if (acumulado >= investimento) {
      const falta = investimento - acumuladoAnterior;
      const fracao = economiaAno > 0 ? falta / economiaAno : 0;
      return ano - 1 + fracao;
    }
  }

  return maxAnos;
}

/** Soma da economia em N anos com reajuste tarifário composto */
export function calculateSavingsOverYears(
  economiaMensalInicial: number,
  anos: number,
  reajusteAnual: number = REAJUSTE_TARIFARIO_ANUAL,
): number {
  let total = 0;
  for (let ano = 1; ano <= anos; ano++) {
    total += economiaMensalInicial * 12 * Math.pow(1 + reajusteAnual, ano - 1);
  }
  return total;
}

class LocalFinancialProvider implements FinancialDataProvider {
  calculate(input: FinancialCalculationInput): FinancialCalculationResult {
    const {
      potenciaInstaladaKwp,
      geracaoMensalKwh,
      consumoMensalKwh,
      estado,
      tipoLigacao = "monofasica",
      tarifaModo = "concessionaria",
      tarifaConcessionariaKey,
      tarifaManualKwh,
    } = input;

    const { total: investimentoTotalReais, tier: faixaInvestimento } =
      calculateInvestmentTotal(potenciaInstaladaKwp);

    const tarifaResolvida = resolveTarifaParaSimulacao({
      estado,
      tarifaModo,
      tarifaConcessionariaKey,
      tarifaManualKwh,
    });
    const tarifaLookup = tarifaResolvida.lookup;
    const tarifaKwh = tarifaResolvida.tarifaKwh;

    const { economiaMensalReais, kwhCompensadosMes, kwhFaturadosMes, custoDisponibilidadeKwh } =
      calculateMonthlySavings(
        geracaoMensalKwh,
        consumoMensalKwh,
        tarifaKwh,
        tipoLigacao,
      );

    const economiaAnualReais = economiaMensalReais * 12;

    const paybackSimplesAnos = calculateSimplePayback(
      investimentoTotalReais,
      economiaAnualReais,
    );

    const paybackAjustadoAnos = calculateAdjustedPayback(
      investimentoTotalReais,
      economiaMensalReais,
    );

    const economia25AnosReais = calculateSavingsOverYears(
      economiaMensalReais,
      25,
    );

    return {
      investimentoTotalReais,
      custoPorKwpAplicado: faixaInvestimento.custoPorKwp,
      faixaInvestimento,
      tarifaLookup,
      tarifaKwh,
      tarifaFonte: tarifaResolvida.fonte,
      tarifaConcessionariaKey: tarifaResolvida.concessionariaKey,
      tarifaConcessionaria: tarifaResolvida.concessionaria,
      economiaMensalReais,
      economiaAnualReais,
      paybackSimplesAnos,
      paybackAjustadoAnos,
      reajusteTarifarioAnual: REAJUSTE_TARIFARIO_ANUAL,
      economia25AnosReais,
      kwhCompensadosMes,
      kwhFaturadosMes,
      custoDisponibilidadeKwh,
    };
  }
}

let activeFinancialProvider: FinancialDataProvider =
  new LocalFinancialProvider();

export function setFinancialDataProvider(
  provider: FinancialDataProvider,
): void {
  activeFinancialProvider = provider;
}

export function calculateFinancials(
  input: FinancialCalculationInput,
): FinancialCalculationResult {
  return activeFinancialProvider.calculate(input);
}
