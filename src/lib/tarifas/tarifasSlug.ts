import { normalizeSolarText } from "@/lib/solar/solarData";

/** CPFL-PAULISTA → cpfl-paulista */
export function toTarifaSlug(distribuidora: string): string {
  return normalizeSolarText(distribuidora)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toUfSlug(uf: string): string {
  return uf.trim().toLowerCase();
}

export function parseUfSlug(slug: string): string | null {
  const uf = slug.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(uf) ? uf : null;
}

/** Slug futuro para subpáginas: /tarifa/cpfl-paulista/b1-residencial */
export function toTarifaVariantSlug(
  baseSlug: string,
  subgrupo: string,
  classe: string,
): string {
  const part = normalizeSolarText(`${subgrupo}-${classe}`)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${baseSlug}/${part}`;
}
