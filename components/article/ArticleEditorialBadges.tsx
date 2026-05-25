import type { Article } from "@/lib/types/article";
import { formatSmokeLevel } from "@/lib/editorial/smoke-level";

interface ArticleEditorialBadgesProps {
  donZopiVerdict: string;
  smokeLevel: Article["smokeLevel"];
}

export function ArticleEditorialBadges({
  donZopiVerdict,
  smokeLevel,
}: ArticleEditorialBadgesProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="inline-block border border-ink/20 bg-tan/60 px-3 py-1 font-serif text-sm font-bold text-ink">
        {donZopiVerdict}
      </span>
      <span className="text-sm text-ink/80">{formatSmokeLevel(smokeLevel)}</span>
    </div>
  );
}
