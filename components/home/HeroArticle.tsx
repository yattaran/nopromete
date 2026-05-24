import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types/article";
import { formatTimeAgo } from "@/lib/utils/date";
import { getCategoryHref, getCategoryLabel } from "@/lib/utils/categories";

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
  return (
    <article className="flex flex-col gap-6">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-muted uppercase">
          <Link href={getCategoryHref(article.category)} className="hover:text-ink">
            {getCategoryLabel(article.category)}
          </Link>
          <span aria-hidden>•</span>
          <time dateTime={article.publishedAt}>{formatTimeAgo(article.publishedAt)}</time>
        </div>
        <h2 className="font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          <Link href={`/noticias/${article.slug}`} className="hover:opacity-80">
            {article.headline}
          </Link>
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/80">
          {article.summary}
        </p>
        <Link
          href={`/noticias/${article.slug}`}
          className="mt-6 inline-flex w-fit items-center gap-2 bg-ink px-6 py-3 text-xs font-semibold tracking-wider text-paper uppercase transition hover:bg-ink/90"
        >
          Leer más
          <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden border border-ink/20 bg-tan">
        <Image
          src={article.heroImage}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>
    </article>
  );
}
