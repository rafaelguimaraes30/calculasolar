"use client";

import type { SolarSimulatorInitialValues } from "@/hooks/useSolarSimulator";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const SolarSimulation = dynamic(
  () =>
    import("@/components/home/SolarSimulation").then((m) => ({
      default: m.SolarSimulation,
    })),
  {
    loading: () => (
      <div className="flex min-h-[480px] items-center justify-center bg-background py-24">
        <div className="flex flex-col items-center gap-3 text-navy-700/60">
          <Loader2 className="h-8 w-8 animate-spin text-solar-500" />
          <p className="text-sm font-medium">Carregando simulador...</p>
        </div>
      </div>
    ),
    ssr: false,
  },
);

interface SimuladorClientProps {
  initial: SolarSimulatorInitialValues;
}

export function SimuladorClient({ initial }: SimuladorClientProps) {
  return <SolarSimulation initial={initial} />;
}
