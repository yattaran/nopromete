import { z } from "zod";
import { defaultSmokeLevel, isSmokeLevel, smokeLevels } from "@/lib/editorial/smoke-level";

const safetyEnum = ["safe", "sensitive", "not_suitable_for_satire"] as const;
const formatEnum = [
  "story_text_only",
  "story_with_don_zopi",
  "carousel_3_slide",
  "feed_post",
  "not_suitable",
] as const;

export const SocialLLMOutputSchema = z.object({
  safety_classification: z.enum(safetyEnum),
  reason: z.string().min(3).max(400),
  recommended_format: z.enum(formatEnum),
  news_summary_internal: z.string().min(20).max(1200),
  editorial_angle: z.string().min(10).max(400),
  story_headline: z.string().min(4).max(80),
  story_subtext: z.string().min(4).max(140),
  don_zopi_reaction: z.string().max(260).default(""),
  smoke_level: z.enum(smokeLevels),
  instagram_caption: z.string().min(20).max(2200),
  hashtags: z.array(z.string()).max(20).default([]),
  source_credit: z.string().min(4).max(120),
  link_sticker_url: z.string().url(),
});

export type SocialLLMOutput = z.infer<typeof SocialLLMOutputSchema>;

export type SocialLLMGenerateInput = {
  sourceName: string;
  sourceUrl: string;
  title: string;
  extractedText?: string;
};

const CAMEL_TO_SNAKE: Record<string, string> = {
  safetyClassification: "safety_classification",
  recommendedFormat: "recommended_format",
  newsSummaryInternal: "news_summary_internal",
  editorialAngle: "editorial_angle",
  storyHeadline: "story_headline",
  storySubtext: "story_subtext",
  donZopiReaction: "don_zopi_reaction",
  smokeLevel: "smoke_level",
  instagramCaption: "instagram_caption",
  sourceCredit: "source_credit",
  linkStickerUrl: "link_sticker_url",
};

function normalizeSafetyClassification(value: unknown): (typeof safetyEnum)[number] {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (raw.includes("not_suitable") || raw.includes("no_satir") || raw === "not_suitable") {
    return "not_suitable_for_satire";
  }
  if (raw === "sensitive" || raw.includes("sensib")) return "sensitive";
  return "safe";
}

function normalizeRecommendedFormat(value: unknown): (typeof formatEnum)[number] {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if ((formatEnum as readonly string[]).includes(raw)) return raw as (typeof formatEnum)[number];
  if (raw.includes("not_suitable")) return "not_suitable";
  if (raw.includes("zopi") || raw.includes("don")) return "story_with_don_zopi";
  if (raw.includes("carousel")) return "carousel_3_slide";
  if (raw.includes("feed")) return "feed_post";
  return "story_with_don_zopi";
}

function normalizeSmokeLevel(value: unknown): (typeof smokeLevels)[number] {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (isSmokeLevel(raw)) return raw;
  if (raw.includes("cinematic")) return "cinematic";
  if (raw.includes("conferencia")) return "conferencia_eterna";
  if (raw.includes("estres")) return "estresando";
  if (raw.includes("relax")) return "relax";
  return defaultSmokeLevel;
}

function flattenRecord(obj: Record<string, unknown>): Record<string, unknown> {
  const nested = obj.output ?? obj.draft ?? obj.data ?? obj.result;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return { ...obj, ...(nested as Record<string, unknown>) };
  }
  return obj;
}

function toSnakeRecord(obj: Record<string, unknown>): Record<string, unknown> {
  const flat = flattenRecord(obj);
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const snake = CAMEL_TO_SNAKE[key] ?? key;
    out[snake] = value;
  }

  return out;
}

export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();
  return JSON.parse(candidate);
}

export function normalizeSocialLLMRaw(
  raw: unknown,
  fallbacks?: { sourceUrl: string; sourceName: string },
): Record<string, unknown> {
  const base =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? toSnakeRecord(raw as Record<string, unknown>)
      : {};

  const hashtags = Array.isArray(base.hashtags)
    ? base.hashtags.filter((t): t is string => typeof t === "string")
    : [];

  const headline =
    typeof base.story_headline === "string"
      ? base.story_headline
      : typeof base.headline === "string"
        ? base.headline
        : "";

  const subtext =
    typeof base.story_subtext === "string"
      ? base.story_subtext
      : typeof base.subtext === "string"
        ? base.subtext
        : "";

  const link =
    typeof base.link_sticker_url === "string" && base.link_sticker_url.startsWith("http")
      ? base.link_sticker_url
      : fallbacks?.sourceUrl;

  const sourceCredit =
    typeof base.source_credit === "string" && base.source_credit.trim()
      ? base.source_credit
      : fallbacks?.sourceName
        ? `Fuente: ${fallbacks.sourceName}`
        : "";

  return {
    safety_classification: normalizeSafetyClassification(base.safety_classification),
    reason:
      typeof base.reason === "string" && base.reason.trim()
        ? base.reason
        : "Clasificación automática del borrador.",
    recommended_format: normalizeRecommendedFormat(base.recommended_format),
    news_summary_internal:
      typeof base.news_summary_internal === "string" && base.news_summary_internal.trim()
        ? base.news_summary_internal
        : typeof base.summary === "string"
          ? base.summary
          : headline || "Resumen pendiente de revisión editorial.",
    editorial_angle:
      typeof base.editorial_angle === "string" && base.editorial_angle.trim()
        ? base.editorial_angle
        : "Ángulo observador costarricense, sin explicar de más.",
    story_headline: headline || "Sin titular",
    story_subtext: subtext || "Sin subtexto",
    don_zopi_reaction:
      typeof base.don_zopi_reaction === "string" ? base.don_zopi_reaction : "",
    smoke_level: normalizeSmokeLevel(base.smoke_level),
    instagram_caption:
      typeof base.instagram_caption === "string" && base.instagram_caption.trim()
        ? base.instagram_caption
        : typeof base.caption === "string"
          ? base.caption
          : `${headline}\n\n${sourceCredit}`,
    hashtags,
    source_credit: sourceCredit,
    link_sticker_url: link,
  };
}

export function clampSocialOutput(parsed: SocialLLMOutput): SocialLLMOutput {
  const clamp = (s: string, max: number) => {
    const t = s.trim();
    if (t.length <= max) return t;
    return `${t.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
  };

  return {
    ...parsed,
    story_headline: clamp(parsed.story_headline, 80),
    story_subtext: clamp(parsed.story_subtext, 140),
    don_zopi_reaction: clamp(parsed.don_zopi_reaction ?? "", 260),
  };
}

export function parseSocialLLMJson(
  raw: string,
  fallbacks?: { sourceUrl: string; sourceName: string },
): SocialLLMOutput {
  const json = extractJsonObject(raw);
  const normalized = normalizeSocialLLMRaw(json, fallbacks);
  const parsed = SocialLLMOutputSchema.parse(normalized);
  return clampSocialOutput(parsed);
}
