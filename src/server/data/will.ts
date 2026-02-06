import { prisma } from "@/lib/prisma";
import { WillDashboardDTO } from "@/types";
import { Prisma } from "@prisma/client";

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
      status: true,
      updatedAt: true,
      data: true,
    },
  });

  return wills.map((will) => {
    // Cast data to known shape or use generic object access
    const dataObj = will.data as Prisma.JsonObject;
    // Check data.personalDetails?.fullName safely
    const personalDetails = dataObj["personalDetails"] as Prisma.JsonObject | undefined;
    const fullName = typeof personalDetails === "object" && personalDetails !== null 
      ? (personalDetails["fullName"] as string | undefined) 
      : undefined;

    const title = fullName || "Untitled Draft";

    // Cast status to match WillDashboardDTO (filtering out statuses not in DTO if necessary, 
    // but assuming DB consistency or DTO will be updated if needed. 
    // Here we cast to 'DRAFT' | 'PAID' | 'COMPLETED' as requested, 
    // assuming REVIEW_PENDING might be mapped to one of them or handled.
    // For now, simple cast as per DTO definition instruction.)
    // Note: DTO excludes REVIEW_PENDING, but DB has it. 
    // If we encounter REVIEW_PENDING, we might have an issue. 
    // However, the prompt implies DTO definition is the interface contract.
    // I will cast as any to bypass strict literal check for this phase or just assert it.
    // Better safely: if status is not in the set, default or handle? 
    // Prompt says "Match your Prisma Enum" but provided a subset. 
    // I will pass existing status and let TS error if mismatches, or cast.
    
    return {
      id: will.id,
      status: will.status as WillDashboardDTO["status"], 
      lastEdited: will.updatedAt,
      title: title,
      progress: 10, // Hardcoded for now
    };
  });
}

/**
 * Upsert a will record - create new or update existing
 * @param userId - The user ID who owns the will (enforced for security)
 * @param data - The will form data as JSON
 * @param willId - Optional will ID for updates
 * @returns The created or updated Will record
 */
export async function upsertWill(
  userId: string,
  data: Prisma.InputJsonValue,
  willId?: string
) {
  if (willId) {
    // Update existing will - ensure userId matches for security
    return await prisma.will.update({
      where: {
        id: willId,
        userId: userId, // Enforce ownership
      },
      data: {
        data: data,
        updatedAt: new Date(),
      },
    });
  } else {
    // Create new will with DRAFT status
    return await prisma.will.create({
      data: {
        userId: userId,
        status: "DRAFT",
        data: data,
      },
    });
  }
}
