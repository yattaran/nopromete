import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";

export interface ExtractedArticle {
  title: string;
  content: string;
  imageUrl: string | null;
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

  const title = article?.title ?? $("title").text().trim() ?? "Sin título";
  const content = article?.textContent?.trim() ?? "";

  if (content.length < 100) {
    throw new Error(`Insufficient content extracted from ${url}`);
  }

  return {
    title,
    content,
    imageUrl: ogImage,
    rawHtml,
  };
}
