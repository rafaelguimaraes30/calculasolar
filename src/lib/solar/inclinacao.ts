import type { RoofTiltChoice } from "@/types/solar";
import { getOptimalTilt } from "./transposition";

export const ROOF_TILT_OPTIONS: { value: RoofTiltChoice; label: string }[] = [
  { value: "nao_sei", label: "Não sei (recomendado)" },
  { value: "5", label: "5°" },
  { value: "10", label: "10°" },
  { value: "15", label: "15°" },
  { value: "20", label: "20°" },
  { value: "25", label: "25°" },
  { value: "30", label: "30°" },
  { value: "35", label: "35°" },
];

const VALID_TILT_CHOICES = new Set<RoofTiltChoice>(
  ROOF_TILT_OPTIONS.map((o) => o.value),
);

export function isValidRoofTiltChoice(value: string): value is RoofTiltChoice {
  return VALID_TILT_CHOICES.has(value as RoofTiltChoice);
}

/**
 * Resolve a inclinação utilizada no cálculo.
 * "Não sei" → getOptimalTilt(latitude).
 */
export function resolveInclinacao(
  escolha: RoofTiltChoice,
  latitude: number,
): { inclinacaoUtilizada: number; inclinacaoAutomatica: boolean; tiltIdeal: number } {
  const tiltIdeal = getOptimalTilt(latitude);

  if (escolha === "nao_sei") {
    return {
      inclinacaoUtilizada: tiltIdeal,
      inclinacaoAutomatica: true,
      tiltIdeal,
    };
  }

  return {
    inclinacaoUtilizada: Number(escolha),
    inclinacaoAutomatica: false,
    tiltIdeal,
  };
}
