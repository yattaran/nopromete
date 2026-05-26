import Image from "next/image";
import Link from "next/link";
import { brand, getPrimarySocialLinks } from "@/lib/brand";

export function Header() {
  const social = getPrimarySocialLinks();

  return (
    <header className="border-b border-ink">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src={brand.donZopiComenta}
            alt="Don Zopi"
            width={48}
            height={48}
            className="shrink-0 rounded-full"
          />
          <div>
            <p className="font-serif text-2xl font-bold tracking-tight text-ink group-hover:opacity-80">
              {brand.siteName}
            </p>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
              Redes primero
            </p>
          </div>
        </Link>
        {social[0] && (
          <a
            href={social[0].href}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-accent bg-accent px-3 py-2 text-[10px] font-semibold tracking-wide text-paper uppercase"
          >
            {social[0].label}
          </a>
        )}
      </div>
    </header>
  );
}
