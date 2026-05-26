import type { RoofOrientation } from "@/types/solar";

export interface OrientacaoTelhadoOption {
  id: RoofOrientation;
  label: string;
  /** Destaque visual no seletor */
  destaque?: "melhor" | "boa" | "moderada" | "baixa";
}

/**
 * Fatores numéricos de orientação (somente para cálculo).
 * Não devem ser exibidos na UI.
 */
export const ORIENTACAO_FATORES: Record<RoofOrientation, number> = {
  norte: 1.0,
  nordeste: 0.94,
  noroeste: 0.94,
  leste: 0.85,
  oeste: 0.85,
  sudeste: 0.78,
  sudoeste: 0.78,
  sul: 0.7,
};

export const ORIENTACOES_TELHADO: OrientacaoTelhadoOption[] = [
  {
    id: "norte",
    label: "Norte",
    destaque: "melhor",
  },
  {
    id: "nordeste",
    label: "Nordeste",
    destaque: "boa",
  },
  {
    id: "noroeste",
    label: "Noroeste",
    destaque: "boa",
  },
  {
    id: "leste",
    label: "Leste",
    destaque: "moderada",
  },
  {
    id: "oeste",
    label: "Oeste",
    destaque: "moderada",
  },
  {
    id: "sudeste",
    label: "Sudeste",
    destaque: "moderada",
  },
  {
    id: "sudoeste",
    label: "Sudoeste",
    destaque: "moderada",
  },
  {
    id: "sul",
    label: "Sul",
    destaque: "baixa",
  },
];

export function getOrientacaoFator(orientacao: RoofOrientation): number {
  return ORIENTACAO_FATORES[orientacao];
}

export function getOrientacaoLabel(orientacao: RoofOrientation): string {
  return ORIENTACOES_TELHADO.find((o) => o.id === orientacao)?.label ?? orientacao;
}

export function getOrientacaoOption(
  orientacao: RoofOrientation,
): OrientacaoTelhadoOption | undefined {
  return ORIENTACOES_TELHADO.find((o) => o.id === orientacao);
}
