import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";

export interface ExtractedArticle {
  title: string;
  content: string;
  imageUrl: string | null;
  description: string | null;
  rawHtml: string;
}

export async function fetchAndExtractArticle(url: string): Promise<ExtractedArticle> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "NoPrometeBot/1.0 (+https://nopromete.com)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const rawHtml = await response.text();
  const dom = new JSDOM(rawHtml, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const $ = cheerio.load(rawHtml);
  const ogImage =
    $('meta[property="og:image"]').attr("content") ??
    $('meta[name="twitter:image"]').attr("content") ??
    null;

  const metaDescription =
    $('meta[property="og:description"]').attr("content") ??
    $('meta[name="twitter:description"]').attr("content") ??
    $('meta[name="description"]').attr("content") ??
    null;

  const title = article?.title ?? $("title").text().trim() ?? "Sin título";
  let content = article?.textContent?.trim() ?? "";

  // Paywalls / JS-heavy pages may yield tiny Readability output; fallback to meta description.
  if (content.length < 100) {
    if (metaDescription && metaDescription.trim().length >= 60) {
      content = metaDescription.trim();
    } else {
      throw new Error(`Insufficient content extracted from ${url}`);
    }
  } else if (content.length < 600 && metaDescription && metaDescription.trim().length >= 60) {
    // When extraction is weak-but-not-empty, prepend a concise synopsis to help the LLM.
    content = `${metaDescription.trim()}\n\n${content}`;
  }

  return {
    title,
    content,
    imageUrl: ogImage,
    description: metaDescription?.trim() ?? null,
    rawHtml,
  };
}
