import Parser from "rss-parser";

export interface FeedItem {
  title: string;
  link: string;
  description?: string | null;
  pubDate?: string;
}

const parser = new Parser({
  timeout: 10_000,
  headers: {
    "User-Agent": "NoPrometeBot/1.0 (+https://nopromete.com)",
  },
});

export async function fetchFeedItems(feedUrl: string): Promise<FeedItem[]> {
  const feed = await parser.parseURL(feedUrl);

  return (feed.items ?? [])
    .map((item) => ({
      title: item.title?.trim() ?? "Sin título",
      link: item.link?.trim() ?? item.guid?.trim() ?? "",
      description:
        (typeof (item as any).contentSnippet === "string" ? (item as any).contentSnippet : null) ??
        (typeof (item as any).content === "string" ? (item as any).content : null) ??
        (typeof (item as any).summary === "string" ? (item as any).summary : null) ??
        null,
      pubDate: item.pubDate ?? item.isoDate,
    }))
    .filter((item) => item.link.startsWith("http"));
}
