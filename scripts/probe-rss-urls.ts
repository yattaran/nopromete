/**
 * Prueba URLs candidatas de RSS. Uso: npx tsx scripts/probe-rss-urls.ts
 */
import { fetchFeedItems } from "../lib/ingest/rss";

const CANDIDATES: [string, string][] = process.argv.slice(2).length
  ? process.argv.slice(2).map((url) => ["custom", url] as [string, string])
  : [
      ["Tico Times", "https://feeds.feedburner.com/theticotimes"],
      ["CR Hoy", "https://crhoy.com/feed/"],
      ["La República", "https://www.larepublica.net/feed/"],
      ["BBC World", "https://feeds.bbci.co.uk/news/world/rss.xml"],
      ["Guardian World", "https://www.theguardian.com/world/rss"],
    ];

async function main() {
  for (const [name, url] of CANDIDATES) {
    try {
      const items = await fetchFeedItems(url);
      console.log(`OK  ${name.padEnd(16)} ${String(items.length).padStart(3)}  ${url}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message.split("\n")[0] : String(err);
      console.log(`FAIL ${name.padEnd(16)}      ${url}  → ${msg}`);
    }
  }
}

main();
