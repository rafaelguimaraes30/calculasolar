import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogArticles } from "@/lib/blog/articles";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = buildPageMetadata({
  title: "Últimas Notícias sobre Energia Solar | CalculaSolar",
  description:
    "Acompanhe as últimas notícias sobre energia solar, ANEEL, ONS, tarifas de energia, bandeiras tarifárias, geração distribuída e mercado fotovoltaico.",
  path: "/ultimas-noticias",
  keywords: [
    "notícias energia solar",
    "ANEEL",
    "ONS",
    "tarifas de energia",
    "geração distribuída",
    "mercado fotovoltaico",
  ],
});

export default function UltimasNoticiasPage() {
  const articles = getBlogArticles();
  const pageUrl = `${SITE_URL}/ultimas-noticias`;

  const collectionLd = buildCollectionPageJsonLd({
    name: "Últimas Notícias sobre Energia Solar",
    description:
      "Acompanhe as últimas notícias sobre energia solar, ANEEL, ONS, tarifas de energia e mercado fotovoltaico.",
    url: pageUrl,
  });

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Início", item: SITE_URL },
    { name: "Últimas Notícias", item: pageUrl },
  ]);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Notícias ${SITE_NAME}`,
    url: pageUrl,
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `${SITE_URL}/blog/${article.slug}`,
      description: article.description,
      ...(article.publishedAt && { datePublished: article.publishedAt }),
    })),
  };

  return (
    <>
      <JsonLd data={collectionLd} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={blogLd} />
      <Navbar />
      <main className="bg-background">
        <AdSlot position="top-banner" className="mx-auto mt-4 max-w-7xl px-4 h-20 sm:h-24" />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Início", href: "/" },
                { label: "Últimas Notícias" },
              ]}
            />

            <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Últimas Notícias sobre Energia Solar
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-navy-700/70">
              Acompanhe as últimas notícias sobre energia solar, ANEEL, ONS, tarifas de energia,
              bandeiras tarifárias, geração distribuída e mercado fotovoltaico.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <Link href="/" className="font-medium text-solar-600 hover:text-solar-600/80">
                Página inicial
              </Link>
              <Link href="/simulador" className="font-medium text-solar-600 hover:text-solar-600/80">
                Simulador
              </Link>
              <Link href="/blog" className="font-medium text-solar-600 hover:text-solar-600/80">
                Blog
              </Link>
            </div>

            <AdSlot position="inline-content" className="my-8 h-20 sm:h-24" />

            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
