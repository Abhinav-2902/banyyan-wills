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
  nationality: z.string().optional(),

  // Parents Information
  fatherName: z.string().min(2, "Father's name is required"),
  fatherDateOfBirth: z.string().optional(),
  fatherAadhaar: aadhaarNumberSchema,
  fatherPan: panNumberSchema,
  motherName: z.string().min(2, "Mother's name is required"),
  motherDateOfBirth: z.string().optional(),
  motherAadhaar: aadhaarNumberSchema,
  motherPan: panNumberSchema,

  // Spouse Information (conditional)
  spouseDetails: z.object({
    fullName: z.string().min(2, "Spouse name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    aadhaarNumber: aadhaarNumberSchema,
    panNumber: panNumberSchema,
  }).optional(),

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
}).refine((data) => {
  // If married, spouse details are required
  if (data.maritalStatus === "Married" && !data.spouseDetails) {
    return false;
  }
  return true;
}, {
  message: "Spouse details are required when marital status is Married",
  path: ["spouseDetails"],
});

// ============================================
// STEP 2: WILL DETAILS (DECLARATION & SIGNING) SCHEMA
// ============================================
export const willDetailsSchema = z.object({
  soundMind: z.boolean().refine((val) => val === true, {
    message: "You must declare that you are of sound mind",
  }),
  revokePriorWills: z.boolean().refine((val) => val === true, {
    message: "You must revoke all prior wills",
  }),
  signingDate: z.string().min(1, "Date of signing is required"),
  signingPlace: z.string().min(2, "Place of signing is required"),
});

// ============================================
// STEP 3: EXECUTOR DETAILS SCHEMA
// ============================================

export const executorDetailsSchema = z.object({
  useProfessionalExecutor: z.boolean().default(false),
  
  // Primary Executor
  executor: z.string().min(2, "Primary executor name is required"),
  executorRelationship: z.string().optional(),
  executorFatherName: z.string().optional(),
  executorDateOfBirth: z.string().optional(),
  executorAadhaar: aadhaarNumberSchema,
  executorPan: panNumberSchema,
  executorCountryCode: z.string().default("+91"),
  executorPhoneNumber: mobileNumberSchema,
  executorEmail: emailSchema.or(z.literal("")).optional(),
  executorAddress: z.string().optional(),
  executorCity: z.string().optional(),
  executorState: z.string().optional(),
  executorCountry: z.string().optional(),
  executorPinCode: z.string().optional(),
  
  // Backup Executor
  backupExecutor: z.string().min(2, "Backup executor name is required"),
  backupExecutorRelationship: z.string().optional(),
  backupExecutorFatherName: z.string().optional(),
  backupExecutorDateOfBirth: z.string().optional(),
  backupExecutorAadhaar: aadhaarNumberSchema,
  backupExecutorPan: panNumberSchema,
  backupExecutorCountryCode: z.string().default("+91"),
  backupExecutorPhoneNumber: mobileNumberSchema,
  backupExecutorEmail: emailSchema.or(z.literal("")).optional(),
  backupExecutorAddress: z.string().optional(),
  backupExecutorCity: z.string().optional(),
  backupExecutorState: z.string().optional(),
  backupExecutorCountry: z.string().optional(),
  backupExecutorPinCode: z.string().optional(),
  
  // Banyyan fallback
  banyyanFallbackExecutorOptIn: z.boolean().default(true),
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

const executorPersonSchema = z.object({
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
  emailAddress: emailSchema.or(z.literal("")).optional(),
  consentObtained: z.boolean().refine(val => val === true, "Executor consent is required"),
});

export const executorInfoSchema = z.object({
  primaryExecutor: executorPersonSchema,
  hasAlternateExecutor: z.boolean(),
  alternateExecutor: executorPersonSchema.optional(),
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
  step2: willDetailsSchema,
  step3: executorDetailsSchema,
  step4: beneficiaryDistributionSchema,
  step5: guardianshipSchema,
  step6: executorInfoSchema,
  step7: additionalProvisionsSchema,
});

// ============================================
// TYPE EXPORTS
// ============================================

export type TestatorDetails = z.infer<typeof testatorDetailsSchema>;
export type WillDetails = z.infer<typeof willDetailsSchema>;
export type ExecutorDetails = z.infer<typeof executorDetailsSchema>;
export type BeneficiaryDistribution = z.infer<typeof beneficiaryDistributionSchema>;
export type Guardianship = z.infer<typeof guardianshipSchema>;
export type ExecutorInfo = z.infer<typeof executorInfoSchema>;
export type AdditionalProvisions = z.infer<typeof additionalProvisionsSchema>;
export type CompleteWillFormData = z.infer<typeof completeWillSchema>;

// Legacy exports for backward compatibility
export type WillFormData = CompleteWillFormData;
export type WillInputData = CompleteWillFormData;
