import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MainNav } from "@/components/layout/MainNav";
import { NewsletterBand } from "@/components/layout/NewsletterBand";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <MainNav />
      <main className="flex-1">{children}</main>
      <NewsletterBand />
      <Footer />
    </>
  );
}
