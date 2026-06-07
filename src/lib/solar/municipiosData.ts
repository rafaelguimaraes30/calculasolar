/**
 * Lookup e busca de municípios brasileiros (IBGE).
 * Fonte: src/lib/solar/data/municipios.json
 */

import municipiosJson from "./data/municipios.json";
import populacaoJson from "./data/populacao.json";
import { normalizeSolarText } from "./solarData";
import { parseMunicipioSlug, toMunicipioSlug } from "@/lib/seo/slug";

/** População mínima para pré-renderização estática (habitantes) */
export const POPULACAO_MINIMA_PRIORIDADE = 100_000;

/** ISR: revalidação de páginas municipais (segundos) */
export const MUNICIPIO_PAGE_REVALIDATE = 86_400;

export interface MunicipioRecord {
  codigo_ibge: number;
  nome: string;
  latitude: number;
  longitude: number;
  capital: number;
  codigo_uf: number;
}

export type MunicipioSource = "cidade" | "estado" | "nacional";

export interface MunicipioLookupResult {
  latitude: number;
  longitude: number;
  source: MunicipioSource;
  estado: string;
  cidadeEncontrada?: string;
  mensagem: string;
}

export interface MunicipioSearchResult {
  codigo_ibge: number;
  nome: string;
  uf: string;
  latitude: number;
  longitude: number;
  label: string;
  slug: string;
}

/** Mapeamento UF (sigla) → código IBGE da unidade federativa */
export const UF_TO_CODIGO: Record<string, number> = {
  AC: 12, AL: 27, AP: 16, AM: 13, BA: 29, CE: 23, DF: 53, ES: 32, GO: 52,
  MA: 21, MG: 31, MS: 50, MT: 51, PA: 15, PB: 25, PR: 41, PE: 26, PI: 22,
  RJ: 33, RN: 24, RS: 43, RO: 11, RR: 14, SC: 42, SP: 35, SE: 28, TO: 17,
};

export const CODIGO_TO_UF: Record<number, string> = Object.fromEntries(
  Object.entries(UF_TO_CODIGO).map(([uf, codigo]) => [codigo, uf]),
) as Record<number, string>;

/** Capitais e cidades em destaque para geração estática / SEO */
export const FEATURED_MUNICIPIO_SLUGS = [
  "goiania-go",
  "campinas-sp",
  "curitiba-pr",
  "campo-grande-ms",
  "belo-horizonte-mg",
  "sao-paulo-sp",
  "rio-de-janeiro-rj",
  "brasilia-df",
  "salvador-ba",
  "fortaleza-ce",
  "recife-pe",
  "porto-alegre-rs",
  "florianopolis-sc",
  "manaus-am",
  "belem-pa",
] as const;

/** Principais polos solares e mercados fotovoltaicos (além de capitais e 100k+) */
export const POLOS_SOLARES_SLUGS = [
  "petrolina-pe",
  "juazeiro-ba",
  "uberlandia-mg",
  "uberaba-mg",
  "ribeirao-preto-sp",
  "sorocaba-sp",
  "joinville-sc",
  "londrina-pr",
  "maringa-pr",
  "piracicaba-sp",
  "jundiai-sp",
  "cuiaba-mt",
  "anapolis-go",
  "dourados-ms",
  "rondonopolis-mt",
  "sinop-mt",
  "cascavel-pr",
  "chapeco-sc",
  "blumenau-sc",
  "franca-sp",
  "bauru-sp",
  "taubate-sp",
  "santos-sp",
  "vitoria-es",
  "campos-dos-goytacazes-rj",
] as const;

const populacaoMap = populacaoJson as Record<string, number>;

