import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        password: { label: "Contraseña", type: "password" },
      },
      authorize(credentials) {
        const password = credentials?.password as string | undefined;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!password || !adminPassword || password !== adminPassword) {
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
