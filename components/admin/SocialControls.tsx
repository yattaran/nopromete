"use client";

import { useActionState } from "react";
import {
  generateSocialDraftsAction,
  publishDueScheduledSocialDraftsAction,
  runSocialIngestAction,
} from "@/app/admin/actions";

type IngestState = { processed?: number; skipped?: number; errors?: string[] } | null;
type DraftState = { created?: number; errors?: string[] } | null;
type PublishState = { published?: number; checked?: number; errors?: string[] } | null;

function ResultBox({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  if (lines.length === 0) return null;
  return (
    <div className="mt-3 border border-ink/15 bg-tan/30 p-3 text-xs text-ink/80">
      <p className="font-semibold tracking-wide uppercase text-muted">{title}</p>
      <ul className="mt-2 list-disc pl-5">
        {lines.map((l, idx) => (
          <li key={idx}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

export function SocialControls(props: { sourcesCount: number; newsItemsCount: number }) {
  const [ingestState, ingestAction, ingestPending] = useActionState<IngestState>(
    async () => {
      try {
        const res = await runSocialIngestAction({ maxItems: 25 });
        return res;
      } catch (e) {
        return { errors: [e instanceof Error ? e.message : "Ingest failed"] };
      }
    },
    null,
  );

  const [draftState, draftAction, draftPending] = useActionState<DraftState>(
    async () => {
      try {
        const res = await generateSocialDraftsAction({ maxDrafts: 1 });
        return res;
      } catch (e) {
        return { errors: [e instanceof Error ? e.message : "Draft generation failed"] };
      }
    },
    null,
  );

  const ingestLines = [
    ingestState?.processed !== undefined ? `processed: ${ingestState.processed}` : "",
    ingestState?.skipped !== undefined ? `skipped: ${ingestState.skipped}` : "",
    ...(ingestState?.errors ?? []).map((e) => `error: ${e}`),
  ].filter(Boolean);

  const draftLines = [
    draftState?.created !== undefined ? `created: ${draftState.created}` : "",
    ...(draftState?.errors ?? []).map((e) => `error: ${e}`),
  ].filter(Boolean);

  const [publishState, publishAction, publishPending] = useActionState<PublishState>(
    async () => {
      try {
        return await publishDueScheduledSocialDraftsAction();
      } catch (e) {
        return { errors: [e instanceof Error ? e.message : "Publish failed"] };
      }
    },
    null,
  );

  const publishLines = [
    publishState?.checked !== undefined ? `checked: ${publishState.checked}` : "",
    publishState?.published !== undefined ? `published: ${publishState.published}` : "",
    ...(publishState?.errors ?? []).map((e) => `error: ${e}`),
  ].filter(Boolean);

  return (
    <div className="mb-8 border border-ink/15 p-4">
      <p className="text-xs text-muted">
        Sources: <strong className="text-ink">{props.sourcesCount}</strong> · News items:{" "}
        <strong className="text-ink">{props.newsItemsCount}</strong>
      </p>

      {props.sourcesCount === 0 && (
        <p className="mt-3 border border-accent/40 bg-tan/40 p-3 text-sm text-ink">
          No hay fuentes configuradas en <code className="font-mono">sources</code>. Corré{" "}
          <code className="font-mono">npm run db:seed</code> o agregá feeds en la tabla.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <form action={ingestAction}>
          <button
            type="submit"
            disabled={ingestPending}
            className="bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase disabled:opacity-60"
          >
            {ingestPending ? "Ingestando..." : "Ingesta social (25)"}
          </button>
        </form>
        <form action={draftAction}>
          <button
            type="submit"
            disabled={draftPending}
            className="bg-ink px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase disabled:opacity-60"
          >
            {draftPending ? "Generando..." : "Generar draft (1)"}
          </button>
        </form>
        <form action={publishAction}>
          <button
            type="submit"
            disabled={publishPending}
            className="border border-ink/30 px-4 py-2 text-xs font-semibold tracking-wide uppercase disabled:opacity-60"
          >
            {publishPending ? "Publicando..." : "Publicar programados"}
          </button>
        </form>
      </div>

      <ResultBox title="Resultado ingesta" lines={ingestLines} />
      <ResultBox title="Resultado drafts" lines={draftLines} />
      <ResultBox title="Resultado programados" lines={publishLines} />
    </div>
  );
}

