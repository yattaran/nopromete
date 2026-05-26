import Image from "next/image";
import { brand, getPrimarySocialLinks } from "@/lib/brand";
import type { Source } from "@/lib/db/schema";

export function LandingHub({ sources }: { sources: Source[] }) {
  const social = getPrimarySocialLinks();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="text-center">
        <Image
          src={brand.donZopiComenta}
          alt="Don Zopi"
          width={120}
          height={120}
          className="mx-auto rounded-full"
          priority
        />
        <h1 className="mt-6 font-serif text-4xl font-bold text-ink">{brand.siteName}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Comentario tico sobre noticias reales. Sin promesas, sin filtro — pero siempre con
          fuente.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        <p className="text-center text-xs font-semibold tracking-wide text-muted uppercase">
          Seguinos
        </p>
        {social.length === 0 ? (
          <p className="text-center text-sm text-muted">
            Próximamente en redes. Configurá{" "}
            <code className="font-mono text-xs">NEXT_PUBLIC_INSTAGRAM_URL</code> y{" "}
            <code className="font-mono text-xs">NEXT_PUBLIC_TIKTOK_URL</code>.
          </p>
        ) : (
          social.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-ink bg-paper px-5 py-4 text-center font-semibold tracking-wide text-ink uppercase transition hover:bg-tan"
            >
              {link.label}
            </a>
          ))
        )}
      </div>

      <section className="mt-14 border-t border-ink/15 pt-10">
        <h2 className="font-serif text-xl font-bold text-ink">Sobre el proyecto</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/85">
          No Promete no es un diario. Transformamos titulares reales en reacciones sociales,
          observaciones y humor costarricense — siempre enlazando la fuente original.
        </p>
      </section>

      <section className="mt-12 border-t border-ink/15 pt-10">
        <h2 className="font-serif text-xl font-bold text-ink">Disclaimer</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/85">
          No Promete es comentario, opinión y sátira. No somos el medio original de las noticias
          que comentamos. Cada publicación enlaza la fuente. El contenido satírico no debe
          interpretarse como acusación factual contra personas o instituciones.
        </p>
      </section>

      {sources.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-bold text-ink">Fuentes que seguimos</h2>
          <p className="mt-2 text-sm text-muted">
            Cada post cita y enlaza al medio original. No copiamos artículos completos.
          </p>
          <ul className="mt-4 divide-y divide-ink/15 border border-ink/15">
            {sources.map((source) => (
              <li key={source.id} className="px-4 py-3 text-sm">
                <span className="font-semibold text-ink">{source.name}</span>
                <span className="mx-2 text-muted">·</span>
                <a
                  href={source.feedUrl}
                  className="text-muted underline underline-offset-2 hover:text-ink"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  RSS
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-14 text-center text-xs text-muted">{brand.footerTagline}</p>
    </div>
  );
}
