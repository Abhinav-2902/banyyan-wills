export interface DashboardBeneficiary {
  id: string;
  fullName: string;
  relationship: string;
  name?: string; 
  charityName?: string; // Optional to allow property access on union types in components
}

export interface DashboardCharity {
  id: string;
  charityName: string;
  name?: string;
  fullName?: string; // Optional to allow property access on union types in components
  relationship?: string; // Optional to allow property access on union types in components
}

export interface DashboardAssetDetails {
  address?: string; // Property
  bankName?: string; // Bank Account
  accountNumber?: string; // Bank Account / Investment
  institution?: string; // Investment
  name?: string; // General
  description?: string; // General
  vehicleType?: string; // Vehicle
  registrationNumber?: string; // Vehicle
}

export interface DashboardAsset {
  type: string;
  details?: DashboardAssetDetails;
  distribution?: {
    [recipientId: string]: number; // recipientId -> percentage
  };
}

export interface RecipientAsset {
  type: string;
  percentage: number;
  details: DashboardAssetDetails;
}

export interface RecipientData {
  assets: RecipientAsset[];
  genericPercentage: number;
}

export interface DashboardWillData {
  assets: DashboardAsset[];
  beneficiaries: DashboardBeneficiary[];
  charities: DashboardCharity[];
  genericAssetDistribution?: {
    [recipientId: string]: number;
  };
}
