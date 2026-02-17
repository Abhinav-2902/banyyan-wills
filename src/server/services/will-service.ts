import { findWillsByUser, upsertWill } from "@/server/data/will";
import { WillDashboardDTO } from "@/types";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateWillDiff } from "@/lib/utils/will-diff";
import { CompleteWillFormData } from "@/lib/validations/will";

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
 * @param name - Optional name for the will
 * @returns The saved will record
 * @throws Error if trying to edit a finalized will
 */
export async function saveWillDraft(
  userId: string,
  data: Record<string, unknown>,
  willId?: string,
  name?: string
) {
  // Check user subscription status
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });

  if (!user) throw new Error("User not found");

  // If updating an existing will, handle permissions and versioning
  if (willId) {
    const existingWill = await prisma.will.findUnique({
      where: { id: willId, userId },
      select: { status: true, data: true },
    });

    if (!existingWill) {
      throw new Error("Will not found or you don't have permission to edit it");
    }

    const isFinalized = existingWill.status === "PAID" || existingWill.status === "COMPLETED";

    if (isFinalized) {
      // Check for dev bypass key or premium subscription
      const isDevBypass = process.env.DEV_TEST_BYPASS_KEY && process.env.DEV_TEST_BYPASS_KEY === "banyyan-dev-test-2024";
      
      if (user.subscriptionTier !== "PREMIUM" && !isDevBypass) {
        throw new Error("Cannot edit a finalized will. Upgrade to Premium to unlock editing.");
      }

      // Premium Logic: Create Version if data changed
      const oldData = existingWill.data as unknown as Partial<CompleteWillFormData>;
      const newData = data as unknown as Partial<CompleteWillFormData>;
      const diff = calculateWillDiff(oldData, newData);

      if (diff.changes.length > 0) {
        // Create a version snapshot of the PREVIOUS state
        await prisma.willVersion.create({
          data: {
            willId,
            snapshot: existingWill.data as Prisma.InputJsonValue,
            changes: diff.changes as unknown as Prisma.InputJsonValue,
            commitMsg: diff.summary,
            versionNum: await prisma.willVersion.count({ where: { willId } }) + 1
          },
        });
      }
    }
  }

  // Call DAL to upsert the will with name
  const savedWill = await upsertWill(userId, data as Prisma.InputJsonValue, willId, name);

  return savedWill;
}

/**
 * Update will status
 * @param willId - The will ID to update
 * @param status - The new status
 */
export async function updateWillStatus(
  willId: string,
  status: "DRAFT" | "PAID" | "COMPLETED"
) {
  const updatedWill = await prisma.will.update({
    where: { id: willId },
    data: { status },
  });

  return updatedWill;
}
