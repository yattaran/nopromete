import Image from "next/image";
import Link from "next/link";
import { brand, socialLinks } from "@/lib/brand";

function SocialIcon({ icon }: { icon: string }) {
  const paths: Record<string, string> = {
    facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    x: "M4 4l11 13M20 4L9 17",
    instagram:
      "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M17.5 6.5h.01",
    youtube: "M2 8l12 6V2L2 8z M16 6v12a2 2 0 0 0 2 2h2V4h-2a2 2 0 0 0-2 2z",
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={paths[icon] ?? paths.x} />
    </svg>
  );
}

export function Header() {
  return (
    <header className="border-b border-ink">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <Link href="/" className="group flex items-center gap-4">
            <Image
              src={brand.logo}
              alt="Don Zopi"
              width={64}
              height={64}
              className="shrink-0 rounded-full"
            />
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-ink group-hover:opacity-80">
                {brand.siteName}
              </h1>
              <p className="mt-0.5 text-xs font-semibold tracking-[0.15em] text-muted uppercase">
                {brand.tagline}
              </p>
            </div>
          </Link>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.icon}
                    href={link.href}
                    aria-label={link.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:border-ink hover:bg-tan"
                  >
                    <SocialIcon icon={link.icon} />
                  </a>
                ))}
              </div>
              <button
                type="button"
                aria-label="Buscar"
                className="flex h-8 w-8 items-center justify-center text-ink transition hover:opacity-70"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
              <Link
                href="#"
                className="flex items-center gap-2 border border-accent bg-accent px-4 py-2 text-xs font-semibold tracking-wide text-paper uppercase transition hover:bg-accent-dark"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Únete
              </Link>
            </div>
            <Link
              href="#newsletter"
              className="flex items-center gap-2 text-xs text-muted transition hover:text-ink"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
              Sin promesas, pero con buen chisme.{" "}
              <span className="font-semibold underline underline-offset-2">
                Suscríbete al boletín.
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
