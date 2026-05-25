---
name: nopromete-editorial
description: >-
  Voz editorial, prompts LLM y reglas de secciones para No Promete (sátira tica,
  noticias positivas vs críticas, concisión para ahorrar tokens). Usar al editar
  prompts, borradores Gemini, UI de artículos o ingestión RSS.
---

# No Promete — voz editorial

## Identidad

Sitio de comentario y sátira inteligente sobre noticias de Costa Rica y el mundo. **No todo es cinismo negativo**: el tono sigue la noticia.

## Secciones del artículo

| Sección | Campo / regla |
|---------|----------------|
| Qué pasó | `factual_summary` — hechos, neutral, **breve** |
| Por qué importa | `why_it_matters` — relevancia para el lector tico, **breve** |
| La parte que **no** promete | `commentary` cuando `is_positive_news: false` |
| La parte que **promete** | `commentary` cuando `is_positive_news: true` |

**Nunca** usar el título viejo "La parte no promete" (sin "que").

## `is_positive_news`

- `true`: logro, buena noticia, alivio, celebración, avance deseable.
- `false`: neutral, mixta, polémica, tragedia, escándalo o tono crítico/sátiro.

### Comentario (`commentary`)

- **Positiva**: cálido, optimista o celebratorio; irónico suave permitido; **sin** sarcasmo negativo ni cinismo.
- **No positiva**: satírica o crítica con ingenio; puede ser irónica, absurda u observadora — **no obligatorio** ser negativa.

### Don Zopi (`don_zopi_quote`)

Frase corta; tono alineado con `is_positive_news`.

## Economía de tokens

- Fuente al modelo: máximo `SOURCE_CONTENT_MAX_CHARS` (4500) en `lib/llm/prompts.ts`.
- Pedir **mínimo de palabras** en cada campo; sin relleno.
- Límites Zod en `lib/llm/generate.ts` (p. ej. `factual_summary` ≤ 500 caracteres).
- Versión de prompt: `LLM_PROMPT_VERSION` en `lib/llm/prompts.ts` — incrementar al cambiar reglas.

## Archivos clave

- `lib/llm/prompts.ts` — system prompt y truncado de fuente
- `lib/llm/generate.ts` — schema Gemini + Zod
- `lib/editorial/labels.ts` — `commentarySectionTitle(isPositiveNews)`
- `components/article/ArticleSections.tsx` — títulos en UI pública
- `lib/db/schema.ts` — columna `is_positive_news`

## Tras cambiar schema

```bash
npm run db:push
```

Borradores viejos sin `is_positive_news` quedan en `false` por default.

## Checklist al modificar

- [ ] ¿Prompt pide concisión y tono según positivo/negativo?
- [ ] ¿UI usa `commentarySectionTitle()`?
- [ ] ¿Pipeline y `admin/actions` persisten `is_positive_news`?
- [ ] ¿Subiste `LLM_PROMPT_VERSION`?
