import type { PostStatus } from "@/lib/db/schema";

const LABELS: Record<PostStatus, string> = {
  draft: "Borrador",
  pending_review: "Pendiente",
  approved: "Aprobado",
  published: "Publicado",
  rejected: "Rechazado",
};

export function PostStatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className="inline-block bg-tan px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
      {LABELS[status]}
    </span>
  );
}
