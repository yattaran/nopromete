import { and, desc, eq, ne } from "drizzle-orm";
import { getDb, requireDb } from "@/lib/db";
import { posts, rawArticles } from "@/lib/db/schema";
import type { Post, PostStatus } from "@/lib/db/schema";
import * as mock from "@/lib/mock/articles";
import type { Article, CategorySlug } from "@/lib/types/article";

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
  return Boolean(process.env.DATABASE_URL);
}

export async function getFeaturedArticle(): Promise<Article> {
  const db = getDb();
  if (!db) return mock.getFeaturedArticle();

  const [featured] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "published"), eq(posts.featured, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(1);

  if (featured) return rowToArticle(featured);

  const [latest] = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(1);

  if (latest) return rowToArticle(latest);
  return mock.getFeaturedArticle();
}

export async function getGridArticles(): Promise<Article[]> {
  const db = getDb();
  if (!db) return mock.getGridArticles();

  const featured = await getFeaturedArticle();
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "published"), ne(posts.slug, featured.slug)))
    .orderBy(desc(posts.publishedAt))
    .limit(3);

  if (rows.length === 0) return mock.getGridArticles();
  return rows.map(rowToArticle);
}

export async function getFeaturedDonZopiQuote(): Promise<string> {
  const featured = await getFeaturedArticle();
  return featured.donZopiQuote;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = getDb();
  if (!db) return mock.getArticleBySlug(slug) ?? null;

  const [row] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!row || row.status !== "published") {
    return mock.getArticleBySlug(slug) ?? null;
  }
  return rowToArticle(row);
}

export async function getArticlesByCategory(category: CategorySlug): Promise<Article[]> {
  const db = getDb();
  if (!db) return mock.getArticlesByCategory(category);

  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.status, "published"), eq(posts.category, category)))
    .orderBy(desc(posts.publishedAt));

  if (rows.length === 0) return mock.getArticlesByCategory(category);
  return rows.map(rowToArticle);
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const db = getDb();
  if (!db) return mock.getAllSlugs();

  const rows = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.status, "published"));

  if (rows.length === 0) return mock.getAllSlugs();
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
