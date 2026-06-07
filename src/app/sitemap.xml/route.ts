import { buildSitemapIndexXml } from "@/lib/seo/sitemapXml";

export async function GET() {
  const xml = buildSitemapIndexXml([
    "/sitemap-pages.xml",
    "/sitemap-blog.xml",
    "/sitemap-municipios.xml",
  ]);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
