import Link from "next/link";

export function MembershipCta() {
  return (
    <aside className="flex flex-col justify-between bg-ink p-6 text-paper">
      <div>
        <p className="font-serif text-xl font-bold leading-snug">
          Información sin maquillaje.
        </p>
        <p className="mt-2 font-serif text-lg text-accent">
          Para gente que sí piensa.
        </p>
      </div>
      <Link
        href="#"
        className="mt-6 inline-flex w-full items-center justify-center border border-accent bg-accent px-5 py-2.5 text-xs font-semibold tracking-wider text-paper uppercase transition hover:bg-accent-dark"
      >
        Hazte miembro
      </Link>
    </aside>
  );
}
