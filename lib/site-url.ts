/** Canonical site origin for signed asset URLs and auth callbacks. */
export function getSiteUrl(): string {
  for (const key of ["NEXTAUTH_URL", "AUTH_URL", "NEXT_PUBLIC_SITE_URL"] as const) {
    const value = process.env[key]?.trim();
    if (value) return value.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
