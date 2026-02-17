import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./lib/validations/auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Adapter } from "next-auth/adapters";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (user.id) token.sub = user.id;
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;
      }

      if (trigger === "update" && session?.user) {
        token.role = session.user.role;
        token.subscriptionTier = session.user.subscriptionTier;
      }

      // Dev Bypass Logic
      const isDevBypass = process.env.DEV_TEST_BYPASS_KEY && process.env.DEV_TEST_BYPASS_KEY === "banyyan-dev-test-2024";
      if (isDevBypass) {
        token.subscriptionTier = "PREMIUM";
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.subscriptionTier = token.subscriptionTier as "FREE" | "PREMIUM";
      }
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
});

