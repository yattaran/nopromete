import Link from "next/link";
import {
  approvePostById,
  publishPostById,
  regeneratePost,
  rejectPostById,
} from "@/app/admin/actions";
import type { PostStatus } from "@/lib/db/schema";

interface PostReviewActionsProps {
  postId: string;
  status: PostStatus;
}

export function PostReviewActions({ postId, status }: PostReviewActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {status === "pending_review" && (
        <>
          <form action={approvePostById.bind(null, postId)}>
            <button
              type="submit"
              className="bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase"
            >
              Aprobar
            </button>
          </form>
          <form action={rejectPostById.bind(null, postId)}>
            <button
              type="submit"
              className="border border-ink px-4 py-2 text-xs font-semibold tracking-wide uppercase"
            >
              Rechazar
            </button>
          </form>
        </>
      )}

      {status === "approved" && (
        <form action={publishPostById.bind(null, postId)}>
          <button
            type="submit"
            className="bg-ink px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase"
          >
            Publicar
          </button>
        </form>
      )}

      {(status === "pending_review" || status === "approved") && (
        <form action={regeneratePost}>
          <input type="hidden" name="id" value={postId} />
          <button
            type="submit"
            className="border border-ink/30 px-4 py-2 text-xs font-semibold tracking-wide uppercase"
          >
            Regenerar con LLM
          </button>
        </form>
      )}

      <Link
        href="/admin"
        className="border border-ink/30 px-4 py-2 text-xs font-semibold tracking-wide uppercase"
      >
        Volver
      </Link>
    </div>
  );
}
