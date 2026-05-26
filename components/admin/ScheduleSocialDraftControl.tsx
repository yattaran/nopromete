"use client";

import { useActionState } from "react";
import { scheduleSocialDraftById } from "@/app/admin/actions";

type State = { ok: true } | { ok: false; error: string } | null;

export function ScheduleSocialDraftControl(props: { draftId: string; enabled: boolean }) {
  const [state, action, pending] = useActionState<State, FormData>(async (_prev, formData) => {
    try {
      await scheduleSocialDraftById(props.draftId, formData);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Schedule failed" };
    }
  }, null);

  if (!props.enabled) return null;

  const defaultValue = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <form action={action} className="mt-4 space-y-2 border-t border-ink/10 pt-4">
      <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Programar</h3>
      <input
        type="datetime-local"
        name="scheduledAt"
        defaultValue={defaultValue}
        className="border border-ink/20 bg-paper px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="border border-ink/30 px-4 py-2 text-xs font-semibold tracking-wide uppercase disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Marcar como programado"}
      </button>
      {state?.ok && <p className="text-xs text-muted">Programado. Usá “Publicar programados” en el panel.</p>}
      {state && !state.ok && <p className="text-xs text-accent">Error: {state.error}</p>}
    </form>
  );
}
