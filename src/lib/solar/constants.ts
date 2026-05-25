/** Performance Ratio — perdas do sistema (cabeamento, inversor, sujeira, etc.) */
export const PERFORMANCE_RATIO = 0.8;

/** Consumo mínimo e máximo aceitos no formulário (kWh/mês) */
export const CONSUMO_MIN_KWH = 50;
export const CONSUMO_MAX_KWH = 50_000;

export const MESES_LABEL = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

export const ESTADOS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export const LOADING_DURATION_MS = 900;
