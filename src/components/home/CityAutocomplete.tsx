"use client";

import { fieldClassName } from "@/components/ui/FormField";
import { lookupGHI } from "@/lib/solar/ghiData";
import {
  searchMunicipios,
  type MunicipioSearchResult,
} from "@/lib/solar/municipiosData";
import { Loader2, MapPin } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

interface CityAutocompleteProps {
  cidade: string;
  estado: string;
  onCidadeChange: (value: string) => void;
  onSelectCity: (record: MunicipioSearchResult) => void;
  error?: string;
}

export function CityAutocomplete({
  cidade,
  estado,
  onCidadeChange,
  onSelectCity,
  error,
}: CityAutocompleteProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<MunicipioSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const refreshSuggestions = useCallback(
    (query: string) => {
      setSearching(true);
      const results = searchMunicipios(query, estado, 10);
      setSuggestions(results);
      setHighlightIndex(0);
      setSearching(false);
      setOpen(results.length > 0 && query.trim().length >= 2);
    },
    [estado],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cidade.trim().length >= 2) {
        refreshSuggestions(cidade);
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [cidade, estado, refreshSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectRecord(record: MunicipioSearchResult) {
    onSelectCity(record);
    onCidadeChange(record.nome);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      const picked = suggestions[highlightIndex];
      if (picked) selectRecord(picked);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function ghiPreview(record: MunicipioSearchResult): string {
    const lookup = lookupGHI(record.nome, record.uf);
    return lookup.ghi.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${error ? "rounded-xl ring-2 ring-red-400/50" : ""}`}
    >
      <div className="relative">
        <input
          id="cidade"
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="Digite sua cidade..."
          value={cidade}
          onChange={(e) => {
            onCidadeChange(e.target.value);
            if (e.target.value.trim().length >= 2) setOpen(true);
          }}
          onFocus={() => {
            if (cidade.trim().length >= 2 && suggestions.length) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-invalid={!!error}
          className={`${fieldClassName(!!error)} pr-10`}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-700/40">
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin text-solar-600" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </span>
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-navy-800/10 bg-white py-1 shadow-xl shadow-navy-900/10 animate-fade-in"
        >
          {suggestions.map((record, index) => (
            <li
              key={`${record.codigo_ibge}-${record.uf}`}
              role="option"
              aria-selected={index === highlightIndex}
            >
              <button
                type="button"
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  index === highlightIndex
                    ? "bg-solar-500/15 text-navy-900"
                    : "text-navy-800 hover:bg-slate-50"
                }`}
                onMouseEnter={() => setHighlightIndex(index)}
                onClick={() => selectRecord(record)}
              >
                <span className="font-medium">{record.label}</span>
                <span className="shrink-0 text-xs text-navy-700/50">
                  GHI {ghiPreview(record)} kWh/m²/dia
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
