import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { approveSocialDraftById, rejectSocialDraftById } from "@/app/admin/actions";
import { getSocialDraftWithNewsItem } from "@/lib/data/social";
import { RenderSocialAssetControl } from "@/components/admin/RenderSocialAssetControl";
import { SocialDraftEditForm } from "@/components/admin/SocialDraftEditForm";
import { PublishInstagramControl } from "@/components/admin/PublishInstagramControl";
import { isInstagramPublishConfigured } from "@/lib/brand";
import {
  formatSmokeLevel,
  getSmokeLevelImage,
  resolveSmokeLevel,
} from "@/lib/editorial/smoke-level";
import { isNonRetryablePublishError } from "@/lib/publish/social-draft-publish";
import { ScheduleSocialDraftControl } from "@/components/admin/ScheduleSocialDraftControl";
import { RegenerateSocialDraftControl } from "@/components/admin/RegenerateSocialDraftControl";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Revisar draft social",
  robots: { index: false, follow: false },
};

export default async function AdminSocialDraftPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getSocialDraftWithNewsItem(id);
  if (!data) notFound();

  const { draft, item } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/admin" className="text-xs font-semibold tracking-wide uppercase text-muted">
        ← Volver al panel
      </Link>

      <div className="mt-4">
        <h1 className="font-serif text-3xl font-bold text-ink">Revisar draft social</h1>
        <p className="mt-1 text-sm text-muted">
          {draft.platform} · {draft.format} · {draft.status}
          {draft.scheduledAt && (
            <> · programado {draft.scheduledAt.toLocaleString("es-CR")}</>
          )}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="border border-ink/15 p-5">
          <h2 className="font-serif text-lg font-bold text-ink">Fuente original</h2>
          <a
            href={item.sourceUrl}
            className="mt-2 inline-block text-sm font-medium text-ink underline decoration-accent/60 underline-offset-2 hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.sourceName}
          </a>

          <h3 className="mt-5 font-serif font-bold text-ink">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">
            {draft.newsSummaryInternal}
          </p>
        </section>

        <section className="border border-ink/15 p-5">
          <h2 className="font-serif text-lg font-bold text-ink">Salida social</h2>

          <p className="mt-3 text-xs font-semibold tracking-wide uppercase text-muted">
            Seguridad: {draft.safetyClassification}
          </p>
          {draft.safetyReason && <p className="mt-2 text-sm text-ink/80">{draft.safetyReason}</p>}

          <p className="mt-6 font-serif text-2xl font-bold text-ink">{draft.headline}</p>
          <p className="mt-5 text-sm leading-relaxed text-ink/80">{draft.subtext}</p>

          {draft.donZopiReaction && (
            <div className="mt-5 border-l-2 border-accent pl-3">
              <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                Don Zopi comenta
              </p>
              <blockquote className="mt-2 font-serif text-sm italic leading-relaxed">
                &ldquo;{draft.donZopiReaction}&rdquo;
              </blockquote>
              <p className="mt-2 text-xs text-muted">
                {formatSmokeLevel(resolveSmokeLevel(draft.smokeLevel))}
              </p>
              <img
                src={getSmokeLevelImage(resolveSmokeLevel(draft.smokeLevel))}
                alt=""
                className="mt-3 h-24 w-auto object-contain"
              />
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Caption</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
              {draft.caption}
            </p>
          </div>

          {draft.hashtags.length > 0 && (
            <p className="mt-4 text-xs text-muted">{draft.hashtags.join(" ")}</p>
          )}

          <p className="mt-4 text-xs">
            <a
              href={draft.linkStickerUrl || item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline decoration-accent/50 underline-offset-2 hover:text-ink"
            >
              {draft.sourceCredit || `Fuente: ${item.sourceName}`}
            </a>
          </p>

          <SocialDraftEditForm
            draftId={draft.id}
            headline={draft.headline}
            subtext={draft.subtext}
            donZopiReaction={draft.donZopiReaction}
            smokeLevel={resolveSmokeLevel(draft.smokeLevel)}
            caption={draft.caption}
            editable={draft.status === "needs_review"}
          />

          <RenderSocialAssetControl draftId={draft.id} initialUrl={draft.renderedAssetUrl} />
          <ScheduleSocialDraftControl
            draftId={draft.id}
            enabled={draft.status === "approved" && Boolean(draft.renderedAssetUrl)}
          />

          <PublishInstagramControl
            draftId={draft.id}
            canPublish={draft.status === "approved" && Boolean(draft.renderedAssetUrl)}
            canRetry={
              draft.status === "failed" &&
              Boolean(draft.renderedAssetUrl) &&
              !isNonRetryablePublishError(draft.errorMessage ?? "")
            }
            igConfigured={isInstagramPublishConfigured()}
            lastError={draft.errorMessage}
          />

          <RegenerateSocialDraftControl
            draftId={draft.id}
            enabled={draft.status === "needs_review" || draft.status === "failed"}
          />
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {draft.status === "needs_review" && (
          <>
            <form action={approveSocialDraftById.bind(null, draft.id)}>
              <button
                type="submit"
                className="bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase"
              >
                Aprobar
              </button>
            </form>
            <form action={rejectSocialDraftById.bind(null, draft.id)}>
              <button
                type="submit"
                className="border border-ink px-4 py-2 text-xs font-semibold tracking-wide uppercase"
              >
                Rechazar
              </button>
            </form>
          </>
        )}
        <Link
          href="/admin"
          className="border border-ink/30 px-4 py-2 text-xs font-semibold tracking-wide uppercase"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}

