import { prisma } from "@/lib/prisma";
import { WillDashboardDTO } from "@/types";
import { Prisma } from "@prisma/client";
import { calculateWillProgress } from "@/lib/utils/calculate-will-progress";
import { CompleteWillFormData } from "@/lib/validations/will";

export async function findWillsByUser(userId: string): Promise<WillDashboardDTO[]> {
  const wills = await prisma.will.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true, // Include the name field
      status: true,
      updatedAt: true,
      data: true,
    },
  });

  return wills.map((will) => {
    // Use the will name if available, otherwise fall back to "Untitled Draft"
    const title = will.name || "Untitled Draft";
    
    return {
      id: will.id,
      status: will.status as WillDashboardDTO["status"], 
      lastEdited: will.updatedAt,
      title: title,
      progress: calculateWillProgress(will.data as Partial<CompleteWillFormData>),
    };
  });
}

/**
 * Upsert a will record - create new or update existing
 * @param userId - The user ID who owns the will (enforced for security)
 * @param data - The will form data as JSON
 * @param willId - Optional will ID for updates
 * @param name - Optional name for the will
 * @returns The created or updated Will record
 */
export async function upsertWill(
  userId: string,
  data: Prisma.InputJsonValue,
  willId?: string,
  name?: string
) {
  if (willId) {
    // Update existing will - ensure userId matches for security
    const updateData: Prisma.WillUpdateInput = {
      data: data,
      updatedAt: new Date(),
    };
    
    // Only update name if provided
    if (name !== undefined) {
      updateData.name = name;
    }
    
    return await prisma.will.update({
      where: {
        id: willId,
        userId: userId, // Enforce ownership
      },
      data: updateData,
    });
  } else {
    // Create new will with DRAFT status
    return await prisma.will.create({
      data: {
        userId: userId,
        status: "DRAFT",
        data: data,
        name: name, // Include name when creating
      },
    });
  }
}

/**
 * Find a single Will by ID
 * @param willId - The Will ID to fetch
 * @param userId - Optional user ID to enforce ownership
 * @returns The Will record or null if not found
 */
export async function findWillById(willId: string, userId?: string) {
  return await prisma.will.findFirst({
    where: {
      id: willId,
      ...(userId && { userId }), // Only include userId filter if provided
    },
  });
}

/**
 * Delete a Will by ID
 * @param willId - The Will ID to delete
 * @param userId - The user ID who owns the Will
 * @throws Error if Will not found, not owned by user, or is finalized
 */
export async function deleteWill(willId: string, userId: string) {
  // Verify ownership and status
  const will = await prisma.will.findUnique({
    where: { id: willId, userId },
    select: { status: true },
  });

  if (!will) {
    throw new Error("Will not found or you don't have permission to delete it");
  }

  if (will.status === "PAID" || will.status === "COMPLETED") {
    throw new Error("Cannot delete a finalized will");
  }

  // Delete the Will
  await prisma.will.delete({
    where: { id: willId, userId },
  });
}
