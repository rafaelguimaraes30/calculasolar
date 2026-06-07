import { normalizeSolarText } from "@/lib/solar/solarData";

/** Gera slug SEO: "Goiânia" + "GO" → "goiania-go" */
export function toMunicipioSlug(cidade: string, uf: string): string {
  const citySlug = normalizeSolarText(cidade)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${citySlug}-${uf.toLowerCase()}`;
}

/** Extrai UF e parte da cidade de um slug */
export function parseMunicipioSlug(slug: string): {
  citySlug: string;
  uf: string;
} | null {
  if (!slug) return null;
  const match = slug.match(/^(.+)-([a-z]{2})$/i);
  if (!match) return null;
  return { citySlug: match[1], uf: match[2].toUpperCase() };
}
