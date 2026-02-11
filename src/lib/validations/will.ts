import { z } from "zod";

// ============================================
// HELPER VALIDATORS
// ============================================

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

// Indian mobile number validation (10 digits)
const mobileNumberSchema = z.string()
  .regex(/^[6-9]\d{9}$/, "Mobile number must be 10 digits starting with 6-9");

// Indian PIN code validation (6 digits)
const pinCodeSchema = z.string()
  .regex(/^\d{6}$/, "PIN code must be 6 digits");

// PAN number validation
const panNumberSchema = z.string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)")
  .or(z.literal(""));

// Aadhaar number validation (12 digits)
const aadhaarNumberSchema = z.string()
  .regex(/^\d{12}$/, "Aadhaar number must be 12 digits")
  .or(z.literal(""));

// Email validation
const emailSchema = z.string().email("Invalid email address");

// ============================================
// STEP 1: TESTATOR DETAILS SCHEMA
// ============================================

export const testatorDetailsSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  fatherMotherName: z.string().min(2, "Father's/Mother's name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.number().min(18, "You must be at least 18 years old"),
  gender: z.enum(["Male", "Female", "Other"]),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed", "Separated"]),
  religion: z.string().optional(),
  occupation: z.string().optional(),
  panNumber: panNumberSchema,
  aadhaarNumber: aadhaarNumberSchema,

  // Residential Address
  residentialAddress: z.object({
    addressLine1: z.string().min(5, "Address is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pinCode: pinCodeSchema,
    country: z.string().default("India"),
    yearsAtAddress: z.number().optional(),
  }),

  // Contact Information
  contactInfo: z.object({
    mobileNumber: mobileNumberSchema,
    alternateMobileNumber: mobileNumberSchema.or(z.literal("")).optional(),
    emailAddress: emailSchema,
    alternateEmailAddress: emailSchema.or(z.literal("")).optional(),
  }),
});

// ============================================
// STEP 2: FAMILY DETAILS SCHEMA
// ============================================

