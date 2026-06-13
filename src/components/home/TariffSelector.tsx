"use client";

import { fieldClassName, FormField } from "@/components/ui/FormField";
import {
  getTarifaByKey,
  getTarifaEfetivaKwh,
  getTarifaOptionByKey,
  getTarifaOptionsCountByUf,
  resolveTarifaParaSimulacao,
  searchTarifaConcessionariaOptions,
  type TarifaConcessionariaOption,
} from "@/lib/solar/tarifasCursorData";
import type { TarifaModo } from "@/types/solar";
import { Receipt, Search } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

interface TariffSelectorProps {
  estado: string;
  tarifaModo: TarifaModo;
  tarifaConcessionariaKey: string;
  tarifaManual: string;
  onModoChange: (modo: TarifaModo) => void;
  onConcessionariaChange: (key: string) => void;
  onManualChange: (value: string) => void;
  errors?: {
    tarifaConcessionariaKey?: string;
    tarifaManual?: string;
  };
}

export function TariffSelector({
  estado,
  tarifaModo,
  tarifaConcessionariaKey,
  tarifaManual,
  onModoChange,
  onConcessionariaChange,
  onManualChange,
  errors,
}: TariffSelectorProps) {
  const MAX_SUGGESTIONS = 10;
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TarifaConcessionariaOption[]>([]);

  const totalTarifas = getTarifaOptionsCountByUf(estado);

  const selectedOption = useMemo(
    () => getTarifaOptionByKey(tarifaConcessionariaKey),
    [tarifaConcessionariaKey],
  );

  const selectedRecord = useMemo(
    () =>
      tarifaModo === "concessionaria" && tarifaConcessionariaKey
        ? getTarifaByKey(tarifaConcessionariaKey)
        : undefined,
    [tarifaModo, tarifaConcessionariaKey],
  );

  const preview = useMemo(() => {
    if (tarifaModo === "manual") {
      const manual = Number(tarifaManual.replace(",", "."));
      if (!Number.isFinite(manual) || manual <= 0) return null;
      return resolveTarifaParaSimulacao({
        estado,
        tarifaModo: "manual",
        tarifaManualKwh: manual,
      });
    }
    return resolveTarifaParaSimulacao({
      estado,
      tarifaModo: "concessionaria",
      tarifaConcessionariaKey,
    });
  }, [estado, tarifaModo, tarifaConcessionariaKey, tarifaManual]);

  const refreshSuggestions = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (trimmed.length === 0) {
        setSuggestions([]);
        setOpen(false);
        return;
      }

      const results = searchTarifaConcessionariaOptions(query, estado, MAX_SUGGESTIONS);
      setSuggestions(results);
      setHighlightIndex(0);
      setOpen(true);
    },
    [estado],
  );

  const trimmedQuery = searchQuery.trim();
  const showDropdown = open && trimmedQuery.length > 0;

  const inputValue =
    searchQuery.trim().length > 0
      ? searchQuery
      : (selectedOption?.label ?? searchQuery);

  const [prevEstado, setPrevEstado] = useState(estado);
  if (estado !== prevEstado) {
    setPrevEstado(estado);
    setSearchQuery("");
    setSuggestions([]);
    setOpen(false);
  }

  useEffect(() => {
    if (tarifaModo !== "concessionaria" || trimmedQuery.length === 0) return;

    const timer = setTimeout(() => refreshSuggestions(searchQuery), 150);
    return () => clearTimeout(timer);
  }, [searchQuery, trimmedQuery, estado, tarifaModo, refreshSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(key: string, label: string) {
    onConcessionariaChange(key);
    setSearchQuery(label);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && showDropdown) {
      e.preventDefault();
      const picked = suggestions[highlightIndex];
      if (picked) selectOption(picked.key, picked.label);
    }
  }

  return (
    <div className="sm:col-span-2">
      <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-900">
        <Receipt className="h-4 w-4 text-solar-600" />
        Tarifa de energia
      </span>

      <div className="space-y-4 rounded-2xl border border-navy-800/10 bg-gradient-to-b from-slate-50/80 to-white p-4 sm:p-5">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy-800/10 bg-white px-4 py-3 transition-colors hover:border-solar-500/30">
          <input
            type="checkbox"
            checked={tarifaModo === "manual"}
            onChange={(e) =>
              onModoChange(e.target.checked ? "manual" : "concessionaria")
            }
            className="mt-1 h-4 w-4 rounded border-navy-800/20 text-solar-500 focus:ring-solar-500"
          />
          <span>
            <span className="block text-sm font-semibold text-navy-900">
              Informar tarifa manualmente
            </span>
            <span className="mt-0.5 block text-xs text-navy-700/60">
              Ignora a tarifa da concessionária e usa o valor que você informar
            </span>
          </span>
        </label>

        {tarifaModo === "concessionaria" ? (
          <FormField
            id="tarifa-concessionaria"
            label="Concessionária"
            error={errors?.tarifaConcessionariaKey}
            hint={`${totalTarifas} tarifas em ${estado} — busque por distribuidora, subgrupo ou classe`}
          >
            <div
              ref={containerRef}
              className={`relative ${errors?.tarifaConcessionariaKey ? "rounded-xl ring-2 ring-red-400/50" : ""}`}
            >
              <div className="relative">
                <input
                  id="tarifa-concessionaria"
                  type="text"
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={showDropdown}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  placeholder="Buscar concessionária (ex.: CPFL, CEMIG, ENEL...)"
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    if (!value.trim()) {
                      onConcessionariaChange("");
                      setSuggestions([]);
                      setOpen(false);
                    }
                  }}
                  onFocus={(e) => {
                    setOpen(false);
                    e.target.select();
                  }}
                  onKeyDown={handleKeyDown}
                  aria-invalid={!!errors?.tarifaConcessionariaKey}
                  className={`${fieldClassName(!!errors?.tarifaConcessionariaKey)} pr-10`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-700/40">
                  <Search className="h-4 w-4" />
                </span>
              </div>

              {showDropdown && suggestions.length === 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-navy-800/10 bg-white px-4 py-3 text-sm text-navy-700/60 shadow-xl shadow-navy-900/10 animate-fade-in">
                  Nenhuma concessionária encontrada.
                </div>
              )}

              {showDropdown && suggestions.length > 0 && (
                <ul
                  id={listId}
                  role="listbox"
                  className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-navy-800/10 bg-white py-1 shadow-xl shadow-navy-900/10 animate-fade-in"
                >
                  {suggestions.map((opt, index) => (
                    <li
                      key={opt.key}
                      role="option"
                      aria-selected={index === highlightIndex}
                    >
                      <button
                        type="button"
                        className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left text-sm transition-colors ${
                          index === highlightIndex
                            ? "bg-solar-500/15 text-navy-900"
                            : "text-navy-800 hover:bg-slate-50"
                        }`}
                        onMouseEnter={() => setHighlightIndex(index)}
                        onClick={() => selectOption(opt.key, opt.label)}
                      >
                        <span className="font-medium">{opt.record.distribuidora}</span>
                        <span className="text-xs text-navy-700/60">
                          {opt.record.subgrupo} · {opt.record.classe} · {opt.record.uf} ·{" "}
                          R${" "}
                          {getTarifaEfetivaKwh(opt.record, opt.record.uf).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          /kWh
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FormField>
        ) : (
          <FormField
            id="tarifa-manual"
            label="Tarifa manual (R$/kWh)"
            error={errors?.tarifaManual}
            hint="Valor total da energia na sua fatura"
          >
            <input
              id="tarifa-manual"
              type="number"
              inputMode="decimal"
              min={0.01}
              step={0.01}
              placeholder="Ex: 0,92"
              value={tarifaManual}
              onChange={(e) => onManualChange(e.target.value)}
              aria-invalid={!!errors?.tarifaManual}
              className={fieldClassName(!!errors?.tarifaManual)}
            />
          </FormField>
        )}

        {selectedRecord && tarifaModo === "concessionaria" && (
          <div className="grid gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-navy-700/50">
                Distribuidora
              </p>
              <p className="font-semibold text-navy-900">
                {selectedRecord.distribuidora}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-navy-700/50">
                UF / Região
              </p>
              <p className="font-semibold text-navy-900">
                {selectedRecord.uf} · {selectedRecord.regiao}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-navy-700/50">
                Tarifa efetiva
              </p>
              <p className="text-lg font-bold text-navy-900">
                R${" "}
                {getTarifaEfetivaKwh(selectedRecord, selectedRecord.uf).toLocaleString(
                  "pt-BR",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                )}
                /kWh
              </p>
            </div>
          </div>
        )}

        {preview && (
          <div className="rounded-xl border border-navy-800/10 bg-white/90 px-4 py-3 text-sm">
            <p className="font-semibold text-navy-900">
              Tarifa utilizada no cálculo: R${" "}
              {preview.tarifaKwh.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              /kWh
            </p>
            <p className="mt-1 text-xs text-navy-700/60">{preview.lookup.mensagem}</p>
          </div>
        )}
      </div>
    </div>
  );
}
