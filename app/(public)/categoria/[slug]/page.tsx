import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleMeta } from "@/components/article/ArticleMeta";
import { getArticlesByCategory } from "@/lib/data/posts";
import { categories } from "@/lib/utils/categories";
import type { CategorySlug } from "@/lib/types/article";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Categoría no encontrada" };
  return {
    title: category.label,
    description: `Noticias de ${category.label} en No Promete.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(slug as CategorySlug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-ink">{category.label}</h1>
      <p className="mt-2 text-muted">
        Lo más reciente en {category.label.toLowerCase()}, con sarcasmo incluido.
      </p>

      <ul className="mt-10 divide-y divide-ink/15">
        {articles.length === 0 ? (
          <li className="py-8 text-muted">No hay artículos en esta sección todavía.</li>
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
