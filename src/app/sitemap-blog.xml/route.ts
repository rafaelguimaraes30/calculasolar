import { getAllBlogSlugs } from "@/lib/blog/articles";
import { buildUrlSetXml } from "@/lib/seo/sitemapXml";
import { SITE_URL } from "@/lib/seo/site";

export async function GET() {
  const urls = getAllBlogSlugs().map((slug) => `${SITE_URL}/blog/${slug}`);
  const xml = buildUrlSetXml(urls);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
