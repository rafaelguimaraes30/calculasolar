"use client";

import { useSolarSimulator } from "@/hooks/useSolarSimulator";
import { Results } from "./Results";
import { Simulator } from "./Simulator";

export function SolarSimulation() {
  const simulator = useSolarSimulator();

  return (
    <>
      <Simulator simulator={simulator} />
      <Results
        result={simulator.result}
        loading={simulator.loading}
        hasSimulated={simulator.hasSimulated}
        animationKey={simulator.animationKey}
        loadingHspLabel={
          simulator.hspPreview
            ? `HSP ${simulator.hspPreview.hsp.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h/dia · ${simulator.hspPreview.mensagem}`
            : null
        }
      />
    </>
  );
}
