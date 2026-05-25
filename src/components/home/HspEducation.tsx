import { Lightbulb, Sun } from "lucide-react";

export function HspEducation() {
  return (
    <div className="mt-10 rounded-2xl border border-navy-800/8 bg-gradient-to-br from-solar-500/8 to-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-solar-500/20">
          <Sun className="h-5 w-5 text-solar-600" />
        </span>
        <div>
          <h3 className="text-base font-bold text-navy-900">O que é HSP?</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-700/75">
            <strong className="font-semibold text-navy-900">HSP</strong> significa{" "}
            <strong className="font-semibold text-navy-900">Horas de Sol Pleno</strong>.
            É um número simples que diz{" "}
            <em>quanto sol “forte” sua cidade recebe por dia</em>, em média.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-navy-700/75">
            Quanto <strong className="text-navy-900">maior o HSP</strong>, mais energia os
            painéis produzem no mesmo telhado. Por isso usamos o HSP da sua cidade (ou a
            média do estado) para calcular quantos painéis você precisa.
          </p>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-white/80 px-3 py-2 text-xs text-navy-700/70">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-solar-600" />
            Exemplo: HSP 5,0 ≈ cerca de 5 horas por dia com sol ideal para gerar energia.
          </p>
        </div>
      </div>
    </div>
  );
}
