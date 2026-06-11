/**
 * Registro central para páginas SEO programáticas futuras.
 * Ative cada módulo definindo `enabled: true` e implementando `getSlugs`.
 */
import type { SitemapUrlEntry } from "./sitemapXml";
import { SITE_URL } from "./site";

export interface ProgrammaticSeoModule {
  /** Identificador interno do módulo */
  id: string;
  /** Rota base (ex.: /energia-solar-estado/[slug]) */
  basePath: string;
  enabled: boolean;
  sitemapPriority: number;
  sitemapChangefreq: SitemapUrlEntry["changefreq"];
  getSlugs: () => string[];
}

/** Módulos preparados para expansão sem refatoração do sitemap. */
export const PROGRAMMATIC_SEO_MODULES: ProgrammaticSeoModule[] = [
  {
    id: "estados",
    basePath: "/energia-solar-estado",
    enabled: false,
    sitemapPriority: 0.75,
    sitemapChangefreq: "monthly",
    getSlugs: () => [],
  },
  {
    id: "regioes",
    basePath: "/energia-solar-regiao",
    enabled: false,
    sitemapPriority: 0.75,
    sitemapChangefreq: "monthly",
    getSlugs: () => [],
  },
];

export function getProgrammaticSitemapEntries(): SitemapUrlEntry[] {
  const today = new Date().toISOString().split("T")[0];
  const entries: SitemapUrlEntry[] = [];

  for (const seoModule of PROGRAMMATIC_SEO_MODULES) {
    if (!seoModule.enabled) continue;
    for (const slug of seoModule.getSlugs()) {
      entries.push({
        loc: `${SITE_URL}${seoModule.basePath}/${slug}`,
        lastmod: today,
        changefreq: seoModule.sitemapChangefreq,
        priority: seoModule.sitemapPriority,
      });
    }
  }

  return entries;
}

export function hasProgrammaticSitemapEntries(): boolean {
  return getProgrammaticSitemapEntries().length > 0;
}
