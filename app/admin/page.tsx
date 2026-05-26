import Link from "next/link";
import type { Metadata } from "next";
import { logoutAction } from "@/app/admin/actions";
import { isMissingColumnError } from "@/lib/db/errors";
import { hasDatabase } from "@/lib/db";
import { getSocialCounts, getSocialDraftsByStatus } from "@/lib/data/social";
import { SocialControls } from "@/components/admin/SocialControls";
import { getSocialLLMConfig } from "@/lib/llm/social-provider-info";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const dbReady = hasDatabase();
  let schemaOutOfDate = false;
  let socialNeedsReview: Awaited<ReturnType<typeof getSocialDraftsByStatus>> = [];
  let socialApproved: Awaited<ReturnType<typeof getSocialDraftsByStatus>> = [];
  let socialPublished: Awaited<ReturnType<typeof getSocialDraftsByStatus>> = [];
  let socialScheduled: Awaited<ReturnType<typeof getSocialDraftsByStatus>> = [];
  let socialFailed: Awaited<ReturnType<typeof getSocialDraftsByStatus>> = [];
  let socialCounts = { sourcesCount: 0, newsItemsCount: 0 };

  if (dbReady) {
    try {
      socialNeedsReview = await getSocialDraftsByStatus("needs_review");
      socialApproved = await getSocialDraftsByStatus("approved");
      socialScheduled = await getSocialDraftsByStatus("scheduled");
      socialPublished = await getSocialDraftsByStatus("published");
      socialFailed = await getSocialDraftsByStatus("failed");
      socialCounts = await getSocialCounts();
    } catch (err) {
      if (isMissingColumnError(err, "is_positive_news")) {
        schemaOutOfDate = true;
      } else {
        throw err;
      }
    }
  }

  const llm = getSocialLLMConfig();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Panel social</h1>
          <p className="mt-1 text-sm text-muted">
            Ingesta → draft LLM → revisión → asset → publicación (manual).
          </p>
          <p className="mt-1 text-xs text-muted">
            LLM:{" "}
            <span className="font-mono text-ink">
              {llm.configured ? `${llm.provider} / ${llm.model}` : `${llm.provider} (sin API key)`}
            </span>
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

      {schemaOutOfDate && (
        <p className="mb-8 border border-accent/40 bg-tan/40 p-4 text-sm text-ink">
          Schema desactualizado. Ejecutá <code className="font-mono">npm run db:push</code> y
          recargá.
        </p>
      )}

      {dbReady && (
        <SocialControls
          sourcesCount={socialCounts.sourcesCount}
          newsItemsCount={socialCounts.newsItemsCount}
        />
      )}

      <DraftList
        title={`Pendientes de revisión (${socialNeedsReview.length})`}
        empty="No hay drafts pendientes."
        drafts={socialNeedsReview}
        cta="Revisar"
        ctaClass="bg-accent text-paper"
      />

      <DraftList
        title={`Aprobados (${socialApproved.length})`}
        empty="No hay drafts aprobados."
        drafts={socialApproved}
        cta="Ver"
        ctaClass="border border-ink"
      />

      <DraftList
        title={`Programados (${socialScheduled.length})`}
        empty="No hay drafts programados."
        drafts={socialScheduled}
        cta="Ver"
        ctaClass="border border-ink"
      />

      <DraftList
        title={`Fallidos (${socialFailed.length})`}
        empty="No hay drafts fallidos."
        drafts={socialFailed}
        cta="Revisar"
        ctaClass="bg-accent text-paper"
      />

      <DraftList
        title={`Publicados (${socialPublished.length})`}
        empty="Todavía no hay publicaciones."
        drafts={socialPublished}
        cta="Ver"
        ctaClass="border border-ink/30"
      />
    </div>
  );
}

function DraftList({
  title,
  empty,
  drafts,
  cta,
  ctaClass,
}: {
  title: string;
  empty: string;
  drafts: Awaited<ReturnType<typeof getSocialDraftsByStatus>>;
  cta: string;
  ctaClass: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-serif text-xl font-bold text-ink">{title}</h2>
      {drafts.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-ink/15 border border-ink/15">
          {drafts.map((draft) => (
            <li key={draft.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-muted">
                  {draft.platform} · {draft.format} · {draft.status}
                </p>
                <p className="mt-1 font-serif font-bold text-ink">{draft.headline || "(sin titular)"}</p>
                {draft.publishedPlatformId && (
                  <p className="mt-1 text-xs text-muted">IG: {draft.publishedPlatformId}</p>
                )}
              </div>
              <Link
                href={`/admin/social/${draft.id}`}
                className={`shrink-0 px-4 py-2 text-xs font-semibold tracking-wide uppercase ${ctaClass}`}
              >
                {cta}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
