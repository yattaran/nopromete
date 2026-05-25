import type { SmokeLevel } from "@/lib/editorial/smoke-level";

export type CategorySlug =
  | "noticias"
  | "politica"
  | "costa-rica"
  | "mundo"
  | "opinion"
  | "cultura"
  | "que-desastre";

export interface Category {
  slug: CategorySlug;
  label: string;
}

export interface Article {
  slug: string;
  category: CategorySlug;
  publishedAt: string;
  headline: string;
  summary: string;
  factualSummary: string;
  whyItMatters: string;
  isPositiveNews?: boolean;
  donZopiQuote: string;
  donZopiVerdict: string;
  smokeLevel: SmokeLevel;
  sourceUrl: string;
  sourceName: string;
  heroImage: string;
  viewCount?: number;
  featured?: boolean;
}

export interface BreakingItem {
  slug: string;
  headline: string;
  publishedAt: string;
}
