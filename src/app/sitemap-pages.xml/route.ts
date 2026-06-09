import { getStaticPageSitemapEntries } from "@/lib/seo/sitemapEntries";
import { buildUrlSetXml } from "@/lib/seo/sitemapXml";

export async function GET() {
  const xml = buildUrlSetXml(getStaticPageSitemapEntries());

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
