import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSocialDraftWithNewsItem } from "@/lib/data/social";
import { resolveSmokeLevel } from "@/lib/editorial/smoke-level";
import { verifyAssetToken } from "@/lib/social/assets";
import { buildSocialAssetElement, getSocialAssetDimensions } from "@/lib/social/asset-template";
import { loadSocialAssetFonts } from "@/lib/social/asset-fonts";
import { getZopiPngDataUrl } from "@/lib/social/asset-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) return new NextResponse("Missing token", { status: 401 });

    try {
      if (!verifyAssetToken({ draftId: id, token })) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unauthorized";
      return new NextResponse(message, { status: 401 });
    }

    const db = getDb();
    if (!db) return new NextResponse("DATABASE_URL missing", { status: 500 });

    const data = await getSocialDraftWithNewsItem(id);
    if (!data) return new NextResponse("Not found", { status: 404 });

    const { draft, item } = data;
    const dimensions = getSocialAssetDimensions(draft.format);

    const showZopi =
      draft.format === "story_with_don_zopi" || Boolean(draft.donZopiReaction?.trim());

    let fonts;
    try {
      fonts = await loadSocialAssetFonts();
    } catch (err) {
      console.error("[social-asset] font load failed", err);
      return new NextResponse("Font load failed", { status: 500 });
    }

    const smokeLevel = resolveSmokeLevel(draft.smokeLevel);

    let zopiImageSrc: string | undefined;
    if (showZopi) {
      try {
        zopiImageSrc = await getZopiPngDataUrl(smokeLevel);
      } catch (err) {
        console.error("[social-asset] zopi image load failed", err);
        return new NextResponse("Image load failed", { status: 500 });
      }
    }

    const imageResponse = new ImageResponse(
      buildSocialAssetElement({
        draft: {
          headline: draft.headline,
          subtext: draft.subtext,
          donZopiReaction: draft.donZopiReaction,
          sourceCredit: draft.sourceCredit,
          format: draft.format,
        },
        item: { sourceName: item.sourceName, sourceUrl: item.sourceUrl },
        smokeLevel,
        zopiImageSrc,
      }),
      {
        width: dimensions.width,
        height: dimensions.height,
        fonts,
      },
    );

    imageResponse.headers.set("Cache-Control", "no-store, max-age=0");
    return imageResponse;
  } catch (err) {
    console.error("[social-asset] render failed", err);
    const message = err instanceof Error ? err.message : "Render failed";
    return new NextResponse(message, { status: 500 });
  }
}
