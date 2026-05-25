export default function EticaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-ink">Código de ética</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/85">
        <p>
          En <strong>No Promete</strong> distinguimos siempre hechos de opinión. Los
          resúmenes factuales se basan en fuentes verificables. El comentario de Don
          Zopi puede ser satírico, crítico o celebratorio según la noticia, siempre en la
          sección &ldquo;Don Zopi comenta&rdquo;.
        </p>
        <h2 className="font-serif text-xl font-bold text-ink">Principios</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Citar siempre la fuente original con enlace visible.</li>
          <li>No inventar hechos ni distorsionar citas.</li>
          <li>Revisión humana obligatoria antes de publicar (M2).</li>
          <li>Evitar acusaciones directas falsas contra personas reales.</li>
          <li>Separar claramente sátira de información.</li>
        </ul>
        <h2 className="font-serif text-xl font-bold text-ink">Correcciones</h2>
        <p>
          Si detectás un error factual, contactanos. Corregimos con transparencia y
          mantenemos la fuente original accesible.
        </p>
      </div>
    </div>
  );
}
