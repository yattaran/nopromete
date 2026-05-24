import { signIn } from "@/lib/auth";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-serif text-3xl font-bold text-ink">Panel editorial</h1>
      <p className="mt-2 text-sm text-muted">Ingresá la contraseña de editor.</p>

      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            password: formData.get("password"),
            redirectTo: "/admin",
          });
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
