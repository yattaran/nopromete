import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { MembershipCta } from "./MembershipCta";

interface SidebarProps {
  donZopiQuote: string;
}

export function Sidebar({ donZopiQuote }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      <section className="border border-ink/20 bg-tan/40 p-5">
        <h2 className="mb-5 text-center font-serif text-sm font-bold tracking-wider text-ink uppercase">
          Don Zopi comenta
        </h2>
        <div className="flex flex-col items-center">
          <Image
            src={brand.donZopiComenta}
            alt="Don Zopi"
            width={160}
            height={160}
            className="rounded-full"
          />
          <blockquote className="relative mt-5 text-center">
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 -translate-x-1/2 font-serif text-5xl leading-none text-accent/60"
            >
              &ldquo;
            </span>
            <p className="px-2 pt-6 font-serif text-sm italic leading-relaxed text-ink">
              {donZopiQuote}
            </p>
          </blockquote>
        </div>
        <Link
          href="/categoria/opinion"
          className="mt-5 flex w-full items-center justify-center gap-1 border border-accent bg-accent px-4 py-2.5 text-xs font-semibold tracking-wide text-paper uppercase transition hover:bg-accent-dark"
        >
          Ver todos los comentarios
          <span aria-hidden>→</span>
        </Link>
      </section>

      <MembershipCta />
    </aside>
  );
}
