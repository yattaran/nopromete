"use client";

import { useActionState } from "react";
import { publishSocialDraftToInstagramById } from "@/app/admin/actions";

type State = { ok: true } | { ok: false; error: string } | null;

export function PublishInstagramControl(props: {
  draftId: string;
  canPublish: boolean;
  canRetry: boolean;
  igConfigured: boolean;
  lastError?: string | null;
}) {
  const [state, action, pending] = useActionState<State>(async () => {
    try {
      await publishSocialDraftToInstagramById(props.draftId);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Publish failed" };
    }
  }, null);

  return (
    <div className="mt-6 border-t border-ink/10 pt-4">
      <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Instagram</h3>

      {props.lastError && (
        <p className="mt-2 border border-accent/40 bg-tan/40 p-3 text-xs text-ink">
          Último error: {props.lastError}
        </p>
      )}

      {!props.igConfigured ? (
        <p className="mt-2 text-sm text-muted">
          Publicación a Instagram pendiente de configurar (
          <code className="font-mono text-xs">IG_ACCESS_TOKEN</code>,{" "}
          <code className="font-mono text-xs">IG_USER_ID</code>).
        </p>
      ) : (
        <form action={action} className="mt-3">
          <button
            type="submit"
            disabled={(!props.canPublish && !props.canRetry) || pending}
            className="bg-ink px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase disabled:opacity-60"
          >
            {pending ? "Publicando..." : props.canRetry ? "Reintentar publicación" : "Publicar story"}
          </button>
        </form>
      )}

      {props.igConfigured && !props.canPublish && !props.canRetry && (
        <p className="mt-2 text-xs text-muted">
          Requiere status <code className="font-mono">approved</code> (o <code className="font-mono">failed</code>{" "}
          para reintentar) y asset renderizado.
        </p>
      )}

      {state && !state.ok && (
        <p className="mt-3 border border-accent/40 bg-tan/40 p-3 text-sm text-ink">
          Error: {state.error}
        </p>
      )}
      {state?.ok ? (
        <p className="mt-2 text-xs text-muted">Listo. Refrescá para ver el status.</p>
      ) : null}
    </div>
  );
}

