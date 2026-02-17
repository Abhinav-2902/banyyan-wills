"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getWillHistory(willId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const will = await prisma.will.findUnique({
      where: { id: willId, userId: session.user.id },
    });

    if (!will) {
      return { success: false, error: "Will not found" };
    }

    // Check subscription tier
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { subscriptionTier: true }
    });

    // Check for dev bypass or premium
    const isDevBypass = process.env.DEV_TEST_BYPASS_KEY && process.env.DEV_TEST_BYPASS_KEY === "banyyan-dev-test-2024";

    if (user?.subscriptionTier !== "PREMIUM" && !isDevBypass) {
        return { success: false, error: "REQUIRES_PREMIUM" };
    }

    const history = await prisma.willVersion.findMany({
      where: { willId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        commitMsg: true,
        versionNum: true,
        changes: true,
      }
    });

    return { success: true, data: history };
  } catch (error) {
    console.error("Error fetching will history:", error);
    return { success: false, error: "Failed to fetch history" };
  }
}
