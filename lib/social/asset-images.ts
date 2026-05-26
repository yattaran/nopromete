import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSmokeLevelImage, type SmokeLevel } from "@/lib/editorial/smoke-level";

const cache = new Map<string, string>();

/** Inline PNG from /public — avoids Satori fetching localhost (hangs/crashes). */
export async function getPublicPngDataUrl(publicPath: string) {
  const key = publicPath;
  const hit = cache.get(key);
  if (hit) return hit;

  const filePath = join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  const buf = await readFile(filePath);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  cache.set(key, dataUrl);
  return dataUrl;
}

/** Don Zopi pose PNG for a given smoke level (Satori-safe data URL). */
export async function getZopiPngDataUrl(level: SmokeLevel) {
  return getPublicPngDataUrl(getSmokeLevelImage(level));
}
