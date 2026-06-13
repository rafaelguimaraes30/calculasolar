import { AdSlot } from "@/components/ads/AdSlot";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import {
  getBlogArticle,
  getAllBlogSlugs,
  getBlogCategoryLabel,
} from "@/lib/blog/articles";
import { renderBlogParagraph } from "@/lib/blog/format";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
} from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
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
    socialImages: false,
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const pageUrl = `${SITE_URL}/blog/${slug}`;

  const jsonLd = buildArticleJsonLd(article, pageUrl);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Início", item: SITE_URL },
    { name: "Blog", item: `${SITE_URL}/blog` },
    { name: article.title, item: pageUrl },
  ]);
  const faqLd =
    article.faq && article.faq.length > 0
      ? buildFaqPageJsonLd(
          article.faq.map((item) => ({
            question: item.question,
            answer: item.answer,
          })),
        )
      : null;

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}
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
                {getBlogCategoryLabel(article.category)}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                {article.title}
              </h1>
              <p className="mt-4 text-lg text-navy-700/70">{article.description}</p>
            </header>

            <AdSlot position="inline-content" className="my-8 h-20 sm:h-24" />

            <div className="prose prose-navy max-w-none space-y-8">
              {article.sections.map((section, i) => (
                <div key={i}>
                  <section>
                    {section.heading && (
                      <h2 className="text-xl font-bold text-navy-900">{section.heading}</h2>
                    )}
                    {section.paragraphs.map((p, j) => (
                      <p key={j} className="mt-3 text-base leading-relaxed text-navy-700/80">
                        {renderBlogParagraph(p)}
                      </p>
                    ))}
                  </section>

                  {i === 0 && article.summary && article.summary.length > 0 && (
                    <aside className="mt-6 rounded-2xl border border-solar-500/25 bg-solar-500/8 p-6">
                      <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                        Resumo
                      </h2>
                      <ul className="mt-4 space-y-2">
                        {article.summary.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm leading-relaxed text-navy-700/85"
                          >
                            <span className="mt-0.5 shrink-0 text-solar-600" aria-hidden>
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  )}
                </div>
              ))}
            </div>

            {article.faq && article.faq.length > 0 && (
              <section className="mt-10 space-y-6">
                <h2 className="text-xl font-bold text-navy-900">Perguntas frequentes</h2>
                {article.faq.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-xl border border-navy-800/10 bg-white p-4"
                  >
                    <h3 className="font-semibold text-navy-900">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </section>
            )}

            <RelatedArticles slug={slug} />

            <div className="mt-8 rounded-2xl border border-solar-500/20 bg-solar-500/8 p-6 text-center">
              <p className="font-semibold text-navy-900">Simule para sua cidade</p>
              <p className="mt-2 text-sm text-navy-700/70">
                Use o simulador gratuito com dados reais da sua cidade.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/simulador"
                  className="inline-flex rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-6 py-2.5 text-sm font-bold text-navy-900 transition-all hover:scale-105"
                >
                  Ir ao simulador
                </Link>
                <Link
                  href="/"
                  className="inline-flex rounded-full border border-navy-800/15 px-6 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-solar-500/40"
                >
                  Página inicial
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
