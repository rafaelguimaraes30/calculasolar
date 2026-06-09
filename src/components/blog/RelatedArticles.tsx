import { getRelatedArticles } from "@/lib/blog/articles";
import Link from "next/link";

interface RelatedArticlesProps {
  slug: string;
}

export function RelatedArticles({ slug }: RelatedArticlesProps) {
  const related = getRelatedArticles(slug, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 rounded-2xl border border-navy-800/10 bg-white p-6">
      <h2 className="text-lg font-bold text-navy-900">Artigos relacionados</h2>
      <ul className="mt-4 space-y-3">
        {related.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="text-sm font-medium text-navy-800 transition-colors hover:text-solar-600"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-4 text-sm">
        <Link href="/" className="font-medium text-solar-600 hover:text-solar-600/80">
          Página inicial
        </Link>
        <Link href="/simulador" className="font-medium text-solar-600 hover:text-solar-600/80">
          Simulador
        </Link>
        <Link href="/ultimas-noticias" className="font-medium text-solar-600 hover:text-solar-600/80">
          Últimas notícias
        </Link>
      </div>
    </section>
  );
}
