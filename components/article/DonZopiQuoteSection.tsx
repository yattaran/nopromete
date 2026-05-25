import Image from "next/image";
import type { SmokeLevel } from "@/lib/editorial/smoke-level";
import {
  formatSmokeLevel,
  getSmokeLevelAsset,
} from "@/lib/editorial/smoke-level";

interface DonZopiQuoteSectionProps {
  quote: string;
  smokeLevel: SmokeLevel;
}

export function DonZopiQuoteSection({ quote, smokeLevel }: DonZopiQuoteSectionProps) {
  const { src, width, height } = getSmokeLevelAsset(smokeLevel);
  const moodLabel = formatSmokeLevel(smokeLevel);

  return (
    <section>
      <h2 className="mb-5 font-serif text-2xl font-bold text-ink">Don Zopi comenta</h2>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <div className="mx-auto w-full max-w-[260px] shrink-0 sm:mx-0 sm:max-w-[280px]">
          <Image
            src={src}
            alt={`Don Zopi — ${moodLabel}`}
            width={width}
            height={height}
            className="h-auto w-full"
            sizes="(max-width: 640px) 240px, 280px"
          />
        </div>
        <blockquote className="flex min-w-0 flex-1 items-center border-l-2 border-accent py-1 pl-5 font-serif text-base italic leading-relaxed text-ink/90 sm:text-lg">
          <p>&ldquo;{quote}&rdquo;</p>
        </blockquote>
      </div>
    </section>
  );
}
