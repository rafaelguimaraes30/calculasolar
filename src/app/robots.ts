import { SITE_URL } from "@/lib/seo/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap-pages.xml`,
      `${SITE_URL}/sitemap-blog.xml`,
      `${SITE_URL}/sitemap-municipios.xml`,
    ],
  };
}
