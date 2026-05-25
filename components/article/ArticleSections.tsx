import { DonZopiQuoteSection } from "@/components/article/DonZopiQuoteSection";
import type { SmokeLevel } from "@/lib/editorial/smoke-level";

interface ArticleSectionsProps {
  factualSummary: string;
  whyItMatters: string;
  donZopiQuote: string;
  smokeLevel: SmokeLevel;
}

export function ArticleSections({
  factualSummary,
  whyItMatters,
  donZopiQuote,
  smokeLevel,
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

      <DonZopiQuoteSection quote={donZopiQuote} smokeLevel={smokeLevel} />
    </div>
  );
}
