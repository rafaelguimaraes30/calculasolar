import { getRecentNewsArticles } from "@/lib/blog/articles";
import { ArticleCard } from "@/components/blog/ArticleCard";
import Link from "next/link";

export function RecentNews() {
  const articles = getRecentNewsArticles(3);
  if (articles.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
              Últimas notícias sobre energia solar
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-navy-700/70">
              Acompanhe novidades do setor elétrico, ONS, ANEEL e mercado fotovoltaico.
            </p>
          </div>
          <Link
            href="/ultimas-noticias"
            className="inline-flex rounded-full border border-navy-800/15 px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-solar-500/40 hover:text-solar-600"
          >
            Ver todas as notícias
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
