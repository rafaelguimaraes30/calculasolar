import { toMunicipioSlug } from "@/lib/seo/slug";
import { calculateMunicipioSolarPreview, formatMunicipioPreview } from "@/lib/solar/municipioPreview";
import { DEFAULT_MODULE_ID, getModuleById } from "@/lib/solar/modulesData";
import { calculateSolarSimulation } from "@/lib/solar/calculate";
import { PERFORMANCE_RATIO } from "@/lib/solar/constants";
import { formatDecimal, formatInteger } from "@/lib/solar/format";

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: "guia" | "cidade" | "equipamento";
  /** Conteúdo HTML-safe em parágrafos markdown simples */
  sections: { heading?: string; paragraphs: string[] }[];
}

function painel550Simulation() {
  const modulo = getModuleById("jinko-tiger-neo-550") ?? getModuleById(DEFAULT_MODULE_ID)!;
  const result = calculateSolarSimulation({
    cidade: "Goiânia",
    estado: "GO",
    consumoMensalKwh: 220,
    tipoImovel: "residencial",
    orientacaoTelhado: "norte",
    moduloId: modulo.id,
    inclinacaoEscolha: "nao_sei",
  });
  const geracaoPainel = result.geracaoMensalKwh / result.quantidadeModulos;
  return { modulo, geracaoPainel, result };
}

function sistema5KwpSimulation() {
  const preview = calculateMunicipioSolarPreview("Goiânia", "GO");
  const fmt = formatMunicipioPreview(preview);
  return { preview, fmt };
}

function cidadeArticle(cidade: string, uf: string): BlogArticle {
  const preview = calculateMunicipioSolarPreview(cidade, uf);
  const fmt = formatMunicipioPreview(preview);
  const slug = `energia-solar-em-${toMunicipioSlug(cidade, uf)}`;

  return {
    slug,
    title: `Energia Solar em ${cidade}`,
    description: `Descubra o potencial de energia solar em ${cidade}-${uf}. GHI médio de ${fmt.ghi}, geração estimada e economia anual com sistema de 5 kWp.`,
    keywords: ["energia solar", cidade, uf, "GHI", "painéis solares", "fotovoltaico"],
    category: "cidade",
    sections: [
      {
        paragraphs: [
          `${cidade} possui irradiação solar média de ${fmt.ghi}, o que representa excelente potencial para sistemas fotovoltaicos.`,
          `Um sistema residencial de 5 kWp, com telhado voltado ao Norte e inclinação ideal de ${formatDecimal(preview.tiltIdeal, 1)}°, pode gerar cerca de ${fmt.geracaoAnual} por ano.`,
        ],
      },
      {
        heading: "Economia estimada",
        paragraphs: [
          `Com tarifa média regional, a economia anual estimada é de ${fmt.economiaAnual}, considerando PR de ${PERFORMANCE_RATIO}.`,
          `Use nosso simulador gratuito para dimensionar o sistema ideal para o seu consumo em ${cidade}-${uf}.`,
        ],
      },
    ],
  };
}

const painel550 = painel550Simulation();
const sistema5 = sistema5KwpSimulation();

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "quanto-gera-um-painel-de-550w",
    title: "Quanto gera um painel de 550W?",
    description:
      "Entenda a geração mensal de um módulo fotovoltaico de 550 W com dados reais de irradiação e orientação do telhado.",
    keywords: ["painel 550W", "geração solar", "módulo fotovoltaico", "kWh"],
    category: "equipamento",
    sections: [
      {
        paragraphs: [
          `Um módulo ${painel550.modulo.fabricante} ${painel550.modulo.modelo} (${painel550.modulo.potenciaW} W), em condições típicas de Goiânia-GO com telhado ao Norte, gera aproximadamente ${formatInteger(painel550.geracaoPainel)} kWh por mês.`,
          `A geração real depende da cidade (GHI), orientação, inclinação do telhado e sombreamento. O CalculaSolar utiliza dados de irradiação por município para estimar com mais precisão.`,
        ],
      },
      {
        heading: "Fatores que influenciam",
        paragraphs: [
          "Orientação do telhado: Norte é a mais eficiente no Brasil.",
          "Inclinação: próxima à latitude local maximiza a captura.",
          "Irradiação (GHI): varia significativamente entre regiões.",
        ],
      },
    ],
  },
  {
    slug: "quanto-gera-um-sistema-de-5-kwp",
    title: "Quanto gera um sistema de 5 kWp?",
    description:
      "Veja quanto um sistema fotovoltaico de 5 kWp gera por mês e por ano, com base em dados reais de irradiação solar.",
    keywords: ["5 kWp", "geração solar", "sistema fotovoltaico", "economia"],
    category: "guia",
    sections: [
      {
        paragraphs: [
          `Um sistema de 5 kWp em Goiânia-GO gera em média ${sistema5.fmt.geracaoMensal} (${sistema5.fmt.geracaoAnual}), com HSP efetivo de ${sistema5.fmt.hsp}.`,
          `A economia anual estimada é de ${sistema5.fmt.economiaAnual}, considerando a tarifa média da região.`,
        ],
      },
      {
        heading: "Como calcular para sua cidade",
        paragraphs: [
          "Cada município possui GHI diferente. Use o simulador CalculaSolar informando sua cidade para obter números personalizados.",
        ],
      },
    ],
  },
  cidadeArticle("Goiânia", "GO"),
  cidadeArticle("Curitiba", "PR"),
  cidadeArticle("Campo Grande", "MS"),
  cidadeArticle("Belo Horizonte", "MG"),
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_ARTICLES.map((a) => a.slug);
}
