/**
 * Camada SEO de tarifas por concessionária — processamento server-side.
 * Não altera tarifasCursorData.ts (simulador).
 */
import tarifasJson from "@/lib/solar/data/tarifas_cursor_json/tarifas_cursor.json";
import type { TarifaConcessionariaRecord } from "@/lib/solar/tarifasCursorData";
import { toTarifaSlug, toUfSlug } from "./tarifasSlug";

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
  record: TarifaConcessionariaRecord;
  variants: TarifaVariantRef[];
}

export interface UfTarifaStats {
  uf: string;
  count: number;
  media: number;
  maior: number;
  menor: number;
  maiorDistribuidora: string;
  menorDistribuidora: string;
}

export interface TarifaRankingData {
  top10Maiores: TarifaPageData[];
  top10Menores: TarifaPageData[];
  mediaNacional: number;
  mediaPorRegiao: { regiao: string; media: number; count: number }[];
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
    Number.isFinite(record.tarifa_estimada_final_rs_kwh) &&
    record.tarifa_estimada_final_rs_kwh > 0
  );
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
    typeof r.vigencia !== "string" ||
    typeof r.te_rs_kwh !== "number" ||
    typeof r.tusd_rs_kwh !== "number" ||
    typeof r.tarifa_base_rs_kwh !== "number" ||
    typeof r.icms !== "number" ||
    typeof r.pis_cofins !== "number" ||
    typeof r.tarifa_estimada_final_rs_kwh !== "number"
  ) {
    return null;
  }
  if (!isUsable(r as TarifaConcessionariaRecord)) return null;
  return r as TarifaConcessionariaRecord;
}

function buildTarifaPages(): TarifaPageData[] {
  const byDistribuidora = new Map<
    string,
    { records: TarifaConcessionariaRecord[]; keys: string[] }
  >();

  for (const [key, raw] of Object.entries(
    tarifasJson as Record<string, unknown>,
  )) {
    const record = parseRaw(key, raw);
    if (!record) continue;

    const normalizedName = record.distribuidora.trim();
    const bucket = byDistribuidora.get(normalizedName) ?? {
      records: [],
      keys: [],
    };
    bucket.records.push(record);
    bucket.keys.push(key);
    byDistribuidora.set(normalizedName, bucket);
  }

  const pages: TarifaPageData[] = [];

  for (const [distribuidora, bucket] of byDistribuidora) {
    const primary = pickPrimaryRecord(bucket.records);
    const slug = toTarifaSlug(distribuidora);
    const variants = bucket.records.map((r, i) => ({
      key: bucket.keys[i],
      subgrupo: r.subgrupo,
      classe: r.classe,
      variantSlug: `${slug}/${r.subgrupo.toLowerCase()}-${normalizeVariantClasse(r.classe)}`,
    }));

    const sourceKeyIndex = bucket.records.indexOf(primary);
    pages.push({
      slug,
      distribuidora,
      uf: primary.uf,
      regiao: primary.regiao,
      sourceKey: bucket.keys[sourceKeyIndex >= 0 ? sourceKeyIndex : 0],
      record: primary,
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

  const valores = pages.map((p) => p.record.tarifa_estimada_final_rs_kwh);
  const maior = Math.max(...valores);
  const menor = Math.min(...valores);
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const maiorPage = pages.find((p) => p.record.tarifa_estimada_final_rs_kwh === maior)!;
  const menorPage = pages.find((p) => p.record.tarifa_estimada_final_rs_kwh === menor)!;

  return {
    uf: uf.toUpperCase(),
    count: pages.length,
    media,
    maior,
    menor,
    maiorDistribuidora: maiorPage.distribuidora,
    menorDistribuidora: menorPage.distribuidora,
  };
}

export function getTarifaRanking(): TarifaRankingData {
  const sorted = [...TARIFA_PAGES].sort(
    (a, b) =>
      b.record.tarifa_estimada_final_rs_kwh -
      a.record.tarifa_estimada_final_rs_kwh,
  );

  const valores = TARIFA_PAGES.map((p) => p.record.tarifa_estimada_final_rs_kwh);
  const mediaNacional =
    valores.reduce((a, b) => a + b, 0) / valores.length;

  const regiaoMap = new Map<string, number[]>();
  for (const page of TARIFA_PAGES) {
    const list = regiaoMap.get(page.regiao) ?? [];
    list.push(page.record.tarifa_estimada_final_rs_kwh);
    regiaoMap.set(page.regiao, list);
  }

  const mediaPorRegiao = [...regiaoMap.entries()]
    .map(([regiao, vals]) => ({
      regiao,
      media: vals.reduce((a, b) => a + b, 0) / vals.length,
      count: vals.length,
    }))
    .sort((a, b) => a.regiao.localeCompare(b.regiao, "pt-BR"));

  return {
    top10Maiores: sorted.slice(0, 10),
    top10Menores: [...sorted].reverse().slice(0, 10),
    mediaNacional,
    mediaPorRegiao,
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

export function formatTarifaRs(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

export function formatTarifaRsKwh(value: number): string {
  return `${formatTarifaRs(value)}/kWh`;
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

/** Referências para futuras rotas /tarifa/[slug]/[variant] */
export function getAllTarifaVariantSlugs(): string[] {
  return TARIFA_PAGES.flatMap((p) => p.variants.map((v) => v.variantSlug));
}
