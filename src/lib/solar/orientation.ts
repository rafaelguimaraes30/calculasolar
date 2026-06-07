import type { RoofOrientation } from "@/types/solar";

export interface OrientacaoTelhadoOption {
  id: RoofOrientation;
  label: string;
  /** Destaque visual no seletor */
  destaque?: "melhor" | "boa" | "moderada" | "baixa";
}

/** Opções de orientação exibidas na UI (sem fatores numéricos). */
export const ORIENTACOES_TELHADO: OrientacaoTelhadoOption[] = [
  { id: "norte", label: "Norte", destaque: "melhor" },
  { id: "nordeste", label: "Nordeste", destaque: "boa" },
  { id: "noroeste", label: "Noroeste", destaque: "boa" },
  { id: "leste", label: "Leste", destaque: "moderada" },
  { id: "oeste", label: "Oeste", destaque: "moderada" },
  { id: "sudeste", label: "Sudeste", destaque: "moderada" },
  { id: "sudoeste", label: "Sudoeste", destaque: "moderada" },
  { id: "sul", label: "Sul", destaque: "baixa" },
];

const VALID_ORIENTACOES = new Set<RoofOrientation>(
  ORIENTACOES_TELHADO.map((o) => o.id),
);

export function isValidOrientacao(orientacao: string): orientacao is RoofOrientation {
  return VALID_ORIENTACOES.has(orientacao as RoofOrientation);
}

export function getOrientacaoLabel(orientacao: RoofOrientation): string {
  return ORIENTACOES_TELHADO.find((o) => o.id === orientacao)?.label ?? orientacao;
}

export function getOrientacaoOption(
  orientacao: RoofOrientation,
): OrientacaoTelhadoOption | undefined {
  return ORIENTACOES_TELHADO.find((o) => o.id === orientacao);
}
