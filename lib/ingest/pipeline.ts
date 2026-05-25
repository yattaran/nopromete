import { eq } from "drizzle-orm";
import { requireDb } from "@/lib/db";
import { posts, rawArticles, sources } from "@/lib/db/schema";
import { generatePostDraft } from "@/lib/llm/generate";
import type { CategorySlug } from "@/lib/types/article";
import { heroImageForCategory } from "@/lib/utils/hero-image";
import { makeSlug } from "@/lib/utils/slug";
import { fetchAndExtractArticle } from "./extract";
import { fetchFeedItems } from "./rss";

export interface IngestResult {
  processed: number;
  skipped: number;
  errors: string[];
}

export async function runIngest(options?: { maxArticles?: number }): Promise<IngestResult> {
  const maxArticles = options?.maxArticles ?? 3;
  const db = requireDb();

  const activeSources = await db
    .select()
    .from(sources)
    .where(eq(sources.active, true));

  const result: IngestResult = { processed: 0, skipped: 0, errors: [] };

  for (const source of activeSources) {
    if (result.processed >= maxArticles) break;

    let items;
    try {
      items = await fetchFeedItems(source.feedUrl);
    } catch (err) {
      result.errors.push(
        `Feed ${source.name}: ${err instanceof Error ? err.message : "unknown error"}`,
      );
      continue;
    }

    for (const item of items) {
      if (result.processed >= maxArticles) break;

      const existing = await db
        .select({ id: rawArticles.id })
        .from(rawArticles)
        .where(eq(rawArticles.sourceUrl, item.link))
        .limit(1);

      if (existing.length > 0) {
        result.skipped++;
        continue;
      }

      try {
        const extracted = await fetchAndExtractArticle(item.link);
        const draft = await generatePostDraft(
          extracted.title,
          extracted.content,
          source.name,
        );

        const category = draft.category as CategorySlug;
        const slug = makeSlug(draft.headline, crypto.randomUUID().slice(0, 6));
        const heroImage = extracted.imageUrl ?? heroImageForCategory(category);

        const [raw] = await db
          .insert(rawArticles)
          .values({
            sourceId: source.id,
            sourceUrl: item.link,
            title: extracted.title,
            rawHtml: extracted.rawHtml,
            extractedContent: extracted.content,
            imageUrl: extracted.imageUrl,
            publishedAt: item.pubDate ? new Date(item.pubDate) : null,
          })
          .returning({ id: rawArticles.id });

        await db.insert(posts).values({
          rawArticleId: raw.id,
          slug,
          category,
          status: "pending_review",
          headline: draft.headline,
          summary: draft.summary,
      factualSummary: draft.factual_summary,
      whyItMatters: draft.why_it_matters,
      commentary: draft.commentary,
          isPositiveNews: draft.is_positive_news,
          donZopiQuote: draft.don_zopi_quote,
          sourceUrl: item.link,
          sourceName: source.name,
          heroImage,
          riskFlags: draft.risk_flags,
        });

        result.processed++;
      } catch (err) {
        result.errors.push(
          `${item.link}: ${err instanceof Error ? err.message : "unknown error"}`,
        );
      }
    }
  }

  return result;
}
