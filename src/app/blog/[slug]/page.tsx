import { AdSlot } from "@/components/ads/AdSlot";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogArticle, getAllBlogSlugs } from "@/lib/blog/articles";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return {};

  return buildPageMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${slug}`,
    keywords: article.keywords,
    type: "article",
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const pageUrl = `${SITE_URL}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: pageUrl,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      <Navbar />
      <main className="bg-background">
        <AdSlot position="top-banner" className="mx-auto mt-4 max-w-7xl px-4 h-20 sm:h-24" />

        <article className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Início", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: article.title },
              ]}
            />

            <header>
              <span className="text-xs font-semibold uppercase tracking-wider text-solar-600">
                {article.category}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                {article.title}
              </h1>
              <p className="mt-4 text-lg text-navy-700/70">{article.description}</p>
            </header>

            <AdSlot position="inline-content" className="my-8 h-20 sm:h-24" />

            <div className="prose prose-navy max-w-none space-y-8">
              {article.sections.map((section, i) => (
                <section key={i}>
                  {section.heading && (
                    <h2 className="text-xl font-bold text-navy-900">{section.heading}</h2>
                  )}
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="mt-3 text-base leading-relaxed text-navy-700/80">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-solar-500/20 bg-solar-500/8 p-6 text-center">
              <p className="font-semibold text-navy-900">Simule para sua cidade</p>
              <p className="mt-2 text-sm text-navy-700/70">
                Use o simulador gratuito com dados reais de GHI do Brasil.
              </p>
              <Link
                href="/simulador"
                className="mt-4 inline-flex rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-6 py-2.5 text-sm font-bold text-navy-900 transition-all hover:scale-105"
              >
                Ir ao simulador
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
