import { LandingHub } from "@/components/landing/LandingHub";
import { getActiveSources } from "@/lib/data/sources";

export default async function HomePage() {
  const sources = await getActiveSources();
  return <LandingHub sources={sources} />;
}
