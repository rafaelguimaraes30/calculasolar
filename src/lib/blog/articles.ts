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
    description: `Descubra o potencial de energia solar em ${cidade}-${uf}. Geração estimada e economia anual com sistema de 5 kWp.`,
    keywords: ["energia solar", cidade, uf, "painéis solares", "fotovoltaico"],
    category: "cidade",
    sections: [
      {
        paragraphs: [
          `${cidade} possui excelente potencial para sistemas fotovoltaicos residenciais e comerciais.`,
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
    slug: "como-funciona-energia-solar-economia-conta-luz",
    title: "Como funciona a energia solar e quanto você pode economizar na conta de luz",
    description:
      "Entenda como a energia solar fotovoltaica funciona, quanto você pode economizar na fatura de luz e como os créditos energéticos ajudam no Brasil.",
    keywords: [
      "energia solar",
      "economia conta de luz",
      "fotovoltaico",
      "créditos energéticos",
    ],
    category: "guia",
    sections: [
      {
        paragraphs: [
          "A energia solar fotovoltaica funciona a partir da conversão da luz do sol em eletricidade por meio de módulos solares instalados no telhado ou em áreas abertas. Esses módulos captam a radiação solar e a transformam em energia elétrica utilizável em residências, comércios e indústrias.",
        ],
      },
      {
        heading: "Economia na conta de luz",
        paragraphs: [
          "No Brasil, um dos principais atrativos da energia solar é a redução significativa na conta de luz. Em muitos casos, é possível reduzir até 90% do valor mensal da fatura, dependendo do consumo e do dimensionamento do sistema.",
        ],
      },
      {
        heading: "Créditos energéticos",
        paragraphs: [
          "O sistema é conectado à rede elétrica, permitindo que o excedente de energia seja injetado na rede e convertido em créditos energéticos. Esses créditos podem ser usados para abater o consumo em meses seguintes.",
        ],
      },
      {
        heading: "Sustentabilidade",
        paragraphs: [
          "Além da economia, a energia solar também contribui para a sustentabilidade, reduzindo a emissão de gases poluentes e diminuindo a dependência de fontes não renováveis.",
        ],
      },
    ],
  },
  {
    slug: "quanto-custa-instalar-energia-solar-2026",
    title: "Quanto custa instalar energia solar em casa em 2026?",
    description:
      "Saiba quanto custa um sistema residencial de energia solar em 2026, quais fatores influenciam o preço e em quanto tempo o investimento se paga.",
    keywords: [
      "custo energia solar",
      "preço painéis solares 2026",
      "sistema fotovoltaico residencial",
      "payback solar",
    ],
    category: "guia",
    sections: [
      {
        paragraphs: [
          "O custo de um sistema de energia solar residencial varia de acordo com o consumo de energia, a região e o tipo de equipamento utilizado. Em média, sistemas residenciais no Brasil podem variar entre R$ 8.000 e R$ 25.000 para residências de pequeno e médio porte.",
        ],
      },
      {
        heading: "Fatores que influenciam o custo",
        paragraphs: [
          "O principal fator que determina o custo é a quantidade de módulos fotovoltaicos necessários para suprir o consumo mensal da residência. Outros fatores incluem inversores, estrutura de fixação e mão de obra especializada.",
        ],
      },
      {
        heading: "Retorno do investimento",
        paragraphs: [
          "Apesar do investimento inicial, o sistema costuma se pagar em um período de 3 a 6 anos, dependendo da tarifa de energia local e do perfil de consumo.",
        ],
      },
      {
        heading: "Vida útil do sistema",
        paragraphs: [
          "Após o retorno do investimento, a energia gerada passa a representar praticamente custo zero por muitos anos, já que a vida útil dos sistemas ultrapassa 25 anos.",
        ],
      },
    ],
  },
  {
    slug: "como-calcular-quantos-paineis-solares",
    title: "Como calcular quantos painéis solares você precisa para sua casa",
    description:
      "Aprenda a calcular a quantidade de painéis solares necessários com base no consumo, na potência dos módulos e nas condições da sua região.",
    keywords: [
      "quantos painéis solares",
      "dimensionamento fotovoltaico",
      "cálculo energia solar",
      "simulador solar",
    ],
    category: "guia",
    sections: [
      {
        paragraphs: [
          "O cálculo da quantidade de painéis solares depende do consumo médio mensal de energia, da potência dos módulos fotovoltaicos e da irradiação solar da região onde o sistema será instalado.",
        ],
      },
      {
        heading: "Passo a passo do dimensionamento",
        paragraphs: [
          "De forma simplificada, o primeiro passo é converter o consumo mensal em consumo diário. Em seguida, estima-se a geração diária de energia de cada painel com base na sua potência nominal, nas horas de sol pleno (HSP) da região e na eficiência média do sistema, que considera perdas por inversor, temperatura, cabos e outros fatores.",
          "Na prática, a geração de energia não depende apenas da potência do módulo, mas também das condições climáticas locais e da eficiência global do sistema, que geralmente varia entre 75% e 85%.",
        ],
      },
      {
        heading: "Fórmula simplificada",
        paragraphs: [
          "Consumo diário ÷ (Potência do painel × Horas de sol pleno × eficiência do sistema) = quantidade de módulos necessários",
        ],
      },
      {
        heading: "Fatores fundamentais",
        paragraphs: [
          "Por isso, dois fatores são fundamentais no dimensionamento: o consumo energético da residência e as condições solares da região onde o sistema será instalado.",
        ],
      },
      {
        heading: "Simulação online",
        paragraphs: [
          "Ferramentas online de simulação tornam esse processo mais preciso ao considerar automaticamente variáveis como localização geográfica, irradiação solar média e perdas do sistema, facilitando o dimensionamento correto do sistema fotovoltaico.",
        ],
      },
    ],
  },
  {
    slug: "quanto-gera-um-painel-de-550w",
    title: "Quanto gera um painel de 550W?",
    description:
      "Entenda a geração mensal de um módulo fotovoltaico de 550 W com dados reais de orientação do telhado.",
    keywords: ["painel 550W", "geração solar", "módulo fotovoltaico", "kWh"],
    category: "equipamento",
    sections: [
      {
        paragraphs: [
          `Um módulo ${painel550.modulo.fabricante} ${painel550.modulo.modelo} (${painel550.modulo.potenciaW} W), em condições típicas de Goiânia-GO com telhado ao Norte, gera aproximadamente ${formatInteger(painel550.geracaoPainel)} kWh por mês.`,
          `A geração real depende da cidade, orientação, inclinação do telhado e sombreamento. O CalculaSolar utiliza dados por município para estimar com mais precisão.`,
        ],
      },
      {
        heading: "Fatores que influenciam",
        paragraphs: [
          "Orientação do telhado: Norte é a mais eficiente no Brasil.",
          "Inclinação: próxima à latitude local maximiza a captura.",
          "Localização: o potencial solar varia significativamente entre regiões.",
        ],
      },
    ],
  },
  {
    slug: "quanto-gera-um-sistema-de-5-kwp",
    title: "Quanto gera um sistema de 5 kWp?",
    description:
      "Veja quanto um sistema fotovoltaico de 5 kWp gera por mês e por ano, com base em dados reais por cidade.",
    keywords: ["5 kWp", "geração solar", "sistema fotovoltaico", "economia"],
    category: "guia",
    sections: [
      {
        paragraphs: [
          `Um sistema de 5 kWp em Goiânia-GO gera em média ${sistema5.fmt.geracaoMensal} (${sistema5.fmt.geracaoAnual}).`,
          `A economia anual estimada é de ${sistema5.fmt.economiaAnual}, considerando a tarifa média da região.`,
        ],
      },
      {
        heading: "Como calcular para sua cidade",
        paragraphs: [
          "Cada município possui potencial solar diferente. Use o simulador CalculaSolar informando sua cidade para obter números personalizados.",
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
