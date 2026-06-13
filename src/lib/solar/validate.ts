import type { SimulationFormData, SimulationFormErrors, TipoLigacaoEletrica } from "@/types/solar";
import { CONSUMO_MAX_KWH, CONSUMO_MIN_KWH, ESTADOS_BR } from "./constants";
import { TIPO_LIGACAO_LABELS } from "./disponibilidade";
import { getModuleById } from "./modulesData";
import { isValidRoofTiltChoice } from "./inclinacao";
import { isValidOrientacao } from "./orientation";

const FORM_FIELD_ORDER: (keyof SimulationFormData)[] = [
  "cidade",
  "estado",
  "tarifaConcessionariaKey",
  "tarifaManual",
  "consumo",
  "tipoLigacao",
  "orientacao",
  "inclinacao",
  "moduloId",
  "tipo",
];

const FIELD_ELEMENT_IDS: Partial<Record<keyof SimulationFormData, string>> = {
  cidade: "cidade",
  estado: "estado",
  tarifaConcessionariaKey: "tarifa-concessionaria",
  tarifaManual: "tarifa-manual",
  consumo: "consumo",
  tipoLigacao: "tipo-ligacao",
  orientacao: "orientacao",
  inclinacao: "inclinacao",
  moduloId: "moduloId",
  tipo: "tipo",
};

export function validateSimulationForm(
  data: SimulationFormData,
): SimulationFormErrors {
  const errors: SimulationFormErrors = {};

  const cidade = data.cidade.trim();
  if (!cidade) {
    errors.cidade = "Preencha a cidade antes de continuar.";
  } else if (cidade.length < 2) {
    errors.cidade = "Cidade deve ter pelo menos 2 caracteres.";
  } else if (cidade.length > 80) {
    errors.cidade = "Nome da cidade muito longo.";
  }

  if (!data.estado) {
    errors.estado = "Selecione o estado antes de continuar.";
  } else if (!ESTADOS_BR.includes(data.estado as (typeof ESTADOS_BR)[number])) {
    errors.estado = "Estado inválido.";
  }

  if (data.tarifaModo === "concessionaria" && !data.tarifaConcessionariaKey.trim()) {
    errors.tarifaConcessionariaKey =
      "Selecione a concessionária de energia antes de continuar.";
  }

  const consumoStr = data.consumo.trim();
  if (!consumoStr) {
    errors.consumo = "Informe o consumo mensal antes de continuar.";
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

  const tiposLigacao = Object.keys(TIPO_LIGACAO_LABELS) as TipoLigacaoEletrica[];
  if (!data.tipoLigacao) {
    errors.tipoLigacao = "Selecione o tipo de ligação elétrica.";
  } else if (!tiposLigacao.includes(data.tipoLigacao)) {
    errors.tipoLigacao = "Tipo de ligação inválido.";
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

export function getFirstValidationErrorField(
  errors: SimulationFormErrors,
  data: SimulationFormData,
): keyof SimulationFormData | null {
  for (const field of FORM_FIELD_ORDER) {
    if (field === "tarifaConcessionariaKey" && data.tarifaModo !== "concessionaria") {
      continue;
    }
    if (field === "tarifaManual" && data.tarifaModo !== "manual") {
      continue;
    }
    if (errors[field]) return field;
  }
  return null;
}

export function scrollToFirstFormError(
  errors: SimulationFormErrors,
  data: SimulationFormData,
): void {
  const field = getFirstValidationErrorField(errors, data);
  if (!field) return;

  const elementId = FIELD_ELEMENT_IDS[field] ?? String(field);
  const el = document.getElementById(elementId);
  if (!el) {
    document
      .getElementById("simulador")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("animate-field-shake");

  const focusable = el.matches("input, select, textarea, button")
    ? el
    : el.querySelector<HTMLElement>("input, select, textarea, button");

  focusable?.focus({ preventScroll: true });

  window.setTimeout(() => el.classList.remove("animate-field-shake"), 500);
}
