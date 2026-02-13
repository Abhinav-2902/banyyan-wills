// Comprehensive TypeScript types for Indian Will Form

// ============================================
// STEP 1: TESTATOR DETAILS
// ============================================

export interface TestatorDetails {
  // Personal Information
  fullName: string;
  fatherMotherName: string;
  dateOfBirth: string; // ISO date string
  age: number; // Auto-calculated
  gender: "Male" | "Female" | "Other";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed" | "Separated";
  religion?: string;
  occupation?: string;
  panNumber?: string;
  aadhaarNumber?: string;

  // Residential Address
  residentialAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    yearsAtAddress?: number;
  };

  // Contact Information
  contactInfo: {
    mobileNumber: string;
    alternateMobileNumber?: string;
    emailAddress: string;
    alternateEmailAddress?: string;
  };
}

// ============================================
// STEP 2: WILL DETAILS (DECLARATION & SIGNING)
// ============================================

export interface WillDetails {
  soundMind: boolean;
  revokePriorWills: boolean;
  signingDate: string;
  signingPlace: string;
}

// ============================================
// STEP 3: ASSET DETAILS
// ============================================

export interface ImmovableProperty {
  propertyType: "Residential House" | "Apartment/Flat" | "Commercial Property" | "Agricultural Land" | "Plot/Land" | "Ancestral Property";
  description: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    pinCode: string;
  };
  surveyPlotNumber?: string;
  areaSize: number;
  areaUnit: "Sq. Ft." | "Sq. Meters" | "Acres" | "Hectares" | "Guntas";
  ownershipType: "Sole Owner" | "Joint Owner" | "Co-owner";
  coOwnerNames?: string;
  sharePercentage?: number;
  propertyDocumentNumber?: string;
  registrationDate?: string;
  subRegistrarOffice?: string;
  approximateValue?: number;
  hasLoan: boolean;
  loanDetails?: {
    bankName: string;
    loanAccountNumber?: string;
    outstandingAmount?: number;
  };
}

export interface BankAccount {
  bankName: string;
  branchName?: string;
  accountType: "Savings" | "Current" | "Fixed Deposit" | "Recurring Deposit";
  accountNumber: string;
  accountHolderType: "Single" | "Joint";
  jointHolderNames?: string;
  jointHolderRelationship?: string;
  approximateBalance?: number;
  nomineeRegistered?: boolean;
}

export interface Investment {
  investmentType: "Mutual Funds" | "Stocks/Shares" | "Bonds" | "PPF" | "NSC" | "Post Office Schemes" | "Insurance Policies" | "EPF/PF" | "Gratuity" | "Other";
  description: string;
  folioAccountPolicyNumber?: string;
  institutionCompanyName: string;
  approximateValue?: number;
  nomineeRegistered?: boolean;
}

export interface Vehicle {
  vehicleType: "Car" | "Two-Wheeler" | "Commercial Vehicle" | "Other";
  makeModel: string;
  registrationNumber: string;
  yearOfPurchase?: number;
  approximateValue?: number;
}

export interface JewelryValuables {
  description: string;
  approximateValue?: number;
  locationStorage?: string;
}

export interface BusinessInterest {
  businessName: string;
  businessType: "Sole Proprietorship" | "Partnership" | "Private Limited" | "LLP" | "Other";
  ownershipPercentage: number;
  registrationNumber?: string;
  businessAddress?: string;
}

export interface DigitalAsset {
  assetTypes: string[]; // Cryptocurrency, Domain Names, etc.
  accessInstructions?: string;
}

export interface Debt {
  debtType: "Personal Loan" | "Home Loan" | "Vehicle Loan" | "Credit Card" | "Business Loan" | "Other";
  creditorName: string;
  outstandingAmount: number;
  accountLoanNumber?: string;
}

export interface AssetDetails {
  // Immovable Property
  hasImmovableProperty: boolean;
  immovableProperties?: ImmovableProperty[];

  // Bank Accounts
  hasBankAccounts: boolean;
  bankAccounts?: BankAccount[];

  // Investments
  hasInvestments: boolean;
  investments?: Investment[];

  // Vehicles
  hasVehicles: boolean;
  vehicles?: Vehicle[];

  // Jewelry & Valuables
  hasJewelryValuables: boolean;
  jewelryValuables?: JewelryValuables;

  // Business Interests
  hasBusinessInterests: boolean;
  businessInterests?: BusinessInterest[];

  // Digital Assets
  hasDigitalAssets: boolean;
  digitalAssets?: DigitalAsset;

