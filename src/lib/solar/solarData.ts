/**
 * Banco local de irradiação solar (HSP) por cidade.
 *
 * Arquitetura preparada para troca futura por Supabase / CRESESB:
 * implemente `SolarDataProvider` e injete em `setSolarDataProvider()`.
 */

export interface SolarCityRecord {
  cidade: string;
  estado: string;
  /** HSP médio diário (horas de sol pleno equivalentes por dia) */
  hsp: number;
}

export type HspSource = "cidade" | "estado" | "nacional";

export interface HspLookupResult {
  hsp: number;
  source: HspSource;
  estado: string;
  /** Nome da cidade quando encontrada no banco */
  cidadeEncontrada?: string;
  /** Texto amigável para exibir ao usuário */
  mensagem: string;
}

export interface SolarDataProvider {
  lookupHsp(cidade: string, estado: string): HspLookupResult;
  searchCities(query: string, estado: string, limit?: number): SolarCityRecord[];
  getCitiesByState(estado: string): SolarCityRecord[];
}

/** Fallback nacional quando estado também não tem dados (R$/kWh não — HSP) */
export const HSP_NACIONAL_FALLBACK = 5.0;

/**
 * Capitais brasileiras + cidades MS solicitadas.
 * Valores HSP: médias diárias estimadas (horas/dia) por região — referência inicial local.
 * Substituível por dados CRESESB via provider remoto no futuro.
 */
export const SOLAR_CITIES: readonly SolarCityRecord[] = [
  { cidade: "Rio Branco", estado: "AC", hsp: 5.0 },
  { cidade: "Maceió", estado: "AL", hsp: 5.6 },
  { cidade: "Macapá", estado: "AP", hsp: 5.1 },
  { cidade: "Manaus", estado: "AM", hsp: 5.2 },
  { cidade: "Salvador", estado: "BA", hsp: 5.5 },
  { cidade: "Fortaleza", estado: "CE", hsp: 5.8 },
  { cidade: "Brasília", estado: "DF", hsp: 5.4 },
  { cidade: "Vitória", estado: "ES", hsp: 5.2 },
  { cidade: "Goiânia", estado: "GO", hsp: 5.5 },
  { cidade: "São Luís", estado: "MA", hsp: 5.6 },
  { cidade: "Belo Horizonte", estado: "MG", hsp: 5.3 },
  { cidade: "Campo Grande", estado: "MS", hsp: 5.3 },
  { cidade: "Dourados", estado: "MS", hsp: 5.4 },
  { cidade: "Rio Brilhante", estado: "MS", hsp: 5.3 },
  { cidade: "Cuiabá", estado: "MT", hsp: 5.4 },
  { cidade: "Belém", estado: "PA", hsp: 5.0 },
  { cidade: "João Pessoa", estado: "PB", hsp: 5.6 },
  { cidade: "Curitiba", estado: "PR", hsp: 4.4 },
  { cidade: "Recife", estado: "PE", hsp: 5.6 },
  { cidade: "Teresina", estado: "PI", hsp: 5.7 },
  { cidade: "Rio de Janeiro", estado: "RJ", hsp: 5.0 },
  { cidade: "Natal", estado: "RN", hsp: 5.7 },
  { cidade: "Porto Alegre", estado: "RS", hsp: 4.5 },
  { cidade: "Porto Velho", estado: "RO", hsp: 5.1 },
  { cidade: "Boa Vista", estado: "RR", hsp: 5.3 },
  { cidade: "Florianópolis", estado: "SC", hsp: 4.6 },
  { cidade: "São Paulo", estado: "SP", hsp: 4.8 },
  { cidade: "Aracaju", estado: "SE", hsp: 5.5 },
  { cidade: "Palmas", estado: "TO", hsp: 5.5 },
] as const;

/** Médias por UF derivadas do banco local (atualizadas ao incluir novas cidades) */
function buildStateHspAverages(
  cities: readonly SolarCityRecord[],
): Record<string, number> {
  const buckets: Record<string, number[]> = {};
  for (const { estado, hsp } of cities) {
    if (!buckets[estado]) buckets[estado] = [];
    buckets[estado].push(hsp);
  }
  const averages: Record<string, number> = {};
  for (const [uf, values] of Object.entries(buckets)) {
    const sum = values.reduce((acc, v) => acc + v, 0);
    averages[uf] = Math.round((sum / values.length) * 100) / 100;
  }
  return averages;
}

export const STATE_HSP_AVERAGES: Record<string, number> =
  buildStateHspAverages(SOLAR_CITIES);

