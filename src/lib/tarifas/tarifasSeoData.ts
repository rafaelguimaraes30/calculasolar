/**
 * Camada SEO de tarifas por concessionária — processamento server-side.
 * Não altera tarifasCursorData.ts (simulador).
 */
import tarifasJson from "@/lib/solar/data/tarifas_cursor_json/tarifas_cursor.json";
import type { TarifaConcessionariaRecord } from "@/lib/solar/tarifasCursorData";
import { toTarifaSlug, toUfSlug } from "./tarifasSlug";

/** Dados institucionais exibidos nas páginas SEO — sem valores monetários. */
export type TarifaSeoRecord = Pick<
  TarifaConcessionariaRecord,
  "distribuidora" | "uf" | "regiao" | "subgrupo" | "classe" | "vigencia"
>;

export interface TarifaVariantRef {
  key: string;
  subgrupo: string;
  classe: string;
  variantSlug: string;
}

export interface TarifaPageData {
  slug: string;
  distribuidora: string;
  uf: string;
  regiao: string;
  sourceKey: string;
  record: TarifaSeoRecord;
  variants: TarifaVariantRef[];
}

export interface UfTarifaStats {
  uf: string;
  count: number;
}

export interface TarifaRankingData {
  total: number;
  countPorRegiao: { regiao: string; count: number }[];
  todasConcessionarias: TarifaPageData[];
}

const FEATURED_DISTRIBUIDORAS = [
  "CPFL-PAULISTA",
  "CEMIG-D",
  "ENEL RJ",
  "LIGHT SESA",
  "COPEL-DIS",
  "Neoenergia Brasília",
  "EQUATORIAL GO",
  "ENERGISA MS",
] as const;

function isUsable(record: TarifaConcessionariaRecord): boolean {
  return (
    record.distribuidora.trim().length > 0 &&
    record.uf.trim().length === 2 &&
    record.vigencia.trim().length > 0
  );
}

function toSeoRecord(record: TarifaConcessionariaRecord): TarifaSeoRecord {
  return {
    distribuidora: record.distribuidora,
    uf: record.uf,
    regiao: record.regiao,
    subgrupo: record.subgrupo,
    classe: record.classe,
    vigencia: record.vigencia,
  };
}

function pickPrimaryRecord(
  records: TarifaConcessionariaRecord[],
): TarifaConcessionariaRecord {
  const b1Residencial = records.find(
    (r) => r.subgrupo === "B1" && r.classe === "Residencial",
  );
  if (b1Residencial) return b1Residencial;

  const b1 = records.find((r) => r.subgrupo === "B1");
  if (b1) return b1;

  return records[0];
}

function parseRaw(key: string, raw: unknown): TarifaConcessionariaRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<TarifaConcessionariaRecord>;
  if (
    typeof r.distribuidora !== "string" ||
    typeof r.uf !== "string" ||
    typeof r.regiao !== "string" ||
    typeof r.subgrupo !== "string" ||
    typeof r.classe !== "string" ||
    typeof r.vigencia !== "string"
  ) {
    return null;
  }
  if (!isUsable(r as TarifaConcessionariaRecord)) return null;
  return r as TarifaConcessionariaRecord;
}

