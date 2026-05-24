"use client";

import { useState } from "react";

interface ArticleShareButtonsProps {
  url: string;
  title: string;
}

export function ArticleShareButtons({ url, title }: ArticleShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en X"
        className="flex h-9 w-9 items-center justify-center border border-ink/20 text-sm font-bold transition hover:border-ink hover:bg-tan/60"
      >
        𝕏
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en Facebook"
        className="flex h-9 w-9 items-center justify-center border border-ink/20 text-sm font-bold transition hover:border-ink hover:bg-tan/60"
      >
        f
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en WhatsApp"
        className="flex h-9 w-9 items-center justify-center border border-ink/20 text-sm font-bold transition hover:border-ink hover:bg-tan/60"
      >
        W
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Enlace copiado" : "Copiar enlace"}
        className="flex h-9 w-9 items-center justify-center border border-ink/20 text-sm transition hover:border-ink hover:bg-tan/60"
      >
        {copied ? "✓" : "⧉"}
      </button>
    </div>
  );
}
