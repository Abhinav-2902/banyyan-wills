"use server";

import { auth } from "@/auth";
import { willSchema } from "@/lib/validations/will";
import { saveWillDraft } from "@/server/services/will-service";
import { ActionResponse, WillDashboardDTO } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Server Action to save a will draft
 * @param data - The will form data
 * @param willId - Optional will ID for updates
 * @returns ActionResponse with the saved will or error details
 */
export async function saveWillAction(
  data: unknown,
  willId?: string
): Promise<ActionResponse<WillDashboardDTO>> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // 2. Validation using Zod schema
    const validationResult = willSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    // 3. Call service layer to save the draft
    const savedWill = await saveWillDraft(
      session.user.id,
      validationResult.data,
      willId
    );

    // 4. Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath(`/editor/${savedWill.id}`);

    // 5. Return success with the saved will data
    return {
      success: true,
      data: {
        id: savedWill.id,
        status: savedWill.status as WillDashboardDTO["status"],
        lastEdited: savedWill.updatedAt,
        title: "Draft Saved", // Will be extracted from data in real implementation
        progress: 10,
      },
    };
  } catch (error) {
    console.error("Error saving will draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save draft",
    };
  }
}