/** Normaliza texto para busca (sem acentos, minúsculas) */
export function normalizeSolarText(text: string): string {
  return text
    .trim()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function roundHsp(hsp: number): number {
  return Math.round(hsp * 100) / 100;
}

function formatHspLabel(hsp: number): string {
  return hsp.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
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

class LocalSolarDataProvider implements SolarDataProvider {
  private readonly cityIndex: Map<string, SolarCityRecord>;

  constructor(private readonly cities: readonly SolarCityRecord[]) {
    this.cityIndex = new Map();
    for (const record of cities) {
      const key = `${normalizeSolarText(record.cidade)}|${record.estado}`;
      this.cityIndex.set(key, record);
    }
  }

  lookupHsp(cidade: string, estado: string): HspLookupResult {
    const uf = estado.trim().toUpperCase();
    const cidadeNorm = normalizeSolarText(cidade);

    if (cidadeNorm.length >= 2) {
      const exact = this.cityIndex.get(`${cidadeNorm}|${uf}`);
      if (exact) {
        return {
          hsp: exact.hsp,
          source: "cidade",
          estado: uf,
          cidadeEncontrada: exact.cidade,
          mensagem: `HSP de ${exact.cidade}-${uf}: ${formatHspLabel(exact.hsp)} h/dia (dados da cidade).`,
        };
      }

      const fuzzy = this.cities
        .filter((c) => c.estado === uf)
        .map((c) => ({
          record: c,
          score: scoreCityMatch(normalizeSolarText(c.cidade), cidadeNorm),
        }))
        .filter((x) => x.score >= 80)
        .sort((a, b) => b.score - a.score)[0];

      if (fuzzy) {
        return {
          hsp: fuzzy.record.hsp,
          source: "cidade",
          estado: uf,
          cidadeEncontrada: fuzzy.record.cidade,
          mensagem: `HSP de ${fuzzy.record.cidade}-${uf}: ${formatHspLabel(fuzzy.record.hsp)} h/dia (cidade correspondente).`,
        };
      }
    }

    const mediaEstado = STATE_HSP_AVERAGES[uf];
    if (mediaEstado !== undefined) {
      const hsp = roundHsp(mediaEstado);
      return {
        hsp,
        source: "estado",
        estado: uf,
        mensagem: `Cidade não cadastrada — usando média de ${uf}: ${formatHspLabel(hsp)} h/dia.`,
      };
    }

    return {
      hsp: HSP_NACIONAL_FALLBACK,
      source: "nacional",
      estado: uf,
      mensagem: `Usando média nacional: ${formatHspLabel(HSP_NACIONAL_FALLBACK)} h/dia.`,
    };
  }

  searchCities(query: string, estado: string, limit = 8): SolarCityRecord[] {
    const uf = estado.trim().toUpperCase();
    const q = normalizeSolarText(query);

    const pool = this.cities.filter((c) => c.estado === uf);

    if (!q) {
      return [...pool]
        .sort((a, b) => a.cidade.localeCompare(b.cidade, "pt-BR"))
        .slice(0, limit);
    }

    return pool
      .map((record) => ({
        record,
        score: scoreCityMatch(normalizeSolarText(record.cidade), q),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.record.cidade.localeCompare(b.record.cidade, "pt-BR"))
      .slice(0, limit)
      .map((x) => x.record);
  }

  getCitiesByState(estado: string): SolarCityRecord[] {
    const uf = estado.trim().toUpperCase();
    return this.cities
      .filter((c) => c.estado === uf)
      .sort((a, b) => a.cidade.localeCompare(b.cidade, "pt-BR"));
  }
}

let activeProvider: SolarDataProvider = new LocalSolarDataProvider(SOLAR_CITIES);

/** Troca o provider (ex.: implementação Supabase + CRESESB no futuro) */
export function setSolarDataProvider(provider: SolarDataProvider): void {
  activeProvider = provider;
}

export function getSolarDataProvider(): SolarDataProvider {
  return activeProvider;
}

export function lookupHsp(cidade: string, estado: string): HspLookupResult {
  return activeProvider.lookupHsp(cidade, estado);
}

export function searchCities(
  query: string,
  estado: string,
  limit?: number,
): SolarCityRecord[] {
  return activeProvider.searchCities(query, estado, limit);
}

export function getCitiesByState(estado: string): SolarCityRecord[] {
  return activeProvider.getCitiesByState(estado);
}

export function getHspSourceLabel(source: HspSource): string {
  switch (source) {
    case "cidade":
      return "Dados da cidade";
    case "estado":
      return "Média do estado";
    case "nacional":
      return "Média nacional";
  }
}
