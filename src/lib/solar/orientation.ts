import type { RoofOrientation } from "@/types/solar";

export interface OrientacaoTelhadoOption {
  id: RoofOrientation;
  label: string;
  fator: number;
  /** Texto curto para badge de eficiência */
  eficienciaLabel: string;
  /** Explicação em linguagem simples */
  dica: string;
  /** Destaque visual no seletor */
  destaque?: "melhor" | "boa" | "moderada" | "baixa";
}

export const ORIENTACAO_FATORES: Record<RoofOrientation, number> = {
  norte: 1.0,
  nordeste: 0.95,
  noroeste: 0.95,
  leste: 0.88,
  oeste: 0.88,
  sul: 0.75,
};

export const ORIENTACOES_TELHADO: OrientacaoTelhadoOption[] = [
  {
    id: "norte",
    label: "Norte",
    fator: 1.0,
    eficienciaLabel: "100%",
    dica: "Melhor opção no Brasil — sol da manhã à tarde.",
    destaque: "melhor",
  },
  {
    id: "nordeste",
    label: "Nordeste",
    fator: 0.95,
    eficienciaLabel: "95%",
    dica: "Muito boa — pequena perda em relação ao Norte.",
    destaque: "boa",
  },
  {
    id: "noroeste",
    label: "Noroeste",
    fator: 0.95,
    eficienciaLabel: "95%",
    dica: "Muito boa — pequena perda em relação ao Norte.",
    destaque: "boa",
  },
  {
    id: "leste",
    label: "Leste",
    fator: 0.88,
    eficienciaLabel: "88%",
    dica: "Boa — captam mais sol pela manhã.",
    destaque: "moderada",
  },
  {
    id: "oeste",
    label: "Oeste",
    fator: 0.88,
    eficienciaLabel: "88%",
    dica: "Boa — captam mais sol à tarde.",
    destaque: "moderada",
  },
  {
    id: "sul",
    label: "Sul",
    fator: 0.75,
    eficienciaLabel: "75%",
    dica: "Menos eficiente — exige mais painéis para o mesmo consumo.",
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
