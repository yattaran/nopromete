import Link from "next/link";
import { categories } from "@/lib/utils/categories";

export function MainNav() {
  return (
    <nav
      className="border-b border-ink bg-paper"
      aria-label="Secciones principales"
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex min-w-max items-center gap-0">
          {categories.map((cat, i) => (
            <li key={cat.slug} className="flex">
              <Link
                href={`/categoria/${cat.slug}`}
                className={`flex items-center gap-1 px-4 py-3 text-xs font-semibold tracking-wider text-ink uppercase transition hover:bg-tan ${
                  i > 0 ? "border-l border-ink/20" : ""
                }`}
              >
                {cat.label}
                {cat.slug === "noticias" && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
