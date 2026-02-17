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
