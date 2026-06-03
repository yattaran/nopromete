"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { getDatabaseUrl, requireDb } from "@/lib/db";
import { newsItems, socialDrafts } from "@/lib/db/schema";
import { runSocialIngest } from "@/lib/ingest/social-pipeline";
import { isSmokeLevel } from "@/lib/editorial/smoke-level";
import { generateSocialDraft } from "@/lib/llm/social-generate";
import {
  isNonRetryablePublishError,
  publishDueScheduledDrafts,
  publishSocialDraftRecord,
} from "@/lib/publish/social-draft-publish";

async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function runSocialIngestAction(options?: { maxItems?: number }) {
  await requireAuth();

  if (!getDatabaseUrl()) {
    throw new Error("DATABASE_URL missing or invalid (expected postgresql://...)");
  }

  const result = await runSocialIngest({ maxItems: options?.maxItems ?? 25 });
  revalidatePath("/admin");
  return result;
}

export async function generateSocialDraftsAction(options?: { maxDrafts?: number }) {
  await requireAuth();
  const maxDrafts = options?.maxDrafts ?? 1;

  const db = requireDb();

  const candidates = await db
    .select()
    .from(newsItems)
    .leftJoin(socialDrafts, eq(socialDrafts.newsItemId, newsItems.id))
    .where(isNull(socialDrafts.id))
    .limit(maxDrafts);

  let created = 0;
  const errors: string[] = [];

  for (const row of candidates) {
    const item = row.news_items;
    try {
      const { fetchAndExtractArticle } = await import("@/lib/ingest/extract");
      const extracted = await fetchAndExtractArticle(item.sourceUrl);
      const { output, promptVersion } = await generateSocialDraft({
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        title: extracted.title ?? item.title,
        extractedText: [
          extracted.content,
          item.description ? `\n\nResumen RSS:\n${item.description}` : "",
        ].join(""),
      });

      await db.insert(socialDrafts).values({
        newsItemId: item.id,
        platform: "instagram",
        format: output.recommended_format,
        safetyClassification: output.safety_classification,
        safetyReason: output.reason,
        newsSummaryInternal: output.news_summary_internal,
        editorialAngle: output.editorial_angle,
        headline: output.story_headline,
        subtext: output.story_subtext,
        donZopiReaction: output.don_zopi_reaction ?? "",
        smokeLevel: output.smoke_level,
        caption: output.instagram_caption,
        hashtags: output.hashtags ?? [],
        sourceCredit: output.source_credit,
        linkStickerUrl: output.link_sticker_url,
        status: "needs_review",
        llmPromptVersion: promptVersion,
        updatedAt: new Date(),
      });

      await db
        .update(newsItems)
        .set({
          extractedTitle: extracted.title,
          extractedSummary: extracted.description ?? item.description ?? null,
          articleImageUrl: extracted.imageUrl,
          status: "ready_for_llm",
        })
        .where(eq(newsItems.id, item.id));

      created++;
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      errors.push(`${item.sourceUrl}: ${message}`);

      if (
        message.includes("429") ||
        message.toLowerCase().includes("quota") ||
        message.toLowerCase().includes("rate limit")
      ) {
        break;
      }
    }
  }

  revalidatePath("/admin");
  return { created, errors };
}

export async function updateSocialDraftFieldsAction(draftId: string, formData: FormData) {
  await requireAuth();
  const db = requireDb();

  const headline = formData.get("headline");
  const subtext = formData.get("subtext");
  const donZopiReaction = formData.get("donZopiReaction");
  const smokeLevel = formData.get("smokeLevel");
  const caption = formData.get("caption");

  if (
    typeof headline !== "string" ||
    typeof subtext !== "string" ||
    typeof donZopiReaction !== "string" ||
    typeof smokeLevel !== "string" ||
    typeof caption !== "string"
  ) {
    throw new Error("Invalid form data");
  }

  if (!isSmokeLevel(smokeLevel)) {
    throw new Error("Invalid smoke level");
  }

  await db
    .update(socialDrafts)
    .set({
      headline: headline.trim(),
      subtext: subtext.trim(),
      donZopiReaction: donZopiReaction.trim(),
      smokeLevel,
      caption: caption.trim(),
      updatedAt: new Date(),
      renderedAssetUrl: null,
    })
    .where(and(eq(socialDrafts.id, draftId), eq(socialDrafts.status, "needs_review")));

  revalidatePath(`/admin/social/${draftId}`);
}

