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

// --- Social-first pipeline (new primary model) ---
export const newsItemStatusEnum = pgEnum("news_item_status", [
  "fetched",
  "extracted",
  "duplicate",
  "rejected",
  "ready_for_llm",
]);

export const socialDraftStatusEnum = pgEnum("social_draft_status", [
  "draft",
  "needs_review",
  "approved",
  "scheduled",
  "publishing",
  "published",
  "failed",
  "rejected",
]);

export const socialPlatformEnum = pgEnum("social_platform", ["instagram"]);

export const socialFormatEnum = pgEnum("social_format", [
  "story_text_only",
  "story_with_don_zopi",
  "carousel_3_slide",
  "feed_post",
  "not_suitable",
]);

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  feedUrl: text("feed_url").notNull().unique(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Lean storage: keep only metadata + links + small internal summaries (no raw article text).
export const newsItems = pgTable("news_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url").notNull().unique(),
  rssFeedUrl: text("rss_feed_url").notNull(),

  title: text("title").notNull(),
  description: text("description"),
  normalizedTitle: text("normalized_title").notNull(),

  publishedAt: timestamp("published_at", { withTimezone: true }),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull().defaultNow(),

  extractedTitle: text("extracted_title"),
  extractedSummary: text("extracted_summary"),
  articleImageUrl: text("article_image_url"),

  status: newsItemStatusEnum("status").notNull().default("fetched"),
  rawPayload: jsonb("raw_payload").$type<unknown>().notNull().default({}),
});

export const socialDrafts = pgTable("social_drafts", {
  id: uuid("id").primaryKey().defaultRandom(),
  newsItemId: uuid("news_item_id")
    .notNull()
    .references(() => newsItems.id),

  platform: socialPlatformEnum("platform").notNull().default("instagram"),
  format: socialFormatEnum("format").notNull().default("story_text_only"),

  safetyClassification: text("safety_classification").notNull().default("safe"),
  safetyReason: text("safety_reason").notNull().default(""),
  newsSummaryInternal: text("news_summary_internal").notNull().default(""),
  editorialAngle: text("editorial_angle").notNull().default(""),

  headline: text("headline").notNull().default(""),
  subtext: text("subtext").notNull().default(""),
  donZopiReaction: text("don_zopi_reaction").notNull().default(""),
  smokeLevel: text("smoke_level").notNull().default("sospechoso"),
  caption: text("caption").notNull().default(""),
  hashtags: jsonb("hashtags").$type<string[]>().notNull().default([]),

  sourceCredit: text("source_credit").notNull().default(""),
  linkStickerUrl: text("link_sticker_url").notNull().default(""),

  imagePrompt: text("image_prompt").notNull().default(""),
  renderedAssetUrl: text("rendered_asset_url"),
  assetTemplateVersion: text("asset_template_version").notNull().default("v1"),

  status: socialDraftStatusEnum("status").notNull().default("draft"),
  reviewerNotes: text("reviewer_notes").notNull().default(""),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  publishedPlatformId: text("published_platform_id"),

  attempts: integer("attempts").notNull().default(0),
  errorMessage: text("error_message"),
  llmPromptVersion: text("llm_prompt_version").notNull().default("v1"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
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
  donZopiVerdict: text("don_zopi_verdict").notNull().default("No promete."),
  smokeLevel: text("smoke_level").notNull().default("sospechoso"),
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
export type NewsItem = typeof newsItems.$inferSelect;
export type NewsItemStatus = NewsItem["status"];
export type SocialDraft = typeof socialDrafts.$inferSelect;
export type SocialDraftStatus = SocialDraft["status"];
export type RawArticle = typeof rawArticles.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type PostStatus = Post["status"];
