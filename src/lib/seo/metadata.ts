import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_ALT,
  SITE_URL,
} from "./site";

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const url = `${SITE_URL}${input.path}`;
  const title = input.title.includes(SITE_NAME)
    ? input.title
    : `${input.title} | ${SITE_NAME}`;

  const ogImages = [
    {
      url: SITE_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: SITE_OG_IMAGE_ALT,
    },
  ];

  return {
    title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: input.type ?? "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images: [SITE_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

export function defaultSiteMetadata(): Metadata {
  return buildPageMetadata({
    title: `${SITE_NAME} — Simule painéis solares para sua casa ou negócio`,
    description: SITE_DESCRIPTION,
    path: "/",
    keywords: [
      "energia solar",
      "painéis solares",
      "simulador solar",
      "fotovoltaico",
      "simulador gratuito",
    ],
  });
}
