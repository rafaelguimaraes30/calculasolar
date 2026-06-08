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
      />
    </>
  );
}
