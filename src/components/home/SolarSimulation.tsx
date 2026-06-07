"use client";

import {
  useSolarSimulator,
  type SolarSimulatorInitialValues,
} from "@/hooks/useSolarSimulator";
import { Results } from "./Results";
import { Simulator } from "./Simulator";

interface SolarSimulationProps {
  initial?: SolarSimulatorInitialValues;
}

export function SolarSimulation({ initial }: SolarSimulationProps) {
  const simulator = useSolarSimulator(initial);

  return (
    <>
      <Simulator simulator={simulator} />
      <Results
        result={simulator.result}
        loading={simulator.loading}
        hasSimulated={simulator.hasSimulated}
        animationKey={simulator.animationKey}
        loadingGhiLabel={
          simulator.ghiPreview
            ? `GHI ${simulator.ghiPreview.ghi.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kWh/m²/dia · ${simulator.ghiPreview.mensagem}`
            : null
        }
      />
    </>
  );
}
