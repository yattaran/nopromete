/** Shared Auth.js secret resolution (JWT signing). */
export function getAuthSecret(): string | undefined {
  const secret = process.env.AUTH_SECRET?.trim() ?? process.env.NEXTAUTH_SECRET?.trim();
  if (secret) return secret;

  if (process.env.NODE_ENV !== "production") {
    return "dev-auth-secret-change-me";
  }

  return undefined;
}
