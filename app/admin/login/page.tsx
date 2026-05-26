import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const showDevHint = process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSWORD?.trim();

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-serif text-3xl font-bold text-ink">Panel editorial</h1>
      <p className="mt-2 text-sm text-muted">Ingresá la contraseña de editor.</p>

      {error === "credentials" && (
        <p className="mt-4 border border-accent/50 bg-tan/50 px-3 py-2 text-sm text-ink">
          Contraseña incorrecta. Intentá de nuevo.
        </p>
      )}

      {showDevHint && (
        <p className="mt-4 text-xs text-muted">
          Dev: sin <code className="text-ink">ADMIN_PASSWORD</code> en{" "}
          <code className="text-ink">.env.local</code>, la contraseña es{" "}
          <code className="text-ink">dev-admin</code>.
        </p>
      )}

      <form
        action={async (formData) => {
          "use server";
          const password = formData.get("password");
          try {
            await signIn("credentials", {
              password: typeof password === "string" ? password : "",
              redirectTo: "/admin",
            });
          } catch (err) {
            if (err instanceof AuthError && err.type === "CredentialsSignin") {
              redirect("/admin/login?error=credentials");
            }
            throw err;
          }
        }}
        className="mt-8 space-y-4"
      >
        <div>
          <label
            htmlFor="password"
            className="text-xs font-semibold tracking-wide text-ink uppercase"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full border border-ink/30 bg-paper px-4 py-2.5 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-ink px-4 py-2.5 text-xs font-semibold tracking-wide text-paper uppercase"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
