import type { Article } from "@/lib/types/article";
import { formatTimeAgo } from "@/lib/utils/date";
import { getCategoryLabel } from "@/lib/utils/categories";

interface ArticleMetaProps {
  article: Article;
}

export function ArticleMeta({ article }: ArticleMetaProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-muted uppercase">
      <span>{getCategoryLabel(article.category)}</span>
      <span aria-hidden>•</span>
      <time dateTime={article.publishedAt}>{formatTimeAgo(article.publishedAt)}</time>
    </div>
  );
}
