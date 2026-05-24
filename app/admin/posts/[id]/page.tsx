import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostReviewActions } from "@/components/admin/PostReviewActions";
import { PostStatusBadge } from "@/components/admin/PostStatusBadge";
import { getPostWithRaw } from "@/lib/data/posts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Revisar borrador",
  robots: { index: false, follow: false },
};

export default async function AdminPostPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getPostWithRaw(id);
  if (!data) notFound();

  const { post, raw } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/admin" className="text-xs font-semibold tracking-wide uppercase text-muted">
        ← Volver al panel
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl font-bold text-ink">Revisar borrador</h1>
        <PostStatusBadge status={post.status} />
      </div>

      {post.riskFlags.length > 0 && (
        <p className="mt-4 border border-accent bg-tan/50 p-3 text-sm text-ink">
          <strong>Flags de riesgo:</strong> {post.riskFlags.join(", ")}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="border border-ink/15 p-5">
          <h2 className="font-serif text-lg font-bold text-ink">Fuente original</h2>
          <p className="mt-2 text-sm text-muted">
            {post.sourceName} ·{" "}
            <a href={post.sourceUrl} className="underline" target="_blank" rel="noopener noreferrer">
              Ver original
            </a>
          </p>
          <h3 className="mt-4 font-serif font-bold text-ink">{raw?.title}</h3>
          <p className="mt-4 max-h-[480px] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {raw?.extractedContent}
          </p>
        </section>

        <section className="border border-ink/15 p-5">
          <h2 className="font-serif text-lg font-bold text-ink">Borrador No Promete</h2>
          <p className="mt-4 font-serif text-2xl font-bold text-ink">{post.headline}</p>
          <p className="mt-3 text-sm text-ink/80">{post.summary}</p>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
                Qué pasó
              </h3>
              <p className="mt-2 text-sm leading-relaxed">{post.factualSummary}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
                Por qué importa
              </h3>
              <p className="mt-2 text-sm leading-relaxed">{post.whyItMatters || post.summary}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
                La parte no promete
              </h3>
              <p className="mt-2 text-sm leading-relaxed">{post.commentary}</p>
              <blockquote className="mt-3 border-l-2 border-accent pl-3 font-serif italic">
                &ldquo;{post.donZopiQuote}&rdquo;
              </blockquote>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <PostReviewActions postId={post.id} status={post.status} />
      </div>
    </div>
  );
}
