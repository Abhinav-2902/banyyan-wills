"use server";

import { auth } from "@/auth";
import { completeWillSchema, type CompleteWillFormData } from "@/lib/validations/will";
import { saveWillDraft } from "@/server/services/will-service";
import { ActionResponse, WillDashboardDTO } from "@/types";
import { revalidatePath } from "next/cache";
import { calculateWillProgress } from "@/lib/utils/calculate-will-progress";

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

    // 2. Validation using Zod schema (partial validation for drafts)
    if (typeof data !== 'object' || data === null) {
      return {
        success: false,
        error: "Invalid data format: expected object",
      };
    }

    const validationResult = completeWillSchema.partial().safeParse(data);
    let dataToSave: Partial<CompleteWillFormData> | Record<string, unknown>;

    if (!validationResult.success) {
      console.warn("Saving draft with validation warnings:", 
        JSON.stringify(validationResult.error.flatten().fieldErrors)
      );
      // Proceed with raw data for drafts
      dataToSave = data as Record<string, unknown>;
    } else {
      dataToSave = validationResult.data;
    }

    // 3. Call service layer to save the draft
    const savedWill = await saveWillDraft(
      session.user.id,
      dataToSave as Record<string, unknown>,
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
        title: "Draft Saved",
        progress: calculateWillProgress(dataToSave as unknown as CompleteWillFormData),
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

/**
 * Server Action to create a new empty Will draft
 * @param name - Optional name for the will
 * @returns ActionResponse with the new Will ID for redirection
 */
export async function createNewWillAction(name?: string): Promise<ActionResponse<{ id: string }>> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // 2. Validate name if provided
    if (name && name.length > 100) {
      return {
        success: false,
        error: "Will name must be less than 100 characters",
      };
    }

    // 3. Create empty Will with default values
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    
    const defaultWillData = {
      fullName: "",
      dob: defaultDate.toISOString().split('T')[0], // Format: YYYY-MM-DD string
      email: "",
      phone: "",
      residency: "",
      assets: [],
      beneficiaries: [],
    };

    // 4. Call service layer to create the draft with name
    const newWill = await saveWillDraft(
      session.user.id,
      defaultWillData,
      undefined, // No willId = create new
      name // Pass the name to service layer
    );

    // 5. Revalidate dashboard
    revalidatePath("/dashboard");

    // 6. Return success with the new Will ID
    return {
      success: true,
      data: {
        id: newWill.id,
      },
    };
  } catch (error) {
    console.error("Error creating new will:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create new will",
    };
  }
}

/**
 * Server Action for auto-save (no validation)
 * Allows saving incomplete/invalid data during editing
 * @param data - The will form data (may be incomplete)
 * @param willId - Will ID to update
 * @returns ActionResponse with success/error
 */
export async function autoSaveWillAction(
  data: unknown,
  willId: string
): Promise<ActionResponse<void>> {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // 2. NO VALIDATION - just save the data as-is
    // This allows auto-save to work with incomplete/invalid data
    
    // 3. Call service layer to save the draft
    await saveWillDraft(
      session.user.id,
      data as Partial<CompleteWillFormData>, // Cast without validation for auto-save
      willId
    );

    // 4. Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath(`/editor/${willId}`);

    // 5. Return success
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Error auto-saving will:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to auto-save",
    };
  }
}

/**
 * Server Action to delete a Will
 * @param willId - The Will ID to delete
 * @returns ActionResponse indicating success or failure
 */
export async function deleteWillAction(willId: string): Promise<ActionResponse<void>> {
  try {
    // 1. Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to delete a will",
      };
    }

    // 2. Import deleteWill from data layer
    const { deleteWill } = await import("@/server/data/will");

    // 3. Delete the Will
    await deleteWill(willId, session.user.id);

    // 4. Revalidate dashboard
    revalidatePath("/dashboard");

    // 5. Return success
    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error("Error deleting will:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete will",
    };
  }
}
