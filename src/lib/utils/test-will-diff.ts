
import { calculateWillDiff } from "./will-diff";
import { CompleteWillFormData, TestatorDetails, Beneficiaries } from "@/lib/validations/will";

type Beneficiary = Beneficiaries["beneficiaries"][number];


// Helper to create minimal valid TestatorDetails
const createTestator = (overrides: Partial<TestatorDetails> = {}): TestatorDetails => ({
  fullName: "John Doe",
  fatherMotherName: "Father Name",
  dateOfBirth: "1980-01-01",
  age: 44,
  gender: "Male" as const,
  maritalStatus: "Single" as const,
  residentialAddress: {
    addressLine1: "123 Main St",
    city: "City",
    state: "State",
    pinCode: "123456",
    country: "India"
  },
  contactInfo: {
    mobileNumber: "9876543210",
    emailAddress: "john@example.com"
  },
  fatherName: "Father",
  motherName: "Mother",
  fatherAadhaar: "123456789012",
  fatherPan: "ABCDE1234F",
  motherAadhaar: "123456789012",
  motherPan: "ABCDE1234F",
  panNumber: "ABCDE1234F",
  aadhaarNumber: "123456789012",
  ...overrides
});

// Helper to create minimal valid Beneficiary
const createBeneficiary = (overrides: Partial<Beneficiary> = {}): Beneficiary => ({
  name: "Ben Name",
  relation: "Son",
  dateOfBirth: "2010-01-01",
  pan: "ABCDE1234F",
  aadhaar: "123456789012",
  ...overrides
});

const oldData: Partial<CompleteWillFormData> = {
  step1: createTestator(),
  step6: {
    beneficiaries: [createBeneficiary({ name: "Ben1", relation: "Son" })],
  }
};

const newData: Partial<CompleteWillFormData> = {
  step1: createTestator({
    fullName: "John Doe Updated",
    maritalStatus: "Married" as const,
    spouseDetails: {
        fullName: "Jane Doe",
        dateOfBirth: "1985-01-01",
        aadhaarNumber: "123456789012",
        panNumber: "ABCDE1234F"
    }
  }),
  step6: {
    beneficiaries: [
      createBeneficiary({ name: "Ben1", relation: "Son" }),
      createBeneficiary({ name: "Ben2", relation: "Daughter" })
    ],
  }
};

const diff = calculateWillDiff(oldData, newData);
console.log(JSON.stringify(diff, null, 2));
