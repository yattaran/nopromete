import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types/article";
import { formatTimeAgo } from "@/lib/utils/date";
import { getCategoryHref, getCategoryLabel } from "@/lib/utils/categories";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="flex flex-col border border-ink/15 bg-paper">
      <div className="flex flex-1 flex-col p-4 pb-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-wider text-muted uppercase">
          <Link href={getCategoryHref(article.category)} className="hover:text-ink">
            {getCategoryLabel(article.category)}
          </Link>
          <span aria-hidden>•</span>
          <time dateTime={article.publishedAt}>{formatTimeAgo(article.publishedAt)}</time>
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug text-ink">
          <Link href={`/noticias/${article.slug}`} className="hover:opacity-80">
            {article.headline}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">
          {article.summary}
        </p>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-tan">
        <Image
          src={article.heroImage}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    </article>
  );
}
