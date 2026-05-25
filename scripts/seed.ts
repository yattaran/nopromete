import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { eq } from "drizzle-orm";
import { articles as mockArticles } from "../lib/mock/articles";
import { requireDb } from "../lib/db";
import { posts, rawArticles, sources } from "../lib/db/schema";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

const DEFAULT_SOURCES = [
  { name: "La Nación", feedUrl: "https://www.nacion.com/arc/outboundfeeds/rss/?outputType=xml" },
  { name: "Delfino.cr", feedUrl: "https://delfino.cr/feed" },
];

async function seed() {
  loadEnvLocal();
  const db = requireDb();

  for (const source of DEFAULT_SOURCES) {
    await db.insert(sources).values(source).onConflictDoNothing({ target: sources.feedUrl });
  }

  const [defaultSource] = await db.select().from(sources).limit(1);
  if (!defaultSource) {
    throw new Error("No sources available after seed");
  }

  for (const article of mockArticles) {
    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, article.slug))
      .limit(1);

    if (existingPost.length > 0) continue;

    let rawId: string | undefined;

    const [insertedRaw] = await db
      .insert(rawArticles)
      .values({
        sourceId: defaultSource.id,
        sourceUrl: article.sourceUrl,
        title: article.headline,
        extractedContent: article.factualSummary,
        imageUrl: article.heroImage.startsWith("http") ? article.heroImage : null,
        publishedAt: new Date(article.publishedAt),
      })
      .onConflictDoNothing({ target: rawArticles.sourceUrl })
      .returning({ id: rawArticles.id });

    if (insertedRaw) {
      rawId = insertedRaw.id;
    } else {
      const [existingRaw] = await db
        .select({ id: rawArticles.id })
        .from(rawArticles)
        .where(eq(rawArticles.sourceUrl, article.sourceUrl))
        .limit(1);
      rawId = existingRaw?.id;
    }

    if (!rawId) continue;

    await db.insert(posts).values({
      rawArticleId: rawId,
      slug: article.slug,
      category: article.category,
      status: "published",
      headline: article.headline,
      summary: article.summary,
      factualSummary: article.factualSummary,
      whyItMatters: article.whyItMatters,
      commentary: article.donZopiQuote,
      isPositiveNews: article.isPositiveNews ?? false,
      donZopiQuote: article.donZopiQuote,
      donZopiVerdict: article.donZopiVerdict,
      smokeLevel: article.smokeLevel,
      sourceUrl: article.sourceUrl,
      sourceName: article.sourceName,
      heroImage: article.heroImage,
      featured: article.featured ?? false,
      viewCount: article.viewCount ?? 0,
      publishedAt: new Date(article.publishedAt),
    });
  }

  console.log("Seed complete: RSS sources + mock articles as published posts.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
