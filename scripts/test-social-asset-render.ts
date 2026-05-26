/**
 * Run: npx tsx scripts/test-social-asset-render.ts
 */
import { writeFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { buildSocialAssetElement } from "../lib/social/asset-template";
import { loadSocialAssetFonts } from "../lib/social/asset-fonts";
import { getZopiPngDataUrl } from "../lib/social/asset-images";

async function main() {
  console.log("loading fonts...");
  const fonts = await loadSocialAssetFonts();
  console.log("fonts ok", fonts.length);

  console.log("loading zopi...");
  const smokeLevel = "estresando" as const;
  const zopiImageSrc = await getZopiPngDataUrl(smokeLevel);
  console.log("zopi ok", zopiImageSrc.slice(0, 40) + "...");

  console.log("rendering...");
  const res = new ImageResponse(
    buildSocialAssetElement({
      draft: {
        headline: "Titular de prueba",
        subtext: "Subtexto de prueba",
        donZopiReaction: "Diay mae qué tuanis.",
        sourceCredit: "Fuente: La Nación",
        format: "story_with_don_zopi",
      },
      item: { sourceName: "La Nación", sourceUrl: "https://www.nacion.com/ejemplo" },
      smokeLevel,
      zopiImageSrc,
    }),
    { width: 1080, height: 1920, fonts },
  );

  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile("/tmp/test-social-asset.png", buf);
  console.log("wrote /tmp/test-social-asset.png", buf.length, "bytes");
}

main().catch((err) => {
  console.error("FAILED", err);
  process.exit(1);
});
