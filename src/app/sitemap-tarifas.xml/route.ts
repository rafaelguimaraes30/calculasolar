import { buildUrlSetXml } from "@/lib/seo/sitemapXml";
import { getTarifasSitemapEntries } from "@/lib/tarifas/tarifasSitemap";

export async function GET() {
  const xml = buildUrlSetXml(getTarifasSitemapEntries());

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
