/** Referencia exacta para proveedores sin schema nativo (Groq json_object). */
export const SOCIAL_OUTPUT_JSON_SCHEMA_HINT = `Devolvé UN solo objeto JSON con EXACTAMENTE estas claves en snake_case (todas obligatorias):
{
  "safety_classification": "safe" | "sensitive" | "not_suitable_for_satire",
  "reason": "string (3-400 chars)",
  "recommended_format": "story_text_only" | "story_with_don_zopi" | "carousel_3_slide" | "feed_post" | "not_suitable",
  "news_summary_internal": "string (resumen neutral, 20+ chars)",
  "editorial_angle": "string (10+ chars)",
  "story_headline": "string (max 80 chars)",
  "story_subtext": "string (max 140 chars)",
  "don_zopi_reaction": "string (max 260 chars, puede ser vacío)",
  "smoke_level": "relax" | "sospechoso" | "estresando" | "conferencia_eterna" | "cinematic",
  "instagram_caption": "string (caption con crédito, 20+ chars)",
  "hashtags": ["string", "..."],
  "source_credit": "string (ej. Fuente: La Nación)",
  "link_sticker_url": "string URL de la noticia original"
}
No uses camelCase. No envuelvas en otro objeto. Sin markdown.`;
