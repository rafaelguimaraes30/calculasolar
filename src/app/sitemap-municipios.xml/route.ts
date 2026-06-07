import { buildUrlSetXml } from "@/lib/seo/sitemapXml";
import { SITE_URL } from "@/lib/seo/site";
import { getAllMunicipioSlugs } from "@/lib/solar/municipiosData";

export async function GET() {
  const urls = getAllMunicipioSlugs().map(
    (slug) => `${SITE_URL}/energia-solar-em/${slug}`,
  );
  const xml = buildUrlSetXml(urls);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
