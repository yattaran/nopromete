/**
 * Brand asset paths — final Don Zopi artwork in public/brand/
 */
export const brand = {
  donZopiComenta: "/brand/don-zopi-comenta.png",
  siteName: "No Promete",
  tagline: "NOTICIAS. SIN PROMESAS. SIN FILTRO.",
  footerTagline: "No prometemos. Informamos.",
} as const;

/** Primary CTAs for the public link hub (env-driven). */
export function getPrimarySocialLinks(): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  const ig = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();
  const tt = process.env.NEXT_PUBLIC_TIKTOK_URL?.trim();
  if (ig) links.push({ label: "Instagram", href: ig });
  if (tt) links.push({ label: "TikTok", href: tt });
  return links;
}

export function isInstagramPublishConfigured() {
  return Boolean(process.env.IG_ACCESS_TOKEN?.trim() && process.env.IG_USER_ID?.trim());
}
