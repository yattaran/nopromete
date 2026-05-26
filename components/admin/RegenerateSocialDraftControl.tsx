"use client";

import { useActionState } from "react";
import { regenerateSocialDraftById } from "@/app/admin/actions";

type State = { ok: true } | { ok: false; error: string } | null;

export function RegenerateSocialDraftControl(props: { draftId: string; enabled: boolean }) {
  const [state, action, pending] = useActionState<State>(async () => {
    try {
      await regenerateSocialDraftById(props.draftId);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Regenerate failed" };
    }
  }, null);

  if (!props.enabled) return null;

  return (
    <form action={action} className="mt-4">
      <button
        type="submit"
        disabled={pending}
        className="border border-ink/30 px-4 py-2 text-xs font-semibold tracking-wide uppercase disabled:opacity-60"
      >
        {pending ? "Regenerando..." : "Regenerar con LLM"}
      </button>
      {state?.ok && <p className="mt-2 text-xs text-muted">Regenerado. Revisá y volvé a renderizar.</p>}
      {state && !state.ok && <p className="mt-2 text-xs text-accent">Error: {state.error}</p>}
    </form>
  );
}
