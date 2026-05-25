import { LineChart, Wallet } from "lucide-react";

export function FinancialEducation() {
  return (
    <div className="mt-6 rounded-2xl border border-navy-800/8 bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <Wallet className="h-5 w-5 text-emerald-700" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-navy-900">Payback simples vs ajustado</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-navy-700/70">
            O <strong>payback simples</strong> divide o investimento pela economia de hoje. O{" "}
            <strong>payback ajustado</strong> considera que a conta de luz costuma subir todo
            ano — então você “se paga” mais rápido na vida real.
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] text-navy-700/50">
            <LineChart className="h-3.5 w-3.5" />
            Custo do sistema varia por tamanho (faixas de kWp do mercado brasileiro).
          </p>
        </div>
      </div>
    </div>
  );
}
