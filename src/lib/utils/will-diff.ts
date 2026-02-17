import { CompleteWillFormData } from "@/lib/validations/will";

// Define locally to avoid import issues
export type WillFieldValue = string | number | boolean | null | undefined | object | unknown[];

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
  compare("Declaration", 2, "Signing Place", d => d.step2?.signingPlace);
  
  // Step 3: Executors
  compare("Executors", 3, "Primary Executor", d => d.step3?.executor);
  compare("Executors", 3, "Backup Executor", d => d.step3?.backupExecutor);

  // Step 4: Dispute Resolver
  compare("Dispute Resolver", 4, "Name", d => d.step4?.disputeResolver);

  // Step 5: Witnesses
  compare("Witnesses", 5, "Witness 1", d => d.step5?.witness1?.name);
  compare("Witnesses", 5, "Witness 2", d => d.step5?.witness2?.name);

  // Step 6: Beneficiaries (Array)
  const normOldBen = normalizeValue(oldData.step6?.beneficiaries);
  const normNewBen = normalizeValue(newData.step6?.beneficiaries);
  if (JSON.stringify(normOldBen) !== JSON.stringify(normNewBen)) {
    changes.push({
      section: "Beneficiaries",
      step: 6,
      field: "Beneficiaries List",
      oldValue: normOldBen as WillFieldValue,
      newValue: normNewBen as WillFieldValue
    });
  }

  // Step 7: Charities (Array)
  const normOldCharities = normalizeValue(oldData.step7?.charities);
  const normNewCharities = normalizeValue(newData.step7?.charities);
  if (JSON.stringify(normOldCharities) !== JSON.stringify(normNewCharities)) {
    changes.push({
      section: "Charities",
      step: 7,
      field: "Charities List",
      oldValue: normOldCharities as WillFieldValue,
      newValue: normNewCharities as WillFieldValue
    });
  }

  // Step 8: Assets (Array)
  const normOldAssets = normalizeValue(oldData.step8?.assets);
  const normNewAssets = normalizeValue(newData.step8?.assets);
  if (JSON.stringify(normOldAssets) !== JSON.stringify(normNewAssets)) {
    changes.push({
      section: "Assets",
      step: 8,
      field: "Assets List",
      oldValue: normOldAssets as WillFieldValue,
      newValue: normNewAssets as WillFieldValue
    });
  }
  
  // Step 9: Residuary Clause
  compare("Residuary Clause", 9, "Distribution", d => d.step9?.distribution);
  compare("Residuary Clause", 9, "Recipients", d => d.step9?.selectedRecipients);

  // Step 10: Special Wishes
  compare("Special Wishes", 10, "Funeral Wish", d => d.step10?.funeralWish);
  compare("Special Wishes", 10, "Other Arrangements", d => d.step10?.otherArrangements);
  
  const normOldMessages = normalizeValue(oldData.step10?.messages);
  const normNewMessages = normalizeValue(newData.step10?.messages);
  if (JSON.stringify(normOldMessages) !== JSON.stringify(normNewMessages)) {
      changes.push({
          section: "Special Wishes",
          step: 10,
          field: "Messages",
          oldValue: normOldMessages as WillFieldValue,
          newValue: normNewMessages as WillFieldValue
      });
  }

  // Step 11: Loans (Array)
  const normOldLoans = normalizeValue(oldData.step11?.accounts);
  const normNewLoans = normalizeValue(newData.step11?.accounts);
  if (JSON.stringify(normOldLoans) !== JSON.stringify(normNewLoans)) {
    changes.push({
      section: "Loans",
      step: 11,
      field: "Loan Accounts",
      oldValue: normOldLoans as WillFieldValue,
      newValue: normNewLoans as WillFieldValue
    });
  }

  // Step 12: Organ Donation
  compare("Organ Donation", 12, "Donation Choice", d => d.step12?.donationChoice);
  compare("Organ Donation", 12, "Selected Organs", d => d.step12?.selectedOrgans);
  compare("Organ Donation", 12, "Selected Tissues", d => d.step12?.selectedTissues);

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
