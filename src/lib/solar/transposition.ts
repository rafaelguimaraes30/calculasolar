import type { RoofOrientation } from "@/types/solar";

/**
 * Transposição simplificada de irradiação solar.
 * Fonte única de fatores de orientação e inclinação do CalculaSolar.
 */

/** Inclinação ótima aproximada baseada na latitude local. */
export function getOptimalTilt(latitude: number): number {
  return Math.abs(latitude);
}

/**
 * Correção por inclinação via cosseno da diferença entre
 * inclinação informada e a ideal. Mínimo: 0,80.
 */
export function getTiltFactor(latitude: number, tilt: number): number {
  const ideal = getOptimalTilt(latitude);
  const delta = Math.abs(tilt - ideal);
  const factor = Math.cos((delta * Math.PI) / 180);
  return Math.max(factor, 0.8);
}

/**
 * Fator médio de orientação do telhado (hemisfério sul).
 * Única implementação oficial — toda a aplicação deve usar esta função.
 */
export function getOrientationFactor(orientation: RoofOrientation | string): number {
  switch (orientation.toLowerCase()) {
    case "norte":
      return 1.0;
    case "nordeste":
      return 0.98;
    case "noroeste":
      return 0.98;
    case "leste":
      return 0.95;
    case "oeste":
      return 0.95;
    case "sudeste":
      return 0.92;
    case "sudoeste":
      return 0.92;
    case "sul":
      return 0.85;
    default:
      return 1.0;
  }
}

/** GHI efetivo considerando inclinação e orientação do telhado. */
export function getEffectiveGHI(
  ghi: number,
  latitude: number,
  tilt: number,
  orientation: RoofOrientation | string,
): number {
  const tiltFactor = getTiltFactor(latitude, tilt);
  const orientationFactor = getOrientationFactor(orientation);
  return ghi * tiltFactor * orientationFactor;
}

/**
 * HSP efetivo derivado do GHI após transposição.
 * 1 kWh/m².dia ≈ 1 HSP.
 */
export function getEffectiveHSP(
  ghi: number,
  latitude: number,
  tilt: number,
  orientation: RoofOrientation | string,
): number {
  return getEffectiveGHI(ghi, latitude, tilt, orientation);
}
