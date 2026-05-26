import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getAdminPassword } from "@/lib/admin-password";
import { getAuthSecret } from "@/lib/auth-secret";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: getAuthSecret(),
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        password: { label: "Contraseña", type: "password" },
      },
      authorize(credentials) {
        const password = credentials?.password;
        const adminPassword = getAdminPassword();

        if (typeof password !== "string" || !adminPassword || password !== adminPassword) {
          return null;
        }

        return { id: "admin", name: "Editor" };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = nextUrl.pathname.startsWith("/admin");
      const isLogin = nextUrl.pathname === "/admin/login";
      if (isAdmin && !isLogin) {
        return !!auth;
      }
      return true;
    },
  },
});
