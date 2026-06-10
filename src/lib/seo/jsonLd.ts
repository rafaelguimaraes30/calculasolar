import type { BlogArticle } from "@/lib/blog/articles";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_URL,
} from "./site";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${SITE_OG_IMAGE}`,
    description: SITE_DESCRIPTION,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@type": "Organization", name: SITE_NAME },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/simulador`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${SITE_NAME} — Simulador de Energia Solar`,
    url: `${SITE_URL}/simulador`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    description:
      "Simulador gratuito de energia solar com dimensionamento, geração e payback para todo o Brasil.",
  };
}

export function buildSimuladorFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O simulador do CalculaSolar é gratuito?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. O CalculaSolar é um simulador gratuito de energia solar para residências e comércios no Brasil.",
        },
      },
      {
        "@type": "Question",
        name: "Quais dados preciso para simular energia solar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Informe cidade, consumo mensal em kWh, tipo de imóvel, orientação do telhado e módulo fotovoltaico. O simulador calcula geração, economia e payback.",
        },
      },
      {
        "@type": "Question",
        name: "O simulador considera a tarifa da minha região?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. É possível selecionar a concessionária e utilizar tarifas regionais para estimar a economia financeira com maior precisão.",
        },
      },
    ],
  };
}

export function buildArticleJsonLd(article: BlogArticle, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: pageUrl,
    ...(article.publishedAt && {
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
    }),
    image: `${SITE_URL}${SITE_OG_IMAGE}`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; item?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      ...(entry.item && { item: entry.item }),
    })),
  };
}

export function buildCollectionPageJsonLd(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function buildFaqPageJsonLd(
  items: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildTarifaArticleJsonLd(input: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    image: `${SITE_URL}${SITE_OG_IMAGE}`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function buildMunicipioArticleJsonLd(input: {
  nome: string;
  uf: string;
  pageUrl: string;
  description: string;
  latitude: number;
  longitude: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Energia Solar em ${input.nome} — ${input.uf}`,
    description: input.description,
    url: input.pageUrl,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    about: {
      "@type": "Place",
      name: input.nome,
      address: {
        "@type": "PostalAddress",
        addressRegion: input.uf,
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: input.latitude,
        longitude: input.longitude,
      },
    },
  };
}
