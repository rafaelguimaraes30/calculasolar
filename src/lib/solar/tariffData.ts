/**
 * Tarifa média de energia elétrica por estado (R$/kWh).
 * Preparado para substituição por `setTariffDataProvider()` (Supabase / mercado).
 */

export interface TariffStateRecord {
  estado: string;
  tarifaKwh: number;
}

export interface TariffLookupResult {
  tarifaKwh: number;
  estado: string;
  mensagem: string;
}

export interface TariffDataProvider {
  lookupTariff(estado: string): TariffLookupResult;
}

/** Média nacional quando UF não estiver cadastrada */
export const TARIFA_NACIONAL_FALLBACK = 0.92;

/**
 * Tarifas médias residenciais estimadas por UF (R$/kWh).
 * Referência inicial — integração futura com dados de mercado.
 */
export const STATE_TARIFFS: readonly TariffStateRecord[] = [
  { estado: "AC", tarifaKwh: 0.98 },
  { estado: "AL", tarifaKwh: 1.02 },
  { estado: "AP", tarifaKwh: 1.0 },
  { estado: "AM", tarifaKwh: 0.97 },
  { estado: "BA", tarifaKwh: 0.94 },
  { estado: "CE", tarifaKwh: 1.05 },
  { estado: "DF", tarifaKwh: 0.86 },
  { estado: "ES", tarifaKwh: 0.9 },
  { estado: "GO", tarifaKwh: 0.84 },
  { estado: "MA", tarifaKwh: 1.0 },
  { estado: "MG", tarifaKwh: 0.82 },
  { estado: "MS", tarifaKwh: 0.88 },
  { estado: "MT", tarifaKwh: 0.89 },
  { estado: "PA", tarifaKwh: 0.99 },
  { estado: "PB", tarifaKwh: 1.01 },
  { estado: "PR", tarifaKwh: 0.87 },
  { estado: "PE", tarifaKwh: 1.03 },
  { estado: "PI", tarifaKwh: 1.04 },
  { estado: "RJ", tarifaKwh: 0.95 },
  { estado: "RN", tarifaKwh: 1.02 },
  { estado: "RS", tarifaKwh: 0.91 },
  { estado: "RO", tarifaKwh: 0.96 },
  { estado: "RR", tarifaKwh: 1.01 },
  { estado: "SC", tarifaKwh: 0.89 },
  { estado: "SP", tarifaKwh: 0.78 },
  { estado: "SE", tarifaKwh: 0.98 },
  { estado: "TO", tarifaKwh: 0.93 },
] as const;

class LocalTariffDataProvider implements TariffDataProvider {
  private readonly byState: Map<string, number>;

  constructor(records: readonly TariffStateRecord[]) {
    this.byState = new Map(records.map((r) => [r.estado, r.tarifaKwh]));
  }

  lookupTariff(estado: string): TariffLookupResult {
    const uf = estado.trim().toUpperCase();
    const tarifa = this.byState.get(uf);

    if (tarifa !== undefined) {
      return {
        tarifaKwh: tarifa,
        estado: uf,
        mensagem: `Tarifa média em ${uf}: R$ ${tarifa.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/kWh.`,
      };
    }

    return {
      tarifaKwh: TARIFA_NACIONAL_FALLBACK,
      estado: uf,
      mensagem: `Tarifa média nacional: R$ ${TARIFA_NACIONAL_FALLBACK.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/kWh.`,
    };
  }
}

let activeProvider: TariffDataProvider = new LocalTariffDataProvider(STATE_TARIFFS);

export function setTariffDataProvider(provider: TariffDataProvider): void {
  activeProvider = provider;
}

export function lookupTariff(estado: string): TariffLookupResult {
  return activeProvider.lookupTariff(estado);
}
