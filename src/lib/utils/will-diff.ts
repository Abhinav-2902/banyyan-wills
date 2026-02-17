import { CompleteWillFormData } from "@/lib/validations/will";
import { WillFieldValue } from "@/types/will";

export interface WillChange {
  field: string;
  step: number;
  oldValue: WillFieldValue;
  newValue: WillFieldValue;
  section: string;
}

export interface WillDiff {
  changes: WillChange[];
  summary: string;
}

// Helper to normalize values for comparison
// Treats null, undefined, "", and objects with only empty values as equivalent ("")
function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  
  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    // Recursively normalize array items
    const normalizedItems = value.map(normalizeValue).filter(v => v !== "");
    if (normalizedItems.length === 0) return "";
    return normalizedItems;
  }
  
  if (typeof value === "object") {
    // Check if it has any non-empty keys recursively
    const entries = Object.entries(value as Record<string, unknown>);
    const nonEmptyEntries: [string, unknown][] = [];
    
    for (const [key, val] of entries) {
      const normalized = normalizeValue(val);
      if (normalized !== "") {
        nonEmptyEntries.push([key, normalized]);
      }
    }
    
    if (nonEmptyEntries.length === 0) return "";
    
    // Return sorted object to ensure key order doesn't affect stringify comparison
    return Object.fromEntries(nonEmptyEntries.sort((a, b) => a[0].localeCompare(b[0])));
  }
  
  return value;
}

/**
 * Compare two will objects and return a structured diff
 */
export function calculateWillDiff(
  oldData: Partial<CompleteWillFormData> | null,
  newData: Partial<CompleteWillFormData>
): WillDiff {
  if (!oldData) {
    return {
      changes: [],
      summary: "Created initial draft",
    };
  }

  const changes: WillChange[] = [];

  // Helper to compare fields
  const compare = (
    section: string,
    step: number,
    fieldLabel: string,
    path: (d: Partial<CompleteWillFormData>) => WillFieldValue
  ) => {
    const oldVal = path(oldData);
    const newVal = path(newData);

    const normOld = normalizeValue(oldVal);
    const normNew = normalizeValue(newVal);

    if (JSON.stringify(normOld) !== JSON.stringify(normNew)) {
      changes.push({
        field: fieldLabel,
        step,
        oldValue: normOld as WillFieldValue,
        newValue: normNew as WillFieldValue,
        section
      });
    }
  };


  // Step 1: Personal Details
  compare("Personal Details", 1, "Full Name", d => d.step1?.fullName);
  compare("Personal Details", 1, "Marital Status", d => d.step1?.maritalStatus);
  compare("Personal Details", 1, "Address", d => d.step1?.residentialAddress);

  // Step 2: Declaration
  compare("Declaration", 2, "Signing Date", d => d.step2?.signingDate);
  
  // Step 3: Executors
  compare("Executors", 3, "Primary Executor", d => d.step3?.executor);
  compare("Executors", 3, "Backup Executor", d => d.step3?.backupExecutor);

  // Step 4: Dispute Resolver
  compare("Dispute Resolver", 4, "Name", d => d.step4?.disputeResolver);

  // Step 5: Witnesses
  compare("Witnesses", 5, "Witness 1", d => d.step5?.witness1?.name);
  compare("Witnesses", 5, "Witness 2", d => d.step5?.witness2?.name);

  // Step 6: Beneficiaries
  const oldBenecifiaries = (Array.isArray(oldData.step6?.beneficiaries) ? normalizeValue(oldData.step6?.beneficiaries) : []) as any[];
  const newBeneficiaries = (Array.isArray(newData.step6?.beneficiaries) ? normalizeValue(newData.step6?.beneficiaries) : []) as any[];
  
  // normalizeValue returns "" for empty arrays, so handle that
  const safeOldBen = Array.isArray(oldBenecifiaries) ? oldBenecifiaries : [];
  const safeNewBen = Array.isArray(newBeneficiaries) ? newBeneficiaries : [];

  if (safeOldBen.length !== safeNewBen.length) {
    changes.push({
      field: "Beneficiaries Count",
      step: 6,
      oldValue: safeOldBen.length,
      newValue: safeNewBen.length,
      section: "Beneficiaries"
    });
  } else {
    // Check names if count is same
    for (let i = 0; i < safeNewBen.length; i++) {
        // Safe access in case item is normalized to string/empty
        const oldItem = safeOldBen[i];
        const newItem = safeNewBen[i];
        
        const oldName = (typeof oldItem === 'object' && oldItem) ? oldItem.name : undefined;
        const newName = (typeof newItem === 'object' && newItem) ? newItem.name : undefined;
        
        if (oldName !== newName) {
             changes.push({
                field: `Beneficiary ${i+1} Name`,
                step: 6,
                oldValue: oldName,
                newValue: newName,
                section: "Beneficiaries"
            });
        }
    }
  }

  // Step 7: Charities
  const oldCharities = (Array.isArray(oldData.step7?.charities) ? normalizeValue(oldData.step7?.charities) : []) as any[];
  const newCharities = (Array.isArray(newData.step7?.charities) ? normalizeValue(newData.step7?.charities) : []) as any[];
  
  const safeOldCharities = Array.isArray(oldCharities) ? oldCharities : [];
  const safeNewCharities = Array.isArray(newCharities) ? newCharities : [];

  if (safeOldCharities.length !== safeNewCharities.length) {
    changes.push({
      field: "Charities Count",
      step: 7,
      oldValue: safeOldCharities.length,
      newValue: safeNewCharities.length,
      section: "Charities"
    });
  }

  // Step 8: Assets
  const oldAssets = (Array.isArray(oldData.step8?.assets) ? normalizeValue(oldData.step8?.assets) : []) as any[];
  const newAssets = (Array.isArray(newData.step8?.assets) ? normalizeValue(newData.step8?.assets) : []) as any[];

  const safeOldAssets = Array.isArray(oldAssets) ? oldAssets : [];
  const safeNewAssets = Array.isArray(newAssets) ? newAssets : [];

  if (safeOldAssets.length !== safeNewAssets.length) {
    changes.push({
      field: "Assets Count",
      step: 8,
      oldValue: safeOldAssets.length,
      newValue: safeNewAssets.length,
      section: "Assets"
    });
  }
  
  // Step 9: Residuary
  compare("Residuary", 9, "Distribution", d => d.step9?.distribution);

  // Step 10: Special Wishes
  compare("Special Wishes", 10, "Funeral Wish", d => d.step10?.funeralWish);
  
  // Generate Summary
  let summary = "";
  if (changes.length === 0) {
    summary = "No significant changes";
  } else if (changes.length === 1) {
    summary = `Updated ${changes[0].field}`;
  } else {
    // Group by section
    const sections = Array.from(new Set(changes.map(c => c.section)));
    if (sections.length === 1) {
        summary = `Updated ${sections[0]}`;
    } else {
        summary = `Updated ${sections[0]} and ${sections.length - 1} other sections`;
    }
  }

  return { changes, summary };
}
