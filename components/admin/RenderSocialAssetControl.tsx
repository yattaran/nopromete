"use client";

import { useActionState } from "react";
import { renderSocialAssetById } from "@/app/admin/render-asset-action";

type State =
  | { ok: true; renderedAssetUrl: string }
  | { ok: false; error: string }
  | null;

export function RenderSocialAssetControl(props: { draftId: string; initialUrl: string | null }) {
  const [state, action, pending] = useActionState<State>(async () => {
    try {
      const res = await renderSocialAssetById(props.draftId);
      return { ok: true, renderedAssetUrl: res.renderedAssetUrl };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Render failed" };
    }
  }, null);

  const url = state?.ok ? state.renderedAssetUrl : props.initialUrl;

  return (
    <div className="mt-6 border-t border-ink/10 pt-4">
      <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Asset (Story)</h3>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <form action={action}>
          <button
            type="submit"
            disabled={pending}
            className="border border-ink/30 px-4 py-2 text-xs font-semibold tracking-wide uppercase disabled:opacity-60"
          >
            {pending ? "Renderizando..." : "Renderizar asset"}
          </button>
        </form>

        {url ? (
          <a className="text-sm underline" href={url} target="_blank" rel="noopener noreferrer">
            Abrir imagen
          </a>
        ) : (
          <span className="text-sm text-muted">Todavía no está renderizado.</span>
        )}
      </div>

      {state && !state.ok && (
        <p className="mt-3 border border-accent/40 bg-tan/40 p-3 text-sm text-ink">
          Error: {state.error}
        </p>
      )}
    </div>
  );
}
