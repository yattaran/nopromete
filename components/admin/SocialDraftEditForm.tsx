"use client";

import { useActionState } from "react";
import { updateSocialDraftFieldsAction } from "@/app/admin/actions";
import { formatSmokeLevel, smokeLevels, type SmokeLevel } from "@/lib/editorial/smoke-level";

type State = { ok: true } | { ok: false; error: string } | null;

export function SocialDraftEditForm(props: {
  draftId: string;
  headline: string;
  subtext: string;
  donZopiReaction: string;
  smokeLevel: SmokeLevel;
  caption: string;
  editable: boolean;
}) {
  const [state, action, pending] = useActionState<State, FormData>(async (_prev, formData) => {
    try {
      await updateSocialDraftFieldsAction(props.draftId, formData);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Error al guardar" };
    }
  }, null);

  if (!props.editable) {
    return null;
  }

  return (
    <form action={action} className="mt-6 space-y-4 border-t border-ink/10 pt-4">
      <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Editar antes de aprobar</h3>

      <label className="block text-sm">
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">Headline</span>
        <input
          name="headline"
          defaultValue={props.headline}
          className="mt-1 w-full border border-ink/20 bg-paper px-3 py-2 text-sm"
          maxLength={80}
        />
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">Subtext</span>
        <input
          name="subtext"
          defaultValue={props.subtext}
          className="mt-1 w-full border border-ink/20 bg-paper px-3 py-2 text-sm"
          maxLength={140}
        />
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">
          Don Zopi comenta
        </span>
        <input
          name="donZopiReaction"
          defaultValue={props.donZopiReaction}
          className="mt-1 w-full border border-ink/20 bg-paper px-3 py-2 text-sm"
          maxLength={260}
        />
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">
          Nivel de humo
        </span>
        <select
          name="smokeLevel"
          defaultValue={props.smokeLevel}
          className="mt-1 w-full border border-ink/20 bg-paper px-3 py-2 text-sm"
        >
          {smokeLevels.map((level) => (
            <option key={level} value={level}>
              {formatSmokeLevel(level)}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">Caption</span>
        <textarea
          name="caption"
          defaultValue={props.caption}
          rows={5}
          className="mt-1 w-full border border-ink/20 bg-paper px-3 py-2 text-sm"
          maxLength={2200}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="border border-ink px-4 py-2 text-xs font-semibold tracking-wide uppercase disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>

      {state?.ok && <p className="text-xs text-muted">Guardado.</p>}
      {state && !state.ok && (
        <p className="text-xs text-accent">Error: {state.error}</p>
      )}
    </form>
  );
}
