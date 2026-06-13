/**
 * Banco local de tarifas por concessionária.
 * Fonte: src/lib/solar/data/tarifas_cursor_json/tarifas_cursor.json
 */

import tarifasJson from "./data/tarifas_cursor_json/tarifas_cursor.json";
import { lookupTariff, type TariffLookupResult } from "./tariffData";

/** Teto para tarifa residencial convencional B1 (R$/kWh) */
const TARIFA_MAX_RESIDENCIAL_KWH = 1.18;
/** Piso plausível — abaixo disso usa média da UF */
const TARIFA_MIN_PLAUSIVEL_KWH = 0.55;
/** Teto para tarifas rurais/comerciais selecionadas explicitamente */
const TARIFA_MAX_OUTRAS_CLASSES_KWH = 1.35;

export interface TarifaConcessionariaRecord {
  distribuidora: string;
  uf: string;
  regiao: string;
  subgrupo: string;
  classe: string;
  vigencia: string;
  te_rs_kwh: number;
  tusd_rs_kwh: number;
  tarifa_base_rs_kwh: number;
  icms: number;
  pis_cofins: number;
  tarifa_estimada_final_rs_kwh: number;
}

export interface TarifaConcessionariaOption {
  key: string;
  label: string;
  record: TarifaConcessionariaRecord;
}

export type TarifaFonte = "concessionaria" | "manual" | "estado";

export interface TarifaResolvida {
  tarifaKwh: number;
  fonte: TarifaFonte;
  lookup: TariffLookupResult;
  concessionariaKey?: string;
  concessionaria?: TarifaConcessionariaRecord;
}

function parseTarifaRecord(raw: unknown): TarifaConcessionariaRecord | null {
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
    typeof r.tarifa_estimada_final_rs_kwh !== "number" ||
    !Number.isFinite(r.te_rs_kwh) ||
    !Number.isFinite(r.tusd_rs_kwh) ||
    !Number.isFinite(r.tarifa_base_rs_kwh) ||
    !Number.isFinite(r.icms) ||
    !Number.isFinite(r.pis_cofins) ||
    !Number.isFinite(r.tarifa_estimada_final_rs_kwh)
  ) {
    return null;
  }

  return r as TarifaConcessionariaRecord;
}

const tarifasRaw: Record<string, TarifaConcessionariaRecord> = {};
for (const [key, raw] of Object.entries(
  tarifasJson as Record<string, unknown>,
)) {
  const record = parseTarifaRecord(raw);
  if (record) tarifasRaw[key] = record;
}

function isResidencialB1(record: TarifaConcessionariaRecord): boolean {
  return record.subgrupo === "B1" && record.classe === "Residencial";
}

function isClasseRural(record: TarifaConcessionariaRecord): boolean {
  return (
    record.subgrupo === "B2" ||
    record.classe.toLowerCase().includes("rural")
  );
}

/**
 * Tarifa efetiva paga pelo consumidor — valor único com TE+TUSD e tributos,
 * sem duplicar componentes. Aplica limites de plausibilidade para evitar
 * superestimativas (ex.: rural CEMIG acima de R$ 1,70/kWh).
 */
export function getTarifaEfetivaKwh(
  record: TarifaConcessionariaRecord,
  uf: string,
): number {
  let tarifa = record.tarifa_estimada_final_rs_kwh;

  if (isResidencialB1(record)) {
    tarifa = Math.min(tarifa, TARIFA_MAX_RESIDENCIAL_KWH);
  } else if (isClasseRural(record)) {
    tarifa = Math.min(tarifa, TARIFA_MAX_OUTRAS_CLASSES_KWH);
  } else {
    tarifa = Math.min(tarifa, TARIFA_MAX_RESIDENCIAL_KWH);
  }

  if (tarifa < TARIFA_MIN_PLAUSIVEL_KWH) {
    return lookupTariff(uf).tarifaKwh;
  }

  return tarifa;
}

function isTarifaRecordUsable(record: TarifaConcessionariaRecord): boolean {
  return (
    Number.isFinite(record.tarifa_estimada_final_rs_kwh) &&
    record.tarifa_estimada_final_rs_kwh > 0 &&
    Number.isFinite(record.tarifa_base_rs_kwh) &&
    record.tarifa_base_rs_kwh > 0
  );
}

const tarifaOptions: TarifaConcessionariaOption[] = Object.entries(tarifasRaw)
  .filter(([, record]) => isTarifaRecordUsable(record))
  .map(([key, record]) => ({
    key,
    record,
    label: formatTarifaOptionLabel(key, record),
  }))
  .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

