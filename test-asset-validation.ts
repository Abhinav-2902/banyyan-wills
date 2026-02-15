// Test to demonstrate asset validation is working

import { assetsSchema } from './will';

// Test 1: Property with missing required fields - SHOULD FAIL
const invalidProperty = {
  assets: [{
    type: "Property",
    details: {
      address: "123 Main St",
      // Missing: city, state, country, zipCode
    },
    distribution: {},
    selectedRecipients: []
  }]
};

// Test 2: Property with all required fields - SHOULD PASS
const validProperty = {
  assets: [{
    type: "Property",
    details: {
      address: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400001"
    },
    distribution: {},
    selectedRecipients: []
  }]
};

// Test 3: Investment with "Other" type but no specification - SHOULD FAIL
const invalidInvestment = {
  assets: [{
    type: "Investment",
    details: {
      investmentType: "Other",
      accountNumber: "12345"
      // Missing: otherInvestmentType
    },
    distribution: {},
    selectedRecipients: []
  }]
};

// Test 4: Bank with missing bankName - SHOULD FAIL
const invalidBank = {
  assets: [{
    type: "Bank",
    details: {
      accountNumber: "1234"
      // Missing: bankName (required)
    },
    distribution: {},
    selectedRecipients: []
  }]
};

console.log("Test 1 (Invalid Property):", assetsSchema.safeParse(invalidProperty).success); // false
console.log("Test 2 (Valid Property):", assetsSchema.safeParse(validProperty).success); // true
console.log("Test 3 (Invalid Investment):", assetsSchema.safeParse(invalidInvestment).success); // false
console.log("Test 4 (Invalid Bank):", assetsSchema.safeParse(invalidBank).success); // false
