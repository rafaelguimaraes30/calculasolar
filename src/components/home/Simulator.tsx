"use client";

import { fieldClassName, FormField } from "@/components/ui/FormField";
import type { UseSolarSimulatorReturn } from "@/hooks/useSolarSimulator";
import { ESTADOS_BR } from "@/lib/solar/constants";
import { Building2, Home, Loader2, Zap } from "lucide-react";
import { CityAutocomplete } from "./CityAutocomplete";
import { HspEducation } from "./HspEducation";
import { HspPreviewBadge } from "./HspPreviewBadge";
import { TariffPreviewBadge } from "./TariffPreviewBadge";
import { ModuleSelector } from "./ModuleSelector";
import { FinancialEducation } from "./FinancialEducation";
import { ModulesEducation } from "./ModulesEducation";
import { RoofOrientationPicker } from "./RoofOrientationPicker";

interface SimulatorProps {
  simulator: UseSolarSimulatorReturn;
}

export function Simulator({ simulator }: SimulatorProps) {
  const {
    form,
    errors,
    loading,
    hspPreview,
    hspPreviewLoading,
    tariffPreview,
    updateField,
    selectCity,
    resolveHspPreview,
    handleSubmit,
  } = simulator;

  return (
    <section id="simulador" className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-solar-600">
              Simulador
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Faça sua simulação agora
            </h2>
            <p className="mt-4 text-lg text-navy-700/70">
              Usamos o sol real da sua região (HSP por cidade) para dimensionar painéis,
              geração e payback com mais precisão.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "HSP automático por cidade e estado",
                "Escolha fabricante e potência do módulo",
                "Investimento por faixa de kWp do mercado BR",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm text-navy-700/80">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-solar-500/20">
                    <Zap className="h-3 w-3 text-solar-600" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <HspEducation />
            <ModulesEducation />
            <FinancialEducation />
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass-light rounded-3xl border border-navy-800/10 p-6 shadow-xl shadow-navy-900/5 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <FormField
                    id="cidade"
                    label="Cidade"
                    error={errors.cidade}
                    hint="Comece a digitar — sugestões com HSP da região"
                  >
                    <CityAutocomplete
                      cidade={form.cidade}
                      estado={form.estado}
                      onCidadeChange={(value) => updateField("cidade", value)}
                      onSelectCity={(record) =>
                        selectCity(record.cidade, record.estado)
                      }
                      onHspResolved={resolveHspPreview}
                      error={errors.cidade}
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-1">
                  <FormField id="estado" label="Estado" error={errors.estado}>
                    <select
                      id="estado"
                      value={form.estado}
                      onChange={(e) => updateField("estado", e.target.value)}
                      aria-invalid={!!errors.estado}
                      className={`${fieldClassName(!!errors.estado)} appearance-none`}
                    >
                      {ESTADOS_BR.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <TariffPreviewBadge lookup={tariffPreview} />
                  {(hspPreview || hspPreviewLoading) && (
                    <HspPreviewBadge lookup={hspPreview} loading={hspPreviewLoading} />
                  )}
                </div>

                <div className="sm:col-span-2">
                  <FormField
                    id="consumo"
                    label={
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-solar-600" />
                        Consumo mensal (kWh)
                      </span>
                    }
                    error={errors.consumo}
                    hint='Encontre na sua fatura de energia, campo "consumo kWh"'
                  >
                    <input
                      id="consumo"
                      type="number"
                      inputMode="decimal"
                      min={50}
                      step={1}
                      placeholder="Ex: 350"
                      value={form.consumo}
                      onChange={(e) => updateField("consumo", e.target.value)}
                      aria-invalid={!!errors.consumo}
                      className={fieldClassName(!!errors.consumo)}
                    />
                  </FormField>
                </div>

                <RoofOrientationPicker
                  value={form.orientacao}
                  onChange={(orientacao) => updateField("orientacao", orientacao)}
                  error={errors.orientacao}
                />

                <ModuleSelector
                  moduloId={form.moduloId}
                  onModuleChange={(id) => updateField("moduloId", id)}
                  error={errors.moduloId}
                />

                <div className="sm:col-span-2">
                  <span className="mb-3 block text-sm font-semibold text-navy-900">
                    Tipo de imóvel
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "residencial" as const, label: "Residencial", icon: Home },
                        { value: "comercial" as const, label: "Comercial", icon: Building2 },
                      ] as const
                    ).map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateField("tipo", value)}
                        className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-semibold transition-all ${
                          form.tipo === value
                            ? "border-solar-500 bg-solar-500/10 text-navy-900"
                            : "border-navy-800/10 bg-white text-navy-700/70 hover:border-navy-800/20"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.tipo && (
                    <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                      {errors.tipo}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-navy-800 to-navy-900 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-navy-700 hover:to-navy-800 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {loading && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
                )}
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {hspPreview
                      ? `Calculando com HSP ${hspPreview.hsp.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h/dia...`
                      : "Calculando dimensionamento..."}
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 text-solar-400" />
                    Calcular meu sistema solar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
