import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's specific role */
      role: UserRole;
      /** The user's unique identifier */
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: UserRole;
    sub: string;
  }
}
