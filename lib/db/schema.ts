import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "pending_review",
  "approved",
  "published",
  "rejected",
]);

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  feedUrl: text("feed_url").notNull().unique(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rawArticles = pgTable("raw_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id),
  sourceUrl: text("source_url").notNull().unique(),
  title: text("title").notNull(),
  rawHtml: text("raw_html"),
  extractedContent: text("extracted_content").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ingestedAt: timestamp("ingested_at", { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  rawArticleId: uuid("raw_article_id")
    .notNull()
    .references(() => rawArticles.id),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  status: postStatusEnum("status").notNull().default("pending_review"),
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  factualSummary: text("factual_summary").notNull(),
  whyItMatters: text("why_it_matters").notNull().default(""),
  commentary: text("commentary").notNull(),
  isPositiveNews: boolean("is_positive_news").notNull().default(false),
  donZopiQuote: text("don_zopi_quote").notNull(),
  sourceUrl: text("source_url").notNull(),
  sourceName: text("source_name").notNull(),
  heroImage: text("hero_image").notNull(),
  riskFlags: jsonb("risk_flags").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Source = typeof sources.$inferSelect;
export type RawArticle = typeof rawArticles.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type PostStatus = Post["status"];
