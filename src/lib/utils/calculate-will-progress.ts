import { CompleteWillFormData } from "@/lib/validations/will";

/**
 * Calculate the completion progress of a Will based on filled steps
 * @param data - The Will form data (partial)
 * @returns Progress percentage (0-100)
 */
export function calculateWillProgress(data: Partial<CompleteWillFormData>): number {
  let completedSteps = 0;
  // Total data steps is 12 (Step 13 is Review)
  const totalSteps = 12;

  // Step 1: Testator Details (Required)
  if (data.step1?.fullName && data.step1?.dateOfBirth) {
    completedSteps++;
  }

  // Step 2: Will Details/Declaration (Required)
  if (data.step2?.signingDate && data.step2?.signingPlace) {
    completedSteps++;
  }

  // Step 3: Executor Details (Required)
  if (data.step3?.executor) {
    completedSteps++;
  }

  // Step 4: Dispute Resolver (Optional - counts if object exists)
  if (data.step4) {
    completedSteps++;
  }

  // Step 5: Witness Details (Conditional)
  // If witnesses NOT known (default), it's valid/complete.
  // If known, requires names.
  if (data.step5) {
    if (!data.step5.witnessesKnown) {
      completedSteps++;
    } else if (data.step5.witness1?.name && data.step5.witness2?.name) {
      completedSteps++;
    }
  }

  // Step 6: Beneficiaries (Required - min 1)
  if (data.step6?.beneficiaries && data.step6.beneficiaries.length > 0) {
    completedSteps++;
  }

  // Step 7: Charities (Optional)
  if (data.step7) {
    completedSteps++;
  }

  // Step 8: Assets (Optional)
  if (data.step8) {
    completedSteps++;
  }

  // Step 9: Residuary Clause (Optional)
  if (data.step9) {
    completedSteps++;
  }

  // Step 10: Special Wishes (Optional)
  if (data.step10) {
    completedSteps++;
  }

  // Step 11: Loan Repayment (Optional)
  if (data.step11) {
    completedSteps++;
  }

  // Step 12: Organ Donation (Conditional)
  // If choice is 'specific', requires selection. Otherwise valid.
  if (data.step12) {
    if (data.step12.donationChoice !== 'specific') {
      completedSteps++;
    } else if (
      (data.step12.selectedOrgans && data.step12.selectedOrgans.length > 0) || 
      (data.step12.selectedTissues && data.step12.selectedTissues.length > 0)
    ) {
      completedSteps++;
    }
  }

  // Calculate percentage
  const progress = Math.round((completedSteps / totalSteps) * 100);
  return Math.min(100, Math.max(0, progress)); // Clamp between 0-100
}
