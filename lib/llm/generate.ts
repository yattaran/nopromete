import OpenAI from "openai";
import { z } from "zod";
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
  headline: z.string().min(10).max(200),
  summary: z.string().min(20).max(400),
  factual_summary: z.string().min(20).max(1200),
  why_it_matters: z.string().min(20).max(800),
  commentary: z.string().min(20).max(1200),
  don_zopi_quote: z.string().min(10).max(200),
  category: z.enum(categorySlugs),
  risk_flags: z.array(z.string()).default([]),
});

export type PostDraft = z.infer<typeof PostDraftSchema>;

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export async function generatePostDraft(
  title: string,
  content: string,
  sourceName: string,
): Promise<PostDraft> {
  const client = getOpenAI();
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const response = await client.chat.completions.create({
    model,
    temperature: 0.7,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "post_draft",
        strict: true,
        schema: {
          type: "object",
          properties: {
            headline: { type: "string" },
            summary: { type: "string" },
            factual_summary: { type: "string" },
            why_it_matters: { type: "string" },
            commentary: { type: "string" },
            don_zopi_quote: { type: "string" },
            category: { type: "string", enum: [...categorySlugs] },
            risk_flags: { type: "array", items: { type: "string" } },
          },
          required: [
            "headline",
            "summary",
            "factual_summary",
            "why_it_matters",
            "commentary",
            "don_zopi_quote",
            "category",
            "risk_flags",
          ],
          additionalProperties: false,
        },
      },
    },
    messages: [
      { role: "system", content: `${SYSTEM_PROMPT}\n\nPrompt version: ${LLM_PROMPT_VERSION}` },
      { role: "user", content: buildUserPrompt(title, content, sourceName) },
    ],
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI returned empty response");
  }

  return PostDraftSchema.parse(JSON.parse(raw));
}
