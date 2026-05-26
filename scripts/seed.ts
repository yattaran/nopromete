import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { inArray } from "drizzle-orm";
import { requireDb } from "../lib/db";
import { sources } from "../lib/db/schema";

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

/** Feeds verificados con `npm run test:rss` / `npx tsx scripts/probe-rss-urls.ts`. */
const DEFAULT_SOURCES = [
  { name: "La Nación", feedUrl: "https://www.nacion.com/arc/outboundfeeds/rss/?outputType=xml" },
  { name: "Delfino.cr", feedUrl: "https://delfino.cr/feed" },
  { name: "The Tico Times", feedUrl: "https://feeds.feedburner.com/theticotimes" },
  { name: "Diario Extra", feedUrl: "https://www.diarioextra.com/feed/" },
  // Reuters cerró feeds.reuters.com; BBC World como wire internacional.
  { name: "BBC World (internacional)", feedUrl: "https://feeds.bbci.co.uk/news/world/rss.xml" },
];

/** URLs que probamos y no funcionan — desactivar si quedaron de un seed anterior. */
const DEPRECATED_FEED_URLS = [
  "https://ticotimes.net/feed",
  "https://www.crhoy.com/feed/",
  "https://crhoy.com/feed/",
  "https://www.larepublica.net/feed/",
  "https://larepublica.net/feed/",
  "https://feeds.reuters.com/reuters/worldNews",
];

async function seed() {
  loadEnvLocal();
  const db = requireDb();

  if (DEPRECATED_FEED_URLS.length > 0) {
    await db
      .update(sources)
      .set({ active: false })
      .where(inArray(sources.feedUrl, DEPRECATED_FEED_URLS));
  }

  for (const source of DEFAULT_SOURCES) {
    await db.insert(sources).values(source).onConflictDoNothing({ target: sources.feedUrl });
  }

  console.log("Seed complete: RSS sources.");
  console.log(
    "Nota: CR Hoy y La República no tienen RSS público estable (404/HTML). Si los habilitan, agregarlos a DEFAULT_SOURCES.",
  );
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
