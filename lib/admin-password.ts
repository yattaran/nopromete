/** Admin credentials password (Credentials provider). */
export function getAdminPassword(): string | undefined {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (password) return password;

  if (process.env.NODE_ENV !== "production") {
    return "dev-admin";
  }

  return undefined;
}
