import { AdSlot } from "@/components/ads/AdSlot";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogArticles, getBlogCategoryLabel } from "@/lib/blog/articles";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import Link from "next/link";

export const metadata = buildPageMetadata({
  title: "Blog — Guias de Energia Solar",
  description:
    "Artigos sobre energia solar, geração de painéis fotovoltaicos e potencial solar por cidade no Brasil.",
  path: "/blog",
  keywords: ["blog energia solar", "painéis solares", "fotovoltaico"],
});

export default function BlogIndexPage() {
  const articles = getBlogArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog ${SITE_NAME}`,
    url: `${SITE_URL}/blog`,
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${SITE_URL}/blog/${a.slug}`,
      description: a.description,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <main className="bg-background">
        <AdSlot position="top-banner" className="mx-auto mt-4 max-w-7xl px-4 h-20 sm:h-24" />

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              className="mb-6"
              items={[{ label: "Início", href: "/" }, { label: "Blog" }]}
            />
            <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Blog CalculaSolar
            </h1>
            <p className="mt-4 text-lg text-navy-700/70">
              Guias e análises com dados reais de geração solar por cidade no Brasil.
            </p>

            <AdSlot position="inline-content" className="my-8 h-20 sm:h-24" />

            <ul className="mt-8 space-y-4">
              {articles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="block rounded-2xl border border-navy-800/10 bg-white p-6 shadow-sm transition-all hover:border-solar-500/30 hover:shadow-md"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-solar-600">
                      {getBlogCategoryLabel(article.category)}
                    </span>
                    <h2 className="mt-2 text-xl font-bold text-navy-900">{article.title}</h2>
                    <p className="mt-2 text-sm text-navy-700/70">{article.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