export async function approveSocialDraftById(draftId: string) {
  await requireAuth();
  const db = requireDb();
  await db
    .update(socialDrafts)
    .set({
      status: "approved",
      approvedBy: "admin",
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(socialDrafts.id, draftId), eq(socialDrafts.status, "needs_review")));
  revalidatePath("/admin");
  revalidatePath(`/admin/social/${draftId}`);
}

export async function rejectSocialDraftById(draftId: string) {
  await requireAuth();
  const db = requireDb();
  await db
    .update(socialDrafts)
    .set({
      status: "rejected",
      updatedAt: new Date(),
    })
    .where(eq(socialDrafts.id, draftId));
  revalidatePath("/admin");
  redirect("/admin");
}

export async function publishSocialDraftToInstagramById(draftId: string) {
  await requireAuth();
  const db = requireDb();

  const [draft] = await db.select().from(socialDrafts).where(eq(socialDrafts.id, draftId)).limit(1);
  if (!draft) throw new Error("Draft not found");
  if (draft.status !== "approved" && draft.status !== "failed") {
    throw new Error("Draft must be approved (or failed for retry) before publishing");
  }
  if (draft.status === "failed" && isNonRetryablePublishError(draft.errorMessage ?? "")) {
    throw new Error("This error is not retryable. Fix configuration and re-approve.");
  }

  await publishSocialDraftRecord(db, draft);
  revalidatePath("/admin");
  revalidatePath(`/admin/social/${draftId}`);
}

export async function scheduleSocialDraftById(draftId: string, formData: FormData) {
  await requireAuth();
  const db = requireDb();
  const when = formData.get("scheduledAt");
  if (typeof when !== "string" || !when) throw new Error("Missing schedule time");

  const scheduledAt = new Date(when);
  if (Number.isNaN(scheduledAt.getTime())) throw new Error("Invalid schedule time");

  await db
    .update(socialDrafts)
    .set({
      status: "scheduled",
      scheduledAt,
      updatedAt: new Date(),
    })
    .where(and(eq(socialDrafts.id, draftId), eq(socialDrafts.status, "approved")));

  revalidatePath("/admin");
  revalidatePath(`/admin/social/${draftId}`);
}

export async function publishDueScheduledSocialDraftsAction() {
  await requireAuth();
  const db = requireDb();
  const result = await publishDueScheduledDrafts(db);
  revalidatePath("/admin");
  return result;
}

export async function regenerateSocialDraftById(draftId: string) {
  await requireAuth();
  const db = requireDb();

  const data = await db
    .select()
    .from(socialDrafts)
    .innerJoin(newsItems, eq(newsItems.id, socialDrafts.newsItemId))
    .where(eq(socialDrafts.id, draftId))
    .limit(1);

  const row = data[0];
  if (!row) throw new Error("Draft not found");
  if (row.social_drafts.status !== "needs_review" && row.social_drafts.status !== "failed") {
    throw new Error("Can only regenerate drafts in needs_review or failed");
  }

  const item = row.news_items;
  const { fetchAndExtractArticle } = await import("@/lib/ingest/extract");
  const extracted = await fetchAndExtractArticle(item.sourceUrl);
  const { output, promptVersion } = await generateSocialDraft({
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    title: extracted.title ?? item.title,
    extractedText: [
      extracted.content,
      item.description ? `\n\nResumen RSS:\n${item.description}` : "",
    ].join(""),
  });

  await db
    .update(socialDrafts)
    .set({
      format: output.recommended_format,
      safetyClassification: output.safety_classification,
      safetyReason: output.reason,
      newsSummaryInternal: output.news_summary_internal,
      editorialAngle: output.editorial_angle,
      headline: output.story_headline,
      subtext: output.story_subtext,
      donZopiReaction: output.don_zopi_reaction ?? "",
      smokeLevel: output.smoke_level,
      caption: output.instagram_caption,
      hashtags: output.hashtags ?? [],
      sourceCredit: output.source_credit,
      linkStickerUrl: output.link_sticker_url,
      status: "needs_review",
      renderedAssetUrl: null,
      errorMessage: null,
      llmPromptVersion: promptVersion,
      updatedAt: new Date(),
    })
    .where(eq(socialDrafts.id, draftId));

  revalidatePath("/admin");
  revalidatePath(`/admin/social/${draftId}`);
}
