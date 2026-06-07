/**
 * Lookup de GHI (Global Horizontal Irradiance) por município.
 * Fonte oficial: src/lib/solar/data/ghi.json
 * Fallback: HSP de solarData.ts quando não houver dado no arquivo.
 */

import ghiJson from "./data/ghi.json";
import { lookupHsp, normalizeSolarText } from "./solarData";

export const GHI_MONTH_KEYS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
] as const;

export type GhiMonthKey = (typeof GHI_MONTH_KEYS)[number];

/**
 * Formato padronizado do banco nacional de GHI.
 * Compatível com formato legado (estado + ghi anual).
 */
export interface GhiRawRecord {
  cidade: string;
  /** Formato padronizado */
  uf?: string;
  /** Formato legado — tratado como uf */
  estado?: string;
  latitude?: number;
  longitude?: number;
  /** GHI médio anual (kWh/m².dia) — opcional se houver meses */
  ghi?: number;
  jan?: number;
  fev?: number;
  mar?: number;
  abr?: number;
  mai?: number;
  jun?: number;
  jul?: number;
  ago?: number;
  set?: number;
  out?: number;
  nov?: number;
  dez?: number;
}

export type GhiSource = "cidade" | "estado" | "hsp_fallback" | "nacional";

export interface GhiLookupResult {
  ghi: number;
  source: GhiSource;
  estado: string;
  cidadeEncontrada?: string;
  mensagem: string;
  hasMonthlyData: boolean;
  ghiMensal?: number[];
  latitude?: number;
  longitude?: number;
}

interface ParsedGhiRecord {
  cidade: string;
  estado: string;
  ghiAnual: number;
  ghiMensal?: number[];
  hasMonthlyData: boolean;
  latitude?: number;
  longitude?: number;
}

const ghiRecords = (Array.isArray(ghiJson) ? ghiJson : []) as GhiRawRecord[];

function getRecordUf(record: GhiRawRecord): string {
  return (record.uf ?? record.estado ?? "").trim().toUpperCase();
}

function scoreCityMatch(cityNormalized: string, queryNormalized: string): number {
  if (!queryNormalized) return 1;
  if (cityNormalized === queryNormalized) return 100;
  if (cityNormalized.startsWith(queryNormalized)) return 80;
  if (cityNormalized.includes(queryNormalized)) return 50;
  const queryParts = queryNormalized.split(" ").filter(Boolean);
  const allPartsMatch = queryParts.every((part) => cityNormalized.includes(part));
  return allPartsMatch ? 30 : 0;
}

function extractMonthlyValues(record: GhiRawRecord): number[] | undefined {
  const values = GHI_MONTH_KEYS.map((key) => record[key]).filter(
    (v): v is number => typeof v === "number" && Number.isFinite(v),
  );
  return values.length === 12 ? values : undefined;
}

export function calculateAnnualGhiFromMonthly(ghiMensal: readonly number[]): number {
  if (ghiMensal.length === 0) return 0;
  const sum = ghiMensal.reduce((acc, v) => acc + v, 0);
  return Math.round((sum / ghiMensal.length) * 1000) / 1000;
}

export function parseGhiRecord(record: GhiRawRecord): ParsedGhiRecord | null {
  const uf = getRecordUf(record);
  if (!uf || !record.cidade) return null;

  const ghiMensal = extractMonthlyValues(record);

  let ghiAnual: number | undefined;
  if (typeof record.ghi === "number" && Number.isFinite(record.ghi)) {
    ghiAnual = record.ghi;
  } else if (ghiMensal) {
    ghiAnual = calculateAnnualGhiFromMonthly(ghiMensal);
  }

  if (ghiAnual === undefined) return null;

  return {
    cidade: record.cidade,
    estado: uf,
    ghiAnual,
    ghiMensal,
    hasMonthlyData: ghiMensal !== undefined,
    latitude: record.latitude,
    longitude: record.longitude,
  };
}

function buildParsedIndex(records: GhiRawRecord[]): Map<string, ParsedGhiRecord> {
  const index = new Map<string, ParsedGhiRecord>();
  for (const raw of records) {
    const parsed = parseGhiRecord(raw);
    if (!parsed) continue;
    const key = `${normalizeSolarText(parsed.cidade)}|${parsed.estado}`;
    index.set(key, parsed);
  }
  return index;
}

const parsedGhiIndex = buildParsedIndex(ghiRecords);
const parsedGhiList = [...parsedGhiIndex.values()];

function formatGhiLabel(ghi: number): string {
  return ghi.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function toLookupResult(parsed: ParsedGhiRecord): GhiLookupResult {
  const mensagem = parsed.hasMonthlyData
    ? `GHI de ${parsed.cidade}-${parsed.estado}: ${formatGhiLabel(parsed.ghiAnual)} kWh/m²/dia (média anual de 12 meses).`
    : `GHI de ${parsed.cidade}-${parsed.estado}: ${formatGhiLabel(parsed.ghiAnual)} kWh/m²/dia.`;

  return {
    ghi: parsed.ghiAnual,
    source: "cidade",
    estado: parsed.estado,
    cidadeEncontrada: parsed.cidade,
    mensagem,
    hasMonthlyData: parsed.hasMonthlyData,
    ghiMensal: parsed.ghiMensal ? [...parsed.ghiMensal] : undefined,
    latitude: parsed.latitude,
    longitude: parsed.longitude,
  };
}

export function getGhiSourceLabel(source: GhiSource): string {
  switch (source) {
    case "cidade":
      return "Dados GHI da cidade";
    case "estado":
      return "Média GHI do estado";
    case "hsp_fallback":
      return "Estimativa via HSP";
    case "nacional":
      return "Média nacional";
  }
}

/** Retorna todos os registros GHI parseados (para sitemap / páginas estáticas) */
export function getAllGhiRecords(): ParsedGhiRecord[] {
  return parsedGhiList;
}

/**
 * Busca GHI por cidade + UF.
 * Prioriza ghi.json; fallback seguro via HSP.
 */
export function lookupGHI(cidade: string, estado: string): GhiLookupResult {
  const uf = estado.trim().toUpperCase();
  const cidadeNorm = normalizeSolarText(cidade);

  if (parsedGhiList.length > 0 && cidadeNorm.length >= 2) {
    const exact = parsedGhiIndex.get(`${cidadeNorm}|${uf}`);
    if (exact) return toLookupResult(exact);

    const fuzzy = parsedGhiList
      .filter((r) => r.estado === uf)
      .map((r) => ({
        record: r,
        score: scoreCityMatch(normalizeSolarText(r.cidade), cidadeNorm),
      }))
      .filter((x) => x.score >= 80)
      .sort((a, b) => b.score - a.score)[0];

    if (fuzzy) return toLookupResult(fuzzy.record);
  }

  const hspLookup = lookupHsp(cidade, estado);

  return {
    ghi: hspLookup.hsp,
    source: hspLookup.source === "nacional" ? "nacional" : "hsp_fallback",
    estado: uf,
    cidadeEncontrada: hspLookup.cidadeEncontrada,
    mensagem: `GHI via HSP (${hspLookup.source}): ${formatGhiLabel(hspLookup.hsp)} kWh/m²/dia.`,
    hasMonthlyData: false,
  };
}
