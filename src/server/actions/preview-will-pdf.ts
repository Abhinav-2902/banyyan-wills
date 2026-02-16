"use server";

import { requireAuth } from "@/server/actions/require-auth";
import { findWillById } from "@/server/data/will";
import { generateWillPDFBase64 } from "@/lib/pdf/generate-will-pdf";
import { completeWillSchema } from "@/lib/validations/will";

export async function previewWillPDFAction(willId: string) {
  try {
    // 1. Authenticate user
    const session = await requireAuth();

    // 2. Fetch will data
    const will = await findWillById(willId);

    if (!will) {
      return {
        success: false,
        error: "Will not found",
      };
    }

    // 3. Authorization check - only owner can preview
    if (will.userId !== session.user.id) {
      return {
        success: false,
        error: "Unauthorized: You can only preview your own wills",
      };
    }

    // 4. Validate will data
    // For preview, we use safeParse but we might want to be more lenient in the future
    // For now, let's see what the validation errors are
    const validationResult = completeWillSchema.safeParse(will.data);
    
    if (!validationResult.success) {
      // Format validation errors into a readable list
      const errorDetails = validationResult.error.issues
        .map(issue => `- ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');

      return {
        success: false,
        error: `Incomplete data for PDF generation:\n${errorDetails}`,
      };
    }

    // 5. Generate PDF (without updating status)
    console.log(`Generating PDF preview for willId: ${willId}`);
    const pdfBase64 = await generateWillPDFBase64(validationResult.data);

    // 7. Return PDF as base64
    return {
      success: true,
      pdfBase64,
    };
  } catch (error) {
    console.error("Error in previewWillPDFAction for willId:", willId, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate preview",
    };
  }
}
