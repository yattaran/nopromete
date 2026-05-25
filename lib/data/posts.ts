import { and, desc, eq, ne } from "drizzle-orm";
import { getDb, getDatabaseUrl, requireDb } from "@/lib/db";
import { posts, rawArticles } from "@/lib/db/schema";
import type { Post, PostStatus } from "@/lib/db/schema";
import * as mock from "@/lib/mock/articles";
import type { Article, CategorySlug } from "@/lib/types/article";

function useMockArticles(): boolean {
  return !getDatabaseUrl();
}

function isCategorySlug(value: string): value is CategorySlug {
  return [
    "noticias",
    "politica",
    "costa-rica",
    "mundo",
    "opinion",
    "cultura",
    "que-desastre",
  ].includes(value);
}

function rowToArticle(row: Post): Article {
  return {
    slug: row.slug,
    category: isCategorySlug(row.category) ? row.category : "noticias",
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    headline: row.headline,
    summary: row.summary,
    factualSummary: row.factualSummary,
    whyItMatters: row.whyItMatters || row.summary,
    commentary: row.commentary,
    isPositiveNews: row.isPositiveNews,
    donZopiQuote: row.donZopiQuote,
    sourceUrl: row.sourceUrl,
    sourceName: row.sourceName,
    heroImage: row.heroImage,
    viewCount: row.viewCount,
    featured: row.featured,
  };
}

export function hasDatabase(): boolean {
  return Boolean(getDatabaseUrl());
}

export async function getFeaturedArticle(): Promise<Article | null> {
  if (useMockArticles()) return mock.getFeaturedArticle();

  const db = getDb();
  if (!db) return null;

  const [latest] = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(1);

  return latest ? rowToArticle(latest) : null;
}

export async function getGridArticles(): Promise<Article[]> {
  if (useMockArticles()) return mock.getGridArticles();

  const db = getDb();
  if (!db) return [];

  const featured = await getFeaturedArticle();
  const gridConditions = [eq(posts.status, "published")];
  if (featured) {
    gridConditions.push(ne(posts.slug, featured.slug));
  }

  const rows = await db
    .select()
    .from(posts)
    .where(and(...gridConditions))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  return rows.map(rowToArticle);
}

export async function getFeaturedDonZopiQuote(): Promise<string> {
  const featured = await getFeaturedArticle();
  if (featured) return featured.donZopiQuote;
  if (useMockArticles()) return mock.getFeaturedDonZopiQuote();
  return "Todavía no hay noticias publicadas. Don Zopi está en la torre esperando el primer cable.";
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (useMockArticles()) return mock.getArticleBySlug(slug) ?? null;

  const db = getDb();
  if (!db) return null;

  const [row] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!row || row.status !== "published") return null;
  return rowToArticle(row);
}

export async function getArticlesByCategory(category: CategorySlug): Promise<Article[]> {
  if (useMockArticles()) return mock.getArticlesByCategory(category);

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "published"), eq(posts.category, category)))
    .orderBy(desc(posts.publishedAt));

  return rows.map(rowToArticle);
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  if (useMockArticles()) return mock.getAllSlugs();

  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.status, "published"));

  return rows.map((r) => r.slug);
}

export async function getPostsByStatus(status: PostStatus) {
  const db = getDb();
  if (!db) return [];

  return db
    .select()
    .from(posts)
    .where(eq(posts.status, status))
    .orderBy(desc(posts.createdAt));
}

export async function getPostWithRaw(id: string) {
  const db = getDb();
  if (!db) return null;

  const [row] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!row) return null;

  const [raw] = await db
    .select()
    .from(rawArticles)
    .where(eq(rawArticles.id, row.rawArticleId))
    .limit(1);

  return { post: row, raw: raw ?? null };
}

export async function updatePostStatus(id: string, status: PostStatus) {
  const db = requireDb();
  const now = new Date();

  await db
    .update(posts)
    .set({
      status,
      updatedAt: now,
      ...(status === "published" ? { publishedAt: now } : {}),
    })
    .where(eq(posts.id, id));
}

export { rowToArticle };
