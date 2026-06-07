import { buildUrlSetXml } from "@/lib/seo/sitemapXml";
import { SITE_URL } from "@/lib/seo/site";

export async function GET() {
  const urls = [
    SITE_URL,
    `${SITE_URL}/simulador`,
    `${SITE_URL}/blog`,
  ];

  const xml = buildUrlSetXml(urls);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