const STATE_COORDS_FALLBACK: Record<string, { latitude: number; longitude: number }> = {
  AC: { latitude: -9.97, longitude: -67.81 },
  AL: { latitude: -9.67, longitude: -35.74 },
  AP: { latitude: 0.03, longitude: -51.07 },
  AM: { latitude: -3.12, longitude: -60.02 },
  BA: { latitude: -12.97, longitude: -38.51 },
  CE: { latitude: -3.72, longitude: -38.54 },
  DF: { latitude: -15.78, longitude: -47.93 },
  ES: { latitude: -20.32, longitude: -40.34 },
  GO: { latitude: -16.69, longitude: -49.25 },
  MA: { latitude: -2.53, longitude: -44.28 },
  MG: { latitude: -19.92, longitude: -43.94 },
  MS: { latitude: -20.44, longitude: -54.65 },
  MT: { latitude: -15.60, longitude: -56.10 },
  PA: { latitude: -1.46, longitude: -48.50 },
  PB: { latitude: -7.12, longitude: -34.86 },
  PR: { latitude: -25.43, longitude: -49.27 },
  PE: { latitude: -8.05, longitude: -34.87 },
  PI: { latitude: -5.09, longitude: -42.80 },
  RJ: { latitude: -22.91, longitude: -43.17 },
  RN: { latitude: -5.79, longitude: -35.21 },
  RS: { latitude: -30.03, longitude: -51.23 },
  RO: { latitude: -8.76, longitude: -63.90 },
  RR: { latitude: 2.82, longitude: -60.67 },
  SC: { latitude: -27.59, longitude: -48.55 },
  SP: { latitude: -23.55, longitude: -46.63 },
  SE: { latitude: -10.91, longitude: -37.07 },
  TO: { latitude: -10.18, longitude: -48.33 },
};

const NACIONAL_FALLBACK = { latitude: -15.78, longitude: -47.93 };

const municipios = municipiosJson as MunicipioRecord[];

function scoreCityMatch(cityNormalized: string, queryNormalized: string): number {
  if (!queryNormalized) return 1;
  if (cityNormalized === queryNormalized) return 100;
  if (cityNormalized.startsWith(queryNormalized)) return 80;
  if (cityNormalized.includes(queryNormalized)) return 50;
  const queryParts = queryNormalized.split(" ").filter(Boolean);
  const allPartsMatch = queryParts.every((part) => cityNormalized.includes(part));
  return allPartsMatch ? 30 : 0;
}

function buildMunicipioIndex(records: MunicipioRecord[]): Map<string, MunicipioRecord> {
  const index = new Map<string, MunicipioRecord>();
  for (const record of records) {
    const key = `${normalizeSolarText(record.nome)}|${record.codigo_uf}`;
    index.set(key, record);
  }
  return index;
}

const municipioIndex = buildMunicipioIndex(municipios);

const slugIndex = new Map<string, MunicipioRecord>();
for (const m of municipios) {
  const uf = CODIGO_TO_UF[m.codigo_uf];
  if (!uf) continue;
  slugIndex.set(toMunicipioSlug(m.nome, uf), m);
}

function toSearchResult(record: MunicipioRecord): MunicipioSearchResult {
  const uf = CODIGO_TO_UF[record.codigo_uf] ?? "DF";
  return {
    codigo_ibge: record.codigo_ibge,
    nome: record.nome,
    uf,
    latitude: record.latitude,
    longitude: record.longitude,
    label: `${record.nome} - ${uf}`,
    slug: toMunicipioSlug(record.nome, uf),
  };
}

/**
 * Busca rápida de municípios por nome (e opcionalmente prioriza UF selecionada).
 */
