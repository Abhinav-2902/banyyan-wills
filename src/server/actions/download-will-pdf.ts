"use server";

import { requireAuth } from "@/server/actions/require-auth";
import { findWillById } from "@/server/data/will";
import { updateWillStatus } from "@/server/services/will-service";
import { generateWillPDFBase64 } from "@/lib/pdf/generate-will-pdf";
import { completeWillSchema } from "@/lib/validations/will";

export async function downloadWillPDFAction(willId: string) {
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

    // 3. Authorization check - only owner can download
    if (will.userId !== session.user.id) {
      return {
        success: false,
        error: "Unauthorized: You can only download your own wills",
      };
    }

    // 4. Validate that all 7 steps are complete
    const validationResult = completeWillSchema.safeParse(will.data);
    
    if (!validationResult.success) {
      // Format validation errors into a readable list
      const errorDetails = validationResult.error.issues
        .map(issue => `- ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');

      return {
        success: false,
        error: `Will is incomplete. Please fix the following errors:\n${errorDetails}`,
      };
    }

    // 5. Generate PDF
    const pdfBase64 = await generateWillPDFBase64(validationResult.data);

    // 6. Mark will as COMPLETED
    await updateWillStatus(willId, "COMPLETED");

    // 7. Return PDF as base64
    return {
      success: true,
      pdfBase64,
      filename: `Will_${validationResult.data.step1?.fullName || 'Document'}_${new Date().toISOString().split('T')[0]}.pdf`,
    };
  } catch (error) {
    console.error("Error in downloadWillPDFAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate PDF",
    };
  }
}
