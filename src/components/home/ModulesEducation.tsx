import { Maximize2, PanelsTopLeft } from "lucide-react";

export function ModulesEducation() {
  return (
    <div className="mt-6 rounded-2xl border border-navy-800/8 bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
          <PanelsTopLeft className="h-5 w-5 text-navy-700" />
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-navy-900">
            Módulos mais potentes = menos espaço
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-navy-700/70">
            Painéis com mais watts geram mais energia na mesma área de telhado. Por
            isso, um módulo de <strong>610 W</strong> pode precisar de menos placas
            que um de <strong>550 W</strong> para o mesmo consumo.
          </p>

          <div className="mt-4 flex items-end justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-3 rounded-sm bg-navy-800/25"
                    title="550 W"
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium text-navy-700/50">550 W · 6 placas</span>
            </div>
            <Maximize2 className="mb-6 h-4 w-4 text-solar-600/60" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-3.5 rounded-sm bg-gradient-to-t from-solar-600 to-solar-400"
                    title="610 W"
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-solar-700">610 W · 5 placas</span>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-navy-700/45">
            Ilustração: mesma energia, menos painéis no modelo mais potente
          </p>
        </div>
      </div>
    </div>
  );
}
