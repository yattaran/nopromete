import type { Category, CategorySlug } from "@/lib/types/article";

export const categories: Category[] = [
  { slug: "noticias", label: "NOTICIAS" },
  { slug: "politica", label: "POLÍTICA" },
  { slug: "costa-rica", label: "COSTA RICA" },
  { slug: "mundo", label: "MUNDO" },
  { slug: "opinion", label: "OPINIÓN" },
  { slug: "cultura", label: "CULTURA" },
  { slug: "que-desastre", label: "QUÉ DESASTRE" },
];

export function getCategoryLabel(slug: CategorySlug): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug.toUpperCase();
}

export function getCategoryHref(slug: CategorySlug): string {
  return `/categoria/${slug}`;
}
