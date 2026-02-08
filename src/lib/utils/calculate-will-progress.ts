import { WillInputData } from "@/lib/validations/will";

/**
 * Calculate the completion progress of a Will based on filled fields
 * @param data - The Will form data
 * @returns Progress percentage (0-100)
 */
export function calculateWillProgress(data: WillInputData): number {
  let filledFields = 0;
  let totalFields = 0;

  // Personal Details (5 fields)
  totalFields += 5;
  if (data.fullName && data.fullName.trim().length >= 2) filledFields++;
  // Handle both Date and string types for DOB (data from DB might be Date)
  if (data.dob) {
    const dobValue = typeof data.dob === 'string' ? data.dob : (data.dob as unknown as Date).toISOString();
    if (dobValue && dobValue.length > 0) filledFields++;
  }
  if (data.email && data.email.trim().length > 0) filledFields++;
  if (data.phone && data.phone.trim().length >= 10) filledFields++;
  if (data.residency && data.residency.trim().length > 0) filledFields++;

  // Assets (1 field - has at least one valid asset)
  totalFields += 1;
  if (data.assets && data.assets.length > 0) {
    const hasValidAsset = data.assets.some(
      (asset) =>
        asset.type &&
        asset.description &&
        asset.description.length >= 10 &&
        asset.estimatedValue > 0
    );
    if (hasValidAsset) filledFields++;
  }

  // Beneficiaries (1 field - has beneficiaries totaling 100%)
  totalFields += 1;
  if (data.beneficiaries && data.beneficiaries.length > 0) {
    const totalPercentage = data.beneficiaries.reduce(
      (sum, b) => sum + (Number(b.percentage) || 0),
      0
    );
    const hasValidBeneficiaries = data.beneficiaries.every(
      (b) =>
        b.fullName &&
        b.fullName.length >= 2 &&
        b.relationship &&
        b.relationship.length > 0 &&
        b.percentage >= 1 &&
        b.percentage <= 100
    );
    if (hasValidBeneficiaries && totalPercentage === 100) filledFields++;
  }

  // Calculate percentage
  const progress = Math.round((filledFields / totalFields) * 100);
  return Math.min(100, Math.max(0, progress)); // Clamp between 0-100
}
