import { PERFORMANCE_RATIO } from "./constants";
import { lookupGHI } from "./ghiData";
import { lookupMunicipio } from "./municipiosData";
import { lookupTariff } from "./tariffData";
import { getEffectiveHSP, getOptimalTilt } from "./transposition";
import { formatCurrency, formatDecimal, formatInteger } from "./format";

const REFERENCIA_KWP = 5;

export interface MunicipioSolarPreview {
  ghiMedio: number;
  hspEfetivo: number;
  tiltIdeal: number;
  geracaoMensalKwh: number;
  geracaoAnualKwh: number;
  economiaAnualReais: number;
  tarifaKwh: number;
}

/** Estimativa de sistema de 5 kWp para páginas SEO de município */
export function calculateMunicipioSolarPreview(
  cidade: string,
  uf: string,
): MunicipioSolarPreview {
  const ghiLookup = lookupGHI(cidade, uf);
  const municipio = lookupMunicipio(cidade, uf);
  const tiltIdeal = getOptimalTilt(municipio.latitude);
  const hspEfetivo = getEffectiveHSP(
    ghiLookup.ghi,
    municipio.latitude,
    tiltIdeal,
    "norte",
  );

  const geracaoMensalKwh =
    REFERENCIA_KWP * 30 * hspEfetivo * PERFORMANCE_RATIO;
  const geracaoAnualKwh = geracaoMensalKwh * 12;
  const tarifaKwh = lookupTariff(uf).tarifaKwh;
  const economiaAnualReais = geracaoAnualKwh * tarifaKwh;

  return {
    ghiMedio: ghiLookup.ghi,
    hspEfetivo,
    tiltIdeal,
    geracaoMensalKwh,
    geracaoAnualKwh,
    economiaAnualReais,
    tarifaKwh,
  };
}

export function formatMunicipioPreview(preview: MunicipioSolarPreview) {
  return {
    ghi: `${formatDecimal(preview.ghiMedio, 1)} kWh/m²/dia`,
    geracaoAnual: `${formatInteger(preview.geracaoAnualKwh)} kWh/ano`,
    geracaoMensal: `${formatInteger(preview.geracaoMensalKwh)} kWh/mês`,
    economiaAnual: formatCurrency(preview.economiaAnualReais),
    hsp: `${formatDecimal(preview.hspEfetivo, 1)} h/dia`,
  };
}
