import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from "@google/generative-ai";
import { smokeLevels } from "@/lib/editorial/smoke-level";
import { SOCIAL_LLM_PROMPT_VERSION, SOCIAL_SYSTEM_PROMPT, buildSocialUserPrompt } from "../social-prompts";
import {
  parseSocialLLMJson,
  type SocialLLMGenerateInput,
  type SocialLLMOutput,
} from "../social-output-schema";

const safetyEnum = ["safe", "sensitive", "not_suitable_for_satire"] as const;
const formatEnum = [
  "story_text_only",
  "story_with_don_zopi",
  "carousel_3_slide",
  "feed_post",
  "not_suitable",
] as const;

const socialResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    safety_classification: { type: SchemaType.STRING, format: "enum", enum: [...safetyEnum] },
    reason: { type: SchemaType.STRING },
    recommended_format: { type: SchemaType.STRING, format: "enum", enum: [...formatEnum] },
    news_summary_internal: { type: SchemaType.STRING },
    editorial_angle: { type: SchemaType.STRING },
    story_headline: { type: SchemaType.STRING },
    story_subtext: { type: SchemaType.STRING },
    don_zopi_reaction: { type: SchemaType.STRING },
    smoke_level: { type: SchemaType.STRING, format: "enum", enum: [...smokeLevels] },
    instagram_caption: { type: SchemaType.STRING },
    hashtags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    source_credit: { type: SchemaType.STRING },
    link_sticker_url: { type: SchemaType.STRING },
  },
  required: [
    "safety_classification",
    "reason",
    "recommended_format",
    "news_summary_internal",
    "editorial_angle",
    "story_headline",
    "story_subtext",
    "don_zopi_reaction",
    "smoke_level",
    "instagram_caption",
    "hashtags",
    "source_credit",
    "link_sticker_url",
  ],
};

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenerativeAI(apiKey);
}

export async function generateSocialDraftWithGemini(
  input: SocialLLMGenerateInput,
): Promise<{ output: SocialLLMOutput; promptVersion: string; provider: "gemini"; model: string }> {
  const genAI = getGemini();
  const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: `${SOCIAL_SYSTEM_PROMPT}\n\nPrompt version: ${SOCIAL_LLM_PROMPT_VERSION}`,
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: socialResponseSchema,
    },
  });

  const result = await model.generateContent(buildSocialUserPrompt(input));
  const raw = result.response.text();
  if (!raw) throw new Error("Gemini returned empty response");

  return {
    output: parseSocialLLMJson(raw, {
      sourceUrl: input.sourceUrl,
      sourceName: input.sourceName,
    }),
    promptVersion: SOCIAL_LLM_PROMPT_VERSION,
    provider: "gemini",
    model: modelName,
  };
}
