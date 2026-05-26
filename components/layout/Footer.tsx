import Link from "next/link";
import { brand } from "@/lib/brand";

const footerLinks = [
  { href: "/nosotros", label: "Quiénes somos" },
  { href: "/etica", label: "Código de ética" },
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "#", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {brand.siteName}
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-sm">
            {footerLinks.map((link, i) => (
              <span key={link.label} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden className="mx-2 text-muted/50">
                    |
                  </span>
                )}
                <Link
                  href={link.href}
                  className="text-ink underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="text-sm font-medium text-ink">{brand.footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}
