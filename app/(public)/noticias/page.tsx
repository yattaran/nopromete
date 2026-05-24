import type { Metadata } from "next";
import Link from "next/link";
import { ArticleMeta } from "@/components/article/ArticleMeta";
import { getAllPublishedSlugs, getArticleBySlug } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Todas las noticias de No Promete, sin promesas y sin filtro.",
};

export default async function NoticiasPage() {
  const slugs = await getAllPublishedSlugs();
  const articles = (
    await Promise.all(slugs.map((slug) => getArticleBySlug(slug)))
  ).filter((article): article is NonNullable<typeof article> => article !== null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-ink">Noticias</h1>
      <p className="mt-2 text-muted">Sin promesas. Sin filtro.</p>

      <ul className="mt-10 divide-y divide-ink/15">
        {articles.length === 0 ? (
          <li className="py-8 text-muted">No hay artículos todavía.</li>
        ) : (
          articles.map((article) => (
            <li key={article.slug} className="py-6">
              <ArticleMeta article={article} />
              <h2 className="font-serif text-2xl font-bold text-ink">
                <Link href={`/noticias/${article.slug}`} className="hover:opacity-80">
                  {article.headline}
                </Link>
              </h2>
              <p className="mt-2 text-ink/70">{article.summary}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
