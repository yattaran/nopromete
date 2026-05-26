import { readFile } from "node:fs/promises";
import { join } from "node:path";

const cache = new Map<string, ArrayBuffer>();

function fontPath(packageName: string, filename: string) {
  return join(process.cwd(), "node_modules/@fontsource", packageName, "files", filename);
}

async function loadWoff(packageName: string, filename: string) {
  const key = `${packageName}/${filename}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const buf = await readFile(fontPath(packageName, filename));
  const data = new Uint8Array(buf).buffer;
  cache.set(key, data);
  return data;
}

/** WOFF from @fontsource — Satori does not support woff2. */
export async function loadSocialAssetFonts() {
  const [serifBold, serifItalic, sansSemi, sansRegular] = await Promise.all([
    loadWoff("source-serif-4", "source-serif-4-latin-700-normal.woff"),
    loadWoff("source-serif-4", "source-serif-4-latin-400-italic.woff"),
    loadWoff("barlow", "barlow-latin-600-normal.woff"),
    loadWoff("barlow", "barlow-latin-400-normal.woff"),
  ]);

  return [
    { name: "Source Serif 4", data: serifBold, weight: 700 as const, style: "normal" as const },
    { name: "Source Serif 4", data: serifItalic, weight: 400 as const, style: "italic" as const },
    { name: "Barlow", data: sansSemi, weight: 600 as const, style: "normal" as const },
    { name: "Barlow", data: sansRegular, weight: 400 as const, style: "normal" as const },
  ];
}
