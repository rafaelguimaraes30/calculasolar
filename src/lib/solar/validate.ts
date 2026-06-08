import type { SimulationFormData, SimulationFormErrors } from "@/types/solar";
import { CONSUMO_MAX_KWH, CONSUMO_MIN_KWH, ESTADOS_BR } from "./constants";
import { getModuleById } from "./modulesData";
import { isValidRoofTiltChoice } from "./inclinacao";
import { isValidOrientacao } from "./orientation";

export function validateSimulationForm(
  data: SimulationFormData,
): SimulationFormErrors {
  const errors: SimulationFormErrors = {};

  const cidade = data.cidade.trim();
  if (!cidade) {
    errors.cidade = "Informe a cidade.";
  } else if (cidade.length < 2) {
    errors.cidade = "Cidade deve ter pelo menos 2 caracteres.";
  } else if (cidade.length > 80) {
    errors.cidade = "Nome da cidade muito longo.";
  }

  if (!data.estado) {
    errors.estado = "Selecione o estado.";
  } else if (!ESTADOS_BR.includes(data.estado as (typeof ESTADOS_BR)[number])) {
    errors.estado = "Estado inválido.";
  }

  const consumoStr = data.consumo.trim();
  if (!consumoStr) {
    errors.consumo = "Informe o consumo mensal em kWh.";
  } else {
    const consumo = Number(consumoStr);
    if (Number.isNaN(consumo)) {
      errors.consumo = "Consumo deve ser um número válido.";
    } else if (consumo < CONSUMO_MIN_KWH) {
      errors.consumo = `Consumo mínimo: ${CONSUMO_MIN_KWH} kWh/mês.`;
    } else if (consumo > CONSUMO_MAX_KWH) {
      errors.consumo = `Consumo máximo: ${CONSUMO_MAX_KWH.toLocaleString("pt-BR")} kWh/mês.`;
    }
  }

  if (!data.tipo) {
    errors.tipo = "Selecione o tipo de imóvel.";
  }

  if (!data.orientacao) {
    errors.orientacao = "Selecione para onde os painéis ficarão voltados.";
  } else if (!isValidOrientacao(data.orientacao)) {
    errors.orientacao = "Orientação do telhado inválida.";
  }

  if (!data.inclinacao) {
    errors.inclinacao = "Selecione a inclinação aproximada do telhado.";
  } else if (!isValidRoofTiltChoice(data.inclinacao)) {
    errors.inclinacao = "Inclinação do telhado inválida.";
  }

  if (!data.moduloId) {
    errors.moduloId = "Selecione um módulo fotovoltaico.";
  } else if (!getModuleById(data.moduloId)) {
    errors.moduloId = "Módulo selecionado inválido.";
  }

  if (data.tarifaModo === "manual") {
    const manualStr = data.tarifaManual.trim().replace(",", ".");
    if (!manualStr) {
      errors.tarifaManual = "Informe a tarifa em R$/kWh.";
    } else {
      const manual = Number(manualStr);
      if (Number.isNaN(manual) || manual <= 0) {
        errors.tarifaManual = "Tarifa deve ser um valor positivo.";
      } else if (manual > 10) {
        errors.tarifaManual = "Tarifa parece alta demais. Verifique o valor.";
      }
    }
  }

  return errors;
}

export function hasFormErrors(errors: SimulationFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
