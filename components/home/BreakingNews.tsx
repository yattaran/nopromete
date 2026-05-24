import Link from "next/link";
import type { BreakingItem } from "@/lib/types/article";
import { formatTimeAgo } from "@/lib/utils/date";

interface BreakingNewsProps {
  items: BreakingItem[];
}

export function BreakingNews({ items }: BreakingNewsProps) {
  return (
    <section>
      <h2 className="mb-4 border-b border-ink pb-2 font-serif text-sm font-bold tracking-wider text-ink uppercase">
        Última hora
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.slug} className="border-b border-ink/10 pb-3 last:border-0">
            <time
              dateTime={item.publishedAt}
              className="text-[10px] font-semibold tracking-wider text-accent uppercase"
            >
              {formatTimeAgo(item.publishedAt)}
            </time>
            <Link
              href={`/noticias/${item.slug}`}
              className="mt-1 block font-serif text-sm leading-snug text-ink hover:opacity-80"
            >
              {item.headline}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