const spouseDetailsSchema = z.object({
  fullName: z.string().min(2, "Spouse name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  panNumber: panNumberSchema,
  marriageDate: z.string().min(1, "Marriage date is required"),
  marriageRegistrationNumber: z.string().optional(),
  isSecondMarriage: z.boolean(),
  previousSpouseDetails: z.string().optional(),
});

const childDetailsSchema = z.object({
  fullName: z.string().min(2, "Child name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  isMinor: z.boolean(),
  relationship: z.enum(["Biological Son", "Biological Daughter", "Adopted Son", "Adopted Daughter", "Stepson", "Stepdaughter"]),
  panNumber: panNumberSchema,
  aadhaarNumber: aadhaarNumberSchema,
  currentAddress: z.string().optional(),
});

const parentDetailsSchema = z.object({
  name: z.string().min(2, "Parent name is required"),
  status: z.enum(["Alive", "Deceased"]),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

const siblingDetailsSchema = z.object({
  fullName: z.string().min(2, "Sibling name is required"),
  relationship: z.enum(["Brother", "Sister"]),
  contactDetails: z.string().optional(),
});

export const familyDetailsSchema = z.object({
  isMarried: z.boolean(),
  spouse: spouseDetailsSchema.optional(),
  hasChildren: z.boolean(),
  numberOfChildren: z.number().optional(),
  children: z.array(childDetailsSchema).optional(),
  father: parentDetailsSchema,
  mother: parentDetailsSchema,
  hasSiblings: z.boolean(),
  numberOfSiblings: z.number().optional(),
  siblings: z.array(siblingDetailsSchema).optional(),
}).refine((data) => {
  // If married, spouse details are required
  if (data.isMarried && !data.spouse) {
    return false;
  }
  return true;
}, {
  message: "Spouse details are required when married",
  path: ["spouse"],
}).refine((data) => {
  // If has children, at least one child is required
  if (data.hasChildren && (!data.children || data.children.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one child is required when you have children",
  path: ["children"],
}).refine((data) => {
  // If has siblings, at least one sibling is required
  if (data.hasSiblings && (!data.siblings || data.siblings.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one sibling is required when you have siblings",
  path: ["siblings"],
});

// ============================================
// STEP 3: ASSET DETAILS SCHEMA
// ============================================

const immovablePropertySchema = z.object({
  propertyType: z.enum(["Residential House", "Apartment/Flat", "Commercial Property", "Agricultural Land", "Plot/Land", "Ancestral Property"]),
  description: z.string().min(10, "Property description is required"),
  address: z.object({
    addressLine1: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pinCode: pinCodeSchema,
  }),
  surveyPlotNumber: z.string().optional(),
  areaSize: z.number().positive("Area size must be positive"),
  areaUnit: z.enum(["Sq. Ft.", "Sq. Meters", "Acres", "Hectares", "Guntas"]),
  ownershipType: z.enum(["Sole Owner", "Joint Owner", "Co-owner"]),
  coOwnerNames: z.string().optional(),
  sharePercentage: z.number().min(0).max(100).optional(),
  propertyDocumentNumber: z.string().optional(),
  registrationDate: z.string().optional(),
  subRegistrarOffice: z.string().optional(),
  approximateValue: z.number().optional(),
  hasLoan: z.boolean(),
  loanDetails: z.object({
    bankName: z.string(),
    loanAccountNumber: z.string().optional(),
    outstandingAmount: z.number().nullish(),
  }).optional(),
}).refine((data) => {
  // If hasLoan is false, loanDetails should not be validated
  if (!data.hasLoan) {
    return true;
  }
  // If hasLoan is true, loanDetails is optional but if present, must be valid
  return true;
}, {
  message: "Loan details validation",
});

const bankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  branchName: z.string().optional(),
  accountType: z.enum(["Savings", "Current", "Fixed Deposit", "Recurring Deposit"]),
  accountNumber: z.string().min(5, "Account number is required"),
  accountHolderType: z.enum(["Single", "Joint"]),
  jointHolderNames: z.string().optional(),
  jointHolderRelationship: z.string().optional(),
  approximateBalance: z.number().optional(),
  nomineeRegistered: z.boolean().optional(),
});

const investmentSchema = z.object({
  investmentType: z.enum(["Mutual Funds", "Stocks/Shares", "Bonds", "PPF", "NSC", "Post Office Schemes", "Insurance Policies", "EPF/PF", "Gratuity", "Other"]),
  description: z.string().min(5, "Investment description is required"),
  folioAccountPolicyNumber: z.string().optional(),
  institutionCompanyName: z.string().min(2, "Institution/Company name is required"),
  approximateValue: z.number().optional(),
  nomineeRegistered: z.boolean().optional(),
});

const vehicleSchema = z.object({
  vehicleType: z.enum(["Car", "Two-Wheeler", "Commercial Vehicle", "Other"]),
  makeModel: z.string().min(2, "Make and model is required"),
  registrationNumber: z.string().min(5, "Registration number is required"),
  yearOfPurchase: z.number().optional(),
  approximateValue: z.number().optional(),
});

const jewelryValuablesSchema = z.object({
  description: z.string().min(5, "Description is required"),
  approximateValue: z.number().optional(),
  locationStorage: z.string().optional(),
});

const businessInterestSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.enum(["Sole Proprietorship", "Partnership", "Private Limited", "LLP", "Other"]),
  ownershipPercentage: z.number().min(0).max(100),
  registrationNumber: z.string().optional(),
  businessAddress: z.string().optional(),
});

const digitalAssetSchema = z.object({
  assetTypes: z.array(z.string()),
  accessInstructions: z.string().optional(),
});

const debtSchema = z.object({
  debtType: z.enum(["Personal Loan", "Home Loan", "Vehicle Loan", "Credit Card", "Business Loan", "Other"]),
  creditorName: z.string().min(2, "Creditor name is required"),
  outstandingAmount: z.number().positive("Outstanding amount must be positive"),
  accountLoanNumber: z.string().optional(),
});

export const assetDetailsSchema = z.object({
  hasImmovableProperty: z.boolean().default(false),
  immovableProperties: z.array(immovablePropertySchema).default([]),
  hasBankAccounts: z.boolean().default(false),
  bankAccounts: z.array(bankAccountSchema).default([]),
  hasInvestments: z.boolean().default(false),
  investments: z.array(investmentSchema).default([]),
  hasVehicles: z.boolean().default(false),
  vehicles: z.array(vehicleSchema).default([]),
  hasJewelryValuables: z.boolean().default(false),
  jewelryValuables: jewelryValuablesSchema.optional(),
  hasBusinessInterests: z.boolean().default(false),
  businessInterests: z.array(businessInterestSchema).default([]),
  hasDigitalAssets: z.boolean().default(false),
  digitalAssets: digitalAssetSchema.optional(),
  hasDebts: z.boolean().default(false),
  debts: z.array(debtSchema).default([]),
}).refine((data) => {
  if (data.hasImmovableProperty && data.immovableProperties.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Please add at least one property or uncheck 'Do you have immovable property'",
  path: ["immovableProperties"],
}).refine((data) => {
  if (data.hasBankAccounts && data.bankAccounts.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Please add at least one bank account or uncheck 'Do you have bank accounts'",
  path: ["bankAccounts"],
}).refine((data) => {
  if (data.hasInvestments && data.investments.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Please add at least one investment or uncheck 'Do you have investments'",
  path: ["investments"],
}).refine((data) => {
  if (data.hasVehicles && data.vehicles.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Please add at least one vehicle or uncheck 'Do you have vehicles'",
  path: ["vehicles"],
}).refine((data) => {
  if (data.hasBusinessInterests && data.businessInterests.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Please add at least one business interest or uncheck 'Do you have business interests'",
  path: ["businessInterests"],
}).refine((data) => {
  if (data.hasDebts && data.debts.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Please add at least one debt or uncheck 'Do you have debts'",
  path: ["debts"],
});

// ============================================
// STEP 4: BENEFICIARIES & DISTRIBUTION SCHEMA
// ============================================

const beneficiarySchema = z.object({
  fullName: z.string().min(2, "Beneficiary name is required"),
  relationship: z.enum(["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Grandson", "Granddaughter", "Friend", "Charity/Trust", "Other"]),
  dateOfBirth: z.string().optional(),
  isMinor: z.boolean().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  panNumber: panNumberSchema,
  aadhaarNumber: aadhaarNumberSchema,
  address: z.object({
    addressLine1: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pinCode: pinCodeSchema,
  }),
  mobileNumber: mobileNumberSchema.optional(),
  emailAddress: emailSchema.optional(),
  sharePercentage: z.number().min(0, "Must be positive").max(100, "Cannot exceed 100%"),
  specificAssets: z.string().optional(),
});

const conditionalBequestSchema = z.object({
  beneficiaryName: z.string().min(2, "Beneficiary name is required"),
  conditionDescription: z.string().min(10, "Condition description is required"),
  alternativeBeneficiary: z.string().optional(),
});

export const beneficiaryDistributionSchema = z.object({
  beneficiaries: z.array(beneficiarySchema).min(1, "At least one beneficiary is required"),
  distributionType: z.enum(["Equal distribution", "Percentage-based", "Specific asset allocation", "Combination"]),
  totalPercentage: z.number(),
  conditionalBequests: z.array(conditionalBequestSchema).optional(),
  residuaryBeneficiary: z.object({
    name: z.string(),
    relationship: z.string(),
  }).optional(),
}).refine((data) => {
  const total = data.beneficiaries.reduce((sum, b) => {
    // Handle potential NaN or undefined values
    const share = typeof b.sharePercentage === 'number' && !isNaN(b.sharePercentage) 
      ? b.sharePercentage 
      : 0;
    return sum + share;
  }, 0);
  
  // Allow small floating point error (e.g. 99.99 or 100.01)
  return Math.abs(total - 100) < 0.1;
}, {
  message: "Total beneficiary allocation must equal exactly 100%",
  path: ["totalPercentage"],
});

// ============================================
// STEP 5: GUARDIANSHIP SCHEMA
// ============================================

const guardianDetailsSchema = z.object({
  fullName: z.string().min(2, "Guardian name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  mobileNumber: mobileNumberSchema,
  emailAddress: emailSchema.or(z.literal("")).optional(),
  occupation: z.string().optional(),
  consentObtained: z.boolean().refine(val => val === true, "Guardian consent is required"),
});

export const guardianshipSchema = z.object({
  hasMinorChildren: z.boolean(),
  primaryGuardian: guardianDetailsSchema.optional(),
  alternateGuardian: guardianDetailsSchema.optional(),
  separatePropertyGuardian: z.boolean().optional(),
  propertyGuardian: guardianDetailsSchema.optional(),
  specialInstructions: z.object({
    childCare: z.string().optional(),
    educationPreferences: z.string().optional(),
    religiousCulturalUpbringing: z.string().optional(),
  }).optional(),
}).refine((data) => {
  // If has minor children, primary guardian is required
  if (data.hasMinorChildren && !data.primaryGuardian) {
    return false;
  }
  return true;
}, {
  message: "Primary guardian is required when there are minor children",
  path: ["primaryGuardian"],
});

// ============================================
// STEP 6: EXECUTOR DETAILS SCHEMA
// ============================================

const executorDetailsSchema = z.object({
  fullName: z.string().min(2, "Executor name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.number().min(18, "Executor must be at least 18 years old"),
  occupation: z.string().optional(),
  panNumber: panNumberSchema,
  address: z.object({
    addressLine1: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pinCode: pinCodeSchema,
  }),
  mobileNumber: mobileNumberSchema,
  emailAddress: emailSchema.optional(),
  consentObtained: z.boolean().refine(val => val === true, "Executor consent is required"),
});

export const executorInfoSchema = z.object({
  primaryExecutor: executorDetailsSchema,
  hasAlternateExecutor: z.boolean(),
  alternateExecutor: executorDetailsSchema.optional(),
  powers: z.object({
    canSellProperty: z.boolean(),
    canManageInvestments: z.boolean(),
    canSettleDebts: z.boolean(),
    canDistributeAssets: z.boolean(),
  }),
  remuneration: z.enum(["No remuneration", "Fixed amount", "Percentage of estate", "As per legal provisions"]).optional(),
  remunerationAmount: z.number().optional(),
});

// ============================================
// STEP 7: ADDITIONAL PROVISIONS SCHEMA
// ============================================

const witnessDetailsSchema = z.object({
  fullName: z.string().min(2, "Witness name is required"),
  address: z.string().min(5, "Address is required"),
  occupation: z.string().optional(),
  age: z.number().min(18, "Witness must be at least 18 years old"),
  relationship: z.string().min(2, "Relationship is required"),
});

export const additionalProvisionsSchema = z.object({
  hasPreviousWill: z.boolean(),
  previousWillDate: z.string().optional(),
  revokeAllPreviousWills: z.boolean(),
  funeralInstructions: z.string().optional(),
  burialCremationPreference: z.string().optional(),
  religiousCeremonyPreferences: z.string().optional(),
  organDonationWishes: z.string().optional(),
  assetDistributionInstructions: z.string().optional(),
  businessContinuationInstructions: z.string().optional(),
  petCareInstructions: z.string().optional(),
  charitableDonations: z.string().optional(),
  witness1: witnessDetailsSchema,
  witness2: witnessDetailsSchema,
  placeOfExecution: z.string().min(2, "Place of execution is required"),
  dateOfExecution: z.string().min(1, "Date of execution is required"),
  soundMindDeclaration: z.boolean().refine(val => val === true, "Sound mind declaration is required"),
  noUndueInfluenceDeclaration: z.boolean().refine(val => val === true, "No undue influence declaration is required"),
  understandingDeclaration: z.boolean().refine(val => val === true, "Understanding declaration is required"),
  testatorSignature: z.string().optional(),
  witness1Signature: z.string().optional(),
  witness2Signature: z.string().optional(),
  signingTimestamp: z.string().optional(),
  ipAddress: z.string().optional(),
});

// ============================================
// COMPLETE WILL FORM SCHEMA
// ============================================

export const completeWillSchema = z.object({
  step1: testatorDetailsSchema,
  step2: familyDetailsSchema,
  step3: assetDetailsSchema,
  step4: beneficiaryDistributionSchema,
  step5: guardianshipSchema,
  step6: executorInfoSchema,
  step7: additionalProvisionsSchema,
});

// ============================================
// TYPE EXPORTS
// ============================================

export type TestatorDetails = z.infer<typeof testatorDetailsSchema>;
export type FamilyDetails = z.infer<typeof familyDetailsSchema>;
export type AssetDetails = z.infer<typeof assetDetailsSchema>;
export type BeneficiaryDistribution = z.infer<typeof beneficiaryDistributionSchema>;
export type Guardianship = z.infer<typeof guardianshipSchema>;
export type ExecutorInfo = z.infer<typeof executorInfoSchema>;
export type AdditionalProvisions = z.infer<typeof additionalProvisionsSchema>;
export type CompleteWillFormData = z.infer<typeof completeWillSchema>;

// Legacy exports for backward compatibility
export type WillFormData = CompleteWillFormData;
export type WillInputData = CompleteWillFormData;
