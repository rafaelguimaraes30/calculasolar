"use client";

import {
  getManufacturers,
  getModuleById,
  getPowersByManufacturer,
  getModulesDataProvider,
} from "@/lib/solar/modulesData";
import { Cpu, Zap } from "lucide-react";
import { useMemo } from "react";

interface ModuleSelectorProps {
  moduloId: string;
  onModuleChange: (moduloId: string) => void;
  error?: string;
}

export function ModuleSelector({
  moduloId,
  onModuleChange,
  error,
}: ModuleSelectorProps) {
  const current = getModuleById(moduloId);
  const fabricantes = useMemo(() => getManufacturers(), []);
  const fabricante = current?.fabricante ?? fabricantes[0];
  // Evita memoização manual que pode impedir otimizações do React Compiler.
  const potencias = getPowersByManufacturer(fabricante);

  const handleFabricante = (novoFabricante: string) => {
    const powers = getPowersByManufacturer(novoFabricante);
    const targetPower = current?.potenciaW ?? powers[0];
    const closest =
      powers.find((p) => p === targetPower) ?? powers[powers.length - 1];
    const modulo = getModulesDataProvider().findByManufacturerAndPower(
      novoFabricante,
      closest,
    );
    if (modulo) onModuleChange(modulo.id);
  };

  const handlePotencia = (potenciaW: number) => {
    const modulo = getModulesDataProvider().findByManufacturerAndPower(
      fabricante,
      potenciaW,
    );
    if (modulo) onModuleChange(modulo.id);
  };

  return (
    <div id="moduloId" className="sm:col-span-2">
      <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-900">
        <Cpu className="h-4 w-4 text-solar-600" />
        Módulo fotovoltaico
      </span>

      <div
        className={`rounded-2xl border bg-gradient-to-b from-slate-50/80 to-white p-4 sm:p-5 ${
          error ? "border-red-400" : "border-navy-800/10"
        }`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fabricante" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy-700/55">
              Fabricante
            </label>
            <select
              id="fabricante"
              value={fabricante}
              onChange={(e) => handleFabricante(e.target.value)}
              className="w-full appearance-none rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm font-medium text-navy-900 outline-none transition-all focus:border-solar-500 focus:ring-2 focus:ring-solar-500/20"
            >
              {fabricantes.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-navy-700/55">
              Potência
            </span>
            <div className="flex flex-wrap gap-2">
              {potencias.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => handlePotencia(w)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm font-bold transition-all ${
                    current?.potenciaW === w
                      ? "border-solar-500 bg-solar-500/15 text-navy-900"
                      : "border-navy-800/10 bg-white text-navy-700/70 hover:border-solar-500/40"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  {w} W
                </button>
              ))}
            </div>
          </div>
        </div>

        {current && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-navy-800/8 pt-4 text-xs text-navy-700/65">
            <span>
              <strong className="text-navy-900">{current.modelo}</strong>
            </span>
            <span>{current.eficienciaPercent}% eficiência</span>
            <span>
              {(current.larguraMm / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} ×{" "}
              {(current.alturaMm / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m
            </span>
            <span>{current.tipo}</span>
            <span className="font-semibold text-solar-700">
              {current.precoMedioReais.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
              /placa
            </span>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
