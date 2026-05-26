import type { CSSProperties, ReactElement } from "react";
import React from "react";
import {
  getSmokeLevelAsset,
  type SmokeLevel,
} from "@/lib/editorial/smoke-level";
import { assetColors, assetFonts } from "@/lib/social/asset-brand";

export type SocialAssetDraft = {
  headline: string;
  subtext: string;
  donZopiReaction: string;
  sourceCredit: string;
  format: string;
};

export type SocialAssetNewsItem = {
  sourceName: string;
  sourceUrl: string;
};

type OgChild = ReactElement | string;

/** Satori crashes on null children and undefined style values. */
function og(
  type: string,
  props: { style?: CSSProperties; [key: string]: unknown } | null,
  ...children: (OgChild | null | undefined | false)[]
): ReactElement {
  const filtered = children.filter((c): c is OgChild => c != null && c !== false);
  return React.createElement(type, props, ...filtered);
}

function headlineFontSize(text: string): number {
  const len = text.trim().length;
  if (len <= 42) return 92;
  if (len <= 68) return 78;
  if (len <= 95) return 66;
  return 54;
}

const ZOPI_DISPLAY_WIDTH = 280;

function zopiDisplaySize(level: SmokeLevel) {
  const asset = getSmokeLevelAsset(level);
  return {
    width: ZOPI_DISPLAY_WIDTH,
    height: Math.round((asset.height / asset.width) * ZOPI_DISPLAY_WIDTH),
  };
}

function zopiImg(zopiImageSrc: string, level: SmokeLevel) {
  const size = zopiDisplaySize(level);
  return og("img", {
    src: zopiImageSrc,
    width: size.width,
    height: size.height,
    style: { objectFit: "contain" },
  });
}

export function getSocialAssetDimensions(format: string) {
  if (format === "feed_post" || format === "carousel_3_slide") {
    return { width: 1080, height: 1350, isStory: false };
  }
  return { width: 1080, height: 1920, isStory: true };
}

export function buildSocialAssetElement(input: {
  draft: SocialAssetDraft;
  item: SocialAssetNewsItem;
  smokeLevel: SmokeLevel;
  zopiImageSrc?: string;
}): ReactElement {
  const { draft, item, smokeLevel, zopiImageSrc } = input;
  const { isStory } = getSocialAssetDimensions(draft.format);
  const showZopi =
    Boolean(zopiImageSrc) &&
    (draft.format === "story_with_don_zopi" || Boolean(draft.donZopiReaction?.trim()));

  const padX = isStory ? 72 : 64;
  const padTop = isStory ? 108 : 72;
  const padBottom = isStory ? 220 : 72;

  const headline = draft.headline?.trim() || "Sin titular";
  const headlineSize = headlineFontSize(headline);
  const subtext = draft.subtext?.trim() ?? "";
  const reaction = draft.donZopiReaction?.trim() ?? "";

  const contentChildren: OgChild[] = [
    og(
      "div",
      {
        style: {
          fontSize: headlineSize,
          lineHeight: 1.06,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          fontFamily: assetFonts.serif,
        },
      },
      headline,
    ),
  ];

  if (subtext) {
    contentChildren.push(
      og(
        "div",
        {
          style: {
            marginTop: isStory ? 44 : 36,
            fontSize: isStory ? 40 : 36,
            lineHeight: 1.22,
            color: assetColors.muted,
            fontWeight: 400,
            fontFamily: assetFonts.sans,
          },
        },
        subtext,
      ),
    );
  }

  const bodyChildren: OgChild[] = [
    og(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          width: "100%",
        },
      },
      og("div", { style: { flex: 1, height: 2, background: assetColors.rule } }),
      og(
        "div",
        {
          style: {
            fontSize: 26,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: assetColors.muted,
            fontWeight: 600,
            fontFamily: assetFonts.sans,
            marginLeft: 20,
            marginRight: 20,
          },
        },
        "No Promete",
      ),
      og("div", { style: { flex: 1, height: 2, background: assetColors.rule } }),
    ),
    og(
      "div",
      {
        style: {
          marginTop: isStory ? 56 : 44,
          display: "flex",
          flexDirection: "column",
          ...(showZopi && !reaction ? { flex: 1 } : {}),
        },
      },
      ...contentChildren,
    ),
  ];

  if (reaction) {
    const commentBody: OgChild[] = [
      og(
        "div",
        {
          style: {
            flex: 1,
            fontSize: 38,
            lineHeight: 1.28,
            fontStyle: "italic",
            fontFamily: assetFonts.serif,
            fontWeight: 400,
            paddingRight: showZopi && zopiImageSrc ? 24 : 0,
          },
        },
        `"${reaction}"`,
      ),
    ];

    if (showZopi && zopiImageSrc) {
      commentBody.push(zopiImg(zopiImageSrc, smokeLevel));
    }

    bodyChildren.push(
      og(
        "div",
        {
          style: {
            marginTop: 48,
            background: assetColors.tan,
            borderLeft: `8px solid ${assetColors.accent}`,
            padding: "22px 30px 26px",
            display: "flex",
            flexDirection: "column",
          },
        },
        og(
          "div",
          {
            style: {
              fontSize: 24,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: assetColors.accent,
              fontWeight: 600,
              fontFamily: assetFonts.sans,
              fontStyle: "normal",
              marginBottom: 14,
            },
          },
          "Don Zopi comenta",
        ),
        og(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
            },
          },
          ...commentBody,
        ),
      ),
    );
  }

  bodyChildren.push(og("div", { style: { flex: 1, minHeight: 24 } }));

  if (showZopi && zopiImageSrc && !reaction) {
    bodyChildren.push(
      og(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 20,
          },
        },
        zopiImg(zopiImageSrc, smokeLevel),
      ),
    );
  }

  bodyChildren.push(
    og("div", {
      style: {
        height: 2,
        background: assetColors.rule,
        marginBottom: 18,
      },
    }),
    og(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      og(
        "div",
        {
          style: {
            fontSize: 26,
            color: assetColors.muted,
            fontWeight: 400,
            fontFamily: assetFonts.sans,
            lineHeight: 1.3,
            marginBottom: 10,
          },
        },
        draft.sourceCredit?.trim() || `Fuente: ${item.sourceName}`,
      ),
      og(
        "div",
        {
          style: {
            fontSize: 22,
            color: assetColors.muted,
            fontFamily: assetFonts.sans,
            fontWeight: 400,
          },
        },
        "Link en sticker / bio",
      ),
    ),
  );

  return og(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        background: assetColors.paper,
        color: assetColors.ink,
        display: "flex",
        flexDirection: "column",
        padding: `${padTop}px ${padX}px ${padBottom}px ${padX}px`,
        fontFamily: assetFonts.sans,
        fontWeight: 400,
      },
    },
    ...bodyChildren,
  );
}