export function searchMunicipios(
  query: string,
  preferredUf?: string,
  limit = 10,
): MunicipioSearchResult[] {
  const q = normalizeSolarText(query.trim());
  if (q.length < 2) return [];

  const uf = preferredUf?.trim().toUpperCase();

  return municipios
    .map((record) => {
      const recordUf = CODIGO_TO_UF[record.codigo_uf] ?? "";
      let score = scoreCityMatch(normalizeSolarText(record.nome), q);
      if (uf && recordUf === uf) score += 15;
      return { record, score };
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.record.nome.localeCompare(b.record.nome, "pt-BR"),
    )
    .slice(0, limit)
    .map((x) => toSearchResult(x.record));
}

/** Busca município pelo slug SEO (ex.: goiania-go) */
export function findMunicipioBySlug(slug: string): MunicipioSearchResult | null {
  if (!slug) return null;
  const direct = slugIndex.get(slug);
  if (direct) return toSearchResult(direct);

  const parsed = parseMunicipioSlug(slug);
  if (!parsed) return null;

  const codigoUf = UF_TO_CODIGO[parsed.uf];
  if (!codigoUf) return null;

  const cityNorm = parsed.citySlug.replace(/-/g, " ");
  const exact = municipioIndex.get(`${cityNorm}|${codigoUf}`);
  if (exact) return toSearchResult(exact);

  const fuzzy = municipios
    .filter((m) => m.codigo_uf === codigoUf)
    .map((m) => ({
      record: m,
      score: scoreCityMatch(normalizeSolarText(m.nome), cityNorm),
    }))
    .filter((x) => x.score >= 80)
    .sort((a, b) => b.score - a.score)[0];

  return fuzzy ? toSearchResult(fuzzy.record) : null;
}

export function getMunicipioPopulacao(codigoIbge: number): number | undefined {
  return populacaoMap[String(codigoIbge)];
}

/** Slugs prioritários: capitais + DF + 100k+ habitantes + polos solares */
export function getPriorityMunicipioSlugs(): string[] {
  const slugs = new Set<string>([
    ...FEATURED_MUNICIPIO_SLUGS,
    ...POLOS_SOLARES_SLUGS,
  ]);

  for (const m of municipios) {
    const uf = CODIGO_TO_UF[m.codigo_uf];
    if (!uf) continue;
    const slug = toMunicipioSlug(m.nome, uf);

    if (m.capital === 1) slugs.add(slug);

    const pop = getMunicipioPopulacao(m.codigo_ibge);
    if (typeof pop === "number" && pop >= POPULACAO_MINIMA_PRIORIDADE) {
      slugs.add(slug);
    }
  }

  return [...slugs];
}

/** @deprecated Use getPriorityMunicipioSlugs */
export function getStaticMunicipioSlugs(): string[] {
  return getPriorityMunicipioSlugs();
}

/** Todos os slugs municipais — para sitemap (rotas dinâmicas com ISR) */
export function getAllMunicipioSlugs(): string[] {
  return municipios
    .map((m) => {
      const uf = CODIGO_TO_UF[m.codigo_uf];
      return uf ? toMunicipioSlug(m.nome, uf) : null;
    })
    .filter((s): s is string => s !== null);
}

export function lookupMunicipio(cidade: string, estado: string): MunicipioLookupResult {
  const uf = estado.trim().toUpperCase();
  const cidadeNorm = normalizeSolarText(cidade);
  const codigoUf = UF_TO_CODIGO[uf];

  if (cidadeNorm.length >= 2 && codigoUf !== undefined) {
    const exact = municipioIndex.get(`${cidadeNorm}|${codigoUf}`);
    if (exact) {
      return {
        latitude: exact.latitude,
        longitude: exact.longitude,
        source: "cidade",
        estado: uf,
        cidadeEncontrada: exact.nome,
        mensagem: `Coordenadas de ${exact.nome}-${uf} (IBGE).`,
      };
    }

    const fuzzy = municipios
      .filter((m) => m.codigo_uf === codigoUf)
      .map((m) => ({
        record: m,
        score: scoreCityMatch(normalizeSolarText(m.nome), cidadeNorm),
      }))
      .filter((x) => x.score >= 80)
      .sort((a, b) => b.score - a.score)[0];

    if (fuzzy) {
      return {
        latitude: fuzzy.record.latitude,
        longitude: fuzzy.record.longitude,
        source: "cidade",
        estado: uf,
        cidadeEncontrada: fuzzy.record.nome,
        mensagem: `Coordenadas de ${fuzzy.record.nome}-${uf} (correspondência aproximada).`,
      };
    }
  }

  const stateCoords = STATE_COORDS_FALLBACK[uf];
  if (stateCoords) {
    return {
      latitude: stateCoords.latitude,
      longitude: stateCoords.longitude,
      source: "estado",
      estado: uf,
      mensagem: `Cidade não encontrada — usando coordenadas da capital de ${uf}.`,
    };
  }

  return {
    latitude: NACIONAL_FALLBACK.latitude,
    longitude: NACIONAL_FALLBACK.longitude,
    source: "nacional",
    estado: uf,
    mensagem: "Usando coordenadas centrais do Brasil (Brasília).",
  };
}
