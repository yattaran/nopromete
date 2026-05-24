import Parser from "rss-parser";

export interface FeedItem {
  title: string;
  link: string;
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
      pubDate: item.pubDate ?? item.isoDate,
    }))
    .filter((item) => item.link.startsWith("http"));
}
