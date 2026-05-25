-- Ejecutar en Neon SQL Editor si npm run db:push no se aplicó aún.
ALTER TABLE "posts"
ADD COLUMN IF NOT EXISTS "is_positive_news" boolean NOT NULL DEFAULT false;
