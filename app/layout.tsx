import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "No Promete — Noticias sin promesas",
    template: "%s | No Promete",
  },
  description:
    "Noticias de Costa Rica y el mundo, resumidas con sarcasmo a lo tico. Siempre con enlace a la fuente original.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CR" className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
