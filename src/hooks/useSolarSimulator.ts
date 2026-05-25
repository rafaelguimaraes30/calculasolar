"use client";

import { calculateSolarSimulation } from "@/lib/solar/calculate";
import { LOADING_DURATION_MS } from "@/lib/solar/constants";
import { DEFAULT_MODULE_ID } from "@/lib/solar/modulesData";
import { lookupHsp, type HspLookupResult } from "@/lib/solar/solarData";
import { lookupTariff, type TariffLookupResult } from "@/lib/solar/tariffData";
import { hasFormErrors, validateSimulationForm } from "@/lib/solar/validate";
import type {
  PropertyType,
  SimulationFormData,
  SimulationFormErrors,
  SimulationResult,
} from "@/types/solar";
import { useCallback, useEffect, useRef, useState } from "react";

const initialForm: SimulationFormData = {
  cidade: "",
  estado: "SP",
  consumo: "",
  tipo: "residencial",
  orientacao: "norte",
  moduloId: DEFAULT_MODULE_ID,
};

export function useSolarSimulator() {
  const [form, setForm] = useState<SimulationFormData>(initialForm);
  const [errors, setErrors] = useState<SimulationFormErrors>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [hspPreview, setHspPreview] = useState<HspLookupResult | null>(null);
  const [hspPreviewLoading, setHspPreviewLoading] = useState(false);
  const [tariffPreview, setTariffPreview] = useState<TariffLookupResult | null>(
    () => lookupTariff(initialForm.estado),
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hspDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hspDebounceRef.current) clearTimeout(hspDebounceRef.current);

    const cidade = form.cidade.trim();
    if (cidade.length < 2) {
      setHspPreview(null);
      setHspPreviewLoading(false);
      return;
    }

    setHspPreviewLoading(true);
    hspDebounceRef.current = setTimeout(() => {
      setHspPreview(lookupHsp(cidade, form.estado));
      setHspPreviewLoading(false);
    }, 320);

    return () => {
      if (hspDebounceRef.current) clearTimeout(hspDebounceRef.current);
    };
  }, [form.cidade, form.estado]);

  useEffect(() => {
    setTariffPreview(lookupTariff(form.estado));
  }, [form.estado]);

  const updateField = useCallback(
    <K extends keyof SimulationFormData>(
      field: K,
      value: SimulationFormData[K],
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const selectCity = useCallback(
    (cidade: string, estado: string) => {
      setForm((prev) => ({ ...prev, cidade, estado }));
      setHspPreview(lookupHsp(cidade, estado));
      setHspPreviewLoading(false);
      setErrors((prev) => {
        if (!prev.cidade) return prev;
        const next = { ...prev };
        delete next.cidade;
        return next;
      });
    },
    [],
  );

  const resolveHspPreview = useCallback((lookup: HspLookupResult) => {
    setHspPreview(lookup);
    setHspPreviewLoading(false);
  }, []);

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
      const simulation = calculateSolarSimulation({
        cidade: form.cidade.trim(),
        estado: form.estado,
        consumoMensalKwh: Number(form.consumo),
        tipoImovel: form.tipo as PropertyType,
        orientacaoTelhado: form.orientacao,
        moduloId: form.moduloId,
      });

      setHspPreview(simulation.hspLookup);
      setResult(simulation);
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
    hspPreview,
    hspPreviewLoading,
    tariffPreview,
    updateField,
    selectCity,
    resolveHspPreview,
    handleSubmit,
  };
}

export type UseSolarSimulatorReturn = ReturnType<typeof useSolarSimulator>;
