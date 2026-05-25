import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function isValidDatabaseUrl(url: string | undefined): boolean {
  if (!url?.trim()) return false;

  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "postgresql:" || parsed.protocol === "postgres:";
  } catch {
    return false;
  }
}

export function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  return isValidDatabaseUrl(url) ? url! : null;
}

export function getDb() {
  const url = getDatabaseUrl();
  if (!url) return null;

  if (!_db) {
    const sql = neon(url);
    _db = drizzle(sql, { schema });
  }

  return _db;
}

export function requireDb() {
  const db = getDb();
  if (!db) {
    throw new Error(
      "DATABASE_URL is missing or invalid. Use a postgresql:// connection string from Neon.",
    );
  }
  return db;
}

export { schema };
