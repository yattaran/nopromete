import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDisclaimer } from "@/components/article/ArticleDisclaimer";
import { ArticleEditorialBadges } from "@/components/article/ArticleEditorialBadges";
import { ArticlePageMeta } from "@/components/article/ArticlePageMeta";
import { ArticleSections } from "@/components/article/ArticleSections";
import { ArticleShareButtons } from "@/components/article/ArticleShareButtons";
import { SourceAttribution } from "@/components/article/SourceAttribution";
import { getAllPublishedSlugs, getArticleBySlug, hasDatabase } from "@/lib/data/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (hasDatabase()) return [];
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Noticia no encontrada" };
  return {
    title: article.headline,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const articleUrl = `${process.env.NEXTAUTH_URL ?? "https://nopromete.vercel.app"}/noticias/${slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/noticias"
          className="text-sm font-semibold tracking-wide text-muted uppercase transition hover:text-ink"
        >
          ← Volver a noticias
        </Link>
        <ArticleShareButtons url={articleUrl} title={article.headline} />
      </div>

      <ArticlePageMeta article={article} />

      <h1 className="mt-6 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">
        {article.headline}
      </h1>

      <ArticleEditorialBadges
        donZopiVerdict={article.donZopiVerdict}
        smokeLevel={article.smokeLevel}
      />

      <div className="mt-10 space-y-10">
        <ArticleSections
          factualSummary={article.factualSummary}
          whyItMatters={article.whyItMatters}
          donZopiQuote={article.donZopiQuote}
          smokeLevel={article.smokeLevel}
        />
        <SourceAttribution
          sourceName={article.sourceName}
          sourceUrl={article.sourceUrl}
        />
        <ArticleDisclaimer />
      </div>
    </article>
  );
}
