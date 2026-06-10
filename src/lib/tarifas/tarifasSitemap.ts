import type { SitemapUrlEntry } from "@/lib/seo/sitemapXml";
import { SITE_URL } from "@/lib/seo/site";
import {
  getAllTarifaPages,
  getAllUfSlugs,
} from "./tarifasSeoData";

function todayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTarifasSitemapEntries(): SitemapUrlEntry[] {
  const today = todayIsoDate();
  const entries: SitemapUrlEntry[] = [
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

  for (const ufSlug of getAllUfSlugs()) {
    entries.push({
      loc: `${SITE_URL}/tarifas/${ufSlug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    });
  }

  for (const page of getAllTarifaPages()) {
    entries.push({
      loc: `${SITE_URL}/tarifa/${page.slug}`,
      lastmod: page.record.vigencia || today,
      changefreq: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
