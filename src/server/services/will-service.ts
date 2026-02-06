import { findWillsByUser, upsertWill } from "@/server/data/will";
import { WillDashboardDTO } from "@/types";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getUserDashboard(userId: string): Promise<WillDashboardDTO[]> {
  try {
    const wills = await findWillsByUser(userId);
    // Future business logic (e.g., filtering archived wills) goes here.
    return wills;
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    throw new Error("Failed to load dashboard data");
  }
}

/**
 * Save a will draft with business logic validation
 * @param userId - The user ID who owns the will
 * @param data - The will form data
 * @param willId - Optional will ID for updates
 * @returns The saved will record
 * @throws Error if trying to edit a finalized will
 */
export async function saveWillDraft(
  userId: string,
  data: Record<string, unknown>,
  willId?: string
) {
  // If updating an existing will, validate it's not finalized
  if (willId) {
    const existingWill = await prisma.will.findUnique({
      where: { id: willId, userId },
      select: { status: true },
    });

    if (!existingWill) {
      throw new Error("Will not found or you don't have permission to edit it");
    }

    if (existingWill.status === "PAID" || existingWill.status === "COMPLETED") {
      throw new Error("Cannot edit a finalized will");
    }
  }

  // Call DAL to upsert the will
  const savedWill = await upsertWill(userId, data as Prisma.InputJsonValue, willId);

  return savedWill;
}
