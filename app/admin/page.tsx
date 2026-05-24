import Link from "next/link";
import type { Metadata } from "next";
import { logoutAction, runIngestAction } from "@/app/admin/actions";
import { getPostsByStatus, hasDatabase } from "@/lib/data/posts";
import { PostStatusBadge } from "@/components/admin/PostStatusBadge";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const dbReady = hasDatabase();
  const pending = dbReady ? await getPostsByStatus("pending_review") : [];
  const approved = dbReady ? await getPostsByStatus("approved") : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Panel editorial</h1>
          <p className="mt-1 text-sm text-muted">
            Revisá borradores RSS + LLM antes de publicar.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="border border-ink/30 px-4 py-2 text-xs font-semibold tracking-wide uppercase"
          >
            Salir
          </button>
        </form>
      </div>

      {!dbReady && (
        <p className="mb-8 border border-accent/40 bg-tan/40 p-4 text-sm text-ink">
          Configurá <code className="font-mono">DATABASE_URL</code> en{" "}
          <code className="font-mono">.env.local</code> y ejecutá{" "}
          <code className="font-mono">npm run db:push</code> y{" "}
          <code className="font-mono">npm run db:seed</code>.
        </p>
      )}

      {dbReady && (
        <form
          action={async () => {
            "use server";
            await runIngestAction();
          }}
          className="mb-8"
        >
          <button
            type="submit"
            className="bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase"
          >
            Ejecutar ingesta manual
          </button>
        </form>
      )}

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">
          Pendientes de revisión ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted">No hay borradores pendientes.</p>
        ) : (
          <ul className="divide-y divide-ink/15 border border-ink/15">
            {pending.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <PostStatusBadge status={post.status} />
                  <p className="mt-1 font-serif font-bold text-ink">{post.headline}</p>
                  <p className="mt-1 text-xs text-muted">
                    {post.sourceName} · {post.category}
                  </p>
                  {post.riskFlags.length > 0 && (
                    <p className="mt-2 text-xs text-accent">
                      Flags: {post.riskFlags.join(", ")}
                    </p>
                  )}
                </div>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="shrink-0 bg-ink px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase"
                >
                  Revisar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">
          Aprobados ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-muted">No hay posts aprobados esperando publicación.</p>
        ) : (
          <ul className="divide-y divide-ink/15 border border-ink/15">
            {approved.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <PostStatusBadge status={post.status} />
                  <p className="mt-1 font-serif font-bold text-ink">{post.headline}</p>
                </div>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="shrink-0 border border-ink px-4 py-2 text-xs font-semibold tracking-wide uppercase"
                >
                  Publicar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
