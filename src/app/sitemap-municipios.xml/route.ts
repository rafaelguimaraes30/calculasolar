import { getMunicipioSitemapEntries } from "@/lib/seo/sitemapEntries";
import { buildUrlSetXml } from "@/lib/seo/sitemapXml";

export async function GET() {
  const xml = buildUrlSetXml(getMunicipioSitemapEntries());

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
