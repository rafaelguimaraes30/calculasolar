const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatDecimal(value: number, digits = 1): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatInteger(value: number): string {
  return integerFormatter.format(Math.round(value));
}

export function formatKwp(value: number): string {
  return formatDecimal(value, 1);
}

export function formatPaybackYears(years: number): string {
  return formatDecimal(years, 1);
}

export function formatAreaM2(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function capitalizeWords(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