function formatTarifaOptionLabel(
  key: string,
  record: TarifaConcessionariaRecord,
): string {
  const tarifa = getTarifaEfetivaKwh(record, record.uf).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${record.distribuidora} — ${record.subgrupo} ${record.classe} (${record.uf}) · R$ ${tarifa}/kWh`;
}

export function getAllTarifaConcessionariaOptions(): TarifaConcessionariaOption[] {
  return tarifaOptions;
}

export function getTarifaOptionsCount(): number {
  return tarifaOptions.length;
}

export function getTarifaOptionsCountByUf(estado?: string): number {
  const uf = estado?.trim().toUpperCase();
  if (!uf) return 0;
  return tarifaOptions.filter((option) => option.record.uf === uf).length;
}

function normalizeUf(estado?: string): string | undefined {
  const uf = estado?.trim().toUpperCase();
  return uf || undefined;
}

function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function splitSearchWords(normalized: string): string[] {
  return normalized.split(/[\s\-–—/]+/).filter(Boolean);
}

/**
 * Pontua correspondência textual na distribuidora.
 * Prioridade: prefixo do nome > palavra exata > palavra com prefixo > contains.
 */
function scoreDistribuidoraSearch(
  distribuidora: string,
  query: string,
): number {
  const q = normalizeSearchText(query);
  if (!q) return 0;

  const name = normalizeSearchText(distribuidora);
  const words = splitSearchWords(name);

  if (name.startsWith(q)) return 400;
  if (words.some((word) => word === q)) return 300;
  if (words.some((word) => word.startsWith(q))) return 250;
  if (name.includes(q)) return 100;
  if (words.some((word) => word.includes(q))) return 50;

  return 0;
}

/**
 * Busca tarifas filtradas pela UF do formulário.
 */
export function searchTarifaConcessionariaOptions(
  query: string,
  estado?: string,
  limit = 10,
): TarifaConcessionariaOption[] {
  const q = normalizeSearchText(query);
  const uf = normalizeUf(estado);
  if (!uf || !q) return [];

  const pool = tarifaOptions.filter((option) => option.record.uf === uf);

  return pool
    .map((option) => ({
      option,
      score: scoreDistribuidoraSearch(option.record.distribuidora, q),
    }))
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        normalizeSearchText(a.option.record.distribuidora).localeCompare(
          normalizeSearchText(b.option.record.distribuidora),
          "pt-BR",
        ) ||
        a.option.label.localeCompare(b.option.label, "pt-BR"),
    )
    .slice(0, limit)
    .map((x) => x.option);
}

export function getTarifaByKey(
  key: string,
): TarifaConcessionariaRecord | undefined {
  if (!key) return undefined;
  return tarifasRaw[key];
}

export function getTarifaOptionByKey(
  key: string,
): TarifaConcessionariaOption | undefined {
  if (!key) return undefined;
  const record = tarifasRaw[key];
  if (!record || !isTarifaRecordUsable(record)) return undefined;
  return { key, record, label: formatTarifaOptionLabel(key, record) };
}

function formatTarifaValue(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Resolve tarifa para o motor de cálculo: manual > concessionária > média UF */
export function resolveTarifaParaSimulacao(input: {
  estado: string;
  tarifaModo: "concessionaria" | "manual";
  tarifaConcessionariaKey?: string;
  tarifaManualKwh?: number;
}): TarifaResolvida {
  const uf = input.estado.trim().toUpperCase();

  if (input.tarifaModo === "manual") {
    const manual = input.tarifaManualKwh ?? 0;
    return {
      tarifaKwh: manual,
      fonte: "manual",
      lookup: {
        tarifaKwh: manual,
        estado: uf,
        mensagem: `Tarifa informada manualmente: R$ ${formatTarifaValue(manual)}/kWh.`,
      },
    };
  }

  const key = input.tarifaConcessionariaKey?.trim();
  if (key) {
    const record = getTarifaByKey(key);
    if (record && isTarifaRecordUsable(record) && record.uf === uf) {
      const tarifa = getTarifaEfetivaKwh(record, uf);
      return {
        tarifaKwh: tarifa,
        fonte: "concessionaria",
        concessionariaKey: key,
        concessionaria: record,
        lookup: {
          tarifaKwh: tarifa,
          estado: record.uf,
          mensagem: `${record.distribuidora} (${record.regiao}): R$ ${formatTarifaValue(tarifa)}/kWh — ${record.subgrupo} ${record.classe}.`,
        },
      };
    }
  }

  const estadoLookup = lookupTariff(uf);
  return {
    tarifaKwh: estadoLookup.tarifaKwh,
    fonte: "estado",
    lookup: estadoLookup,
  };
}
