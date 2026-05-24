const rtf = new Intl.RelativeTimeFormat("es-CR", { numeric: "auto" });

export function formatTimeAgo(date: string | Date): string {
  const then = new Date(date).getTime();
  const now = Date.now();
  const diffSec = Math.round((then - now) / 1000);
  const absSec = Math.abs(diffSec);

  if (absSec < 60) return rtf.format(diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHour = Math.round(diffSec / 3600);
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
  const diffDay = Math.round(diffSec / 86400);
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day");
  const diffMonth = Math.round(diffSec / 2592000);
  return rtf.format(diffMonth, "month");
}

export function formatPublishedDate(date: string | Date): string {
  return new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatViewCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M vistas`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K vistas`;
  return `${count} vistas`;
}