  // Liabilities
  hasDebts: boolean;
  debts?: Debt[];
}

// ============================================
// STEP 4: BENEFICIARIES & DISTRIBUTION
// ============================================

export interface Beneficiary {
  fullName: string;
  relationship: "Spouse" | "Son" | "Daughter" | "Father" | "Mother" | "Brother" | "Sister" | "Grandson" | "Granddaughter" | "Friend" | "Charity/Trust" | "Other";
  dateOfBirth?: string;
  isMinor?: boolean;
  gender: "Male" | "Female" | "Other";
  panNumber?: string;
  aadhaarNumber?: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    pinCode: string;
  };
  mobileNumber?: string;
  emailAddress?: string;
  sharePercentage: number;
  specificAssets?: string;
}

export interface ConditionalBequest {
  beneficiaryName: string;
  conditionDescription: string;
  alternativeBeneficiary?: string;
}

export interface BeneficiaryDistribution {
  beneficiaries: Beneficiary[];
  distributionType: "Equal distribution" | "Percentage-based" | "Specific asset allocation" | "Combination";
  totalPercentage: number; // Must equal 100
  conditionalBequests?: ConditionalBequest[];
  residuaryBeneficiary?: {
    name: string;
    relationship: string;
  };
}

// ============================================
// STEP 5: GUARDIANSHIP
// ============================================

export interface GuardianDetails {
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  address: string;
  mobileNumber: string;
  emailAddress?: string;
  occupation?: string;
  consentObtained: boolean;
}

export interface Guardianship {
  hasMinorChildren: boolean; // Auto-detected
  primaryGuardian?: GuardianDetails;
  alternateGuardian?: GuardianDetails;
  separatePropertyGuardian?: boolean;
  propertyGuardian?: GuardianDetails;
  specialInstructions?: {
    childCare?: string;
    educationPreferences?: string;
    religiousCulturalUpbringing?: string;
  };
}

// ============================================
// STEP 6: EXECUTOR DETAILS
// ============================================

export interface ExecutorDetails {
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  age: number;
  occupation?: string;
  panNumber?: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    pinCode: string;
  };
  mobileNumber: string;
  emailAddress?: string;
  consentObtained: boolean;
}

export interface ExecutorInfo {
  primaryExecutor: ExecutorDetails;
  hasAlternateExecutor: boolean;
  alternateExecutor?: ExecutorDetails;
  powers: {
    canSellProperty: boolean;
    canManageInvestments: boolean;
    canSettleDebts: boolean;
    canDistributeAssets: boolean;
  };
  remuneration?: "No remuneration" | "Fixed amount" | "Percentage of estate" | "As per legal provisions";
  remunerationAmount?: number;
}

// ============================================
// STEP 7: ADDITIONAL PROVISIONS
// ============================================

export interface WitnessDetails {
  fullName: string;
  address: string;
  occupation?: string;
  age: number;
  relationship: string; // Cannot be beneficiary
}

export interface AdditionalProvisions {
  // Revocation
  hasPreviousWill: boolean;
  previousWillDate?: string;
  revokeAllPreviousWills: boolean;

  // Funeral & Last Rites
  funeralInstructions?: string;
  burialCremationPreference?: string;
  religiousCeremonyPreferences?: string;
  organDonationWishes?: string;

  // Special Instructions
  assetDistributionInstructions?: string;
  businessContinuationInstructions?: string;
  petCareInstructions?: string;
  charitableDonations?: string;

  // Witnesses
  witness1: WitnessDetails;
  witness2: WitnessDetails;

  // Declarations
  placeOfExecution: string;
  dateOfExecution: string;
  soundMindDeclaration: boolean;
  noUndueInfluenceDeclaration: boolean;
  understandingDeclaration: boolean;

  // Digital Signatures
  testatorSignature?: string;
  witness1Signature?: string;
  witness2Signature?: string;
  signingTimestamp?: string;
  ipAddress?: string;
}

// ============================================
// COMPLETE WILL FORM DATA
// ============================================

export interface WillFormData {
  step1: TestatorDetails;
  step2: WillDetails;
  step3: AssetDetails;
  step4: BeneficiaryDistribution;
  step5: Guardianship;
  step6: ExecutorInfo;
  step7: AdditionalProvisions;
}

// ============================================
// FORM STATE & METADATA
// ============================================

export interface WillFormState {
  currentStep: number;
  completedSteps: number[];
  formData: Partial<WillFormData>;
  lastSaved?: string;
  isDraft: boolean;
}
