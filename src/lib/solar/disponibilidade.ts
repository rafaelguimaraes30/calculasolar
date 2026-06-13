import type { TipoLigacaoEletrica } from "@/types/solar";

/** Consumo mínimo faturável (custo de disponibilidade) — regra ANEEL */
export const CUSTO_DISPONIBILIDADE_KWH: Record<TipoLigacaoEletrica, number> = {
  monofasica: 30,
  bifasica: 50,
  trifasica: 100,
};

export const TIPO_LIGACAO_LABELS: Record<TipoLigacaoEletrica, string> = {
  monofasica: "Monofásica",
  bifasica: "Bifásica",
  trifasica: "Trifásica",
};

export function getCustoDisponibilidadeKwh(tipo: TipoLigacaoEletrica): number {
  return CUSTO_DISPONIBILIDADE_KWH[tipo];
}
