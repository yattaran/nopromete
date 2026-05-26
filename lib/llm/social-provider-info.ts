import { resolveSocialLLMProvider } from "@/lib/llm/social-generate";

export function getSocialLLMConfig() {
  const provider = resolveSocialLLMProvider();
  const model =
    provider === "groq"
      ? (process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile")
      : (process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash");

  const configured =
    provider === "groq"
      ? Boolean(process.env.GROQ_API_KEY?.trim())
      : Boolean(process.env.GEMINI_API_KEY?.trim());

  return { provider, model, configured };
}
