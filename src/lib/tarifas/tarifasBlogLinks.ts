import { getAllTarifaPages } from "./tarifasSeoData";

/** Marcas mencionadas no blog → slug principal */
const BRAND_ALIASES: { pattern: RegExp; slug: string }[] = [
  { pattern: /\bNeoenergia\b/gi, slug: "neoenergia-brasilia" },
  { pattern: /\bEquatorial\b/gi, slug: "equatorial-go" },
  { pattern: /\bCOPEL\b/gi, slug: "copel-dis" },
  { pattern: /\bLIGHT\b/gi, slug: "light-sesa" },
  { pattern: /\bCEMIG\b/gi, slug: "cemig-d" },
  { pattern: /\bENEL\b/gi, slug: "enel-rj" },
  { pattern: /\bCPFL\b/gi, slug: "cpfl-paulista" },
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Converte menções a concessionárias em links markdown [nome](/tarifa/slug).
 * Deve ser aplicado antes de renderBlogParagraph.
 */
export function enrichTextWithTarifaLinks(text: string): string {
  if (text.includes("](/tarifa/")) return text;

  let result = text;
  const pages = [...getAllTarifaPages()].sort(
    (a, b) => b.distribuidora.length - a.distribuidora.length,
  );

  for (const page of pages) {
    const pattern = new RegExp(
      `(?<!\\[)\\b${escapeRegex(page.distribuidora)}\\b(?!\\])`,
      "gi",
    );
    if (pattern.test(result)) {
      result = result.replace(
        pattern,
        `[${page.distribuidora}](/tarifa/${page.slug})`,
      );
    }
  }

  for (const alias of BRAND_ALIASES) {
    if (result.includes(`](/tarifa/${alias.slug})`)) continue;
    result = result.replace(alias.pattern, (match) => {
      return `[${match}](/tarifa/${alias.slug})`;
    });
  }

  return result;
}
