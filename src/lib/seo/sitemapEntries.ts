import { getBlogArticles } from "@/lib/blog/articles";
import { getAllMunicipioSlugs } from "@/lib/solar/municipiosData";
import { getProgrammaticSitemapEntries } from "./programmatic";
import type { SitemapUrlEntry } from "./sitemapXml";
import { SITE_URL } from "./site";

function todayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getStaticPageSitemapEntries(): SitemapUrlEntry[] {
  const today = todayIsoDate();
  return [
    {
      loc: SITE_URL,
      lastmod: today,
      changefreq: "weekly",
      priority: 1.0,
    },
    {
      loc: `${SITE_URL}/simulador`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.95,
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: today,
      changefreq: "daily",
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/ultimas-noticias`,
      lastmod: today,
      changefreq: "daily",
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/tarifas`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: `${SITE_URL}/ranking-tarifas`,
      lastmod: today,
      changefreq: "weekly",
      priority: 0.85,
    },
  ];
}

export function getBlogSitemapEntries(): SitemapUrlEntry[] {
  const fallbackDate = todayIsoDate();
  return getBlogArticles().map((article) => ({
    loc: `${SITE_URL}/blog/${article.slug}`,
    lastmod: article.publishedAt ?? fallbackDate,
    changefreq: "monthly" as const,
    priority: 0.85,
  }));
}

export function getMunicipioSitemapEntries(): SitemapUrlEntry[] {
  const today = todayIsoDate();
  return getAllMunicipioSlugs().map((slug) => ({
    loc: `${SITE_URL}/energia-solar-em/${slug}`,
    lastmod: today,
    changefreq: "monthly" as const,
    priority: 0.8,
  }));
}

export { getProgrammaticSitemapEntries };
