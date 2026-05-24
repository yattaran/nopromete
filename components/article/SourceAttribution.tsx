interface SourceAttributionProps {
  sourceName: string;
  sourceUrl: string;
}

export function SourceAttribution({ sourceName, sourceUrl }: SourceAttributionProps) {
  return (
    <aside className="border-2 border-ink bg-tan/40 p-5">
      <p className="text-xs font-semibold tracking-wider text-muted uppercase">
        Fuente original
      </p>
      <p className="mt-2 font-serif text-lg font-bold text-ink">{sourceName}</p>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-xs font-semibold tracking-wider text-paper uppercase transition hover:bg-ink/90"
      >
        Leer artículo original
        <span aria-hidden>→</span>
      </a>
    </aside>
  );
}
