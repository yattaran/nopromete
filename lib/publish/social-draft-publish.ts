import { and, eq, lte } from "drizzle-orm";
import { requireDb } from "@/lib/db";
import { socialDrafts } from "@/lib/db/schema";
import { publishInstagramStoryImage } from "./instagram";

type Db = ReturnType<typeof requireDb>;

export function isTransientPublishError(message: string) {
  const m = message.toLowerCase();
  return (
    m.includes("timeout") ||
    m.includes("rate limit") ||
    m.includes("429") ||
    m.includes("temporarily") ||
    m.includes("service unavailable") ||
    m.includes("503")
  );
}

export function isNonRetryablePublishError(message: string) {
  const m = message.toLowerCase();
  return (
    m.includes("permission") ||
    m.includes("oauth") ||
    m.includes("access token") ||
    m.includes("invalid") ||
    m.includes("unsupported") ||
    m.includes("not configured")
  );
}

export async function publishSocialDraftRecord(
  db: Db,
  draft: typeof socialDrafts.$inferSelect,
) {
  if (!draft.renderedAssetUrl) {
    throw new Error("Render the asset before publishing");
  }
  if (draft.platform !== "instagram") {
    throw new Error("Unsupported platform");
  }

  await db
    .update(socialDrafts)
    .set({
      status: "publishing",
      attempts: draft.attempts + 1,
      errorMessage: null,
      updatedAt: new Date(),
    })
    .where(eq(socialDrafts.id, draft.id));

  try {
    const result = await publishInstagramStoryImage({
      imageUrl: draft.renderedAssetUrl,
      caption: draft.caption,
    });

    await db
      .update(socialDrafts)
      .set({
        status: "published",
        publishedAt: new Date(),
        publishedPlatformId: result.mediaId,
        updatedAt: new Date(),
      })
      .where(eq(socialDrafts.id, draft.id));

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Publish failed";
    await db
      .update(socialDrafts)
      .set({
        status: "failed",
        errorMessage: message,
        updatedAt: new Date(),
      })
      .where(eq(socialDrafts.id, draft.id));
    throw err;
  }
}

export async function publishDueScheduledDrafts(db: Db) {
  const now = new Date();
  const due = await db
    .select()
    .from(socialDrafts)
    .where(and(eq(socialDrafts.status, "scheduled"), lte(socialDrafts.scheduledAt, now)));

  let published = 0;
  const errors: string[] = [];

  for (const draft of due) {
    try {
      await publishSocialDraftRecord(db, draft);
      published++;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed";
      errors.push(`${draft.id}: ${message}`);
    }
  }

  return { published, errors, checked: due.length };
}
