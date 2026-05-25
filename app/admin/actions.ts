"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { updatePostStatus } from "@/lib/data/posts";
import { requireDb } from "@/lib/db";
import { posts, rawArticles } from "@/lib/db/schema";
import { generatePostDraft } from "@/lib/llm/generate";
import type { PostStatus } from "@/lib/db/schema";
import type { CategorySlug } from "@/lib/types/article";
import { heroImageForCategory } from "@/lib/utils/hero-image";

async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }
}

function revalidatePublicPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/noticias");
  if (slug) {
    revalidatePath(`/noticias/${slug}`);
  }
}

async function setStatus(id: string, status: PostStatus) {
  await requireAuth();

  const db = requireDb();
  const [post] = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  if (!post) {
    throw new Error("Post not found");
  }

  await updatePostStatus(id, status);
  revalidatePath("/admin");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePublicPages(post.slug);
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function approvePostById(postId: string) {
  await setStatus(postId, "approved");
}

export async function publishPostById(postId: string) {
  await setStatus(postId, "published");
  redirect("/admin");
}

export async function rejectPostById(postId: string) {
  await setStatus(postId, "rejected");
  redirect("/admin");
}

/** @deprecated Use approvePostById — kept for any old forms */
export async function approvePost(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Missing post id");
  await approvePostById(id);
}

export async function publishPost(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Missing post id");
  await publishPostById(id);
}

export async function rejectPost(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Missing post id");
  await rejectPostById(id);
}

export async function regeneratePost(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Missing post id");

  await requireAuth();
  const db = requireDb();

  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) throw new Error("Post not found");

  const [raw] = await db
    .select()
    .from(rawArticles)
    .where(eq(rawArticles.id, post.rawArticleId))
    .limit(1);

  if (!raw) throw new Error("Raw article not found");

  const draft = await generatePostDraft(raw.title, raw.extractedContent, post.sourceName);
  const category = draft.category as CategorySlug;

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
      category,
      heroImage: raw.imageUrl ?? heroImageForCategory(category),
      riskFlags: draft.risk_flags,
      status: "pending_review",
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));

  revalidatePath("/admin");
  revalidatePath(`/admin/posts/${id}`);
}

export async function runIngestAction() {
  await requireAuth();

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) throw new Error("CRON_SECRET not configured");

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/cron/ingest`, {
    headers: { Authorization: `Bearer ${cronSecret}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Ingest failed");
  }

  revalidatePath("/admin");
  return data;
}
