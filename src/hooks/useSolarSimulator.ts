"use client";

import { calculateSolarSimulation } from "@/lib/solar/calculate";
import { LOADING_DURATION_MS } from "@/lib/solar/constants";
import { DEFAULT_MODULE_ID } from "@/lib/solar/modulesData";
import {
  getTarifaByKey,
  resolveTarifaParaSimulacao,
} from "@/lib/solar/tarifasCursorData";
import {
  hasFormErrors,
  scrollToFirstFormError,
  validateSimulationForm,
} from "@/lib/solar/validate";
import type {
  PropertyType,
  SimulationFormData,
  SimulationFormErrors,
  SimulationInput,
  SimulationResult,
  TarifaModo,
} from "@/types/solar";
import { useCallback, useMemo, useRef, useState } from "react";

export interface SolarSimulatorInitialValues {
  cidade?: string;
  estado?: string;
  consumo?: string;
}

const defaultForm: SimulationFormData = {
  cidade: "",
  estado: "SP",
  consumo: "",
  tipoLigacao: "monofasica",
  tipo: "residencial",
  orientacao: "norte",
  inclinacao: "nao_sei",
  moduloId: DEFAULT_MODULE_ID,
  tarifaModo: "concessionaria",
  tarifaConcessionariaKey: "",
  tarifaManual: "",
};

function parseTarifaManual(value: string): number | undefined {
  const parsed = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function buildSimulationInput(form: SimulationFormData): SimulationInput | null {
  const consumo = Number(form.consumo);
  if (!Number.isFinite(consumo) || !form.cidade.trim()) return null;

  const input: SimulationInput = {
    cidade: form.cidade.trim(),
    estado: form.estado,
    consumoMensalKwh: consumo,
    tipoLigacao: form.tipoLigacao,
    tipoImovel: form.tipo as PropertyType,
    orientacaoTelhado: form.orientacao,
    moduloId: form.moduloId,
    inclinacaoEscolha: form.inclinacao,
    tarifaModo: form.tarifaModo,
    tarifaConcessionariaKey: form.tarifaConcessionariaKey || undefined,
  };

  if (form.tarifaModo === "manual") {
    const manual = parseTarifaManual(form.tarifaManual);
    if (manual !== undefined) input.tarifaManualKwh = manual;
  }

  return input;
}

export function useSolarSimulator(initial?: SolarSimulatorInitialValues) {
  const [form, setForm] = useState<SimulationFormData>({
    ...defaultForm,
    cidade: initial?.cidade ?? defaultForm.cidade,
    estado: initial?.estado ?? defaultForm.estado,
    consumo: initial?.consumo ?? defaultForm.consumo,
  });
  const [errors, setErrors] = useState<SimulationFormErrors>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const tariffPreview = useMemo(
    () =>
      resolveTarifaParaSimulacao({
        estado: form.estado,
        tarifaModo: form.tarifaModo,
        tarifaConcessionariaKey: form.tarifaConcessionariaKey,
        tarifaManualKwh: parseTarifaManual(form.tarifaManual),
      }),
    [
      form.estado,
      form.tarifaModo,
      form.tarifaConcessionariaKey,
      form.tarifaManual,
    ],
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSimulatedParamsRef = useRef<string | null>(null);

  const getRecalcSignature = useCallback((formData: SimulationFormData) => {
    return JSON.stringify({
      orientacao: formData.orientacao,
      inclinacao: formData.inclinacao,
      tipoLigacao: formData.tipoLigacao,
      tarifaModo: formData.tarifaModo,
      tarifaConcessionariaKey: formData.tarifaConcessionariaKey,
      tarifaManual: formData.tarifaManual,
    });
  }, []);

  const recalculateIfSimulated = useCallback(
    (formData: SimulationFormData) => {
      if (!hasSimulated || loading) return;

      const signature = getRecalcSignature(formData);
      if (lastSimulatedParamsRef.current === signature) return;

      const input = buildSimulationInput(formData);
      if (!input) return;

      const simulation = calculateSolarSimulation(input);

      setResult(simulation);
      setAnimationKey((k) => k + 1);
      lastSimulatedParamsRef.current = signature;
    },
    [getRecalcSignature, hasSimulated, loading],
  );

  const updateField = useCallback(
    <K extends keyof SimulationFormData>(
      field: K,
      value: SimulationFormData[K],
    ) => {
      setForm((prev) => {
        let next = { ...prev, [field]: value };

        if (
          field === "estado" &&
          prev.tarifaModo === "concessionaria" &&
          prev.tarifaConcessionariaKey
        ) {
          const record = getTarifaByKey(prev.tarifaConcessionariaKey);
          if (!record || record.uf !== value) {
            next = { ...next, tarifaConcessionariaKey: "" };
          }
        }

        if (
          field === "orientacao" ||
          field === "inclinacao" ||
          field === "tipoLigacao" ||
          field === "tarifaModo" ||
          field === "tarifaConcessionariaKey" ||
          field === "tarifaManual" ||
          field === "estado"
        ) {
          recalculateIfSimulated(next);
        }

        return next;
      });
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [recalculateIfSimulated],
  );

  const setTarifaModo = useCallback(
    (modo: TarifaModo) => {
      setForm((prev) => {
        const next = { ...prev, tarifaModo: modo };
        recalculateIfSimulated(next);
        return next;
      });
      setErrors((prev) => {
        const next = { ...prev };
        delete next.tarifaManual;
        delete next.tarifaConcessionariaKey;
        return next;
      });
    },
    [recalculateIfSimulated],
  );

  const selectCity = useCallback(
    (cidade: string, estado: string) => {
      setForm((prev) => {
        const next = {
          ...prev,
          cidade,
          estado,
          tarifaConcessionariaKey:
            prev.tarifaModo === "concessionaria" ? "" : prev.tarifaConcessionariaKey,
        };
        recalculateIfSimulated(next);
        return next;
      });
      setErrors((prev) => {
        if (!prev.cidade) return prev;
        const next = { ...prev };
        delete next.cidade;
        return next;
      });
    },
    [recalculateIfSimulated],
  );

  const submit = useCallback(() => {
    const validationErrors = validateSimulationForm(form);
    setErrors(validationErrors);

    if (hasFormErrors(validationErrors)) {
      requestAnimationFrame(() => {
        scrollToFirstFormError(validationErrors, form);
      });
      return false;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      const input = buildSimulationInput(form);
      if (!input) {
        setLoading(false);
        return;
      }

      const simulation = calculateSolarSimulation(input);

      setResult(simulation);
      lastSimulatedParamsRef.current = getRecalcSignature(form);
      setHasSimulated(true);
      setAnimationKey((k) => k + 1);
      setLoading(false);

      requestAnimationFrame(() => {
        document
          .getElementById("resultados")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, LOADING_DURATION_MS);

    return true;
  }, [form, getRecalcSignature]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submit();
    },
    [submit],
  );

  return {
    form,
    errors,
    result,
    loading,
    hasSimulated,
    animationKey,
    tariffPreview,
    updateField,
    setTarifaModo,
    selectCity,
    handleSubmit,
  };
}

export type UseSolarSimulatorReturn = ReturnType<typeof useSolarSimulator>;
