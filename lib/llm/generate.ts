import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from "@google/generative-ai";
import { z } from "zod";
import { smokeLevels } from "@/lib/editorial/smoke-level";
import type { CategorySlug } from "@/lib/types/article";
import { buildUserPrompt, LLM_PROMPT_VERSION, SYSTEM_PROMPT } from "./prompts";

const categorySlugs = [
  "noticias",
  "politica",
  "costa-rica",
  "mundo",
  "opinion",
  "cultura",
  "que-desastre",
] as const satisfies readonly CategorySlug[];

export const PostDraftSchema = z.object({
  headline: z.string().min(8).max(100),
  summary: z.string().min(15).max(200),
  factual_summary: z.string().min(30).max(500),
  why_it_matters: z.string().min(15).max(300),
  don_zopi_quote: z.string().min(8).max(320),
  don_zopi_verdict: z.string().min(4).max(60),
  smoke_level: z.enum(smokeLevels),
  is_positive_news: z.boolean(),
  category: z.enum(categorySlugs),
  risk_flags: z.array(z.string()).default([]),
});

export type PostDraft = z.infer<typeof PostDraftSchema>;

const postDraftResponseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    headline: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    factual_summary: { type: SchemaType.STRING },
    why_it_matters: { type: SchemaType.STRING },
    don_zopi_quote: { type: SchemaType.STRING },
    don_zopi_verdict: { type: SchemaType.STRING },
    smoke_level: { type: SchemaType.STRING, format: "enum", enum: [...smokeLevels] },
    is_positive_news: { type: SchemaType.BOOLEAN },
    category: { type: SchemaType.STRING, format: "enum", enum: [...categorySlugs] },
    risk_flags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: [
    "headline",
    "summary",
    "factual_summary",
    "why_it_matters",
    "don_zopi_quote",
    "don_zopi_verdict",
    "smoke_level",
    "is_positive_news",
    "category",
    "risk_flags",
  ],
};

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function generatePostDraft(
  title: string,
  content: string,
  sourceName: string,
): Promise<PostDraft> {
  const genAI = getGemini();
  const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: `${SYSTEM_PROMPT}\n\nPrompt version: ${LLM_PROMPT_VERSION}`,
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: postDraftResponseSchema,
    },
  });

  const result = await model.generateContent(buildUserPrompt(title, content, sourceName));
  const raw = result.response.text();
  if (!raw) {
    throw new Error("Gemini returned empty response");
  }

  return PostDraftSchema.parse(JSON.parse(raw));
}
