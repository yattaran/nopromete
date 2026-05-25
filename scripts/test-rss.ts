import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { fetchAndExtractArticle } from "../lib/ingest/extract";
import { fetchFeedItems } from "../lib/ingest/rss";

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

const FEEDS = [
  { name: "La Nación", url: "https://www.nacion.com/arc/outboundfeeds/rss/?outputType=xml" },
  { name: "Delfino.cr", url: "https://delfino.cr/feed" },
  { name: "Semanario Universidad", url: "https://semanariouniversidad.com/feed/" },
];

async function main() {
  loadEnvLocal();

  const extractOne = process.argv.includes("--extract");

  for (const feed of FEEDS) {
    console.log(`\n📡 ${feed.name}`);
    console.log(`   ${feed.url}`);

    try {
      const items = await fetchFeedItems(feed.url);
      console.log(`   ✓ ${items.length} items en el feed`);

      for (const item of items.slice(0, 3)) {
        console.log(`   · ${item.title.slice(0, 70)}${item.title.length > 70 ? "…" : ""}`);
        console.log(`     ${item.link}`);
      }

      if (extractOne && items[0]) {
        console.log(`\n   Extrayendo artículo: ${items[0].title.slice(0, 60)}…`);
        const extracted = await fetchAndExtractArticle(items[0].link);
        console.log(`   ✓ ${extracted.content.length} caracteres extraídos`);
        console.log(`   Preview: ${extracted.content.slice(0, 200).replace(/\s+/g, " ")}…`);
        if (extracted.imageUrl) {
          console.log(`   Imagen: ${extracted.imageUrl}`);
        }
      }
    } catch (err) {
      console.log(`   ✗ Error: ${err instanceof Error ? err.message : err}`);
    }
  }

  if (!extractOne) {
    console.log("\nTip: agregá --extract para probar Readability en el primer artículo de cada feed.");
    console.log("Tip: npm run ingest -- --max=1 para ingerir y guardar borradores en Neon.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
