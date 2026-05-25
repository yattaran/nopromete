import { ArticleGrid } from "@/components/home/ArticleGrid";
import { HeroArticle } from "@/components/home/HeroArticle";
import { Sidebar } from "@/components/home/Sidebar";
import {
  getFeaturedArticle,
  getFeaturedDonZopiQuote,
  getGridArticles,
  hasDatabase,
} from "@/lib/data/posts";

export default async function HomePage() {
  const [featured, gridArticles, donZopiQuote] = await Promise.all([
    getFeaturedArticle(),
    getGridArticles(),
    getFeaturedDonZopiQuote(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
        <div className="space-y-10">
          {featured ? (
            <HeroArticle article={featured} />
          ) : (
            <p className="border border-ink/15 p-6 text-sm text-muted">
              {hasDatabase()
                ? "No hay noticias publicadas todavía. Aprobá y publicá un borrador desde el panel admin."
                : "No hay artículos para mostrar."}
            </p>
          )}
          <ArticleGrid articles={gridArticles} />
        </div>
        <Sidebar donZopiQuote={donZopiQuote} />
      </div>
    </div>
  );
}
