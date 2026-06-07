import type { SimulationInput, SimulationResult } from "@/types/solar";
import { PERFORMANCE_RATIO } from "./constants";
import {
  distributeMonthlyGeneration,
  distributeMonthlyGenerationFromGhi,
} from "./seasonality";
import { calculateFinancials } from "./financial";
import { calculateArrayAreaM2, getDefaultModule, getModuleById } from "./modulesData";
import { getOrientacaoLabel } from "./orientation";
import { lookupGHI } from "./ghiData";
import { resolveInclinacao } from "./inclinacao";
import { lookupMunicipio } from "./municipiosData";
import { lookupHsp } from "./solarData";
import { getEffectiveHSP } from "./transposition";

/**
 * Dimensionamento fotovoltaico on-grid com GHI, latitude, orientação,
 * inclinação e HSP efetivo.
 *
 * Fluxo: cidade → latitude → GHI → inclinação → orientação → HSP efetivo → PR
 */
export function calculateSolarSimulation(
  input: SimulationInput,
): SimulationResult {
  const {
    consumoMensalKwh,
    orientacaoTelhado,
    cidade,
    estado,
    moduloId,
    inclinacaoEscolha = "nao_sei",
  } = input;

  const modulo = getModuleById(moduloId) ?? getDefaultModule();

  const ghiLookup = lookupGHI(cidade, estado);
  const ghi = ghiLookup.ghi;

  const municipio = lookupMunicipio(cidade, estado);
  const latitude = ghiLookup.latitude ?? municipio.latitude;
  const longitude = ghiLookup.longitude ?? municipio.longitude;

  const { inclinacaoUtilizada, inclinacaoAutomatica, tiltIdeal } =
    resolveInclinacao(inclinacaoEscolha, latitude);

  const hspEfetivo = getEffectiveHSP(
    ghi,
    latitude,
    inclinacaoUtilizada,
    orientacaoTelhado,
  );

  const hspLookup = lookupHsp(cidade, estado);

  const potenciaSistemaKwp =
    consumoMensalKwh / (30 * hspEfetivo * PERFORMANCE_RATIO);

  const quantidadeModulos = Math.ceil(
    (potenciaSistemaKwp * 1000) / modulo.potenciaW,
  );

  const potenciaInstaladaKwp =
    (quantidadeModulos * modulo.potenciaW) / 1000;

  let geracaoMensalDetalhada;
  let geracaoAnualKwh: number;
  let geracaoMensalKwh: number;

  if (ghiLookup.hasMonthlyData && ghiLookup.ghiMensal) {
    geracaoMensalDetalhada = distributeMonthlyGenerationFromGhi(
      potenciaInstaladaKwp,
      ghiLookup.ghiMensal,
      latitude,
      inclinacaoUtilizada,
      orientacaoTelhado,
      PERFORMANCE_RATIO,
    );
    geracaoAnualKwh = geracaoMensalDetalhada.reduce(
      (acc, p) => acc + p.geracaoKwh,
      0,
    );
    geracaoMensalKwh = geracaoAnualKwh / 12;
  } else {
    geracaoMensalKwh =
      potenciaInstaladaKwp * 30 * hspEfetivo * PERFORMANCE_RATIO;
    geracaoAnualKwh = geracaoMensalKwh * 12;
    geracaoMensalDetalhada = distributeMonthlyGeneration(geracaoMensalKwh);
  }

  const geracaoMensalPorMes = geracaoMensalDetalhada.map((p) => p.geracaoKwh);

  const areaNecessariaM2 = calculateArrayAreaM2(quantidadeModulos, modulo);

  const financeiro = calculateFinancials({
    potenciaInstaladaKwp,
    geracaoMensalKwh,
    consumoMensalKwh,
    estado,
  });

  return {
    potenciaSistemaKwp,
    potenciaInstaladaKwp,
    quantidadeModulos,
    geracaoMensalKwh,
    geracaoAnualKwh,
    economiaMensalReais: financeiro.economiaMensalReais,
    economia25AnosReais: financeiro.economia25AnosReais,
    investimentoEstimadoReais: financeiro.investimentoTotalReais,
    paybackAnos: financeiro.paybackSimplesAnos,
    geracaoMensalPorMes: [...geracaoMensalPorMes],
    geracaoMensalDetalhada,
    orientacaoLabel: getOrientacaoLabel(orientacaoTelhado),
    hsp: hspEfetivo,
    hspLookup,
    ghiLookup,
    latitude,
    longitude,
    ghi,
    ghiMensal: ghiLookup.ghiMensal,
    hspEfetivo,
    tiltIdeal,
    inclinacaoUtilizada,
    inclinacaoAutomatica,
    performanceRatio: PERFORMANCE_RATIO,
    modulo,
    areaNecessariaM2,
    financeiro,
    input,
    calculadoEm: Date.now(),
  };
}
