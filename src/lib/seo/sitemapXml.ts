import { SITE_URL } from "./site";

export type SitemapChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: SitemapChangeFreq;
  priority?: number;
}

export function buildUrlSetXml(entries: SitemapUrlEntry[] | string[]): string {
  const normalized: SitemapUrlEntry[] = entries.map((entry) =>
    typeof entry === "string" ? { loc: entry } : entry,
  );

  const body = normalized
    .map((entry) => {
      const lines = [`  <url>`, `    <loc>${escapeXml(entry.loc)}</loc>`];
      if (entry.lastmod) lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority !== undefined) {
        lines.push(`    <priority>${entry.priority.toFixed(2)}</priority>`);
      }
      lines.push(`  </url>`);
      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export function buildSitemapIndexXml(sitemapPaths: string[]): string {
  const now = new Date().toISOString();
  const entries = sitemapPaths
    .map(
      (path) =>
        `  <sitemap>\n    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
