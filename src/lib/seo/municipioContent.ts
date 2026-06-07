import type { MunicipioSearchResult } from "@/lib/solar/municipiosData";
import type { MunicipioSolarPreview } from "@/lib/solar/municipioPreview";
import { formatDecimal } from "@/lib/solar/format";

type GhiTier = "excelente" | "bom" | "moderado";

function classifyGhi(ghi: number): GhiTier {
  if (ghi >= 5.5) return "excelente";
  if (ghi >= 5.0) return "bom";
  return "moderado";
}

const GHI_INTRO: Record<GhiTier, string> = {
  excelente:
    "apresenta um dos melhores índices de irradiação solar do país, ideal para sistemas fotovoltaicos de alta performance",
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
    ghi: string;
    geracaoAnual: string;
    geracaoMensal: string;
    economiaAnual: string;
    hsp: string;
  },
): MunicipioSeoSection[] {
  const tier = classifyGhi(preview.ghiMedio);
  const regiao = REGION_LABELS[municipio.uf] ?? "Brasil";
  const tilt = formatDecimal(preview.tiltIdeal, 1);

  return [
    {
      paragraphs: [
        `${municipio.nome}, localizada na região ${regiao} (${municipio.uf}), ${GHI_INTRO[tier]}. ` +
          `Com GHI médio de ${fmt.ghi}, a cidade permite dimensionar sistemas fotovoltaicos com dados reais de irradiação.`,
        `Para referência, um sistema residencial de 5 kWp instalado em ${municipio.nome} — com telhado voltado ao Norte, ` +
          `inclinação ideal de ${tilt}° e HSP efetivo de ${fmt.hsp} — pode gerar cerca de ${fmt.geracaoAnual} ` +
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
          : `${municipio.nome} conta com irradiação suficiente para atender residências e pequenos comércios ` +
            "com sistemas bem dimensionados.",
        `Use o simulador CalculaSolar para informar seu consumo mensal em kWh e obter o dimensionamento personalizado ` +
          `para ${municipio.nome}-${municipio.uf}, com dados de GHI, tarifa e módulos atualizados.`,
      ],
    },
  ];
}
