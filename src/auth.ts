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

      // Fetch fresh user data to ensure UI reflects DB changes (e.g. via Prisma Studio)
      if (token.sub) {
          const freshUser = await prisma.user.findUnique({
              where: { id: token.sub },
              select: { role: true, subscriptionTier: true }
          });
          if (freshUser) {
              token.role = freshUser.role;
              token.subscriptionTier = freshUser.subscriptionTier;
          }
      }

      if (trigger === "update" && session?.user) {
        token.role = session.user.role;
        token.subscriptionTier = session.user.subscriptionTier;
      }

      // Note: Dev Bypass logic removed from session to allow testing Free tier in UI.
      // Backend services may still check the key for specific permissions.

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

