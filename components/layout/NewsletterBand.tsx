export function NewsletterBand() {
  return (
    <section id="newsletter" className="border-y border-ink bg-tan">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mt-0.5 shrink-0 text-ink"
            aria-hidden
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4L12 13 2 4" />
          </svg>
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">
              Boletín sin promesas
            </h2>
            <p className="mt-1 text-sm text-muted">
              Chisme con contexto. Sin spam, sin promesas vacías.
            </p>
          </div>
        </div>
        <form className="flex w-full max-w-md gap-2 sm:w-auto" action="#">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            disabled
            aria-label="Correo electrónico"
            className="min-w-0 flex-1 border border-ink/30 bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled
            className="shrink-0 bg-ink px-6 py-2.5 text-xs font-semibold tracking-wide text-paper uppercase transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
            title="Próximamente"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}