function buildTarifaPages(): TarifaPageData[] {
  const bySlug = new Map<
    string,
    {
      distribuidora: string;
      records: TarifaConcessionariaRecord[];
      keys: string[];
    }
  >();

  for (const [key, raw] of Object.entries(
    tarifasJson as Record<string, unknown>,
  )) {
    const record = parseRaw(key, raw);
    if (!record) continue;

    const slug = toTarifaSlug(record.distribuidora);
    const bucket = bySlug.get(slug) ?? {
      distribuidora: record.distribuidora.trim(),
      records: [],
      keys: [],
    };
    bucket.records.push(record);
    bucket.keys.push(key);
    bySlug.set(slug, bucket);
  }

  const pages: TarifaPageData[] = [];

  for (const [slug, bucket] of bySlug) {
    const primary = pickPrimaryRecord(bucket.records);
    const variants = bucket.records.map((r, i) => ({
      key: bucket.keys[i],
      subgrupo: r.subgrupo,
      classe: r.classe,
      variantSlug: `${slug}/${r.subgrupo.toLowerCase()}-${normalizeVariantClasse(r.classe)}`,
    }));

    const sourceKeyIndex = bucket.records.indexOf(primary);
    pages.push({
      slug,
      distribuidora: bucket.distribuidora,
      uf: primary.uf,
      regiao: primary.regiao,
      sourceKey: bucket.keys[sourceKeyIndex >= 0 ? sourceKeyIndex : 0],
      record: toSeoRecord(primary),
      variants,
    });
  }

  return pages.sort((a, b) =>
    a.distribuidora.localeCompare(b.distribuidora, "pt-BR"),
  );
}

function normalizeVariantClasse(classe: string): string {
  return classe
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TARIFA_PAGES = buildTarifaPages();
const slugIndex = new Map(TARIFA_PAGES.map((p) => [p.slug, p]));
const ufIndex = new Map<string, TarifaPageData[]>();

for (const page of TARIFA_PAGES) {
  const list = ufIndex.get(page.uf) ?? [];
  list.push(page);
  ufIndex.set(page.uf, list);
}

for (const [, list] of ufIndex) {
  list.sort((a, b) => a.distribuidora.localeCompare(b.distribuidora, "pt-BR"));
}

export function getAllTarifaPages(): TarifaPageData[] {
  return TARIFA_PAGES;
}

export function getAllTarifaSlugs(): string[] {
  return TARIFA_PAGES.map((p) => p.slug);
}

export function getTarifaPageBySlug(slug: string): TarifaPageData | undefined {
  return slugIndex.get(slug);
}

export function getTarifaPagesByUf(uf: string): TarifaPageData[] {
  return ufIndex.get(uf.toUpperCase()) ?? [];
}

export function getUfsWithTarifas(): string[] {
  return [...ufIndex.keys()].sort();
}

export function getAllUfSlugs(): string[] {
  return getUfsWithTarifas().map(toUfSlug);
}

export function getUfTarifaStats(uf: string): UfTarifaStats | null {
  const pages = getTarifaPagesByUf(uf);
  if (pages.length === 0) return null;

  return {
    uf: uf.toUpperCase(),
    count: pages.length,
  };
}

export function getTarifaRanking(): TarifaRankingData {
  const regiaoMap = new Map<string, number>();
  for (const page of TARIFA_PAGES) {
    regiaoMap.set(page.regiao, (regiaoMap.get(page.regiao) ?? 0) + 1);
  }

  const countPorRegiao = [...regiaoMap.entries()]
    .map(([regiao, count]) => ({ regiao, count }))
    .sort((a, b) => a.regiao.localeCompare(b.regiao, "pt-BR"));

  return {
    total: TARIFA_PAGES.length,
    countPorRegiao,
    todasConcessionarias: TARIFA_PAGES,
  };
}

export function getFeaturedTarifaPages(limit = 8): TarifaPageData[] {
  const featured: TarifaPageData[] = [];
  for (const name of FEATURED_DISTRIBUIDORAS) {
    const page = TARIFA_PAGES.find(
      (p) => p.distribuidora.toUpperCase() === name.toUpperCase(),
    );
    if (page) featured.push(page);
    if (featured.length >= limit) break;
  }

  if (featured.length < limit) {
    for (const page of TARIFA_PAGES) {
      if (featured.some((f) => f.slug === page.slug)) continue;
      featured.push(page);
      if (featured.length >= limit) break;
    }
  }

  return featured;
}

/** Referências para futuras rotas /tarifa/[slug]/[variant] */
export function getAllTarifaVariantSlugs(): string[] {
  return TARIFA_PAGES.flatMap((p) => p.variants.map((v) => v.variantSlug));
}
