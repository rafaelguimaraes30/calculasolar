/** Monta URL do simulador com cidade e UF pré-preenchidos */
export function buildSimuladorUrl(cidade: string, uf: string, consumo?: string): string {
  const params = new URLSearchParams({
    cidade: cidade.trim(),
    uf: uf.trim().toUpperCase(),
  });
  if (consumo?.trim()) params.set("consumo", consumo.trim());
  return `/simulador?${params.toString()}`;
}
