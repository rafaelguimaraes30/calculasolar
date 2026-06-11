import { getBlogArticles } from "./articles";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildBlogRssXml(): string {
  const articles = getBlogArticles();
  const items = articles
    .map((article) => {
      const link = `${SITE_URL}/blog/${article.slug}`;
      const pubDate = article.publishedAt
        ? new Date(article.publishedAt).toUTCString()
        : new Date().toUTCString();

      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`Blog ${SITE_NAME}`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>Artigos e notícias sobre energia solar no Brasil.</description>
    <language>pt-BR</language>
${items}
  </channel>
</rss>`;
}
