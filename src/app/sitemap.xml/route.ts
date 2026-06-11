import { buildSitemapIndexXml } from "@/lib/seo/sitemapXml";

export async function GET() {
  const sitemaps = [
    "/sitemap-pages.xml",
    "/sitemap-blog.xml",
    "/sitemap-municipios.xml",
    "/sitemap-programmatic.xml",
  ];

  const xml = buildSitemapIndexXml(sitemaps);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
