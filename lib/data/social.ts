import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { newsItems, socialDrafts } from "@/lib/db/schema";
import type { SocialDraftStatus } from "@/lib/db/schema";
import { sources } from "@/lib/db/schema";

export async function getSocialDraftsByStatus(status: SocialDraftStatus) {
  const db = getDb();
  if (!db) return [];
  return db
    .select()
    .from(socialDrafts)
    .where(eq(socialDrafts.status, status))
    .orderBy(desc(socialDrafts.createdAt))
    .limit(50);
}

export async function getSocialDraftWithNewsItem(id: string) {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(socialDrafts)
    .innerJoin(newsItems, eq(newsItems.id, socialDrafts.newsItemId))
    .where(eq(socialDrafts.id, id))
    .limit(1);
  if (!row) return null;
  return { draft: row.social_drafts, item: row.news_items };
}

export async function getSocialCounts() {
  const db = getDb();
  if (!db) return { sourcesCount: 0, newsItemsCount: 0 };

  const [sourcesRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(sources)
    .limit(1);
  const [itemsRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(newsItems)
    .limit(1);

  return {
    sourcesCount: Number(sourcesRow?.count ?? 0),
    newsItemsCount: Number(itemsRow?.count ?? 0),
  };
}

