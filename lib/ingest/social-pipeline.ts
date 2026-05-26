import { and, eq, gte } from "drizzle-orm";
import { requireDb } from "@/lib/db";
import { newsItems, sources } from "@/lib/db/schema";
import { fetchFeedItems } from "./rss";

export interface SocialIngestResult {
  processed: number;
  skipped: number;
  errors: string[];
}

function normalizeTitle(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, "");
}

export async function runSocialIngest(options?: { maxItems?: number }): Promise<SocialIngestResult> {
  const maxItems = options?.maxItems ?? 25;
  const db = requireDb();

  const activeSources = await db
    .select()
    .from(sources)
    .where(eq(sources.active, true));

  const result: SocialIngestResult = { processed: 0, skipped: 0, errors: [] };

  for (const source of activeSources) {
    if (result.processed >= maxItems) break;

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
      if (result.processed >= maxItems) break;

      // Fast dedupe: unique on `source_url` (and we also keep normalized_title for later heuristics).
      const existing = await db
        .select({ id: newsItems.id })
        .from(newsItems)
        .where(eq(newsItems.sourceUrl, item.link))
        .limit(1);

      if (existing.length > 0) {
        result.skipped++;
        continue;
      }

      const normalized = normalizeTitle(item.title);
      const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const similar = await db
        .select({ id: newsItems.id })
        .from(newsItems)
        .where(
          and(
            eq(newsItems.sourceId, source.id),
            eq(newsItems.normalizedTitle, normalized),
            gte(newsItems.fetchedAt, since),
          ),
        )
        .limit(1);

      if (similar.length > 0) {
        result.skipped++;
        continue;
      }

      try {
        await db.insert(newsItems).values({
          sourceId: source.id,
          sourceName: source.name,
          sourceUrl: item.link,
          rssFeedUrl: source.feedUrl,
          title: item.title,
          description: item.description ?? null,
          normalizedTitle: normalized,
          publishedAt: item.pubDate ? new Date(item.pubDate) : null,
          status: "fetched",
          rawPayload: item,
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

