import { loadLocalEnv } from "../lib/env/load-local";
import { requireDb } from "../lib/db";
import { sources } from "../lib/db/schema";
import { runIngest } from "../lib/ingest/pipeline";

function parseMaxArticles(): number {
  const flag = process.argv.find((arg) => arg.startsWith("--max="));
  if (!flag) return 1;

  const value = Number.parseInt(flag.slice("--max=".length), 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

async function main() {
  loadLocalEnv();

  if (!process.env.DATABASE_URL) {
    console.error("Falta DATABASE_URL en .env.local");
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("Falta GEMINI_API_KEY en .env.local (necesario para generar borradores)");
    process.exit(1);
  }

  const db = requireDb();
  const activeSources = await db.select().from(sources);

  if (activeSources.length === 0) {
    console.error("No hay fuentes RSS en la base. Corré primero: npm run db:seed");
    process.exit(1);
  }

  const maxArticles = parseMaxArticles();
  console.log(`Fuentes: ${activeSources.map((s) => s.name).join(", ")}`);
  console.log(`Procesando hasta ${maxArticles} artículo(s) nuevo(s)…\n`);

  const result = await runIngest({ maxArticles });

  console.log("Resultado:");
  console.log(`  procesados: ${result.processed}`);
  console.log(`  omitidos (ya existían): ${result.skipped}`);

  if (result.errors.length > 0) {
    console.log("  errores:");
    for (const err of result.errors) {
      console.log(`    - ${err}`);
    }
  }

  if (result.processed === 0 && result.errors.length === 0) {
    console.log("\nNo hubo artículos nuevos. Probá de nuevo más tarde o revisá los feeds.");
  } else if (result.processed > 0) {
    console.log("\nBorradores guardados en Neon (status: pending_review). Revisalos en /admin");
  }

  process.exit(result.errors.length > 0 ? 1 : 0);
}

function isMissingTableError(err: unknown): boolean {
  const cause = err && typeof err === "object" && "cause" in err ? err.cause : err;
  return (
    cause !== null &&
    typeof cause === "object" &&
    "code" in cause &&
    cause.code === "42P01"
  );
}

main().catch((err) => {
  if (isMissingTableError(err)) {
    console.error("Las tablas no existen en Neon. Corré primero:");
    console.error("  npm run db:push");
    console.error("  npm run db:seed");
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
