import type { SimulationInput, SimulationResult } from "@/types/solar";
import { PERFORMANCE_RATIO } from "./constants";
import { distributeMonthlyGeneration } from "./seasonality";
import { calculateFinancials } from "./financial";
import { calculateArrayAreaM2, getDefaultModule, getModuleById } from "./modulesData";
import { getOrientacaoFator, getOrientacaoLabel } from "./orientation";
import { lookupHsp } from "./solarData";

/**
 * Dimensionamento fotovoltaico on-grid com HSP, orientação, módulo e finanças de mercado.
 */
export function calculateSolarSimulation(
  input: SimulationInput,
): SimulationResult {
  const { consumoMensalKwh, orientacaoTelhado, cidade, estado, moduloId } =
    input;

  const modulo = getModuleById(moduloId) ?? getDefaultModule();
  const fatorOrientacao = getOrientacaoFator(orientacaoTelhado);
  const hspLookup = lookupHsp(cidade, estado);
  const hsp = hspLookup.hsp;

  const potenciaSistemaKwp =
    consumoMensalKwh /
    (30 * hsp * PERFORMANCE_RATIO * fatorOrientacao);

  const quantidadeModulos = Math.ceil(
    (potenciaSistemaKwp * 1000) / modulo.potenciaW,
  );

  const potenciaInstaladaKwp =
    (quantidadeModulos * modulo.potenciaW) / 1000;

  const geracaoMensalKwh =
    potenciaInstaladaKwp *
    30 *
    hsp *
    PERFORMANCE_RATIO *
    fatorOrientacao;

  const geracaoAnualKwh = geracaoMensalKwh * 12;

  const areaNecessariaM2 = calculateArrayAreaM2(quantidadeModulos, modulo);

  const financeiro = calculateFinancials({
    potenciaInstaladaKwp,
    geracaoMensalKwh,
    consumoMensalKwh,
    estado,
  });

  const geracaoMensalDetalhada = distributeMonthlyGeneration(geracaoMensalKwh);
  const geracaoMensalPorMes = geracaoMensalDetalhada.map((p) => p.geracaoKwh);

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
    fatorOrientacao,
    orientacaoLabel: getOrientacaoLabel(orientacaoTelhado),
    hsp,
    hspLookup,
    modulo,
    areaNecessariaM2,
    financeiro,
    input,
    calculadoEm: Date.now(),
  };
}
