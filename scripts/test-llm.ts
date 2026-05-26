/**
 * Prueba rápida del proveedor LLM activo.
 * Uso: npx tsx scripts/test-llm.ts
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { getSocialLLMConfig } from "../lib/llm/social-provider-info";
import { generateSocialDraft } from "../lib/llm/social-generate";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const cfg = getSocialLLMConfig();
  const hasGroq = Boolean(process.env.GROQ_API_KEY?.trim());
  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());
  const explicit = process.env.SOCIAL_LLM_PROVIDER?.trim() || "(auto)";

  console.log(`Proveedor: ${cfg.provider} · modelo: ${cfg.model} · key: ${cfg.configured ? "ok" : "falta"}`);
  console.log(`Env: SOCIAL_LLM_PROVIDER=${explicit} · GROQ_API_KEY=${hasGroq ? "sí" : "no"} · GEMINI_API_KEY=${hasGemini ? "sí" : "no"}`);

  if (cfg.provider === "gemini" && hasGroq) {
    console.log("\nTip: tenés GROQ_API_KEY pero se eligió Gemini. Poné SOCIAL_LLM_PROVIDER=groq en .env.local");
  }
  if (cfg.provider === "groq" && !hasGroq) {
    console.log("\nFalta GROQ_API_KEY en .env.local (consola.groq.com → API Keys)");
    process.exit(1);
  }
  if (!cfg.configured) {
    process.exit(1);
  }

  const { output, provider, model } = await generateSocialDraft({
    sourceName: "Prueba",
    sourceUrl: "https://example.com/noticia",
    title: "MOPT anuncia obras en la ruta 1",
    extractedText:
      "El Ministerio de Obras Públicas confirmó un plan de mejoras en la ruta 1 que incluye nuevos puentes y señalización. Las obras empezarían en agosto y durarían varios meses, según el ministro.",
  });

  console.log(`\n✓ ${provider} / ${model}`);
  console.log(`  headline: ${output.story_headline}`);
  console.log(`  smoke: ${output.smoke_level}`);
  console.log(`  safety: ${output.safety_classification}`);
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
