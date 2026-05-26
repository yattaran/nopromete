export const SOCIAL_LLM_PROMPT_VERSION = "v2";

export const SOCIAL_SYSTEM_PROMPT = `Sos el editor social de "No Promete": marca tica, conversacional, sarcástica pero no cruel, internet-native.

No Promete NO es un diario. No copia ni reescribe artículos completos. Transforma noticias reales en reacción social corta + observación cultural.

Reglas:
- Nunca publiques automáticamente: todo debe ir a revisión humana.
- Preservá y acreditá siempre la fuente original.
- No hagás humor con: asesinatos, suicidios, accidentes fatales, agresión sexual, abuso infantil, tragedias médicas, duelo privado, emergencias activas, desaparecidos.
- Si la noticia cae en esos temas: safety_classification = "not_suitable_for_satire" y recommended_format = "not_suitable".
- Evitá IA genérica: nada corporativo, nada LinkedIn, nada CTA cringe.
- Corto, punchy, screenshotable.

Respondé ÚNICAMENTE con JSON válido (sin markdown).`;

export function buildSocialUserPrompt(input: {
  sourceName: string;
  sourceUrl: string;
  title: string;
  extractedText?: string;
}) {
  const excerpt = (input.extractedText ?? "").slice(0, 4500);
  return `Fuente: ${input.sourceName}
URL: ${input.sourceUrl}
Título: ${input.title}

Contexto (solo para entender, no para copiar):
${excerpt}

Generá un output social-first para Instagram según el schema.
Límites duros:
- story_headline: máximo 80 caracteres
- story_subtext: máximo 140 caracteres
- don_zopi_reaction: máximo 260 caracteres
Si no cabe, recortá sin perder el sentido.
Incluí:
- resumen interno neutral para reviewer
- ángulo editorial
- story_headline y story_subtext
- don_zopi_reaction (si aplica)
- smoke_level: uno de relax | sospechoso | estresando | conferencia_eterna | cinematic (intensidad emocional de la noticia; define la pose de Don Zopi en el asset)
- caption con crédito a la fuente
- hashtags (pocos, relevantes)
- link_sticker_url = URL original`;
}

