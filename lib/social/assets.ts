import crypto from "node:crypto";
import { getAuthSecret } from "@/lib/auth-secret";

function getAssetSecret(): string | null {
  const direct = process.env.ASSET_SIGNING_SECRET?.trim();
  if (direct) return direct;

  const authSecret = getAuthSecret();
  if (authSecret) return authSecret;

  // In dev, allow running without a secret (token becomes non-secret).
  if (process.env.NODE_ENV !== "production") return "dev-insecure-secret";

  return null;
}

export function signAssetToken(payload: { draftId: string; exp: number }) {
  const secret = getAssetSecret();
  if (!secret) {
    throw new Error(
      "Asset signing secret missing. Set AUTH_SECRET (or ASSET_SIGNING_SECRET) in production.",
    );
  }
  const data = `${payload.draftId}.${payload.exp}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${payload.exp}.${sig}`;
}

export function verifyAssetToken(input: { draftId: string; token: string }) {
  const secret = getAssetSecret();
  if (!secret) return false;
  const parts = input.token.split(".");
  if (parts.length !== 2) return false;
  const exp = Number(parts[0]);
  if (!Number.isFinite(exp)) return false;
  if (Date.now() > exp) return false;

  const data = `${input.draftId}.${exp}`;
  const expected = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  const a = Buffer.from(parts[1]);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

