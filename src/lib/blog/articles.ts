import { calculateMunicipioSolarPreview, formatMunicipioPreview } from "@/lib/solar/municipioPreview";
import { DEFAULT_MODULE_ID, getModuleById } from "@/lib/solar/modulesData";
import { calculateSolarSimulation } from "@/lib/solar/calculate";
import { formatInteger } from "@/lib/solar/format";

export type BlogCategory = "guia" | "cidade" | "equipamento" | "noticias";

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: BlogCategory;
  /** ISO 8601 — usado para ordenação na listagem (mais recente primeiro) */
  publishedAt?: string;
  /** Perguntas frequentes — renderizadas no artigo e no schema FAQPage */
  faq?: BlogFaqItem[];
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
    tipoLigacao: "monofasica",
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
    slug: "absolar-alerta-gargalos-sistema-eletrico-excesso-energia-solar",
    title:
      "Absolar alerta para gargalos no sistema elétrico após corte emergencial na geração solar",
    description:
      "Após o corte emergencial realizado pelo ONS, a Absolar afirma que o episódio evidencia a necessidade de modernização do sistema elétrico brasileiro. Entenda os impactos para a energia solar.",
    keywords: [
      "ABSOLAR",
      "ONS",
      "energia solar",
      "gargalos sistema elétrico",
      "geração distribuída",
      "transição energética",
      "excedente de energia",
      "infraestrutura elétrica",
      "armazenamento de energia",
    ],
    category: "noticias",
    publishedAt: "2026-06-10",
    faq: [
      {
        question: "O ONS desligou a energia solar residencial?",
        answer:
          "Não. O corte emergencial atingiu parte da geração coordenada pelo sistema elétrico nacional e não desligou automaticamente sistemas fotovoltaicos residenciais.",
      },
      {
        question: "Quem possui energia solar perdeu créditos?",
        answer:
          "Não. O sistema de compensação de energia continua funcionando normalmente para consumidores enquadrados na geração distribuída.",
      },
      {
        question: "Vale a pena instalar energia solar após esse episódio?",
        answer:
          "Sim. O episódio evidencia desafios da infraestrutura elétrica brasileira, mas não reduz o potencial econômico da energia solar para residências, empresas e propriedades rurais.",
      },
    ],
    sections: [
      {
        paragraphs: [
          "Em 10 de junho de 2026, o Operador Nacional do Sistema Elétrico (ONS) precisou reduzir temporariamente parte da geração renovável conectada às redes de distribuição. O motivo foi um excesso momentâneo de oferta de energia em horários de baixa demanda, cenário que exigiu ações para preservar a estabilidade da rede elétrica nacional.",
          "Na sequência do episódio, a Associação Brasileira de Energia Solar Fotovoltaica (ABSOLAR) publicou posicionamento afirmando que o caso evidencia gargalos estruturais do sistema elétrico brasileiro — e não um problema da tecnologia solar em si. Para quem acompanha o setor ou planeja instalar painéis, entender o contexto ajuda a separar fatos de alarmismo.",
        ],
      },
      {
        heading: "O que aconteceu?",
        paragraphs: [
          "O sistema elétrico precisa manter, a todo instante, um equilíbrio fino entre a energia produzida e a energia consumida. Quando a geração supera a demanda em determinado período, o operador do sistema precisa ajustar a produção para evitar oscilações de frequência que podem comprometer equipamentos e o fornecimento.",
          "No episódio recente, houve excesso momentâneo de geração combinado com baixa demanda — situação comum em certos horários do dia, quando o consumo cai mas a produção solar e outras fontes renováveis continuam elevadas.",
          "Inicialmente o ONS reduziu a geração das grandes usinas do Sistema Interligado Nacional. Como a medida não foi suficiente, foi acionado um plano emergencial aprovado pela ANEEL para limitar temporariamente parte da geração renovável conectada às distribuidoras.",
          "A atuação teve caráter preventivo: o objetivo foi preservar a estabilidade operacional da rede, não punir consumidores ou produtores de energia solar. Para mais detalhes sobre a operação do ONS nesse contexto, confira nosso artigo sobre o [plano emergencial para excedente de energia](/blog/ons-plano-emergencial-excedente-energia).",
        ],
      },
      {
        heading: "Por que isso aconteceu?",
        paragraphs: [
          "O Brasil vive um crescimento acelerado da energia solar, especialmente na modalidade de geração distribuída — sistemas instalados em telhados de residências, comércios e propriedades rurais. Esse avanço é positivo para a matriz energética, mas coloca pressão sobre uma infraestrutura que foi dimensionada décadas atrás para um modelo centralizado de geração.",
          "Ao mesmo tempo, outras fontes renováveis também expandiram sua participação. O resultado é que, em determinados momentos do dia, a oferta de energia pode superar o consumo imediato — especialmente quando a demanda industrial e residencial está reduzida.",
          "Entre os fatores que contribuem para esse descompasso estão a falta de investimentos proporcionais em linhas de transmissão, a ausência de armazenamento de energia em larga escala (como baterias e hidrogênio) e a necessidade de modernizar a operação das redes de distribuição para lidar com geração descentralizada.",
          "Em outras palavras: o problema não é a energia solar em si, mas a velocidade com que o país adotou fontes renováveis em comparação com a velocidade de adaptação da infraestrutura elétrica.",
        ],
      },
      {
        heading: "Isso é ruim para quem tem energia solar?",
        paragraphs: [
          "Para a grande maioria dos consumidores residenciais e comerciais com sistemas fotovoltaicos, a resposta prática é: não.",
          "Os cortes emergenciais coordenados pelo ONS atingiram geradores conectados em escala que exigem coordenação centralizada. Consumidores com placas no telhado não tiveram seus equipamentos desligados remotamente nem perderam o direito de usar a energia que produzem.",
          "O mecanismo de compensação de energia — que permite abater o consumo da rede com os créditos gerados pelo excedente solar — continua funcionando normalmente. Quem já instalou ou pretende instalar pode seguir contando com esse benefício regulatório.",
          "O episódio reforça, sim, que o país precisa evoluir sua infraestrutura. Mas isso não diminui o potencial econômico da energia solar para residências e empresas. Para avaliar o retorno do investimento no seu caso, veja se [energia solar vale a pena em 2026](/blog/energia-solar-vale-a-pena-2026) e [quanto custa instalar um sistema residencial](/blog/quanto-custa-instalar-energia-solar-2026).",
        ],
      },
      {
        heading: "O que a ABSOLAR defende?",
        paragraphs: [
          "A ABSOLAR classificou o episódio como um sinal de alerta para a necessidade de modernização do setor elétrico brasileiro, e não como motivo para desacelerar a energia solar.",
          "Entre as propostas defendidas pela entidade estão a expansão da capacidade de transmissão entre regiões, investimentos em tecnologias de armazenamento de energia, a modernização do marco regulatório para acomodar a geração distribuída e maior flexibilidade operacional nas redes de distribuição.",
          "A associação também destaca a importância de fortalecer as redes elétricas locais para que consigam absorver volumes crescentes de geração descentralizada sem depender exclusivamente de cortes emergenciais.",
          "O posicionamento converge com o que especialistas do setor vêm alertando há anos: a transição energética brasileira é irreversível, mas precisa caminhar junto com investimentos em infraestrutura, regulação e inovação tecnológica.",
        ],
      },
      {
        heading: "O que esperar para os próximos anos?",
        paragraphs: [
          "A tendência é que a geração distribuída continue crescendo. Custos de equipamentos seguem competitivos, a conscientização ambiental aumenta e a economia na conta de luz permanece como principal motivador para residências e pequenos negócios.",
          "Para acomodar esse volume sem repetir episódios de excesso de oferta, o Brasil precisará acelerar investimentos em transmissão, armazenamento, redes inteligentes (Smart Grids) e novos modelos de gestão da demanda — como tarifas que incentivem o consumo em horários de maior geração solar.",
          "Reguladores, operadores e distribuidoras já discutem mecanismos mais sofisticados de integração de fontes renováveis. A expectativa é que, nos próximos anos, o sistema ganhe mais ferramentas para equilibrar oferta e demanda sem intervenções emergenciais.",
          "Para o consumidor, o cenário continua favorável: quem investe em energia solar hoje colhe economia imediata na fatura e participa de uma matriz energética em transformação. Entenda melhor [como a energia solar funciona e gera economia](/blog/como-funciona-energia-solar-economia-conta-luz) na prática.",
        ],
      },
      {
        heading: "Conclusão",
        paragraphs: [
          "Episódios como o corte emergencial do ONS fazem parte da transição energética brasileira — um processo que envolve crescimento acelerado de fontes limpas e a necessidade de adaptar uma infraestrutura histórica a um novo paradigma de geração descentralizada.",
          "O alerta da ABSOLAR não deve ser lido como um sinal de que a energia solar perdeu atratividade. Pelo contrário: reforça que o país precisa investir na rede elétrica para sustentar o potencial que a tecnologia já demonstrou em escala.",
          "Para quem considera instalar painéis, o momento continua sendo de oportunidade. Use o [simulador gratuito do CalculaSolar](/simulador) para estimar geração, economia e payback com dados da sua cidade, ou comece pela [página inicial](/) para conhecer todas as ferramentas disponíveis.",
        ],
      },
      {
        heading: "Fontes",
        paragraphs: [
          "Este conteúdo foi elaborado com base em informações públicas divulgadas por órgãos e entidades do setor elétrico brasileiro.",
          "Fontes consultadas:",
          "[Operador Nacional do Sistema Elétrico (ONS)](https://www.ons.org.br/)",
          "[Agência Nacional de Energia Elétrica (ANEEL)](https://www.gov.br/aneel/)",
          "[Associação Brasileira de Energia Solar Fotovoltaica (ABSOLAR)](https://www.absolar.org.br/)",
        ],
      },
    ],
  },
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

/** Artigos mais recentes para a central de notícias e destaques na home. */
export function getRecentNewsArticles(limit = 12): BlogArticle[] {
  return getBlogArticles().slice(0, limit);
}

function relatedArticleScore(current: BlogArticle, candidate: BlogArticle): number {
  let score = 0;
  if (current.category === candidate.category) score += 3;
  const sharedKeywords = current.keywords.filter((kw) =>
    candidate.keywords.some((c) => c.toLowerCase() === kw.toLowerCase()),
  );
  score += sharedKeywords.length * 2;
  return score;
}

/** Artigos relacionados por categoria e palavras-chave. */
export function getRelatedArticles(slug: string, limit = 3): BlogArticle[] {
  const current = getBlogArticle(slug);
  if (!current) return [];

  return getBlogArticles()
    .filter((article) => article.slug !== slug)
    .map((article) => ({ article, score: relatedArticleScore(current, article) }))
    .sort((a, b) => b.score - a.score || a.article.title.localeCompare(b.article.title, "pt-BR"))
    .slice(0, limit)
    .map(({ article }) => article);
}
