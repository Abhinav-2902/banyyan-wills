import { auth } from "@/auth";

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "AuthenticationError";
  }
}

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new AuthenticationError();
  }

  return session;
}
