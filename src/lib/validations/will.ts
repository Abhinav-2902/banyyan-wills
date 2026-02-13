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
// STEP 4: DISPUTE RESOLVER SCHEMA
// ============================================

export const disputeResolverSchema = z.object({
  // All fields are optional but recommended
  disputeResolver: z.string().optional(),
  disputeResolverRelation: z.string().optional(),
  disputeResolverFather: z.string().optional(),
  disputeResolverNationality: z.string().optional(),
  disputeResolverAadhaar: aadhaarNumberSchema,
  disputeResolverPan: panNumberSchema,
  disputeResolverPhoneCountryCode: z.string().default("+91"),
  disputeResolverPhoneNumber: z.string().optional(),
  disputeResolverEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  disputeResolverAddress: z.string().optional(),
  disputeResolverCity: z.string().optional(),
  disputeResolverState: z.string().optional(),
  disputeResolverCountry: z.string().optional(),
  disputeResolverZipCode: z.string().optional(),
});

// ============================================
// STEP 5: WITNESS DETAILS SCHEMA
// ============================================

const witnessSchema = z.object({
  name: z.string().optional(),
  aadhaar: aadhaarNumberSchema,
  phoneCountryCode: z.string().default("+91"),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  father: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

export const witnessDetailsSchema = z.object({
  witnessesKnown: z.boolean().default(false),
  witness1: witnessSchema.optional(),
  witness2: witnessSchema.optional(),
});

// ============================================
// STEP 6: BENEFICIARIES SCHEMA
// ============================================

const beneficiarySchema = z.object({
  name: z.string().min(2, "Beneficiary name is required"),
  relation: z.string().min(2, "Relation is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.string().optional(), // Auto-calculated, stored as string
  pan: panNumberSchema,
  aadhaar: aadhaarNumberSchema,
  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
}).refine((data) => {
  // If age is less than 18, guardian fields are required
  const age = parseInt(data.age || "0");
  if (age < 18 && age > 0) {
    return !!data.guardianName && !!data.guardianRelation;
  }
  return true;
}, {
  message: "Guardian information is required for beneficiaries under 18",
  path: ["guardianName"],
});

export const beneficiariesSchema = z.object({
  beneficiaries: z.array(beneficiarySchema).min(1, "At least one beneficiary is required"),
});

// ============================================
// STEP 7: CHARITY DONATIONS SCHEMA
// ============================================

const charitySchema = z.object({
  name: z.string().min(2, "Charity name is required"),
  identificationNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

export const charitiesSchema = z.object({
  charities: z.array(charitySchema).optional().default([]),
});

// ============================================
// COMPLETE WILL FORM SCHEMA
// ============================================

export const completeWillSchema = z.object({
  step1: testatorDetailsSchema,
  step2: willDetailsSchema,
  step3: executorDetailsSchema,
  step4: disputeResolverSchema,
  step5: witnessDetailsSchema,
  step6: beneficiariesSchema,
  step7: charitiesSchema,
});

// ============================================
// TYPE EXPORTS
// ============================================

export type TestatorDetails = z.infer<typeof testatorDetailsSchema>;
export type WillDetails = z.infer<typeof willDetailsSchema>;
export type ExecutorDetails = z.infer<typeof executorDetailsSchema>;
export type DisputeResolver = z.infer<typeof disputeResolverSchema>;
export type WitnessDetails = z.infer<typeof witnessDetailsSchema>;
export type Beneficiaries = z.infer<typeof beneficiariesSchema>;
export type Charities = z.infer<typeof charitiesSchema>;
export type CompleteWillFormData = z.infer<typeof completeWillSchema>;

// Legacy exports for backward compatibility
export type WillFormData = CompleteWillFormData;
export type WillInputData = CompleteWillFormData;
