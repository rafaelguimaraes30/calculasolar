import { getBlogCategoryLabel, type BlogArticle } from "@/lib/blog/articles";
import Link from "next/link";

interface ArticleCardProps {
  article: BlogArticle;
  showImage?: boolean;
}

function formatPublishedDate(date?: string): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ArticleCard({ article, showImage = true }: ArticleCardProps) {
  const publishedLabel = formatPublishedDate(article.publishedAt);

  return (
    <article className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white shadow-sm transition-all hover:border-solar-500/30 hover:shadow-md">
      {showImage && (
        <div
          className="aspect-[1200/630] w-full bg-gradient-to-br from-solar-500/30 via-solar-400/10 to-navy-800/10"
          aria-hidden="true"
        />
      )}
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-solar-600">
          <span>{getBlogCategoryLabel(article.category)}</span>
          {publishedLabel && (
            <span className="font-medium normal-case tracking-normal text-navy-700/50">
              {publishedLabel}
            </span>
          )}
        </div>
        <h2 className="mt-2 text-xl font-bold text-navy-900">
          <Link href={`/blog/${article.slug}`} className="hover:text-solar-600">
            {article.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
          {article.description}
        </p>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-4 inline-flex text-sm font-semibold text-solar-600 hover:text-solar-600/80"
        >
          Ler artigo →
        </Link>
      </div>
    </article>
  );
}
