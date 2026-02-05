"use server";

import { requireAuth } from "./auth";

export async function testProtectedAction() {
  try {
    const session = await requireAuth();
    return { success: true, user: session.user };
  } catch (error) {
    return { success: false, error: "Access Denied: You are not logged in." };
  }
}
