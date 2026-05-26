import { generateSocialDraftWithGemini } from "./providers/gemini";
import { generateSocialDraftWithGroq } from "./providers/groq";
import type { SocialLLMGenerateInput, SocialLLMOutput } from "./social-output-schema";

export type { SocialLLMOutput } from "./social-output-schema";
export { SocialLLMOutputSchema } from "./social-output-schema";

export type SocialLLMProvider = "gemini" | "groq";

export function resolveSocialLLMProvider(): SocialLLMProvider {
  const explicit = process.env.SOCIAL_LLM_PROVIDER?.trim().toLowerCase();
  if (explicit === "groq" || explicit === "gemini") return explicit;
  if (process.env.GROQ_API_KEY?.trim()) return "groq";
  return "gemini";
}

export async function generateSocialDraft(
  input: SocialLLMGenerateInput,
): Promise<{
  output: SocialLLMOutput;
  promptVersion: string;
  provider: SocialLLMProvider;
  model: string;
}> {
  const provider = resolveSocialLLMProvider();

  if (provider === "groq") {
    return generateSocialDraftWithGroq(input);
  }

  return generateSocialDraftWithGemini(input);
}
