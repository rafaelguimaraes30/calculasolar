import type { MunicipioSearchResult } from "@/lib/solar/municipiosData";
import type { MunicipioSolarPreview } from "@/lib/solar/municipioPreview";
import { formatDecimal } from "@/lib/solar/format";

type SolarTier = "excelente" | "bom" | "moderado";

function classifySolarPotential(ghiMedio: number): SolarTier {
  if (ghiMedio >= 5.5) return "excelente";
  if (ghiMedio >= 5.0) return "bom";
  return "moderado";
}

const SOLAR_INTRO: Record<SolarTier, string> = {
  excelente:
    "apresenta excelente potencial para sistemas fotovoltaicos de alta performance",
  bom: "oferece condições favoráveis para geração de energia solar, com bom retorno sobre investimento",
  moderado:
    "possui potencial solar viável, especialmente com orientação e inclinação adequadas do telhado",
};

const REGION_LABELS: Record<string, string> = {
  AC: "Norte", AL: "Nordeste", AP: "Norte", AM: "Norte", BA: "Nordeste",
  CE: "Nordeste", DF: "Centro-Oeste", ES: "Sudeste", GO: "Centro-Oeste",
  MA: "Nordeste", MG: "Sudeste", MS: "Centro-Oeste", MT: "Centro-Oeste",
  PA: "Norte", PB: "Nordeste", PR: "Sul", PE: "Nordeste", PI: "Nordeste",
  RJ: "Sudeste", RN: "Nordeste", RS: "Sul", RO: "Norte", RR: "Norte",
  SC: "Sul", SP: "Sudeste", SE: "Nordeste", TO: "Norte",
};

export interface MunicipioSeoSection {
  heading?: string;
  paragraphs: string[];
}

export function buildMunicipioSeoSections(
  municipio: MunicipioSearchResult,
  preview: MunicipioSolarPreview,
  fmt: {
    geracaoAnual: string;
    geracaoMensal: string;
    economiaAnual: string;
  },
): MunicipioSeoSection[] {
  const tier = classifySolarPotential(preview.ghiMedio);
  const regiao = REGION_LABELS[municipio.uf] ?? "Brasil";
  const tilt = formatDecimal(preview.tiltIdeal, 1);

  return [
    {
      paragraphs: [
        `${municipio.nome}, localizada na região ${regiao} (${municipio.uf}), ${SOLAR_INTRO[tier]}. ` +
          `A cidade permite dimensionar sistemas fotovoltaicos com dados reais de localização e tarifa.`,
        `Para referência, um sistema residencial de 5 kWp instalado em ${municipio.nome} — com telhado voltado ao Norte ` +
          `e inclinação ideal de ${tilt}° — pode gerar cerca de ${fmt.geracaoAnual} ` +
          `(${fmt.geracaoMensal} em média).`,
      ],
    },
    {
      heading: "Economia e viabilidade",
      paragraphs: [
        `Considerando a tarifa média de R$ ${formatDecimal(preview.tarifaKwh, 2)}/kWh em ${municipio.uf}, ` +
          `a economia anual estimada com 5 kWp é de ${fmt.economiaAnual}. ` +
          `Valores reais variam conforme consumo, sombreamento e equipamentos escolhidos.`,
        `A orientação recomendada para máxima eficiência no Brasil é o telhado voltado ao Norte. ` +
          `Inclinações próximas à latitude local (${tilt}° em ${municipio.nome}) maximizam a captura solar ao longo do ano.`,
      ],
    },
    {
      heading: `Por que instalar energia solar em ${municipio.nome}?`,
      paragraphs: [
        tier === "excelente"
          ? `${municipio.nome} está entre os municípios com maior potencial solar do Brasil, ` +
            "o que reduz o tempo de retorno do investimento em painéis fotovoltaicos."
          : `${municipio.nome} conta com potencial suficiente para atender residências e pequenos comércios ` +
            "com sistemas bem dimensionados.",
        `Use o simulador CalculaSolar para informar seu consumo mensal em kWh e obter o dimensionamento personalizado ` +
          `para ${municipio.nome}-${municipio.uf}, com tarifa e módulos atualizados.`,
      ],
    },
  ];
}
