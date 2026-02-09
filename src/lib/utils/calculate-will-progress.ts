import { CompleteWillFormData } from "@/lib/validations/will";

/**
 * Calculate the completion progress of a Will based on filled steps
 * @param data - The Will form data (partial)
 * @returns Progress percentage (0-100)
 */
export function calculateWillProgress(data: Partial<CompleteWillFormData>): number {
  let completedSteps = 0;
  const totalSteps = 7;

  // Step 1: Testator Details
  if (data.step1?.fullName && data.step1?.dateOfBirth && data.step1?.residentialAddress?.city) {
    completedSteps++;
  }

  // Step 2: Family Details
  if (data.step2?.father && data.step2?.mother) {
    completedSteps++;
  }

  // Step 3: Asset Details
  if (data.step3) {
    completedSteps++;
  }

  // Step 4: Beneficiaries
  if (data.step4?.beneficiaries && data.step4.beneficiaries.length > 0) {
    const totalPercentage = data.step4.beneficiaries.reduce(
      (sum, b) => sum + (b.sharePercentage || 0),
      0
    );
    if (totalPercentage === 100) {
      completedSteps++;
    }
  }

  // Step 5: Guardianship (conditional - only if has minor children)
  if (data.step5?.hasMinorChildren === false || data.step5?.primaryGuardian) {
    completedSteps++;
  }

  // Step 6: Executor
  if (data.step6?.primaryExecutor) {
    completedSteps++;
  }

  // Step 7: Additional Provisions
  if (data.step7?.witness1 && data.step7?.witness2 && data.step7?.placeOfExecution) {
    completedSteps++;
  }

  // Calculate percentage
  const progress = Math.round((completedSteps / totalSteps) * 100);
  return Math.min(100, Math.max(0, progress)); // Clamp between 0-100
}
