import { commentarySectionTitle } from "@/lib/editorial/labels";

interface ArticleSectionsProps {
  factualSummary: string;
  whyItMatters: string;
  commentary: string;
  isPositiveNews?: boolean;
}

export function ArticleSections({
  factualSummary,
  whyItMatters,
  commentary,
  isPositiveNews = false,
}: ArticleSectionsProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 font-serif text-2xl font-bold text-ink">Qué pasó</h2>
        <p className="leading-relaxed text-ink/90">{factualSummary}</p>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-bold text-ink">Por qué importa</h2>
        <p className="leading-relaxed text-ink/90">{whyItMatters}</p>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-bold text-ink">
          {commentarySectionTitle(isPositiveNews)}
        </h2>
        <div className="space-y-4 leading-relaxed text-ink/90">
          {commentary.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
