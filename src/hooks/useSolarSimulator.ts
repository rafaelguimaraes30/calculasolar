"use client";

import { calculateSolarSimulation } from "@/lib/solar/calculate";
import { LOADING_DURATION_MS } from "@/lib/solar/constants";
import { DEFAULT_MODULE_ID } from "@/lib/solar/modulesData";
import { lookupGHI } from "@/lib/solar/ghiData";
import { lookupTariff } from "@/lib/solar/tariffData";
import { hasFormErrors, validateSimulationForm } from "@/lib/solar/validate";
import type {
  PropertyType,
  SimulationFormData,
  SimulationFormErrors,
  SimulationInput,
  SimulationResult,
  RoofOrientation,
  RoofTiltChoice,
} from "@/types/solar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface SolarSimulatorInitialValues {
  cidade?: string;
  estado?: string;
  consumo?: string;
}

const defaultForm: SimulationFormData = {
  cidade: "",
  estado: "SP",
  consumo: "",
  tipo: "residencial",
  orientacao: "norte",
  inclinacao: "nao_sei",
  moduloId: DEFAULT_MODULE_ID,
};

function buildSimulationInput(form: SimulationFormData): SimulationInput | null {
  const consumo = Number(form.consumo);
  if (!Number.isFinite(consumo) || !form.cidade.trim()) return null;

  return {
    cidade: form.cidade.trim(),
    estado: form.estado,
    consumoMensalKwh: consumo,
    tipoImovel: form.tipo as PropertyType,
    orientacaoTelhado: form.orientacao,
    moduloId: form.moduloId,
    inclinacaoEscolha: form.inclinacao,
  };
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
  const [ghiPreview, setGhiPreview] = useState<ReturnType<typeof lookupGHI> | null>(null);
  const [ghiPreviewLoading, setGhiPreviewLoading] = useState(false);
  const tariffPreview = useMemo(
    () => lookupTariff(form.estado),
    [form.estado],
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ghiDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSimulatedParamsRef = useRef<{
    orientacao: RoofOrientation;
    inclinacao: RoofTiltChoice;
  } | null>(null);

  useEffect(() => {
    if (ghiDebounceRef.current) clearTimeout(ghiDebounceRef.current);

    const cidade = form.cidade.trim();
    if (cidade.length < 2) {
      setTimeout(() => {
        setGhiPreview(null);
        setGhiPreviewLoading(false);
      }, 0);
      return;
    }

    const loadingTimer = setTimeout(() => setGhiPreviewLoading(true), 0);
    ghiDebounceRef.current = setTimeout(() => {
      setGhiPreview(lookupGHI(cidade, form.estado));
      setGhiPreviewLoading(false);
    }, 280);

    return () => {
      clearTimeout(loadingTimer);
      if (ghiDebounceRef.current) clearTimeout(ghiDebounceRef.current);
    };
  }, [form.cidade, form.estado]);

  const recalculateIfSimulated = useCallback(
    (formData: SimulationFormData) => {
      if (!hasSimulated || loading) return;

      const last = lastSimulatedParamsRef.current;
      if (
        last &&
        last.orientacao === formData.orientacao &&
        last.inclinacao === formData.inclinacao
      ) {
        return;
      }

      const input = buildSimulationInput(formData);
      if (!input) return;

      const simulation = calculateSolarSimulation(input);

      setGhiPreview(simulation.ghiLookup);
      setResult(simulation);
      setAnimationKey((k) => k + 1);
      lastSimulatedParamsRef.current = {
        orientacao: formData.orientacao,
        inclinacao: formData.inclinacao,
      };
    },
    [hasSimulated, loading],
  );

  const updateField = useCallback(
    <K extends keyof SimulationFormData>(
      field: K,
      value: SimulationFormData[K],
    ) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };

        if (field === "orientacao" || field === "inclinacao") {
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

  const selectCity = useCallback(
    (cidade: string, estado: string) => {
      setForm((prev) => ({ ...prev, cidade, estado }));
      setGhiPreview(lookupGHI(cidade, estado));
      setGhiPreviewLoading(false);
      setErrors((prev) => {
        if (!prev.cidade) return prev;
        const next = { ...prev };
        delete next.cidade;
        return next;
      });
    },
    [],
  );

  const submit = useCallback(() => {
    const validationErrors = validateSimulationForm(form);
    setErrors(validationErrors);

    if (hasFormErrors(validationErrors)) {
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

      setGhiPreview(simulation.ghiLookup);
      setResult(simulation);
      lastSimulatedParamsRef.current = {
        orientacao: form.orientacao,
        inclinacao: form.inclinacao,
      };
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
  }, [form]);

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
    ghiPreview,
    ghiPreviewLoading,
    tariffPreview,
    updateField,
    selectCity,
    handleSubmit,
  };
}

export type UseSolarSimulatorReturn = ReturnType<typeof useSolarSimulator>;
