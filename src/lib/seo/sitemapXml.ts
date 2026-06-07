import { SITE_URL } from "./site";

export function buildUrlSetXml(urls: string[]): string {
  const entries = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
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
