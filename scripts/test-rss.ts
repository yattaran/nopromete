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
  { name: "The Tico Times", url: "https://feeds.feedburner.com/theticotimes" },
  { name: "Diario Extra", url: "https://www.diarioextra.com/feed/" },
  { name: "BBC World (internacional)", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "Semanario Universidad", url: "https://semanariouniversidad.com/feed/" },
];

/** Sin RSS estable hoy — se dejan comentados para probe manual. */
const SKIPPED_FEEDS = [
  { name: "CR Hoy", url: "https://www.crhoy.com/feed/", reason: "404 — sin feed público" },
  { name: "La República", url: "https://www.larepublica.net/feed/", reason: "404 — sin feed público" },
  { name: "Reuters", url: "https://feeds.reuters.com/reuters/worldNews", reason: "dominio caído" },
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

  if (SKIPPED_FEEDS.length > 0) {
    console.log("\n— Omitidos (sin RSS estable):");
    for (const feed of SKIPPED_FEEDS) {
      console.log(`   · ${feed.name}: ${feed.reason}`);
    }
  }

  if (!extractOne) {
    console.log("\nTip: agregá --extract para probar Readability en el primer artículo de cada feed.");
    console.log("Tip: npx tsx scripts/probe-rss-urls.ts para probar URLs candidatas.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
