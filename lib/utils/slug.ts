import slugify from "slugify";

export function makeSlug(headline: string, suffix?: string): string {
  const base = slugify(headline, { lower: true, strict: true, locale: "es" });
  const trimmed = base.slice(0, 80).replace(/-+$/, "");
  return suffix ? `${trimmed}-${suffix}` : trimmed;
}
