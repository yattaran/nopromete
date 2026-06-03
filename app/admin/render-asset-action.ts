"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { requireDb } from "@/lib/db";
import { socialDrafts } from "@/lib/db/schema";
import { resolveSmokeLevel } from "@/lib/editorial/smoke-level";
import { getSiteUrl } from "@/lib/site-url";
import { signAssetToken } from "@/lib/social/assets";
import { ASSET_TEMPLATE_VERSION } from "@/lib/social/asset-brand";

async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }
}

/** Isolated from ingest actions so admin pages do not bundle article extraction. */
export async function renderSocialAssetById(draftId: string) {
  await requireAuth();
  const db = requireDb();

  const [draftRow] = await db
    .select({ smokeLevel: socialDrafts.smokeLevel })
    .from(socialDrafts)
    .where(eq(socialDrafts.id, draftId))
    .limit(1);
  if (!draftRow) throw new Error("Draft not found");

  const baseUrl = getSiteUrl();
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const token = signAssetToken({ draftId, exp });
  const smoke = resolveSmokeLevel(draftRow.smokeLevel);
  const renderedAssetUrl = `${baseUrl}/api/assets/social/${draftId}?token=${token}&smoke=${smoke}`;

  await db
    .update(socialDrafts)
    .set({
      renderedAssetUrl,
      assetTemplateVersion: ASSET_TEMPLATE_VERSION,
      updatedAt: new Date(),
    })
    .where(eq(socialDrafts.id, draftId));

  revalidatePath("/admin");
  revalidatePath(`/admin/social/${draftId}`);
  return { renderedAssetUrl };
}
