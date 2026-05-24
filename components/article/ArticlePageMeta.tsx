import type { Article } from "@/lib/types/article";
import { formatPublishedDate } from "@/lib/utils/date";
import { getCategoryHref, getCategoryLabel } from "@/lib/utils/categories";
import Link from "next/link";

interface ArticlePageMetaProps {
  article: Article;
}

export function ArticlePageMeta({ article }: ArticlePageMetaProps) {
  return (
    <div className="mt-4 space-y-1">
      <Link
        href={getCategoryHref(article.category)}
        className="text-xs font-semibold tracking-wider text-accent uppercase hover:text-ink"
      >
        {getCategoryLabel(article.category)}
      </Link>
      <p className="text-sm text-muted">
        <time dateTime={article.publishedAt}>{formatPublishedDate(article.publishedAt)}</time>
        <span aria-hidden> · </span>
        <span>{article.sourceName}</span>
      </p>
    </div>
  );
}
