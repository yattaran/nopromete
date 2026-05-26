import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { sources } from "@/lib/db/schema";

export async function getActiveSources() {
  const db = getDb();
  if (!db) return [];
  return db.select().from(sources).where(eq(sources.active, true)).orderBy(asc(sources.name));
}
