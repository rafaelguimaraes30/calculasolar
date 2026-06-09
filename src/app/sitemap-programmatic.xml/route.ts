import { getProgrammaticSitemapEntries } from "@/lib/seo/sitemapEntries";
import { buildUrlSetXml } from "@/lib/seo/sitemapXml";

export async function GET() {
  const entries = getProgrammaticSitemapEntries();
  const xml = buildUrlSetXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
