import type { CategorySlug } from "@/lib/types/article";

const CATEGORY_HERO: Record<CategorySlug, string> = {
  noticias: "/mock/hero-bridge.svg",
  politica: "/mock/hero-bridge.svg",
  "costa-rica": "/mock/hero-flood.svg",
  mundo: "/mock/hero-coast.svg",
  opinion: "/mock/hero-theater.svg",
  cultura: "/mock/hero-festival.svg",
  "que-desastre": "/mock/hero-eggs.svg",
};

export function heroImageForCategory(category: CategorySlug): string {
  return CATEGORY_HERO[category] ?? "/mock/hero-bridge.svg";
}
