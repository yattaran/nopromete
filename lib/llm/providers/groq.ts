import Groq from "groq-sdk";
import { SOCIAL_OUTPUT_JSON_SCHEMA_HINT } from "../social-json-schema";
import { SOCIAL_LLM_PROMPT_VERSION, SOCIAL_SYSTEM_PROMPT, buildSocialUserPrompt } from "../social-prompts";
import {
  parseSocialLLMJson,
  type SocialLLMGenerateInput,
  type SocialLLMOutput,
} from "../social-output-schema";

function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");
  return new Groq({ apiKey });
}

export async function generateSocialDraftWithGroq(
  input: SocialLLMGenerateInput,
): Promise<{ output: SocialLLMOutput; promptVersion: string; provider: "groq"; model: string }> {
  const groq = getGroq();
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  const system = `${SOCIAL_SYSTEM_PROMPT}

Prompt version: ${SOCIAL_LLM_PROMPT_VERSION}

${SOCIAL_OUTPUT_JSON_SCHEMA_HINT}`;

  const user = `${buildSocialUserPrompt(input)}

Recordá: todas las claves del JSON en snake_case, valores de enum exactos, link_sticker_url = ${input.sourceUrl}`;

  const completion = await groq.chat.completions.create({
    model,
    temperature: 0.5,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Groq returned empty response");

  return {
    output: parseSocialLLMJson(raw, {
      sourceUrl: input.sourceUrl,
      sourceName: input.sourceName,
    }),
    promptVersion: SOCIAL_LLM_PROMPT_VERSION,
    provider: "groq",
    model,
  };
}
