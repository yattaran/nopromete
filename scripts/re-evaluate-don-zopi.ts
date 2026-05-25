import { eq } from "drizzle-orm";
import { loadLocalEnv } from "../lib/env/load-local";
import { getDatabaseUrl, requireDb } from "../lib/db";
import { posts, rawArticles } from "../lib/db/schema";
import { generatePostDraft } from "../lib/llm/generate";

function parseSlugFilter(): string | undefined {
  const flag = process.argv.find((arg) => arg.startsWith("--slug="));
  return flag?.slice("--slug=".length);
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const slugFilter = parseSlugFilter();

  loadLocalEnv();

  if (!getDatabaseUrl()) {
    console.error("Falta DATABASE_URL en .env.local");
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("Falta GEMINI_API_KEY en .env.local");
    process.exit(1);
  }

  const db = requireDb();

  let published = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"));

  if (slugFilter) {
    published = published.filter((p) => p.slug === slugFilter);
    if (published.length === 0) {
      console.error(`No hay post publicado con slug: ${slugFilter}`);
      process.exit(1);
    }
  }

  if (published.length === 0) {
    console.log("No hay posts publicados.");
    return;
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Re-evaluando Don Zopi en ${published.length} post(s)…`,
  );

  let ok = 0;
  let failed = 0;

  for (const post of published) {
    const [raw] = await db
      .select()
      .from(rawArticles)
      .where(eq(rawArticles.id, post.rawArticleId))
      .limit(1);

    if (!raw) {
      console.error(`  ✗ ${post.slug}: sin raw article`);
      failed++;
      continue;
    }

    try {
      const draft = await generatePostDraft(
        raw.title,
        raw.extractedContent,
        post.sourceName,
      );

      if (dryRun) {
        console.log(`  · ${post.slug}`);
        console.log(`    veredicto: ${draft.don_zopi_verdict}`);
        console.log(`    humo: ${draft.smoke_level}`);
        console.log(`    cita: ${draft.don_zopi_quote.slice(0, 80)}…`);
        ok++;
        continue;
      }

      await db
        .update(posts)
        .set({
          headline: draft.headline,
          summary: draft.summary,
          factualSummary: draft.factual_summary,
          whyItMatters: draft.why_it_matters,
          commentary: draft.don_zopi_quote,
          isPositiveNews: draft.is_positive_news,
          donZopiQuote: draft.don_zopi_quote,
          donZopiVerdict: draft.don_zopi_verdict,
          smokeLevel: draft.smoke_level,
          riskFlags: draft.risk_flags,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, post.id));

      console.log(`  ✓ ${post.slug}`);
      ok++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${post.slug}: ${msg}`);
      failed++;
    }
  }

  console.log(`\nListo: ${ok} ok, ${failed} error(es).`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
