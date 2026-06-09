import { calculateMunicipioSolarPreview, formatMunicipioPreview } from "@/lib/solar/municipioPreview";
import { DEFAULT_MODULE_ID, getModuleById } from "@/lib/solar/modulesData";
import { calculateSolarSimulation } from "@/lib/solar/calculate";
import { formatInteger } from "@/lib/solar/format";

export type BlogCategory = "guia" | "cidade" | "equipamento" | "noticias";

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: BlogCategory;
  /** ISO 8601 — usado para ordenação na listagem (mais recente primeiro) */
  publishedAt?: string;
  /** Conteúdo em parágrafos; suporta links markdown [texto](/url) */
  sections: { heading?: string; paragraphs: string[] }[];
}

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  guia: "guia",
  cidade: "cidade",
  equipamento: "equipamento",
  noticias: "Notícias do Setor",
};

export function getBlogCategoryLabel(category: BlogCategory): string {
  return CATEGORY_LABELS[category];
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

const painel550 = painel550Simulation();
const sistema5 = sistema5KwpSimulation();

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "ons-plano-emergencial-excedente-energia",
    title:
      "ONS aciona plano emergencial inédito: entenda por que o Brasil precisou reduzir a geração de energia",
    description:
      "O ONS acionou pela primeira vez um plano emergencial para gerenciar excedentes de energia no sistema elétrico brasileiro. Entenda o que aconteceu, a relação com a energia solar e os impactos para consumidores.",
    keywords: [
      "ONS",
      "ANEEL",
      "apagão",
      "energia solar",
      "excedente de energia",
      "geração distribuída",
      "sistema elétrico brasileiro",
      "energia renovável",
    ],
    category: "noticias",
    publishedAt: "2026-06-09",
    sections: [
      {
        paragraphs: [
          "O Operador Nacional do Sistema Elétrico (ONS) acionou pela primeira vez um plano emergencial para gerenciamento de excedentes de energia elétrica, após identificar um cenário de elevada geração combinada com baixo consumo em determinadas regiões do país.",
          "A medida chamou atenção porque demonstra um novo desafio enfrentado pelo sistema elétrico brasileiro: integrar um volume cada vez maior de fontes renováveis, especialmente a [energia solar](/blog/energia-solar-vale-a-pena-2026), mantendo a estabilidade da rede.",
        ],
      },
      {
        heading: "O que aconteceu?",
        paragraphs: [
          "Durante um período de baixa demanda, a produção de energia prevista superou significativamente o consumo esperado.",
          "Inicialmente o ONS reduziu a geração das grandes usinas conectadas ao Sistema Interligado Nacional.",
          "Como essa redução não foi suficiente para equilibrar oferta e demanda, foi necessário acionar um plano emergencial aprovado pela ANEEL para limitar temporariamente parte da geração conectada às redes de distribuição.",
          "A medida teve caráter preventivo e buscou preservar a estabilidade operacional do sistema elétrico.",
        ],
      },
      {
        heading: "O Brasil quase teve um apagão?",
        paragraphs: [
          "Não exatamente.",
          "O problema não foi falta de energia, mas sim excesso de geração em relação ao consumo naquele momento.",
          "Em sistemas elétricos modernos, tanto a falta quanto o excesso de geração podem provocar instabilidades na frequência da rede.",
          "Por isso o operador realiza cortes temporários de geração para manter o equilíbrio entre produção e consumo.",
        ],
      },
      {
        heading: "Qual a relação com a energia solar?",
        paragraphs: [
          "A energia solar vem crescendo rapidamente no Brasil, principalmente através da geração distribuída instalada em residências, empresas e propriedades rurais.",
          "Esse crescimento é extremamente positivo para a matriz energética nacional, mas exige investimentos em infraestrutura, armazenamento e redes inteligentes para administrar períodos de grande produção.",
          "Situações semelhantes já ocorrem em diversos países com alta participação de fontes renováveis. Para entender melhor os benefícios da tecnologia, leia nosso guia sobre [como a energia solar reduz a conta de luz](/blog/como-funciona-energia-solar-economia-conta-luz).",
        ],
      },
      {
        heading: "O consumidor será afetado?",
        paragraphs: [
          "Na prática, consumidores residenciais normalmente não percebem essas operações.",
          "As ações são coordenadas pelo ONS e pelas distribuidoras para preservar a estabilidade do Sistema Interligado Nacional e evitar interrupções no fornecimento de energia.",
        ],
      },
      {
        heading: "O futuro da energia solar continua positivo",
        paragraphs: [
          "O episódio demonstra que a transição energética exige modernização constante da infraestrutura elétrica brasileira.",
          "O avanço de baterias, Smart Grids e novos mecanismos regulatórios permitirá integrar volumes ainda maiores de geração distribuída sem comprometer a segurança do sistema.",
          "A energia solar continua sendo uma das alternativas mais econômicas e sustentáveis para consumidores residenciais e empresas. Veja também [quanto custa instalar energia solar em 2026](/blog/quanto-custa-instalar-energia-solar-2026).",
        ],
      },
      {
        heading: "Faça uma simulação gratuita",
        paragraphs: [
          "Quer saber quanto você pode economizar instalando energia solar?",
          "Utilize gratuitamente o [simulador do CalculaSolar](/simulador) para estimar geração, economia anual, payback e dimensionamento ideal do seu sistema fotovoltaico. Você também pode começar pela [página inicial](/) ou aprender [como calcular quantos painéis solares](/blog/como-calcular-quantos-paineis-solares) você precisa.",
        ],
      },
    ],
  },
  {
    slug: "energia-solar-vale-a-pena-2026",
    title: "Energia solar vale a pena em 2026?",
    description:
      "Descubra se energia solar vale a pena em 2026: payback, economia na conta de luz, evolução dos módulos e retorno do investimento no Brasil.",
    keywords: [
      "energia solar vale a pena",
      "energia solar 2026",
      "painéis solares",
      "economia conta de luz",
      "investimento solar",
    ],
    category: "guia",
    sections: [
      {
        paragraphs: [
          "A energia solar continua sendo uma das formas mais eficientes de reduzir o custo da conta de luz no Brasil em 2026. Com o aumento constante das tarifas de energia elétrica, sistemas fotovoltaicos se tornaram ainda mais atrativos para residências e empresas.",
        ],
      },
      {
        heading: "Retorno do investimento",
        paragraphs: [
          "Em média, o retorno do investimento ocorre entre 3 e 6 anos, dependendo da região e do consumo energético. Após esse período, a economia gerada pode ultrapassar 90% na conta de energia.",
        ],
      },
      {
        heading: "Evolução da tecnologia",
        paragraphs: [
          "Além disso, a tecnologia dos módulos solares evoluiu significativamente, aumentando a eficiência e reduzindo o custo por watt instalado.",
        ],
      },
      {
        heading: "Conclusão",
        paragraphs: [
          "Sim, energia solar vale a pena em 2026, principalmente para quem busca redução de custos a longo prazo e independência energética.",
        ],
      },
    ],
  },
  {
    slug: "quanto-gera-placa-solar-550w",
    title: "Quanto gera uma placa solar de 550W?",
    description:
      "Saiba quanto gera uma placa solar de 550W por dia e por mês no Brasil, com exemplos práticos para sistemas residenciais.",
    keywords: [
      "placa solar 550W",
      "geração painel solar",
      "kWh painel fotovoltaico",
      "módulo 550 watts",
    ],
    category: "equipamento",
    sections: [
      {
        paragraphs: [
          "Uma placa solar de 550W pode gerar, em média, entre 2,2 kWh e 3,0 kWh por dia, dependendo da irradiação solar da região, inclinação e condições climáticas.",
        ],
      },
      {
        heading: "Geração mensal no Brasil",
        paragraphs: [
          "No Brasil, que possui alta incidência solar, um sistema com esse tipo de módulo pode gerar aproximadamente 80 kWh a 100 kWh por mês por painel.",
          "Isso significa que, em um sistema residencial com 10 painéis de 550W, a geração mensal pode ultrapassar 800 kWh.",
        ],
      },
      {
        heading: "Conclusão",
        paragraphs: [
          "A placa de 550W é atualmente uma das mais eficientes para sistemas residenciais, oferecendo ótimo equilíbrio entre custo e geração.",
        ],
      },
    ],
  },
  {
    slug: "diferenca-kwh-kwp",
    title: "Diferença entre kWh e kWp",
    description:
      "Entenda a diferença entre kWh e kWp em energia solar: consumo, geração e potência do sistema fotovoltaico explicados de forma simples.",
    keywords: [
      "kWh kWp diferença",
      "quilowatt hora",
      "quilowatt pico",
      "energia solar",
      "dimensionamento fotovoltaico",
    ],
    category: "guia",
    sections: [
      {
        paragraphs: [
          "Uma das dúvidas mais comuns em energia solar é a diferença entre kWh e kWp.",
        ],
      },
      {
        heading: "O que é kWh?",
        paragraphs: [
          "kWh (quilowatt-hora): representa o consumo ou geração de energia ao longo do tempo. É o que aparece na sua conta de luz.",
        ],
      },
      {
        heading: "O que é kWp?",
        paragraphs: [
          "kWp (quilowatt-pico): representa a potência máxima que um sistema fotovoltaico pode gerar em condições ideais.",
        ],
      },
      {
        heading: "Capacidade vs. energia produzida",
        paragraphs: [
          "Em outras palavras, kWp é a capacidade do sistema, enquanto kWh é a energia realmente consumida ou produzida.",
          "Por exemplo, um sistema de 5 kWp pode gerar cerca de 500 a 700 kWh por mês, dependendo da localização.",
        ],
      },
      {
        heading: "Conclusão",
        paragraphs: [
          "Entender essa diferença é essencial para dimensionar corretamente um sistema solar.",
        ],
      },
    ],
  },
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
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_ARTICLES.map((a) => a.slug);
}

/** Artigos ordenados por data de publicação (mais recente primeiro). */
export function getBlogArticles(): BlogArticle[] {
  return BLOG_ARTICLES.map((article, index) => ({ article, index })).sort(
    (a, b) => {
      const dateA = a.article.publishedAt;
      const dateB = b.article.publishedAt;
      if (dateA && dateB) return dateB.localeCompare(dateA);
      if (dateA) return -1;
      if (dateB) return 1;
      return a.index - b.index;
    },
  ).map(({ article }) => article);
}
